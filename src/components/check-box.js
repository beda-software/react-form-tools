import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'CheckBox',

    mixins: [FormComponentMixin],

    propTypes: {
        value: React.PropTypes.any,
        uncheckedValue: React.PropTypes.any,
        cursor: BaobabPropTypes.cursor,
        onChange: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            onChange: _.identity,
            value: true,
            uncheckedValue: false,
        };
    },

    onChange(event) {
        const cursor = this.getCursor();
        const value = event.target.checked ? this.props.value : this.props.uncheckedValue;
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
        return _.isEqual(this.props.value, this.getCursor().get());
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
