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
        formStateCursor: BaobabPropTypes.cursor,
        validateOnFly: React.PropTypes.bool,
    },

    childContextTypes: {
        form: React.PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            validateOnFly: true,
            strategy: defaultStrategy(),
            onSubmit: _.identity,
            onInvalidSubmit: _.identity,
        };
    },

    getChildContext: function() {
        return {
            form: {
                cursor: this.props.cursor,
                isValid: this.isValid,
                isDirty: this.isDirty,
                getValidationErrors: this.getValidationErrors,
                setDirtyState: this.setDirtyState,
                setPristineState: this.setPristineState,
            },
        };
    },

    getInitialState: function() {
        if (this.props.formStateCursor) {
            return {};
        }
        return {
            errors: {},
            dirtyStates: {},
        };
    },

    componentDidMount: function() {
        if (this.props.validateOnFly) {
            this.props.cursor.on('update', this.onUpdate);
        }
        this.validate();
    },

    componentWillUnmount: function() {
        if (this.props.validateOnFly) {
            this.props.cursor.off('update', this.onUpdate);
        }
    },

    render: function() {
        return (
          <form noValidate {...this.props} onSubmit={this.onFormSubmit}>
              {this.props.children}
          </form>
        );
    },

    setFormState: function(nextState) {
        if (this.props.formStateCursor) {
            this.props.formStateCursor.merge(nextState);
        } else {
            this.setState(nextState);
        }
    },

    getFormState: function() {
        if (this.props.formStateCursor) {
            return this.props.formStateCursor.get();
        }
        return this.state;
    },

    onFormSubmit: function(evt) {
        evt.preventDefault();
        this.submit();
    },

    onUpdate: function() {
        this.validate();
    },

    submit: function() {
        this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
    },

    validate: function(successCallback, errorCallback) {
        const data = this.props.cursor.get();
        const schema = _.isFunction(this.props.validationSchema) ?
            this.props.validationSchema(data) : this.props.validationSchema;

        this.props.strategy.validate(data, schema, {}, errors => {
            this.setFormState({errors: errors});

            if (_.isEmpty(errors)) {
                successCallback && successCallback();
            } else {
                errorCallback && errorCallback(errors);
            }
        });
    },

    getValidationErrors: function(fieldPath) {
        const state = this.getFormState();
        if (fieldPath) {
            return _.get(state.errors, fieldPath);
        }
        return state.errors;
    },

    isValid: function(fieldPath) {
        const state = this.getFormState();
        if (fieldPath) {
            return !_.get(state.errors, fieldPath);
        }
        return _.isEmpty(state.errors);
    },

    isDirty: function(fieldPath) {
        const state = this.getFormState();
        return !!_.get(state.dirtyStates, fieldPath);
    },

    resetDirtyStates: function() {
        this.setFormState({
            dirtyStates: {},
        });
    },

    resetValidationErrors: function() {
        this.setValidationErrors({});
    },

    setValidationErrors: function(errors) {
        this.setFormState({
            errors: errors,
        });
    },

    setDirtyState: function(fieldPath) {
        this.updateDirtyState(fieldPath, true)
    },

    setPristineState: function(fieldPath) {
        this.updateDirtyState(fieldPath, false)
    },

    updateDirtyState: function(fieldPath, dirtyState) {
        const state = this.getFormState();

        this.setFormState({
            dirtyStates: _.set(state.dirtyStates || {}, fieldPath, dirtyState),
        });
    },
});
