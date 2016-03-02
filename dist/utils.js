'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFieldPathAsArray = getFieldPathAsArray;
function getFieldPathAsArray(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}