import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
  displayName: 'Radio',

  propTypes: {
    cursor: BaobabPropTypes.cursor.isRequired
  },

  onChange: function() {
    const value = this.props.value;

    this.props.cursor.set(value);

    if (this.props.onChange) {
      setTimeout(() => this.props.onChange(value), 0);
    }
  },

  isChecked: function () {
    return this.props.value == this.props.cursor.get();
  },

  render: function () {
    return (
      <input {...this.props}
             onChange={this.onChange}
             type="radio"
             checked={this.isChecked()} />
    );
  }
});
