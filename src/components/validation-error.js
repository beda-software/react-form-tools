import React from 'react';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'ValidationError',

    mixins: [FormComponentMixin, PureRenderMixin],

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    propTypes: {
        fieldPath: React.PropTypes.oneOfType([
          React.PropTypes.string.isRequired,
          React.PropTypes.array.isRequired,
        ]),
        className: React.PropTypes.string,
        dirtyClassName: React.PropTypes.string,
        alwaysShow: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            alwaysShow: false,
            dirtyClassName: '_dirty',
        };
    },

    componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw `react-form.tools: ValidationError must be used only inside Form component`;
        }
    },

    render() {
        const { alwaysShow, className, dirtyClassName } = this.props;
        const errors = this.getErrors();
        const isValid = this.isValid();
        const isDirty = this.isDirty();
        const generatedClassName = classNames(className, {
            [dirtyClassName]: isDirty,
        });

        if (isValid || !alwaysShow && !isDirty) {
            return null;
        }

        return (
            <div className={generatedClassName}>
                {errors}
            </div>
        );
    },
});
