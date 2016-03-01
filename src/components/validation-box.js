import React from 'react';
import classNames from 'classnames';
import BaobabPropTypes from 'baobab-prop-types';
import {getFieldPathAsArray} from '../utils';

export default React.createClass({
    displayName: 'ValidationBox',

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
            React.PropTypes.string.isRequired,
            React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
        alwaysShowError: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            alwaysShowError: false,
        };
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    childContextTypes: {
        fieldPath: React.PropTypes.array,
    },

    getChildContext() {
        return {
            fieldPath: getFieldPathAsArray(this.props.fieldPath),
        };
    },

    render() {
        const form = this.context.form;
        const error = form.getValidationErrors(this.props.fieldPath);
        const isDirty = form.isDirty(this.props.fieldPath);
        const isValid = !error;
        const className = classNames(this.props.className, {
            _dirty: isDirty,
            _error: (isDirty || this.props.alwaysShowError) && !isValid,
        });

        return (
            <div className={className}>
                {this.props.children}
                {isDirty || this.props.alwaysShowError ? (
                    <div className={this.props.className + '-msg'}>
                        {error}
                    </div>
                ) : null}
            </div>
        );
    },
});
