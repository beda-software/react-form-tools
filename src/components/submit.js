import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default React.createClass({
    displayName: 'Submit',

    propTypes: {
        className: React.PropTypes.string,
        disableIfInvalid: React.PropTypes.bool,
        onClick: React.PropTypes.func,
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    getDefaultProps() {
        return {
            disableIfInvalid: false,
            onClick: _.identity,
        };
    },

    onClick(event) {
        if (!this.context.form.isHtmlForm()) {
            event.preventDefault();
            event.stopPropagation();
            this.context.form.submit();
        }

        this.props.onClick(event);
    },

    render() {
        const disabled = !this.context.form.isValid();

        return (
            <input
                {..._.omit(this.props, 'children')}
                type="submit"
                onClick={this.onClick}
                className={classNames(this.props.className, { _disabled: disabled })}
                disabled={this.props.disableIfInvalid && disabled}
                value={this.props.value || this.props.children} />
        );
    },
});
