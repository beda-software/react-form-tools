'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'ValidationGlobalError',

    propTypes: {
        className: _react2.default.PropTypes.string.isRequired,
        globalErrorFieldName: _react2.default.PropTypes.string
    },

    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            globalErrorFieldName: '__all__'
        };
    },

    render: function render() {
        var form = this.context.form;
        // TODO: change fieldPath
        var fieldPath = ['attributes', this.props.globalErrorFieldName];
        var isValid = form.isValid(fieldPath);

        return !isValid && _react2.default.createElement(
            'div',
            { className: this.props.className + '-global-error' },
            form.getValidationErrors(fieldPath)
        );
    }
});