'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFieldPathAsArray = getFieldPathAsArray;
exports.getFieldPathAsString = getFieldPathAsString;
exports.isEnterPressed = isEnterPressed;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFieldPathAsArray(fieldPath) {
    return _lodash2.default.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}

function getFieldPathAsString(fieldPath) {
    return _lodash2.default.isString(fieldPath) ? fieldPath : fieldPath.join('.');
}

function isEnterPressed(event) {
    return event.which === 13 || event.keyCode === 13;
}