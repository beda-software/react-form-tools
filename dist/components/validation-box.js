'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('../utils');

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _mixins = require('../mixins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = _react2.default.createClass({
    displayName: 'ValidationBox',

    mixins: [_mixins.FormComponentMixin, _reactAddonsPureRenderMixin2.default],

    propTypes: {
        fieldPath: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string.isRequired, _react2.default.PropTypes.array.isRequired]),
        alwaysShowError: _react2.default.PropTypes.bool,
        displayError: _react2.default.PropTypes.bool,
        className: _react2.default.PropTypes.string,
        dirtyClassName: _react2.default.PropTypes.string,
        errorClassName: _react2.default.PropTypes.string,
        errorMessageClassName: _react2.default.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            alwaysShowError: false,
            displayError: true,
            dirtyClassName: '_dirty',
            errorClassName: '_error',
            errorMessageClassName: 'validationbox-error-message'
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
    componentWillMount: function componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw 'react-form.tools: ValidationBox must be used only inside Form component';
        }
    },
    render: function render() {
        var _classNames;

        var _props = this.props;
        var className = _props.className;
        var dirtyClassName = _props.dirtyClassName;
        var errorClassName = _props.errorClassName;
        var errorMessageClassName = _props.errorMessageClassName;
        var displayError = _props.displayError;
        var alwaysShowError = _props.alwaysShowError;
        var children = _props.children;


        var errors = this.getErrors();
        var isDirty = this.isDirty();
        var isValid = this.isValid();

        var generatedClassName = (0, _classnames2.default)(className, (_classNames = {}, _defineProperty(_classNames, dirtyClassName, isDirty), _defineProperty(_classNames, errorClassName, (isDirty || this.props.alwaysShowError) && !isValid), _classNames));

        return _react2.default.createElement(
            'div',
            { className: generatedClassName,
                'data-field-path': (0, _utils.getFieldPathAsString)(this.getFieldPath()) },
            children,
            displayError && (isDirty || alwaysShowError) ? _react2.default.createElement(
                'div',
                { className: errorMessageClassName },
                errors
            ) : null
        );
    }
});