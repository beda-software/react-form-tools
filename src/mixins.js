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

    getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        if (props.cursor) {
            return props.cursor;
        }

        if (props.fieldPath) {
            return context.form.cursor.select(getFieldPathAsArray(props.fieldPath));
        }

        if (context.fieldPath) {
            return context.form.cursor.select(context.fieldPath);
        }

        /* istanbul ignore next */
        throw `react-form.tools ${this.displayName}: cursor must be set via 'cursor',
               'fieldPath' or via higher order component ValidationBox with 'fieldPath'`;
    },

    inValidationBox() {
        return !!(this.context.form && this.context.fieldPath);
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
            this.context.form.setDirtyState(this.context.fieldPath);
        }
    },

    setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.context.fieldPath);
        }
    },

    isDirty() {
        if (this.inValidationBox()) {
            return this.context.form.isDirty(this.context.fieldPath);
        }
    },

    isValid() {
        if (this.inValidationBox()) {
            return this.context.form.isValid(this.context.fieldPath);
        }
    },
};
