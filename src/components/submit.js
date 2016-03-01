import React from 'react';
import classNames from 'classnames';

export default React.createClass({
    displayName: 'Submit',

    propTypes: {
        className: React.PropTypes.string.isRequired,
        disableIfInvalid: React.PropTypes.bool,
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    getDefaultProps() {
        return {
            disableIfInvalid: false,
        }
    },

    render() {
        const disabled = !this.context.form.isValid();

        return (
            <input
                type="submit"
                className={classNames(this.props.className, {_disabled: disabled})}
                disabled={this.props.disableIfInvalid && disabled}
                value={this.props.children} />
        );
    },
});
