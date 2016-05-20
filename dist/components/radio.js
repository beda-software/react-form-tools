'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _mixins = require('../mixins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Radio',

    mixins: [_mixins.FormComponentMixin],

    propTypes: {
        value: _react2.default.PropTypes.any,
        cursor: _baobabPropTypes2.default.cursor,
        onChange: _react2.default.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            onChange: _lodash2.default.identity
        };
    },
    onChange: function onChange() {
        var _this = this;

        var cursor = this.getCursor();
        var value = this.props.value;
        var previousValue = cursor.get();

        if (value === previousValue) {
            return;
        }

        this.setValue(value, function () {
            _this.setDirtyState();
            _this.props.onChange(value, previousValue);
        });
    },
    isChecked: function isChecked() {
        return _lodash2.default.isEqual(this.props.value, this.getCursor().get());
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var value = this.getCursor(nextProps, nextContext).get();

        return !_lodash2.default.isEqual(this.props.value, value) || _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(this, nextProps, nextState);
    },
    render: function render() {
        var props = {
            type: 'radio',
            checked: this.isChecked(),
            onChange: this.onChange,
            onKeyPress: this.processKeyPress
        };

        return _react2.default.createElement('input', _extends({}, this.props, props));
    }
});