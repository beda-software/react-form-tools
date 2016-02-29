import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';

export const Root = React.createClass({
    childContextTypes: {
        tree: BaobabPropTypes.baobab,
    },

    getChildContext: function() {
        return {
            tree: this.props.tree,
        };
    },

    render: function() {
        const Component = this.props.component;

        return (
            <div>
                <Component ref="component" {...this.props.componentProps} />
            </div>
        );
    },
});
