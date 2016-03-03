'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFieldPathAsArray = getFieldPathAsArray;
exports.getFieldPathAsString = getFieldPathAsString;
function getFieldPathAsArray(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}

function getFieldPathAsString(fieldPath) {
    return _.isString(fieldPath) ? fieldPath : fieldPath.join('.');
}