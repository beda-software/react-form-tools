import React from 'react';

export const FormComponentMixin = {
    contextTypes: {
        form: React.PropTypes.object,
        fieldPath: React.PropTypes.array,
    },

    getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        /* istanbul ignore next */
        if (!props.cursor && !context.fieldPath) {
            throw 'react-form.tools ' + this.displayName + ': cursor must be set via `cursor` or ' +
                  'via higher order component ValidationBox with fieldPath';
        }

        return props.cursor || context.form.cursor.select(context.fieldPath);
    },

    inValidationBox() {
        return !!(this.context.form && this.context.fieldPath);
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
