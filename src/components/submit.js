import React from 'react';
import classNames from 'classnames';

export default React.createClass({
    displayName: 'Submit',

    propTypes: {
        className: React.PropTypes.string.isRequired,
        disableIfInvalid: React.PropTypes.bool,
    },

    contextTypes: {
        isValid: React.PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            disableIfInvalid: false,
        }
    },

    render: function() {
        const disabled = !this.context.isValid();
        return (
            <input type="submit"
                   className={classNames(this.props.className, {_disabled: disabled})}
                   disabled={this.props.disableIfInvalid && disabled}
                   value={this.props.children} />
        );
    },
});
