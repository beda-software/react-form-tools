// jscs:disable disallowMultipleVarDecl
import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import yup from 'yup';
import sinon from 'sinon';
import { Root } from '../utils';
import { Form, CheckBox } from '../../src/components';

const tree = new Baobab(
    {},
    {
        immutable: false,
        asynchronous: false,
    }
);

const FormWithOneInput = React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        form: {
            field: 'unchecked',
        },
    },

    validationSchema: yup.object().shape({
        field: yup.boolean().required(),
    }),

    render() {
        return (
            <Form cursor={this.cursors.form}
                validationSchema={this.validationSchema} ref="form">
                <CheckBox cursor={this.cursors.form.select('field')}
                    ref="input" {...this.props.inputProps} />
            </Form>
        );
    },
});

describe('CheckBox', () => {
    let inputComponent, formComponent, treeState, onChangeSpy, clock;

    before(() => {
        onChangeSpy = sinon.spy();

        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        value: 'checked',
                        uncheckedValue: 'unchecked',
                    },
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        inputComponent = rootComponent.refs.component.refs.input;
        treeState = tree.serialize();
    });

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        formComponent.componentWillUnmount();
        tree.set(treeState);
    });

    afterEach(() => {
        clock.restore();
        onChangeSpy.reset();
    });

    it('should synchronize with cursor when user changes to checked', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        inputNode.checked.should.be.false;
        TestUtils.Simulate.change(inputNode, { target: { checked: true } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: 'checked', previousValue: 'unchecked' }
        );
        tree.get('form', 'field').should.be.equal('checked');
        inputNode.checked.should.be.true;
    });

    it('should nothing happens when user double changes to checked', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, { target: { checked: true } });

        clock.tick(1);
        onChangeSpy.should.have.not.been.calledWith();
        inputNode.checked.should.be.true;
    });

    it('should synchronize with cursor when user changes to unchecked', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, { target: { checked: false } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: 'unchecked', previousValue: 'checked' }
        );
        tree.get('form', 'field').should.be.equal('unchecked');
        inputNode.checked.should.be.false;
    });
});
