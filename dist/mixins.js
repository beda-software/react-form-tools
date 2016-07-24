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

    processKeyPressForSubmit: function processKeyPressForSubmit(event) {
        var _this = this;

        // Helper method for form components
        // Submits form on enter by default
        this.processKeyPress(event, function () {
            return _this.context.form.submit();
        });
    },
    processKeyPress: function processKeyPress(event, fn) {
        // Callback `fn` will be called on enter press
        if (!this.context.form.isHtmlForm()) {
            if ((0, _utils.isEnterPressed)(event)) {
                event.preventDefault();
                event.stopPropagation();
                fn();
            }
        }

        if (_lodash2.default.isFunction(this.props.onKeyPress)) {
            this.props.onKeyPress(event);
        }
    },
    getFieldPath: function getFieldPath(props, context) {
        props = props || this.props;
        context = context || this.context;

        if (props.fieldPath) {
            return (0, _utils.getFieldPathAsArray)(props.fieldPath);
        }

        if (context.fieldPath) {
            return context.fieldPath;
        }

        return null;
    },
    getCursor: function getCursor(props, context) {
        props = props || this.props;
        context = context || this.context;

        if (props.cursor) {
            return props.cursor;
        }

        var fieldPath = this.getFieldPath(props, context);

        if (fieldPath) {
            return context.form.cursor.select(fieldPath);
        }

        /* istanbul ignore next */
        throw 'react-form.tools ' + this.displayName + ': cursor must be set via \'cursor\',\n               \'fieldPath\' or via higher order component ValidationBox with \'fieldPath\'';
    },
    inValidationBox: function inValidationBox() {
        return !!(this.context.form && this.getFieldPath());
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
            this.context.form.setDirtyState(this.getFieldPath());
        }
    },
    setPristineState: function setPristineState() {
        if (this.inValidationBox()) {
            this.context.form.setPristineState(this.getFieldPath());
        }
    },
    isDirty: function isDirty() {
        if (this.inValidationBox()) {
            return this.state.isDirty;
        }
    },
    isValid: function isValid() {
        if (this.inValidationBox()) {
            return this.state.isValid;
        }
    },
    getErrors: function getErrors() {
        if (this.inValidationBox()) {
            return this.state.errors;
        }
    },
    getInitialState: function getInitialState() {
        return {
            isDirty: false,
            errors: []
        };
    },
    onFormStateUpdate: function onFormStateUpdate(data) {
        var fieldPath = this.getFieldPath();

        var errors = _lodash2.default.get(data, _lodash2.default.concat('errors', fieldPath));
        var isDirty = !!_lodash2.default.get(data, _lodash2.default.concat('dirtyStates', fieldPath));
        var isValid = _lodash2.default.isEmpty(errors);

        this.setState({
            isDirty: isDirty,
            errors: errors,
            isValid: isValid
        });
    },
    componentDidMount: function componentDidMount() {
        if (this.inValidationBox()) {
            this.context.form.subscribe(this.onFormStateUpdate);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        if (this.inValidationBox()) {
            this.context.form.unsubscribe(this.onFormStateUpdate);
        }
    }
};