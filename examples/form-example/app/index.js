import React from 'react';
import {render} from 'react-dom';
import {root as RootMixin} from 'baobab-react/mixins';
import FormExample from './components/form-example';
import tree from './tree';

const App = React.createClass({
    mixins: [RootMixin],

    render() {
        return (
            <FormExample />
        );
    },
});

render(<App tree={tree} />, document.getElementById('react-view'));
