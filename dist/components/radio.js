'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Radio',

    propTypes: {
        cursor: _baobabPropTypes2.default.cursor.isRequired
    },

    onChange: function onChange() {
        var _this = this;

        var value = this.props.value;

        this.props.cursor.set(value);

        if (this.props.onChange) {
            setTimeout(function () {
                return _this.props.onChange(value);
            }, 0);
        }
    },

    isChecked: function isChecked() {
        return this.props.value == this.props.cursor.get();
    },

    render: function render() {
        return _react2.default.createElement('input', _extends({}, this.props, {
            onChange: this.onChange,
            type: 'radio',
            checked: this.isChecked() }));
    }
});