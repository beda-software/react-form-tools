'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Submit',

    propTypes: {
        className: _react2.default.PropTypes.string,
        disableIfInvalid: _react2.default.PropTypes.bool
    },

    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            disableIfInvalid: false
        };
    },
    render: function render() {
        var disabled = !this.context.form.isValid();

        return _react2.default.createElement('input', {
            type: 'submit',
            className: (0, _classnames2.default)(this.props.className, { _disabled: disabled }),
            disabled: this.props.disableIfInvalid && disabled,
            value: this.props.children });
    }
});