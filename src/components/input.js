import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import BaobabPropTypes from 'baobab-prop-types';
import { BranchMixin } from 'baobab-react-mixins';
import { FormComponentMixin } from '../mixins';

export default React.createClass({
    displayName: 'Input',

    mixins: [BranchMixin, FormComponentMixin, PureRenderMixin],

    propTypes: {
        cursor: BaobabPropTypes.cursor,
        onChange: React.PropTypes.func,
        onKeyPress: React.PropTypes.func,
        onSync: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        sync: React.PropTypes.bool,
        syncOnlyOnBlur: React.PropTypes.bool,
        autoFocus: React.PropTypes.bool,
        toInternal: React.PropTypes.func,
        toRepresentation: React.PropTypes.func,
    },

    deferredSyncTimer: null,

    msToPoll: 200,

    cursors(props, context) {
        return {
            cursorValue: this.getCursor(props, context),
        };
    },

    getInitialState() {
        return {
            value: this.props.toInternal(this.getCursor().get()) || '',
        };
    },

    getDefaultProps() {
        return {
            type: 'text',
            nullable: false,
            toInternal: _.identity,
            toRepresentation: _.identity,
            onBlur: _.identity,
            onChange: _.identity,
            onSync: _.identity,
            onKeyPress: _.identity,
            sync: false,
        };
    },

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (this.deferredSyncTimer) {
            // Does not set state when component received props while user inputs
            return;
        }

        if (this.state.cursorValue !== prevState.cursorValue) {
            this.setState({
                value: this.props.toInternal(this.state.cursorValue) || '',
            });
        }
    },

    componentDidMount() {
        if (this.props.autoFocus) {
            setTimeout(() => {
                const element = ReactDOM.findDOMNode(this.refs.input);

                if (element) {
                    element.focus();
                }
            }, 0);
        }
    },

    componentWillUnmount() {
        this.clearDeferredSyncTimer();
    },

    clearDeferredSyncTimer() {
        if (this.deferredSyncTimer) {
            clearTimeout(this.deferredSyncTimer);
            this.deferredSyncTimer = null;
        }
    },

    deferredSyncValue(eventCallback) {
        this.clearDeferredSyncTimer();
        this.deferredSyncTimer = setTimeout(() => this.syncValue(eventCallback), this.msToPoll);
    },

    syncValue(eventCallback) {
        // Synchronizes value with cursor
        const value = this.props.nullable && this.state.value === '' ? null : this.state.value;
        const previousValue = this.state.cursorValue;

        if (value === previousValue) {
            if (_.isFunction(eventCallback)) {
                eventCallback();
            }

            return;
        }

        this.setValue(value, () => {
            this.setDirtyState();
            this.props.onSync(value, previousValue);

            if (_.isFunction(eventCallback)) {
                eventCallback();
            }
        });
    },

    updateValue(value, forceSync=false, eventCallback) {
        // Synchronizes value with state
        this.setState({ value }, function () {
            if (this.props.sync || forceSync) {
                this.syncValue(eventCallback);
                return;
            }

            if (!this.props.syncOnlyOnBlur) {
                this.deferredSyncValue(eventCallback);
            }
        });
    },

    onChange(event) {
        const value = this.props.toInternal(event.target.value);
        const previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.updateValue(value);
        this.props.onChange(value, previousValue);
    },

    onBlur(event) {
        const value = this.props.toInternal(event.target.value);

        // Prevent future updates
        this.clearDeferredSyncTimer();

        // Set inner state value and force synchronization
        this.updateValue(value, true, () => this.props.onBlur(event));
    },

    onKeyPress(event) {
        this.processKeyPress(event, () => {
            this.clearDeferredSyncTimer();
            this.syncValue(() => this.context.form.submit());
        });
    },

    render() {
        const props = {
            value: this.props.toRepresentation(this.state.value),
            onChange: this.onChange,
            onBlur: this.onBlur,
        };

        if (this.props.type == 'textarea') {
            return (
                <textarea {...this.props} {...props} ref="input" />
            );
        }

        return (
            <input {...this.props} {...props}
                type={this.props.type}
                onKeyPress={this.onKeyPress}
                ref="input" />
        );
    },
});
