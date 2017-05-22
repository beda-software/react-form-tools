// jscs:disable disallowMultipleVarDecl
import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import yup from 'yup';
import sinon from 'sinon';
import { Root } from '../utils';
import { Form, MultipleCheckBox } from '../../src/components';

const tree = new Baobab(
    {},
    {
        immutable: false,
        asynchronous: false,
    }
);

const FormWithMultipleInputs = React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        form: {
            field: [1],
        },
    },

    validationSchema: yup.object().shape({
        field: yup.array().required(),
    }),

    render() {
        return (
            <Form cursor={this.cursors.form}
                validationSchema={this.validationSchema} ref="form">
                <MultipleCheckBox cursor={this.cursors.form.select('field')}
                    ref="input1" {...this.props.inputProps} value={1} />
                <MultipleCheckBox cursor={this.cursors.form.select('field')}
                    ref="input2" {...this.props.inputProps} value={2} />
                <MultipleCheckBox cursor={this.cursors.form.select('field')}
                    ref="input3" {...this.props.inputProps} value={3} />
            </Form>
        );
    },
});

describe('MultipleCheckBox', () => {
    let firstInputComponent, secondInputComponent, thirdInputComponent,
        formComponent, treeState, onChangeSpy, clock;

    before(() => {
        onChangeSpy = sinon.spy();

        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithMultipleInputs}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                    },
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        firstInputComponent = rootComponent.refs.component.refs.input1;
        secondInputComponent = rootComponent.refs.component.refs.input2;
        thirdInputComponent = rootComponent.refs.component.refs.input3;
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

    it('should predefined values be correct', () => {
        const firstInputNode = ReactDOM.findDOMNode(firstInputComponent);
        firstInputNode.checked.should.be.true;

        const secondInputNode = ReactDOM.findDOMNode(secondInputComponent);
        secondInputNode.checked.should.be.false;

        const thirdInputNode = ReactDOM.findDOMNode(thirdInputComponent);
        thirdInputNode.checked.should.be.false;
    });

    it('should synchronize with cursor when user changes first to unchecked', () => {
        const inputNode = ReactDOM.findDOMNode(firstInputComponent);
        inputNode.checked.should.be.true;
        TestUtils.Simulate.change(inputNode, { target: { checked: false } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: false, previousValue: true }
        );
        tree.get('form', 'field').should.be.deep.equal([]);
        inputNode.checked.should.be.false;
    });

    it('should synchronize with cursor when user changes first to checked', () => {
        const inputNode = ReactDOM.findDOMNode(firstInputComponent);
        inputNode.checked.should.be.false;
        TestUtils.Simulate.change(inputNode, { target: { checked: true } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: true, previousValue: false }
        );
        tree.get('form', 'field').should.be.deep.equal([1]);
        inputNode.checked.should.be.true;
    });

    it('should synchronize with cursor when user changes second to checked', () => {
        const inputNode = ReactDOM.findDOMNode(secondInputComponent);
        inputNode.checked.should.be.false;
        TestUtils.Simulate.change(inputNode, { target: { checked: true } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: true, previousValue: false }
        );
        tree.get('form', 'field').should.be.deep.equal([1, 2]);
        inputNode.checked.should.be.true;
    });

    it('should synchronize with cursor when user changes third to checked', () => {
        const inputNode = ReactDOM.findDOMNode(thirdInputComponent);
        inputNode.checked.should.be.false;
        TestUtils.Simulate.change(inputNode, { target: { checked: true } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: true, previousValue: false }
        );
        tree.get('form', 'field').should.be.deep.equal([1, 2, 3]);
        inputNode.checked.should.be.true;
    });

    it('should synchronize with cursor when user changes second to unchecked', () => {
        const inputNode = ReactDOM.findDOMNode(secondInputComponent);
        inputNode.checked.should.be.true;
        TestUtils.Simulate.change(inputNode, { target: { checked: false } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: false, previousValue: true }
        );
        tree.get('form', 'field').should.be.deep.equal([1, 3]);
        inputNode.checked.should.be.false;
    });

    it('should nothing happen when user double changes second to unchecked', () => {
        const inputNode = ReactDOM.findDOMNode(secondInputComponent);
        inputNode.checked.should.be.false;
        TestUtils.Simulate.change(inputNode, { target: { checked: false } });

        clock.tick(1);
        onChangeSpy.should.have.not.been.calledWith();
        tree.get('form', 'field').should.be.deep.equal([1, 3]);
        inputNode.checked.should.be.false;
    });
});
