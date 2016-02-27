'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Input',

    mixins: [_reactAddonsPureRenderMixin2.default],

    propTypes: {
        cursor: _baobabPropTypes2.default.cursor,
        onChange: _react2.default.PropTypes.func,
        onBlur: _react2.default.PropTypes.func,
        sync: _react2.default.PropTypes.bool,
        syncOnlyOnBlur: _react2.default.PropTypes.bool,
        autoFocus: _react2.default.PropTypes.bool,
        toInternal: _react2.default.PropTypes.func,
        toRepresentation: _react2.default.PropTypes.func
    },

    contextTypes: {
        form: _react2.default.PropTypes.object,
        fieldPath: _react2.default.PropTypes.array
    },

    deferredSyncTimer: null,

    msToPoll: 200,

    selection: null,

    getInitialState: function getInitialState() {
        return {
            value: this.props.toInternal(this.getCursor().get()) || ''
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'text',
            nullable: true,
            toInternal: _lodash2.default.identity,
            toRepresentation: _lodash2.default.identity,
            onBlur: _lodash2.default.identity,
            onChange: _lodash2.default.identity,
            onSync: _lodash2.default.identity
        };
    },

    getCursor: function getCursor(props) {
        props = props || this.props;
        var cursor = props.cursor || this.context.form.cursor.select(this.context.fieldPath);
        if (!cursor) {
            throw 'react-form.tools Input: cursor must be set via `cursor` or ' + 'via higher order component ValidationBox with fieldPath';
        }
        return cursor;
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.deferredSyncTimer) {
            // Does not set state when component received props while user inputs
            return;
        }
        this.setState({
            value: this.props.toInternal(this.getCursor(nextProps).get())
        });
    },


    componentDidMount: function componentDidMount() {
        var _this = this;

        if (this.props.autoFocus) {
            setTimeout(function () {
                return _reactDom2.default.findDOMNode(_this.refs.input).focus();
            }, 0);
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        this.clearDeferredSyncTimer();
    },

    inValidationBox: function inValidationBox() {
        return !!(this.context.form && this.context.fieldPath);
    },

    setDirtyState: function setDirtyState() {
        if (this.inValidationBox()) {
            this.context.form.setDirtyState(this.context.fieldPath);
        }
    },

    setPristineState: function setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.context.fieldPath);
        }
    },

    isDirty: function isDirty() {
        if (this.inValidationBox()) {
            return this.context.form.isDirty(this.context.fieldPath);
        }
    },

    isValid: function isValid() {
        if (this.inValidationBox()) {
            return this.context.form.isValid(this.context.fieldPath);
        }
    },

    clearDeferredSyncTimer: function clearDeferredSyncTimer() {
        if (this.deferredySyncTimer) {
            clearTimeout(this.deferredSyncTimer);
            this.deferredSyncTimer = null;
        }
    },

    deferredSyncValue: function deferredSyncValue() {
        this.clearDeferredSyncTimer();
        this.deferredSyncTimer = setTimeout(this.syncValue, this.msToPoll);
    },

    syncValue: function syncValue() {
        var _this2 = this;

        var value = this.props.nullable && this.state.value === '' ? null : this.state.value;
        var previousValue = this.getCursor().get();

        if (value === previousValue) {
            return;
        }

        this.getCursor().set(value);
        this.setDirtyState();

        // Wait for next frame
        setTimeout(function () {
            return _this2.props.onSync(value, previousValue);
        }, 0);
    },

    setValue: function setValue(value) {
        var forceSync = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        this.setState({ value: value }, function () {
            if (this.props.sync || forceSync) {
                this.syncValue();
                return;
            }
            if (!this.props.syncOnlyOnBlur) {
                this.deferredSyncValue();
            }
        });
    },

    onChange: function onChange(evt) {
        var value = this.props.toInternal(evt.target.value);
        var previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.setValue(value);
        this.props.onChange(value, previousValue);
    },

    onBlur: function onBlur(evt) {
        var _this3 = this;

        var value = this.props.toInternal(evt.target.value);

        // Prevent future updates
        this.clearDeferredSyncTimer();

        // Set inner state value and force synchronization
        this.setValue(value, true);

        // Wait for next frame
        setTimeout(function () {
            return _this3.props.onBlur(evt);
        }, 0);
    },

    render: function render() {
        var props = {
            value: this.props.toRepresentation(this.state.value),
            onChange: this.onChange,
            onBlur: this.onBlur
        };

        if (this.props.type == 'textarea') {
            return _react2.default.createElement('textarea', _extends({}, this.props, props, { ref: 'input' }));
        }
        return _react2.default.createElement('input', _extends({ type: this.props.type }, this.props, props, { ref: 'input' }));
    }
});