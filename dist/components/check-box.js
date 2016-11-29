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

var _mixins = require('../mixins');

var _baobabReactMixins = require('baobab-react-mixins');

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'CheckBox',

    mixins: [_baobabReactMixins.BranchMixin, _mixins.FormComponentMixin, _reactAddonsPureRenderMixin2.default],

    propTypes: {
        value: _react2.default.PropTypes.any,
        uncheckedValue: _react2.default.PropTypes.any,
        cursor: _baobabPropTypes2.default.cursor,
        onChange: _react2.default.PropTypes.func
    },

    cursors: function cursors(props, context) {
        return {
            value: this.getCursor(props, context)
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            onChange: _lodash2.default.identity,
            value: true,
            uncheckedValue: false
        };
    },
    onChange: function onChange(event) {
        var _this = this;

        var value = event.target.checked ? this.props.value : this.props.uncheckedValue;
        var previousValue = this.state.value;

        if (value === previousValue) {
            return;
        }

        this.setValue(value, function () {
            _this.setDirtyState();
            _this.props.onChange(value, previousValue);
        });
    },
    isChecked: function isChecked() {
        return _lodash2.default.isEqual(this.props.value, this.state.value);
    },
    render: function render() {
        var props = {
            type: 'checkbox',
            checked: this.isChecked(),
            onChange: this.onChange,
            onKeyPress: this.processKeyPressForSubmit
        };

        var restProps = _lodash2.default.omit(this.props, ['value', 'uncheckedValue', 'onChange', 'cursor']);

        return _react2.default.createElement('input', _extends({}, restProps, props));
    }
});