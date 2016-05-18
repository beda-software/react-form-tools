import React from 'react';
import _ from 'lodash';
import defaultStrategy from 'yup-validation-strategy';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    propTypes: {
        onSubmit: React.PropTypes.func,
        onInvalidSubmit: React.PropTypes.func,
        cursor: BaobabPropTypes.cursor.isRequired,

        // TODO: concretize type
        validationSchema: React.PropTypes.any.isRequired,
        formStateCursor: BaobabPropTypes.cursor,
        validateOnFly: React.PropTypes.bool,
        useHtmlForm: React.PropTypes.bool,
    },

    childContextTypes: {
        form: React.PropTypes.object,
    },

    contextTypes: {
        form: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            validateOnFly: true,
            strategy: defaultStrategy(),
            onSubmit: _.identity,
            onInvalidSubmit: _.identity,
            useHtmlForm: true,
        };
    },

    getChildContext() {
        return {
            form: {
                parentForm: this.context.form,
                isHtmlForm: this.isHtmlForm,

                cursor: this.props.cursor,
                isValid: this.isValid,
                isDirty: this.isDirty,
                getValidationErrors: this.getValidationErrors,
                setDirtyState: this.setDirtyState,
                setPristineState: this.setPristineState,

                submit: this.submit,
                validate: this.validate,
            },
        };
    },

    getInitialState() {
        if (this.props.formStateCursor) {
            return {};
        }

        return {
            errors: {},
            dirtyStates: {},
        };
    },

    componentDidMount() {
        if (this.props.validateOnFly) {
            this.props.cursor.on('update', this.onUpdate);
        }

        this.validate();
    },

    componentWillUnmount() {
        if (this.props.validateOnFly) {
            this.props.cursor.off('update', this.onUpdate);
        }
    },

    render() {
        if (this.isHtmlForm()) {
            return (
                <form noValidate {...this.props} onSubmit={this.onFormSubmit}>
                    {this.props.children}
                </form>
            );
        }

        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        );
    },

    isHtmlForm() {
        return this.props.useHtmlForm && (!this.context.form || !this.context.form.isHtmlForm());
    },

    setFormState(nextState) {
        if (this.props.formStateCursor) {
            this.props.formStateCursor.merge(nextState);
        } else {
            this.setState(nextState);
        }
    },

    getFormState() {
        if (this.props.formStateCursor) {
            return this.props.formStateCursor.get();
        }

        return this.state;
    },

    onFormSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.submit();
    },

    onUpdate() {
        this.validate();
    },

    submit() {
        this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
    },

    validate(successCallback, errorCallback) {
        const data = this.props.cursor.get();
        const schema = _.isFunction(this.props.validationSchema) ?
            this.props.validationSchema(data) : this.props.validationSchema;

        this.props.strategy.validate(data, schema, {}, errors => {
            this.setFormState({ errors });

            if (_.isEmpty(errors)) {
                successCallback && successCallback(data);
            } else {
                errorCallback && errorCallback(errors);
            }
        });
    },

    getValidationErrors(fieldPath) {
        const formState = this.getFormState();
        if (fieldPath) {
            return _.get(formState.errors, fieldPath);
        }

        return formState.errors;
    },

    isValid(fieldPath) {
        const formState = this.getFormState();
        if (fieldPath) {
            return !_.get(formState.errors, fieldPath);
        }

        return _.isEmpty(formState.errors);
    },

    isDirty(fieldPath) {
        const formState = this.getFormState();
        return !!_.get(formState.dirtyStates, fieldPath);
    },

    resetDirtyStates() {
        this.setFormState({
            dirtyStates: {},
        });
    },

    resetValidationErrors() {
        this.setValidationErrors({});
    },

    setValidationErrors(errors) {
        this.setFormState({
            errors,
        });
    },

    setDirtyState(fieldPath) {
        this.updateDirtyState(fieldPath, true);
    },

    setPristineState(fieldPath) {
        this.updateDirtyState(fieldPath, false);
    },

    updateDirtyState(fieldPath, dirtyState) {
        if (this.isDirty(fieldPath) === dirtyState) {
            return;
        }

        const formState = this.getFormState();

        this.setFormState({
            dirtyStates: _.set(formState.dirtyStates || {}, fieldPath, dirtyState),
        });
    },
});
