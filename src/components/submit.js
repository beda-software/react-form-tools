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
        disabledClassName: React.PropTypes.string,
        onClick: React.PropTypes.func,
    },

    contextTypes: {
        form: React.PropTypes.object.isRequired,
    },

    getDefaultProps() {
        return {
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

    componentDidMount() {
        this.context.form.subscribe(this.onFormStateUpdate);
    },

    componentWillUnmount() {
        this.context.form.unsubscribe(this.onFormStateUpdate);
    },

    render() {
        const disabled = !this.state.isValid;

        return (
            <input
                {..._.omit(this.props, 'children')}
                type="submit"
                onClick={this.onClick}
                className={classNames(this.props.className, { [this.props.disabledClassName]: disabled })}
                disabled={this.props.disableIfInvalid && disabled}
                value={this.props.value || this.props.children} />
        );
    },
});
