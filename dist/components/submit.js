'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Submit',

    propTypes: {
        className: _react2.default.PropTypes.string,
        disableIfInvalid: _react2.default.PropTypes.bool,
        onClick: _react2.default.PropTypes.func
    },

    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            disableIfInvalid: false,
            onClick: _lodash2.default.identity
        };
    },
    onClick: function onClick(event) {
        if (!this.context.form.isHtmlForm()) {
            event.preventDefault();
            event.stopPropagation();
            this.context.form.submit();
        }

        this.props.onClick(event);
    },
    render: function render() {
        var disabled = !this.context.form.isValid();

        return _react2.default.createElement('input', _extends({}, _lodash2.default.omit(this.props, 'children'), {
            type: 'submit',
            onClick: this.onClick,
            className: (0, _classnames2.default)(this.props.className, { _disabled: disabled }),
            disabled: this.props.disableIfInvalid && disabled,
            value: this.props.value || this.props.children }));
    }
});