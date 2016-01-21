import React from 'react'
import Input from './Input';
import {PropTypes as BaobabPropTypes} from 'baobab-react-schemabranchmixin';

export default React.createClass({
  displayName: 'ReInput',

  propTypes: {
    cursor: BaobabPropTypes.cursor.isRequired,
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
