import _ from 'lodash';

export function getFieldPathAsArray(fieldPath) {
    return _.isArray(fieldPath) ? fieldPath : fieldPath.split('.');
}

export function getFieldPathAsString(fieldPath) {
    return _.isString(fieldPath) ? fieldPath : fieldPath.join('.');
}

export function isEnterPressed(event) {
    return event.which === 13 || event.keyCode === 13;
}
