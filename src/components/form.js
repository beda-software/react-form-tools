import React from 'react';
import _ from 'lodash';
import defaultStrategy from 'yup-validation-strategy';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func,
    onInvalidSubmit: React.PropTypes.func,
    cursor: BaobabPropTypes.cursor.isRequired,
    validationSchema: React.PropTypes.any.isRequired,
    validateOnFly: React.PropTypes.bool
  },

  childContextTypes: {
    isValid: React.PropTypes.func,
    isDirty: React.PropTypes.func,
    getValidationErrors: React.PropTypes.func,
    setDirtyState: React.PropTypes.func,
    setPristineState: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      validateOnFly: true,
      strategy: defaultStrategy()
    };
  },

  getChildContext: function() {
    // Methods for children components such as ValidationBox
    return {
      isValid: this.isValid,
      isDirty: this.isDirty,
      getValidationErrors: this.getValidationErrors,
      setDirtyState: this.setDirtyState,
      setPristineState: this.setPristineState
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
    if (this.props.validateOnFly) {
      this.props.cursor.on('update', this.onUpdate);
    }
    this.setInitialValue();
    this.validate();
  },

  componentWillUnmount: function () {
    if (this.props.validateOnFly) {
      this.props.cursor.off('update', this.onUpdate);
    }
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
    this.submit();
  },

  onUpdate: function () {
    this.validate();
  },

  submit: function () {
    this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
  },

  validate: function (successCallback, errorCallback) {
    const data = this.props.cursor.get();
    const schema = this.props.validationSchema;

    this.props.strategy.validate(data, schema, {}, errors => {
      this.setState({
        validationErrors: errors,
        validationDirtyStates: updateStates(
          this.state.validationDirtyStates,
          this.state.validationInitialValues,
          data)
      });

      // TODO: use baobab diff for best performance
      // TODO: use schema instead of data for iterations!
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

      if (_.isEmpty(errors)) {
        successCallback && successCallback();
      } else {
        errorCallback && errorCallback(errors);
      }
    });
  },

  getValidationErrors: function (fieldPath) {
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

  resetDirtyStates: function () {
    this.setState({
      validationDirtyStates: {}
    });
  },

  resetValidationErrors: function () {
    this.setValidationErrors({});
  },

  setValidationErrors: function (errors) {
    this.setState({
      validationErrors: errors
    });
  },

  setDirtyState: function (fieldPath) {
    this.updateDirtyState(fieldPath, true)
  },

  setPristineState: function (fieldPath) {
    this.updateDirtyState(fieldPath, false)
  },

  updateDirtyState: function (fieldPath, state) {
    this.setState({
      validationDirtyState: _.set(this.state.validationDirtyStates, fieldPath, state)
    });
  }
});
