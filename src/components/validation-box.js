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
        alwaysShowError: React.PropTypes.bool,
        displayError: React.PropTypes.bool,
        className: React.PropTypes.string,
        dirtyClassName: React.PropTypes.string,
        errorClassName: React.PropTypes.string,
        errorMessageClassName: React.PropTypes.string,
    },

    getDefaultProps() {
        return {
            alwaysShowError: false,
            displayError: true,
            dirtyClassName: '_dirty',
            errorClassName: '_error',
            errorMessageClassName: 'validationbox-error-message',
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

    componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw `react-form.tools: ValidationBox must be used only inside Form component`;
        }
    },

    render() {
        const {
            className, dirtyClassName, errorClassName, errorMessageClassName,
            displayError, alwaysShowError, children,
        } = this.props;

        const errors = this.getErrors();
        const isDirty = this.isDirty();
        const isValid = this.isValid();

        const generatedClassName = classNames(className, {
            [dirtyClassName]: isDirty,
            [errorClassName]: (isDirty || this.props.alwaysShowError) && !isValid,
        });

        return (
            <div className={generatedClassName}
                data-field-path={getFieldPathAsString(this.getFieldPath())}>
                {children}
                {displayError && (isDirty || alwaysShowError) ? (
                    <div className={errorMessageClassName}>
                        {errors}
                    </div>
                ) : null}
            </div>
        );
    },
});
