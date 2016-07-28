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

    subscribers: [],
    _isHtmlForm: null,

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

                subscribe: this.subscribe,
                unsubscribe: this.unsubscribe,
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
            isFormDirty: false,
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

    hasParentHtmlForm() {
        let parentForm = this.context.form;

        while (parentForm) {
            if (parentForm.isHtmlForm()) {
                return true;
            }

            parentForm = parentForm.parentForm;
        }
    },

    isHtmlForm() {
        if (this._isHtmlForm === null) {
            this._isHtmlForm = this.props.useHtmlForm && !this.hasParentHtmlForm();
        }

        return this._isHtmlForm;
    },

    publish(...args) {
        _.each(this.subscribers, (subscriber) => subscriber(...args));
    },

    subscribe(subscriber) {
        this.subscribers = _.concat(this.subscribers, subscriber);

        // Notify new subscriber about initial form state
        subscriber(this.getFormState(), null);
    },

    unsubscribe(subscriber) {
        this.subscribers = _.without(this.subscribers, subscriber);
    },

    onFormStateUpdate(data, previousData) {
        // Notify subscribers about changed data only
        if (_.isEqual(data, previousData)) {
            return;
        }

        this.publish(data, previousData);
    },

    setFormState(nextState) {
        const prevState = this.getFormState();

        if (this.props.formStateCursor) {
            this.props.formStateCursor.once(
                'update',
                ({ data }) => this.onFormStateUpdate(data.currentData, prevState)
            );
            this.props.formStateCursor.merge(nextState);
        } else {
            this.setState(
                nextState,
                () => this.onFormStateUpdate(this.state, prevState)
            );
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

        return this.submit();
    },

    onUpdate() {
        this.validate();
    },

    submit() {
        return this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
    },

    getFormData() {
        return this.props.cursor.get();
    },

    validate(successCallback, errorCallback) {
        const data = this.getFormData();
        const schema = _.isFunction(this.props.validationSchema) ?
            this.props.validationSchema(data) : this.props.validationSchema;

        this.props.strategy.validate(data, schema, {}, errors => {
            this.setFormState({ errors });

            if (_.isEmpty(errors)) {
                if (successCallback) {
                    return successCallback(data);
                }
            } else {
                if (errorCallback) {
                    return errorCallback(errors);
                }
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
        const isFormDirty = formState.isFormDirty;

        if (isFormDirty) {
            return true;
        }

        if (!fieldPath) {
            return !_.isEmpty(formState.dirtyStates);
        }

        return !!_.get(formState.dirtyStates, fieldPath);
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
        if (!fieldPath) {
            this.setFormState({
                dirtyStates: {},
                isFormDirty: true,
            });
            return;
        }

        this.updateDirtyState(fieldPath, true);
    },

    setPristineState(fieldPath) {
        if (!fieldPath) {
            this.setFormState({
                dirtyStates: {},
                isFormDirty: false,
            });
            return;
        }

        this.updateDirtyState(fieldPath, false);
    },

    updateDirtyState(fieldPath, dirtyState) {
        if (this.isDirty(fieldPath) === dirtyState) {
            return;
        }

        let { dirtyStates } = this.getFormState();

        dirtyStates = _.cloneDeep(dirtyStates || {});
        _.set(dirtyStates, fieldPath, dirtyState);

        this.setFormState({
            dirtyStates,
        });
    },
});
