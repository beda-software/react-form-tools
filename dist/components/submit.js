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

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = _react2.default.createClass({
    displayName: 'Submit',

    mixins: [_reactAddonsPureRenderMixin2.default],

    propTypes: {
        className: _react2.default.PropTypes.string,
        disableIfInvalid: _react2.default.PropTypes.bool,
        disabled: _react2.default.PropTypes.bool,
        disabledClassName: _react2.default.PropTypes.string,
        onClick: _react2.default.PropTypes.func
    },

    contextTypes: {
        form: _react2.default.PropTypes.object.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            disabled: false,
            disableIfInvalid: false,
            disabledClassName: '_disabled',
            onClick: _lodash2.default.identity
        };
    },
    getInitialState: function getInitialState() {
        return {
            isValid: false
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
    onFormStateUpdate: function onFormStateUpdate(data) {
        var isValid = _lodash2.default.isEmpty(_lodash2.default.get(data, 'errors'));

        this.setState({
            isValid: isValid
        });
    },
    componentWillMount: function componentWillMount() {
        /* istanbul ignore next */
        if (!this.context.form) {
            throw 'react-form.tools: Submit must be used only inside Form component';
        }
    },
    componentDidMount: function componentDidMount() {
        this.context.form.subscribe(this.onFormStateUpdate);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.context.form.unsubscribe(this.onFormStateUpdate);
    },
    render: function render() {
        var isValid = this.state.isValid;

        return _react2.default.createElement('input', _extends({}, _lodash2.default.omit(this.props, 'children'), {
            type: 'submit',
            onClick: this.onClick,
            className: (0, _classnames2.default)(this.props.className, _defineProperty({}, this.props.disabledClassName, !isValid || this.props.disabled)),
            disabled: this.props.disableIfInvalid && !isValid || this.props.disabled,
            value: this.props.value || this.props.children }));
    }
});