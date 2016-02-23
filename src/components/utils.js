export function resolveFieldPath(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}
