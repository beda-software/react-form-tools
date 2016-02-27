'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'ValidationBox',

    propTypes: {
        fieldPath: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string.isRequired, _react2.default.PropTypes.array.isRequired]),
        className: _react2.default.PropTypes.string
    },

    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    childContextTypes: {
        fieldPath: _react2.default.PropTypes.array
    },

    getChildContext: function getChildContext() {
        return {
            fieldPath: (0, _utils.resolveFieldPath)(this.props.fieldPath)
        };
    },

    render: function render() {
        var form = this.context.form;
        // TODO: use ValidationError instead of this code
        var error = form.getValidationErrors(this.props.fieldPath);
        var isDirty = form.isDirty(this.props.fieldPath);
        var isValid = !error;
        var className = (0, _classnames2.default)(this.props.className, {
            _error: isDirty && !isValid
        });

        return _react2.default.createElement(
            'div',
            { className: className },
            this.props.children,
            _react2.default.createElement(
                'div',
                { className: this.props.className + '-msg' },
                isDirty && error
            )
        );
    }
});