import React from 'react';

export default React.createClass({
    displayName: 'ValidationGlobalError',

    propTypes: {
        className: React.PropTypes.string.isRequired,
        globalErrorFieldName: React.PropTypes.string,
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    getDefaultProps() {
        return {
            globalErrorFieldName: '__all__',
        }
    },

    render() {
        const form = this.context.form;
        // TODO: change fieldPath
        const fieldPath = ['attributes', this.props.globalErrorFieldName];
        const isValid = form.isValid(fieldPath);

        return !isValid && (
            <div className={this.props.className + '-global-error'}>
                {form.getValidationErrors(fieldPath)}
            </div>
        );
    },
});
