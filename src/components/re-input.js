import React from 'react'
import Input from './input';
import BaobabPropTypes from 'baobab-prop-types';

export default React.createClass({
    displayName: 'ReInput',

    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
        skip: React.PropTypes.string.isRequired,
    },

    toInternal(value) {
        const regexp = new RegExp(this.props.skip, 'g');

        return String(value).replace(regexp, '');
    },

    render() {
        return (
            <Input
                type="text"
                toInternal={this.toInternal}
                toRepresentation={this.toInternal}
                {...this.props} />
        );
    },
});
