import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    displayName: 'Radio',

    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
    },

    onChange() {
        const value = this.props.value;

        this.props.cursor.set(value);

        if (this.props.onChange) {
            setTimeout(() => this.props.onChange(value), 0);
        }
    },

    isChecked() {
        return this.props.value == this.props.cursor.get();
    },

    render() {
        return (
          <input
              {...this.props}
              onChange={this.onChange}
              type="radio"
              checked={this.isChecked()} />
        );
    },
});
