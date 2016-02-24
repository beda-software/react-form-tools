import React from 'react'
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    displayName: 'Input',

    mixins: [PureRenderMixin],

    propTypes: {
        cursor: BaobabPropTypes.cursor,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        sync: React.PropTypes.bool,
        syncOnlyOnBlur: React.PropTypes.bool,
        autoFocus: React.PropTypes.bool,
        toInternal: React.PropTypes.func,
        toRepresentation: React.PropTypes.func,
    },

    contextTypes: {
        form: React.PropTypes.object,
        fieldPath: React.PropTypes.array,
    },

    updateTimer: null,

    msToPoll: 200,

    selection: null,

    getInitialState: function() {
        return {
            value: this.props.toInternal(this.getCursor().get()),
        }
    },

    getDefaultProps: function() {
        return {
            type: 'text',
            nullable: true,
            toInternal: _.identity,
            toRepresentation: _.identity,
            onBlur: _.identity,
            onChange: _.identity,
        };
    },

    getCursor: function(props) {
        props = props || this.props;
        const cursor = props.cursor || this.context.form.cursor.select(this.context.fieldPath);
        if (!cursor) {
            throw 'react-form.tools Input: cursor must be set via `cursor` or ' +
                  'via higher order component ValidationBox with fieldPath';
        }
        return cursor;
    },

    componentWillReceiveProps(nextProps) {
        if (this.updateTimer) {
            // Does not set state when component received props while user inputs
            return;
        }
        this.setState({
            value: this.props.toInternal(this.getCursor(nextProps).get()),
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

    inValidationBox: function() {
        return !!(this.context.form && this.context.fieldPath);
    },

    setDirtyState: function() {
        if (this.inValidationBox()) {
            this.context.form.setDirtyState(this.context.fieldPath);
        }
    },

    setPristineState: function() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.context.fieldPath);
        }
    },

    isDirty: function() {
        if (this.inValidationBox()) {
            return this.context.form.isDirty(this.context.fieldPath);
        }
    },

    isValid: function() {
        if (this.inValidationBox()) {
            return this.context.form.isValid(this.context.fieldPath);
        }
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

    syncValue: function() {
        const value = this.props.nullable && this.state.value === '' ? null : this.state.value;
        const previousValue = this.getCursor().get();

        if (value === previousValue) {
            return;
        }

        this.getCursor().set(value);
        this.setDirtyState();

        // Wait for next frame
        setTimeout(() => this.props.onChange(value, previousValue), 0);
    },

    setValue: function(rawValue, forceSync=false) {
        const value = this.props.toInternal(rawValue);

        if (value === this.state.value) {
            return;
        }

        this.setState({value}, function() {
            if (this.props.sync || forceSync) {
                this.syncValue();
            } else {
                this.setUpdateTimer();
            }
        });
    },

    onChange: function(evt) {
        if (this.props.syncOnlyOnBlur) {
            return;
        }
        this.setValue(evt.target.value);
    },

    onBlur: function(evt) {
        // Prevent future updates
        this.clearUpdateTimer();

        // Set inner state value and force synchronization
        this.setValue(evt.target.value, true);

        // Wait for next frame
        setTimeout(() => this.props.onBlur(evt), 0);
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
