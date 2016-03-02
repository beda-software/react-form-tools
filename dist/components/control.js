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

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _mixins = require('../mixins');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'Control',

    mixins: [_mixins.FormComponentMixin],

    propTypes: {
        value: _react2.default.PropTypes.any,
        cursor: _baobabPropTypes2.default.cursor
    },

    contextTypes: {
        fieldPath: _react2.default.PropTypes.array
    },

    getDefaultProps: function getDefaultProps() {
        return {
            onChange: _lodash2.default.identity,
            onSync: _lodash2.default.identity
        };
    },
    onChange: function onChange(event) {
        var _this = this;

        var cursor = this.getCursor();
        var value = event.target.value;
        var previousValue = cursor.get();

        if (value === previousValue) {
            return;
        }

        cursor.set(value);
        this.setDirtyState();

        setTimeout(function () {
            _this.props.onChange(value, previousValue);
            _this.props.onSync(value, previousValue);
        }, 0);
    },
    isChecked: function isChecked() {
        return this.props.value === this.getCursor().get();
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var value = this.getCursor(nextProps, nextContext).get();

        return this.props.value !== value || _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(this, nextProps, nextState);
    },
    render: function render() {
        var props = {
            onChange: this.onChange,
            checked: this.isChecked(),
            name: this.props.name || (0, _utils.getNameFromFieldPath)(this.props.fieldPath)
        };

        return _react2.default.createElement('input', _extends({}, this.props, props));
    }
});