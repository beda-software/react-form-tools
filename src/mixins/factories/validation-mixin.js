import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import strategy from 'yup-validation-strategy';

const validator = strategy();

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {

  },

  childContextTypes: {
    isValid: React.PropTypes.func.isRequired,
    isDirty: React.PropTypes.func.isRequired,
    getValidationMessages: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      onSubmit: _.identity
    };
  },

  getChildContext: function() {
    // Methods for children components such as ValidationBox
    return {
      isValid: this.isValid,
      isDirty: this.isDirty,
      getValidationMessages: this.getValidationMessages
    };
  },

  getInitialState: function () {
    return {
      validationErrors: {},
      validationDirtyStates: {},
      validationInitialValues: {}
    };
  },

  setInitialValue: function () {
    this.setState({
      validationInitialValues: _.mapValues(
        _.object(_.keys(this.props.validationSchema.fields)),
        (value, key) => this.props.cursor.get(key)
      )
    });
  },

  componentDidMount: function () {
    // Add on update callback
    this.props.cursor.on('update', this.onUpdate);
    this.setInitialValue();
    this.validate();
  },

  componentWillUnmount: function () {
    this.props.cursor.off('update', this.onUpdate);
  },

  render: function () {
    return (
      <form noValidate {...this.props} onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    );
  },

  onSubmit: function (evt) {
    evt.preventDefault();
    if (this.isValid()) {
      this.props.onSubmit();
    }
  },

  onUpdate: function () {
    this.validate();
  },

  validate: function () {
    const data = this.props.cursor.get();
    const schema = this.props.validationSchema;

    validator.validate(data, schema, {}, errors => {
      this.setState({
        validationErrors: errors,
        validationDirtyStates: updateStates(
          this.state.validationDirtyStates,
          this.state.validationInitialValues,
          data)
      });

      function updateStates(curStates, curInitial, curData) {
        return _.mapValues(curData, function (value, field) {
          if (_.isPlainObject(value) || _.isArray(value)) {
            return updateStates(curStates[field] || {}, curInitial[field] || {}, value);
          } else {
            const initial = curInitial[field];
            return value != initial ? true : curStates[field];
          }
        });
      }
    });
  },

  getValidationMessages: function (fieldPath) {
    if (fieldPath) {
      return _.get(this.state.validationErrors, fieldPath);
    }
    return this.state.validationErrors;
  },

  isValid: function (fieldPath) {
    if (fieldPath) {
      return !_.get(this.state.validationErrors, fieldPath);
    }
    return _.isEmpty(this.state.validationErrors);
  },

  isDirty: function (fieldPath) {
    return !!_.get(this.state.validationDirtyStates, fieldPath);
  },

  resetValidationData: function () {
    this.props.cursor.set(this.state.validationInitialValues);
  },

  resetValidationErrors: function () {
    this.setValidationErrors({});
  },

  setValidationErrors: function (errors) {
    this.setState({
      validationErrors: errors
    });
  }
});
