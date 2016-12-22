import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { FormComponentMixin } from '../mixins';
import { BranchMixin } from 'baobab-react-mixins';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
    displayName: 'CheckBox',

    mixins: [BranchMixin, FormComponentMixin, PureRenderMixin],

    propTypes: {
        value: React.PropTypes.any,
        uncheckedValue: React.PropTypes.any,
        cursor: BaobabPropTypes.cursor,
        onChange: React.PropTypes.func,
    },

    cursors(props, context) {
        return {
            value: this.getCursor(props, context),
        };
    },

    getDefaultProps() {
        return {
            onChange: _.identity,
            value: true,
            uncheckedValue: false,
        };
    },

    onChange(event) {
        const value = event.target.checked ? this.props.value : this.props.uncheckedValue;
        const previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.setValue(value, () => {
            this.setDirtyState();
            this.props.onChange(event, { value, previousValue });
        });
    },

    isChecked() {
        return _.isEqual(this.props.value, this.state.value);
    },

    render() {
        const props = {
            type: 'checkbox',
            checked: this.isChecked(),
            onChange: this.onChange,
            onKeyPress: this.processKeyPressForSubmit,
        };

        const restProps = _.omit(this.props, [
            'value', 'uncheckedValue', 'onChange', 'cursor',
        ]);

        return (
            <input {...restProps} {...props} />
        );
    },
});
