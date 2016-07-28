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

        // TODO: concretize type
        validationSchema: _react2.default.PropTypes.any.isRequired,
        formStateCursor: _baobabPropTypes2.default.cursor,
        validateOnFly: _react2.default.PropTypes.bool,
        useHtmlForm: _react2.default.PropTypes.bool
    },

    childContextTypes: {
        form: _react2.default.PropTypes.object
    },

    contextTypes: {
        form: _react2.default.PropTypes.object
    },

    subscribers: [],
    _isHtmlForm: null,

    getDefaultProps: function getDefaultProps() {
        return {
            validateOnFly: true,
            strategy: (0, _yupValidationStrategy2.default)(),
            onSubmit: _lodash2.default.identity,
            onInvalidSubmit: _lodash2.default.identity,
            useHtmlForm: true
        };
    },
    getChildContext: function getChildContext() {
        return {
            form: {
                parentForm: this.context.form,
                isHtmlForm: this.isHtmlForm,

                cursor: this.props.cursor,
                isValid: this.isValid,
                isDirty: this.isDirty,
                getValidationErrors: this.getValidationErrors,
                setDirtyState: this.setDirtyState,
                setPristineState: this.setPristineState,

                submit: this.submit,
                validate: this.validate,

                subscribe: this.subscribe,
                unsubscribe: this.unsubscribe
            }
        };
    },
    getInitialState: function getInitialState() {
        if (this.props.formStateCursor) {
            return {};
        }

        return {
            errors: {},
            dirtyStates: {},
            isFormDirty: false
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
        if (this.isHtmlForm()) {
            return _react2.default.createElement(
                'form',
                _extends({ noValidate: true }, this.props, { onSubmit: this.onFormSubmit }),
                this.props.children
            );
        }

        return _react2.default.createElement(
            'div',
            this.props,
            this.props.children
        );
    },
    hasParentHtmlForm: function hasParentHtmlForm() {
        var parentForm = this.context.form;

        while (parentForm) {
            if (parentForm.isHtmlForm()) {
                return true;
            }

            parentForm = parentForm.parentForm;
        }
    },
    isHtmlForm: function isHtmlForm() {
        if (this._isHtmlForm === null) {
            this._isHtmlForm = this.props.useHtmlForm && !this.hasParentHtmlForm();
        }

        return this._isHtmlForm;
    },
    publish: function publish() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _lodash2.default.each(this.subscribers, function (subscriber) {
            return subscriber.apply(undefined, args);
        });
    },
    subscribe: function subscribe(subscriber) {
        this.subscribers = _lodash2.default.concat(this.subscribers, subscriber);

        // Notify new subscriber about initial form state
        subscriber(this.getFormState(), null);
    },
    unsubscribe: function unsubscribe(subscriber) {
        this.subscribers = _lodash2.default.without(this.subscribers, subscriber);
    },
    onFormStateUpdate: function onFormStateUpdate(data, previousData) {
        // Notify subscribers about changed data only
        if (_lodash2.default.isEqual(data, previousData)) {
            return;
        }

        this.publish(data, previousData);
    },
    setFormState: function setFormState(nextState) {
        var _this = this;

        var prevState = this.getFormState();

        if (this.props.formStateCursor) {
            this.props.formStateCursor.once('update', function (_ref) {
                var data = _ref.data;
                return _this.onFormStateUpdate(data.currentData, prevState);
            });
            this.props.formStateCursor.merge(nextState);
        } else {
            this.setState(nextState, function () {
                return _this.onFormStateUpdate(_this.state, prevState);
            });
        }
    },
    getFormState: function getFormState() {
        if (this.props.formStateCursor) {
            return this.props.formStateCursor.get();
        }

        return this.state;
    },
    onFormSubmit: function onFormSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        return this.submit();
    },
    onUpdate: function onUpdate() {
        this.validate();
    },
    submit: function submit() {
        return this.validate(this.props.onSubmit, this.props.onInvalidSubmit);
    },
    getFormData: function getFormData() {
        return this.props.cursor.get();
    },
    validate: function validate(successCallback, errorCallback) {
        var _this2 = this;

        var data = this.getFormData();
        var schema = _lodash2.default.isFunction(this.props.validationSchema) ? this.props.validationSchema(data) : this.props.validationSchema;

        this.props.strategy.validate(data, schema, {}, function (errors) {
            _this2.setFormState({ errors: errors });

            if (_lodash2.default.isEmpty(errors)) {
                if (successCallback) {
                    return successCallback(data);
                }
            } else {
                if (errorCallback) {
                    return errorCallback(errors);
                }
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
        var isFormDirty = formState.isFormDirty;

        if (isFormDirty) {
            return true;
        }

        if (!fieldPath) {
            return !_lodash2.default.isEmpty(formState.dirtyStates);
        }

        return !!_lodash2.default.get(formState.dirtyStates, fieldPath);
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
        if (!fieldPath) {
            this.setFormState({
                dirtyStates: {},
                isFormDirty: true
            });
            return;
        }

        this.updateDirtyState(fieldPath, true);
    },
    setPristineState: function setPristineState(fieldPath) {
        if (!fieldPath) {
            this.setFormState({
                dirtyStates: {},
                isFormDirty: false
            });
            return;
        }

        this.updateDirtyState(fieldPath, false);
    },
    updateDirtyState: function updateDirtyState(fieldPath, dirtyState) {
        if (this.isDirty(fieldPath) === dirtyState) {
            return;
        }

        var _getFormState = this.getFormState();

        var dirtyStates = _getFormState.dirtyStates;


        dirtyStates = _lodash2.default.cloneDeep(dirtyStates || {});
        _lodash2.default.set(dirtyStates, fieldPath, dirtyState);

        this.setFormState({
            dirtyStates: dirtyStates
        });
    }
});