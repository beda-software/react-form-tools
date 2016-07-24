import React from 'react';
import _ from 'lodash';
import { isEnterPressed, getFieldPathAsArray } from './utils';

export const FormComponentMixin = {
    contextTypes: {
        form: React.PropTypes.object,
        fieldPath: React.PropTypes.array,
    },

    processKeyPressForSubmit(event) {
        // Helper method for form components
        // Submits form on enter by default
        this.processKeyPress(event, () => this.context.form.submit());
    },

    processKeyPress(event, fn) {
        // Callback `fn` will be called on enter press
        if (!this.context.form.isHtmlForm()) {
            if (isEnterPressed(event)) {
                event.preventDefault();
                event.stopPropagation();
                fn();
            }
        }

        if (_.isFunction(this.props.onKeyPress)) {
            this.props.onKeyPress(event);
        }
    },

    getFieldPath(props, context) {
        props = props || this.props;
        context = context || this.context;

        if (props.fieldPath) {
            return getFieldPathAsArray(props.fieldPath);
        }

        if (context.fieldPath) {
            return context.fieldPath;
        }

        return null;
    },

    getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        if (props.cursor) {
            return props.cursor;
        }

        const fieldPath = this.getFieldPath(props, context);

        if (fieldPath) {
            return context.form.cursor.select(fieldPath);
        }

        /* istanbul ignore next */
        throw `react-form.tools ${this.displayName}: cursor must be set via 'cursor',
               'fieldPath' or via higher order component ValidationBox with 'fieldPath'`;
    },

    inValidationBox() {
        return !!(this.context.form && this.getFieldPath());
    },

    setValue(value, callback) {
        const cursor = this.getCursor();

        if (_.isFunction(callback)) {
            cursor.once('update', callback);
        }

        cursor.set(value);
    },

    setDirtyState() {
        if (this.inValidationBox()) {
            this.context.form.setDirtyState(this.getFieldPath());
        }
    },

    setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.getFieldPath());
        }
    },

    isDirty() {
        if (this.inValidationBox()) {
            return this.state.isDirty;
        }
    },

    isValid() {
        if (this.inValidationBox()) {
            return this.state.isValid;
        }
    },

    getErrors() {
        if (this.inValidationBox()) {
            return this.state.errors;
        }
    },

    getInitialState() {
        return {
            isDirty: false,
            errors: [],
        };
    },

    onFormStateUpdate(data) {
        const fieldPath = this.getFieldPath();

        const errors = _.get(data, _.concat('errors', fieldPath));
        const isDirty = !!_.get(data, _.concat('dirtyStates', fieldPath));
        const isValid = _.isEmpty(errors);

        this.setState({
            isDirty,
            errors,
            isValid,
        });
    },

    componentDidMount() {
        if (this.inValidationBox()) {
            this.context.form.subscribe(this.onFormStateUpdate);
        }
    },

    componentWillUnmount() {
        if (this.inValidationBox()) {
            this.context.form.unsubscribe(this.onFormStateUpdate);
        }
    },
};
