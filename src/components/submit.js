import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
    displayName: 'Submit',

    mixins: [PureRenderMixin],

    propTypes: {
        className: React.PropTypes.string,
        disableIfInvalid: React.PropTypes.bool,
        disabled: React.PropTypes.bool,
        disabledClassName: React.PropTypes.string,
        onClick: React.PropTypes.func,
        value: React.PropTypes.string,
        children: React.PropTypes.node,
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

    getInitialState() {
        return {
            isValid: false,
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

    onFormStateUpdate(data) {
        const isValid = _.isEmpty(_.get(data, 'errors'));

        this.setState({
            isValid,
        });
    },

    componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw `react-form.tools: Submit must be used only inside Form component`;
        }
    },

    componentDidMount() {
        this.context.form.subscribe(this.onFormStateUpdate);
    },

    componentWillUnmount() {
        this.context.form.unsubscribe(this.onFormStateUpdate);
    },

    render() {
        const {
            className, disabledClassName, disabled, disableIfInvalid,
            value, children,
        } = this.props;
        const restProps = _.omit(this.props, [
            'className', 'disabledClassName', 'disabled', 'disableIfInvalid',
            'value', 'children', 'onClick',
        ]);
        const isValid = this.state.isValid;

        return (
            <input
                {...restProps}
                type="submit"
                onClick={this.onClick}
                className={classNames(className, {
                    [disabledClassName]: !isValid || disabled,
                })}
                disabled={disableIfInvalid && !isValid || disabled}
                value={value || children} />
        );
    },
});
