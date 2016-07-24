import React from 'react';
import classNames from 'classnames';
import {getFieldPathAsArray, getFieldPathAsString} from '../utils';

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
            displayError: true,
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
        const fieldPath = this.props.fieldPath;
        const form = this.context.form;
        const error = form.getValidationErrors(fieldPath);
        const isDirty = form.isDirty(fieldPath);
        const isValid = !error;
        const className = classNames(this.props.className, {
            _dirty: isDirty,
            _error: (isDirty || this.props.alwaysShowError) && !isValid,
        });

        return (
            <div className={className} data-field-path={getFieldPathAsString(fieldPath)}>
                {this.props.children}
                {isDirty || this.props.alwaysShowError ? (
                    <div className="validationbox-error-message">
                        {error}
                    </div>
                ) : null}
            </div>
        );
    },
});
