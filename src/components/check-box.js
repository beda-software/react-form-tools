import React from 'react';
import _ from 'lodash';
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

        this.setValue(value, () => {
            this.setDirtyState();
            this.props.onChange(value, previousValue);
        });
    },

    isChecked() {
        return _.isEqual(this.props.value, this.getCursor().get());
    },

    render() {
        const props = {
            type: 'checkbox',
            checked: this.isChecked(),
            onChange: this.onChange,
            onKeyPress: this.processKeyPress,
        };

        return (
            <input {...this.props} {...props} />
        );
    },
});
