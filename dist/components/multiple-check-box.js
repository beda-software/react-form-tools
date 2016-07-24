'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mixins = require('../mixins');

var _baobabReactMixins = require('baobab-react-mixins');

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'MultipleCheckBox',

    mixins: [_baobabReactMixins.BranchMixin, _mixins.FormComponentMixin, _reactAddonsPureRenderMixin2.default],

    propTypes: {
        value: _react2.default.PropTypes.any.isRequired,
        cursor: _baobabPropTypes2.default.cursor,
        onChange: _react2.default.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            onChange: _lodash2.default.identity
        };
    },
    cursors: function cursors(props, context) {
        return {
            value: this.getCursor(props, context)
        };
    },
    onChange: function onChange(event) {
        var _this = this;

        var wasChecked = this.isChecked();
        var isChecked = event.target.checked;

        if (isChecked === wasChecked) {
            return;
        }

        var value = isChecked ? _lodash2.default.concat(this.state.value, this.props.value) : _lodash2.default.without(this.state.value, this.props.value);

        this.setValue(value, function () {
            _this.setDirtyState();
            _this.props.onChange(isChecked, !isChecked);
        });
    },
    isChecked: function isChecked() {
        return _lodash2.default.includes(this.state.value, this.props.value);
    },
    render: function render() {
        var props = {
            type: 'checkbox',
            onChange: this.onChange,
            checked: this.isChecked()
        };

        return _react2.default.createElement('input', _extends({}, this.props, props));
    }
});