import React from 'react';

export default React.createClass({
    displayName: 'ValidationError',

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
          React.PropTypes.string.isRequired,
          React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
        alwaysShow: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            alwaysShow: false,
        };
    },

    render() {
        const form = this.context.form;

        const error = form.getValidationErrors(this.props.fieldPath);
        const isValid = !error;
        const isDirty = form.isDirty(this.props.fieldPath);

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
