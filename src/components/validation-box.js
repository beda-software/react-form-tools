import React from 'react';
import classNames from 'classnames';
import BaobabPropTypes from 'baobab-prop-types';
import {resolveFieldPath} from './utils';

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
        form: React.PropTypes.object.isRequired,
    },

    childContextTypes: {
        fieldPath: React.PropTypes.array,
    },

    getChildContext() {
        return {
            fieldPath: resolveFieldPath(this.props.fieldPath),
        };
    },

    render() {
        const form = this.context.form;
        // TODO: use ValidationError instead of this code
        const error = form.getValidationErrors(this.props.fieldPath);
        const isDirty = form.isDirty(this.props.fieldPath);
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
