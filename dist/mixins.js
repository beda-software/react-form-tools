'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FormComponentMixin = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormComponentMixin = exports.FormComponentMixin = {
    contextTypes: {
        form: _react2.default.PropTypes.object,
        fieldPath: _react2.default.PropTypes.array
    },

    processKeyPress: function processKeyPress(event) {
        // Helper method for form components
        if (this.context.form) {
            if ((0, _utils.isEnterPressed)(event)) {
                event.preventDefault();
                event.stopPropagation();
                this.context.form.submit();
            }
        }

        if (_lodash2.default.isFunction(this.props.onKeyPress)) {
            this.props.onKeyPress(event);
        }
    },
    getCursor: function getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        /* istanbul ignore next */
        if (!props.cursor && !context.fieldPath) {
            throw 'react-form.tools ' + this.displayName + ': cursor must be set via `cursor` or ' + 'via higher order component ValidationBox with fieldPath';
        }

        return props.cursor || context.form.cursor.select(context.fieldPath);
    },
    inValidationBox: function inValidationBox() {
        return !!(this.context.form && this.context.fieldPath);
    },
    setValue: function setValue(value, callback) {
        var cursor = this.getCursor();

        if (_lodash2.default.isFunction(callback)) {
            cursor.once('update', callback);
        }

        cursor.set(value);
    },
    setDirtyState: function setDirtyState() {
        if (this.inValidationBox()) {
            this.context.form.setDirtyState(this.context.fieldPath);
        }
    },
    setPristineState: function setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.context.fieldPath);
        }
    },
    isDirty: function isDirty() {
        if (this.inValidationBox()) {
            return this.context.form.isDirty(this.context.fieldPath);
        }
    },
    isValid: function isValid() {
        if (this.inValidationBox()) {
            return this.context.form.isValid(this.context.fieldPath);
        }
    }
};