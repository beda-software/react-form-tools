import React from 'react';
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

    deferredSyncTimer: null,

    msToPoll: 200,

    selection: null,

    getInitialState() {
        return {
            value: this.props.toInternal(this.getCursor().get()) || '',
        };
    },

    getDefaultProps() {
        return {
            type: 'text',
            nullable: true,
            toInternal: _.identity,
            toRepresentation: _.identity,
            onBlur: _.identity,
            onChange: _.identity,
            onSync: _.identity,
        };
    },

    getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        /* istanbul ignore next */
        if (!props.cursor && !context.fieldPath) {
            throw 'react-form.tools Input: cursor must be set via `cursor` or ' +
                  'via higher order component ValidationBox with fieldPath';
        }

        return props.cursor || context.form.cursor.select(context.fieldPath);
    },

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.deferredSyncTimer) {
            // Does not set state when component received props while user inputs
            return;
        }

        this.setState({
            value: this.props.toInternal(this.getCursor(nextProps, nextContext).get()),
        });
    },

    componentDidMount() {
        if (this.props.autoFocus) {
            setTimeout(() => ReactDOM.findDOMNode(this.refs.input).focus(), 0);
        }
    },

    componentWillUnmount() {
        this.clearDeferredSyncTimer();
    },

    inValidationBox() {
        return !!(this.context.form && this.context.fieldPath);
    },

    setDirtyState() {
        if (this.inValidationBox()) {
            this.context.form.setDirtyState(this.context.fieldPath);
        }
    },

    setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.context.fieldPath);
        }
    },

    isDirty() {
        if (this.inValidationBox()) {
            return this.context.form.isDirty(this.context.fieldPath);
        }
    },

    isValid() {
        if (this.inValidationBox()) {
            return this.context.form.isValid(this.context.fieldPath);
        }
    },

    clearDeferredSyncTimer() {
        if (this.deferredSyncTimer) {
            clearTimeout(this.deferredSyncTimer);
            this.deferredSyncTimer = null;
        }
    },

    deferredSyncValue() {
        this.clearDeferredSyncTimer();
        this.deferredSyncTimer = setTimeout(this.syncValue, this.msToPoll);
    },

    syncValue() {
        const value = this.props.nullable && this.state.value === '' ? null : this.state.value;
        const previousValue = this.getCursor().get();

        if (value === previousValue) {
            return;
        }

        this.getCursor().set(value);
        this.setDirtyState();

        // Wait for next frame
        setTimeout(() => this.props.onSync(value, previousValue), 0);
    },

    setValue(value, forceSync=false) {
        this.setState({ value }, function () {
            if (this.props.sync || forceSync) {
                this.syncValue();
                return;
            }

            if (!this.props.syncOnlyOnBlur) {
                this.deferredSyncValue();
            }
        });
    },

    onChange(evt) {
        const value = this.props.toInternal(evt.target.value);
        const previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.setValue(value);
        this.props.onChange(value, previousValue);
    },

    onBlur(evt) {
        const value = this.props.toInternal(evt.target.value);

        // Prevent future updates
        this.clearDeferredSyncTimer();

        // Set inner state value and force synchronization
        this.setValue(value, true);

        // Wait for next frame
        setTimeout(() => this.props.onBlur(evt), 0);
    },

    render() {
        const props = {
            value: this.props.toRepresentation(this.state.value),
            onChange: this.onChange,
            onBlur: this.onBlur,
        };

        if (this.props.type == 'textarea') {
            return <textarea {...this.props} {...props} ref="input" />;
        }

        return <input type={this.props.type} {...this.props} {...props} ref="input" />;
    },
});
