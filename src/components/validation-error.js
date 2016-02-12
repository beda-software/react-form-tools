import React from 'react';

export default React.createClass({
    displayName: 'ValidationError',

    contextTypes: {
        getValidationErrors: React.PropTypes.func.isRequired,
        isDirty: React.PropTypes.func.isRequired,
    },

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
          React.PropTypes.string.isRequired,
          React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
        alwaysShow: React.PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            alwaysShow: false,
        };
    },

    render: function() {
        const error = this.context.getValidationErrors(this.props.fieldPath);
        const isValid = !error;
        const isDirty = this.context.isDirty(this.props.fieldPath);

        if (isValid || !this.props.alwaysShow && !isDirty) {
            return null;
        }

        return (
            <div className={this.props.className}>
                {error}
            </div>
        );
    },
});
