import React from 'react'
import Input from './Input';

export default React.createClass({
  displayName: 'ReInput',

  propTypes: {
    cursor: React.PropTypes.any.isRequired,
    skip: React.PropTypes.string.isRequired
  },

  toInternal: function (value) {
    const regexp = new RegExp(this.props.skip, 'g');

    return String(value).replace(regexp, '');
  },

  render: function () {
    return (
      <Input type="text"
             toInternal={this.toInternal}
             toRepresentation={this.toInternal}
             {...this.props} />
    );
  }
});
