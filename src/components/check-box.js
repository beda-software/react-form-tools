import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'CheckBox',

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
        const value = event.target.checked;
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
        return !!this.getCursor().get();
    },

    render() {
        const props = {
            type: 'checkbox',
            onChange: this.onChange,
            checked: this.isChecked(),
        };

        return (
            <input {...this.props} {...props} />
        );
    },
});
