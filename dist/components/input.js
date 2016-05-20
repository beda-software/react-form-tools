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

var _mixins = require('../mixins');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Input',

    mixins: [_reactAddonsPureRenderMixin2.default, _mixins.FormComponentMixin],

    propTypes: {
        cursor: _baobabPropTypes2.default.cursor,
        onChange: _react2.default.PropTypes.func,
        onKeyPress: _react2.default.PropTypes.func,
        onSync: _react2.default.PropTypes.func,
        onBlur: _react2.default.PropTypes.func,
        sync: _react2.default.PropTypes.bool,
        syncOnlyOnBlur: _react2.default.PropTypes.bool,
        autoFocus: _react2.default.PropTypes.bool,
        toInternal: _react2.default.PropTypes.func,
        toRepresentation: _react2.default.PropTypes.func
    },

    deferredSyncTimer: null,

    msToPoll: 200,

    getInitialState: function getInitialState() {
        return {
            value: this.props.toInternal(this.getCursor().get()) || ''
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            type: 'text',
            nullable: false,
            toInternal: _lodash2.default.identity,
            toRepresentation: _lodash2.default.identity,
            onBlur: _lodash2.default.identity,
            onChange: _lodash2.default.identity,
            onSync: _lodash2.default.identity,
            onKeyPress: _lodash2.default.identity,
            sync: false
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
        if (this.deferredSyncTimer) {
            // Does not set state when component received props while user inputs
            return;
        }

        this.setState({
            value: this.props.toInternal(this.getCursor(nextProps, nextContext).get())
        });
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        if (this.props.autoFocus) {
            setTimeout(function () {
                var element = _reactDom2.default.findDOMNode(_this.refs.input);

                if (element) {
                    element.focus();
                }
            }, 0);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.clearDeferredSyncTimer();
    },
    clearDeferredSyncTimer: function clearDeferredSyncTimer() {
        if (this.deferredSyncTimer) {
            clearTimeout(this.deferredSyncTimer);
            this.deferredSyncTimer = null;
        }
    },
    deferredSyncValue: function deferredSyncValue(eventCallback) {
        var _this2 = this;

        this.clearDeferredSyncTimer();
        this.deferredSyncTimer = setTimeout(function () {
            return _this2.syncValue(eventCallback);
        }, this.msToPoll);
    },
    syncValue: function syncValue(eventCallback) {
        var _this3 = this;

        // Synchronizes value with cursor
        var value = this.props.nullable && this.state.value === '' ? null : this.state.value;
        var previousValue = this.getCursor().get();

        if (value === previousValue) {
            if (_lodash2.default.isFunction(eventCallback)) {
                eventCallback();
            }

            return;
        }

        this.setValue(value, function () {
            _this3.setDirtyState();
            _this3.props.onSync(value, previousValue);

            if (_lodash2.default.isFunction(eventCallback)) {
                eventCallback();
            }
        });
    },
    updateValue: function updateValue(value) {
        var forceSync = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var eventCallback = arguments[2];

        // Synchronizes value with state
        this.setState({ value: value }, function () {
            if (this.props.sync || forceSync) {
                this.syncValue(eventCallback);
                return;
            }

            if (!this.props.syncOnlyOnBlur) {
                this.deferredSyncValue(eventCallback);
            }
        });
    },
    onChange: function onChange(event) {
        var value = this.props.toInternal(event.target.value);
        var previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.updateValue(value);
        this.props.onChange(value, previousValue);
    },
    onBlur: function onBlur(event) {
        var _this4 = this;

        var value = this.props.toInternal(event.target.value);

        // Prevent future updates
        this.clearDeferredSyncTimer();

        // Set inner state value and force synchronization
        this.updateValue(value, true, function () {
            return _this4.props.onBlur(event);
        });
    },
    onKeyPress: function onKeyPress(event) {
        var _this5 = this;

        if (this.context.form) {
            if ((0, _utils.isEnterPressed)(event)) {
                event.preventDefault();
                event.stopPropagation();

                this.clearDeferredSyncTimer();
                this.syncValue(function () {
                    return _this5.context.form.submit();
                });
            }
        }

        this.props.onKeyPress();
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

        return _react2.default.createElement('input', _extends({}, this.props, props, {
            type: this.props.type,
            onKeyPress: this.onKeyPress,
            ref: 'input' }));
    }
});