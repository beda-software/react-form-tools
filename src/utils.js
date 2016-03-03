export function getFieldPathAsArray(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}

export function getFieldPathAsString(fieldPath) {
    return _.isString(fieldPath) ? fieldPath : fieldPath.join('.');
}
