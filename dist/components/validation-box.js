'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'ValidationBox',

    propTypes: {
        fieldPath: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string.isRequired, _react2.default.PropTypes.array.isRequired]),
        className: _react2.default.PropTypes.string,
        alwaysShowError: _react2.default.PropTypes.bool,
        displayError: _react2.default.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            alwaysShowError: false,
            displayError: true
        };
    },


    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    childContextTypes: {
        fieldPath: _react2.default.PropTypes.array
    },

    getChildContext: function getChildContext() {
        return {
            fieldPath: (0, _utils.getFieldPathAsArray)(this.props.fieldPath)
        };
    },
    render: function render() {
        var fieldPath = this.props.fieldPath;
        var form = this.context.form;
        var error = form.getValidationErrors(fieldPath);
        var isDirty = form.isDirty(fieldPath);
        var isValid = !error;
        var className = (0, _classnames2.default)(this.props.className, {
            _dirty: isDirty,
            _error: (isDirty || this.props.alwaysShowError) && !isValid
        });

        return _react2.default.createElement(
            'div',
            { className: className, 'data-field-path': (0, _utils.getFieldPathAsString)(fieldPath) },
            this.props.children,
            this.props.displayError && (isDirty || this.props.alwaysShowError) ? _react2.default.createElement(
                'div',
                { className: 'validationbox-error-message' },
                error
            ) : null
        );
    }
});