'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _yupValidationStrategy = require('yup-validation-strategy');

var _yupValidationStrategy2 = _interopRequireDefault(_yupValidationStrategy);

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'form',

    propTypes: {
        onSubmit: _react2.default.PropTypes.func,
        onInvalidSubmit: _react2.default.PropTypes.func,
        cursor: _baobabPropTypes2.default.cursor.isRequired,
        validationSchema: _react2.default.PropTypes.any.isRequired,
        formStateCursor: _baobabPropTypes2.default.cursor,
        validateOnFly: _react2.default.PropTypes.bool
    },

    childContextTypes: {
        form: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
        return {
            validateOnFly: true,
            strategy: (0, _yupValidationStrategy2.default)(),
            onSubmit: _lodash2.default.identity,
            onInvalidSubmit: _lodash2.default.identity
        };
    },
    getChildContext: function getChildContext() {
        return {
            form: {
                cursor: this.props.cursor,
                isValid: this.isValid,
                isDirty: this.isDirty,
                getValidationErrors: this.getValidationErrors,
                setDirtyState: this.setDirtyState,
                setPristineState: this.setPristineState
            }
        };
    },
    getInitialState: function getInitialState() {
        if (this.props.formStateCursor) {
            return {};
        }

        return {
            errors: {},
            dirtyStates: {}
        };
    },
    componentDidMount: function componentDidMount() {
        if (this.props.validateOnFly) {
            this.props.cursor.on('update', this.onUpdate);
        }

        this.validate();
    },
    componentWillUnmount: function componentWillUnmount() {
        if (this.props.validateOnFly) {
            this.props.cursor.off('update', this.onUpdate);
        }
    },
    render: function render() {
        return _react2.default.createElement(
            'form',
            _extends({ noValidate: true }, this.props, { onSubmit: this.onFormSubmit }),
            this.props.children
        );
    },
    setFormState: function setFormState(nextState) {
        if (this.props.formStateCursor) {
            this.props.formStateCursor.merge(nextState);
        } else {
            this.setState(nextState);
        }
    },
    getFormState: function getFormState() {
        if (this.props.formStateCursor) {
            return this.props.formStateCursor.get();
        }

        return this.state;
    },
    onFormSubmit: function onFormSubmit(evt) {
        evt.preventDefault();
        this.submit();
    },
    onUpdate: function onUpdate() {
        this.validate();
    },
    submit: function submit() {
        this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
    },
    validate: function validate(successCallback, errorCallback) {
        var _this = this;

        var data = this.props.cursor.get();
        var schema = _lodash2.default.isFunction(this.props.validationSchema) ? this.props.validationSchema(data) : this.props.validationSchema;

        this.props.strategy.validate(data, schema, {}, function (errors) {
            _this.setFormState({ errors: errors });

            if (_lodash2.default.isEmpty(errors)) {
                successCallback && successCallback(data);
            } else {
                errorCallback && errorCallback(errors);
            }
        });
    },
    getValidationErrors: function getValidationErrors(fieldPath) {
        var formState = this.getFormState();
        if (fieldPath) {
            return _lodash2.default.get(formState.errors, fieldPath);
        }

        return formState.errors;
    },
    isValid: function isValid(fieldPath) {
        var formState = this.getFormState();
        if (fieldPath) {
            return !_lodash2.default.get(formState.errors, fieldPath);
        }

        return _lodash2.default.isEmpty(formState.errors);
    },
    isDirty: function isDirty(fieldPath) {
        var formState = this.getFormState();
        return !!_lodash2.default.get(formState.dirtyStates, fieldPath);
    },
    resetDirtyStates: function resetDirtyStates() {
        this.setFormState({
            dirtyStates: {}
        });
    },
    resetValidationErrors: function resetValidationErrors() {
        this.setValidationErrors({});
    },
    setValidationErrors: function setValidationErrors(errors) {
        this.setFormState({
            errors: errors
        });
    },
    setDirtyState: function setDirtyState(fieldPath) {
        this.updateDirtyState(fieldPath, true);
    },
    setPristineState: function setPristineState(fieldPath) {
        this.updateDirtyState(fieldPath, false);
    },
    updateDirtyState: function updateDirtyState(fieldPath, dirtyState) {
        if (this.isDirty(fieldPath) === dirtyState) {
            return;
        }

        var formState = this.getFormState();

        this.setFormState({
            dirtyStates: _lodash2.default.set(formState.dirtyStates || {}, fieldPath, dirtyState)
        });
    }
});