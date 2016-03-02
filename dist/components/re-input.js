'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'ReInput',

    propTypes: {
        cursor: _baobabPropTypes2.default.cursor.isRequired,
        skip: _react2.default.PropTypes.string.isRequired
    },

    toInternal: function toInternal(value) {
        var regexp = new RegExp(this.props.skip, 'g');

        return String(value).replace(regexp, '');
    },
    render: function render() {
        return _react2.default.createElement(_input2.default, _extends({
            type: 'text',
            toInternal: this.toInternal,
            toRepresentation: this.toInternal
        }, this.props));
    }
});