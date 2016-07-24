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
        alwaysShow: React.PropTypes.bool,
    },

    getDefaultProps() {
        return {
            alwaysShow: false,
        };
    },

    render() {
        const errors = this.getErrors();
        const isValid = this.isValid();
        const isDirty = this.isDirty();

        const className = classNames(this.props.className, {
            _dirty: isDirty,
        });
        if (isValid || !this.props.alwaysShow && !isDirty) {
            return null;
        }

        return (
            <div className={className}>
                {errors}
            </div>
        );
    },
});
