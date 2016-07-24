import React from 'react';
import classNames from 'classnames';
import { getFieldPathAsArray, getFieldPathAsString } from '../utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'ValidationBox',

    mixins: [FormComponentMixin, PureRenderMixin],

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
            React.PropTypes.string.isRequired,
            React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
        alwaysShowError: React.PropTypes.bool,
        displayError: React.PropTypes.bool,
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
        const errors = this.getErrors();
        const isDirty = this.isDirty();
        const isValid = this.isValid();
        const className = classNames(this.props.className, {
            _dirty: isDirty,
            _error: (isDirty || this.props.alwaysShowError) && !isValid,
        });

        return (
            <div className={className}
                data-field-path={getFieldPathAsString(this.getFieldPath())}>
                {this.props.children}
                {this.props.displayError && (isDirty || this.props.alwaysShowError) ? (
                    <div className="validationbox-error-message">
                        {errors}
                    </div>
                ) : null}
            </div>
        );
    },
});
