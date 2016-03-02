'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveFieldPath = resolveFieldPath;
function resolveFieldPath(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}