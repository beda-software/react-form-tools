import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  displayName: 'Submit',

  propTypes: {
    className: React.PropTypes.string.isRequired
  },

  contextTypes: {
    isValid: React.PropTypes.func.isRequired
  },

  render: function () {
    const isValid = this.context.isValid();
    return (
      <button className={classNames(this.props.className, {"_active": isValid})}
              onClick={isValid && this.props.onClick}>{this.props.children}</button>
    );
  }
});
