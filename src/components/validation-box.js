import React from 'react';
import classNames from 'classnames';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    displayName: 'ValidationBox',

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
          React.PropTypes.string.isRequired,
          React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
    },

    contextTypes: {
        formCursor: BaobabPropTypes.cursor,
        isValid: React.PropTypes.func.isRequired,
        isDirty: React.PropTypes.func.isRequired,
        setDirtyState: React.PropTypes.func.isRequired,
        getValidationErrors: React.PropTypes.func.isRequired,
    },

    childContextTypes: {
        fieldPath: React.PropTypes.array,
    },

    getChildContext: function() {
        return {
            fieldPath: _.isArray(this.props.fieldPath) ? this.props.fieldPath : this.props.fieldPath.split('.'),
        };
    },

    render: function() {
        // TODO: use ValidationError instead of this code
        const error = this.context.getValidationErrors(this.props.fieldPath);
        const isDirty = this.context.isDirty(this.props.fieldPath);
        const isValid = !error;
        const className = classNames(this.props.className, {
            _error: isDirty && !isValid,
        });

        return (
            <div className={className}>
                {this.props.children}
                <div className={this.props.className + '-msg'}>
                    {isDirty && error}
                </div>
            </div>
        );
    },
});
