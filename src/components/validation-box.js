import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  displayName: 'ValidationBox',

  propTypes: {
    fieldPath: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.array.isRequired
    ]),
    className: React.PropTypes.string
  },

  contextTypes: {
    isValid: React.PropTypes.func.isRequired,
    isDirty: React.PropTypes.func.isRequired,
    getValidationErrors: React.PropTypes.func.isRequired
  },

  render: function() {
    const error = this.context.getValidationErrors(this.props.fieldPath),
      isDirty = this.context.isDirty(this.props.fieldPath),
      isValid = !error;
    const className = classNames(this.props.className, {
      '_error': isDirty && !isValid
    });
    return (
      <div className={className}>
        {this.props.children}
        <div className={this.props.className + "-msg"}>
          {isDirty && error}
        </div>
      </div>
    );
  }
});
