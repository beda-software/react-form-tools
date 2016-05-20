import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'Radio',

    mixins: [FormComponentMixin],

    propTypes: {
        value: React.PropTypes.any,
        cursor: BaobabPropTypes.cursor,
        onChange: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            onChange: _.identity,
        };
    },

    onChange() {
        const cursor = this.getCursor();
        const value = this.props.value;
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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const value = this.getCursor(nextProps, nextContext).get();

        return !_.isEqual(this.props.value, value) ||
            PureRenderMixin.shouldComponentUpdate.bind(this, nextProps, nextState);
    },

    render() {
        const props = {
            type: 'radio',
            checked: this.isChecked(),
            onChange: this.onChange,
            onKeyPress: this.processKeyPress,
        };

        return (
            <input {...this.props} {...props} />
        );
    },
});
