import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default React.createClass({
    displayName: 'Submit',

    propTypes: {
        className: React.PropTypes.string,
        disableIfInvalid: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        disabledClassName: React.PropTypes.string,
        onClick: React.PropTypes.func,
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    getDefaultProps() {
        return {
            disabled: false,
            disableIfInvalid: false,
            disabledClassName: '_disabled',
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

    componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw `react-form.tools: Submit must be used only inside Form component`;
        }
    },

    render() {
        const isValid = this.context.form.isValid();

        return (
            <input
                {..._.omit(this.props, 'children')}
                type="submit"
                onClick={this.onClick}
                className={classNames(this.props.className, {
                    [this.props.disabledClassName]: !isValid || this.props.disabled,
                })}
                disabled={this.props.disableIfInvalid && !isValid || this.props.disabled}
                value={this.props.value || this.props.children} />
        );
    },
});
