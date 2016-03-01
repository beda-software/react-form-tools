import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'Radio',

    mixins: [FormComponentMixin],

    propTypes: {
        value: React.PropTypes.any,
        cursor: BaobabPropTypes.cursor,
    },

    contextTypes: {
        fieldPath: React.PropTypes.array,
    },

    getDefaultProps() {
        return {
            onChange: _.identity,
        };
    },

    onChange(event) {
        const cursor = this.getCursor();
        const value = event.target.value;
        const previousValue = cursor.get();

        if (value === previousValue) {
            return;
        }

        cursor.set(value);
        this.setDirtyState();

        setTimeout(() => {
            this.props.onChange(value, previousValue);
        }, 0);
    },

    isChecked() {
        return this.props.value === this.getCursor().get();
    },

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const value = this.getCursor(nextProps, nextContext).get();

        return this.props.value !== value || PureRenderMixin.shouldComponentUpdate.bind(this, nextProps, nextState);
    },

    render() {
        const props = {
            type: 'radio',
            onChange: this.onChange,
            checked: this.isChecked(),
        };

        return (
            <input {...this.props} {...props} />
        );
    },
});
