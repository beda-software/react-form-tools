import React from 'react';

export default React.createClass({
    displayName: 'ValidationGlobalError',

    propTypes: {
        className: React.PropTypes.string.isRequired,
        globalErrorFieldName: React.PropTypes.string,
    },

    contextTypes: {
        isValid: React.PropTypes.func.isRequired,
        getValidationErrors: React.PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            globalErrorFieldName: '__all__',
        }
    },

    render: function() {
        // TODO: change fieldPath
        const fieldPath = ['attributes', this.props.globalErrorFieldName];
        const isValid = this.context.isValid(fieldPath);

        return !isValid && (
            <div className={this.props.className + '-global-error'}>
                {this.context.getValidationErrors(fieldPath)}
            </div>
        );
    },
});
