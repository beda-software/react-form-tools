export function getFieldPathAsArray(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}
