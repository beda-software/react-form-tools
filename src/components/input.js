import React from 'react'
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    displayName: 'Input',

    mixins: [PureRenderMixin],

    propTypes: {
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        cursor: BaobabPropTypes.cursor.isRequired,
        sync: React.PropTypes.bool,
        syncOnlyOnBlur: React.PropTypes.bool,
        autoFocus: React.PropTypes.bool,
    },

    updateTimer: null,

    msToPoll: 200,

    selection: null,

    getInitialState: function() {
        return {
            value: this.props.toInternal(this.props.cursor.get()),
        }
    },

    getDefaultProps: function() {
        return {
            type: 'text',
            nullable: true,
            toInternal: x => x,
            toRepresentation: x => x,
        };
    },

    componentWillReceiveProps(nextProps) {
        if (this.updateTimer) {
            // Does not set state when component received props while user inputs
            return;
        }
        this.setState({
            value: this.props.toInternal(nextProps.cursor.get()),
        });
    },

    componentDidMount: function() {
        if (this.props.autoFocus) {
            setTimeout(() => ReactDOM.findDOMNode(this.refs.input).focus(), 0);
        }
    },

    componentWillUnmount: function() {
        this.clearUpdateTimer();
    },

    clearUpdateTimer: function() {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }
    },

    setUpdateTimer: function() {
        this.clearUpdateTimer();
        this.updateTimer = setTimeout(this.syncValue, this.msToPoll);
    },

    onChange: function(evt) {
        const value = this.props.toInternal(evt.target.value);

        if (value === this.state.value) {
            // Skip sync if no changes
            return;
        }

        this.setState({ value }, function() {
            if (!this.props.syncOnlyOnBlur) {
                if (this.props.sync) {
                    this.syncValue();
                } else {
                    this.setUpdateTimer();
                }
            }
        });
    },

    syncValue: function() {
        const value = this.props.nullable && this.state.value === '' ? null : this.state.value;

        this.props.cursor.set(value);
        if (_.isFunction(this.props.onChange)) {
            setTimeout(() => this.props.onChange(value), 0);
        }
    },

    onBlur: function(evt) {
        this.clearUpdateTimer();

        this.syncValue();

        if (_.isFunction(this.props.onBlur)) {
            this.props.onBlur(evt);
        }
    },

    render: function() {
        const props = {
            value: this.props.toRepresentation(this.state.value),
            onChange: this.onChange,
            onBlur: this.onBlur,
        };

        if (this.props.type == 'textarea') {
            return <textarea {...this.props} {...props} ref="input" />
        }
        return <input type={this.props.type} {...this.props} {...props} ref="input" />;
    },
});
