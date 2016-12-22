// jscs:disable disallowMultipleVarDecl
import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import yup from 'yup';
import { Form, Radio, ValidationBox } from '../../src/components';
import { Root } from '../utils';
import sinon from 'imports?define=>false,require=>false!sinon/pkg/sinon-2.0.0-pre.js';

const tree = new Baobab(
    {},
    {
        immutable: false,
        asynchronous: false,
    }
);

const FormWithThreeInput = React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        form: {
            field: null,
        },
    },

    validationSchema: yup.object().shape({
        field: yup.boolean().required(),
    }),

    render() {
        return (
            <Form cursor={this.cursors.form}
                validationSchema={this.validationSchema} ref="form">
                <ValidationBox fieldPath="field">
                    <Radio value={1} ref="radio1" {...this.props.inputProps} />
                    <Radio value={2} ref="radio2" {...this.props.inputProps} />
                    <Radio value={3} ref="radio3" {...this.props.inputProps} />
                </ValidationBox>
            </Form>
        );
    },
});

describe('Radio', () => {
    let radioComponents = [], formComponent, treeState, onChangeSpy, clock;

    before(() => {
        onChangeSpy = sinon.spy();

        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithThreeInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                    },
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        radioComponents[0] = rootComponent.refs.component.refs.radio1;
        radioComponents[1] = rootComponent.refs.component.refs.radio2;
        radioComponents[2] = rootComponent.refs.component.refs.radio3;
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

    it('should synchronizes with cursor when user select first radio', () => {
        const firstInputNode = ReactDOM.findDOMNode(radioComponents[0]);

        formComponent.isDirty('field').should.be.false;
        ReactDOM.findDOMNode(radioComponents[0]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[1]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[2]).checked.should.to.be.false;
        TestUtils.Simulate.change(firstInputNode, { target: { value: 1 } });

        clock.tick(1);
        formComponent.isDirty('field').should.be.true;
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: 1, previousValue: null }
        );
        tree.get('form', 'field').should.be.equal(1);
        ReactDOM.findDOMNode(radioComponents[0]).checked.should.to.be.true;
        ReactDOM.findDOMNode(radioComponents[1]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[2]).checked.should.to.be.false;
    });

    it('should nothing happens when user select same radio', () => {
        const firstInputNode = ReactDOM.findDOMNode(radioComponents[0]);
        TestUtils.Simulate.change(firstInputNode, { target: { value: 1 } });

        clock.tick(1);
        onChangeSpy.should.have.not.been.calledWith();
        ReactDOM.findDOMNode(radioComponents[0]).checked.should.to.be.true;
        ReactDOM.findDOMNode(radioComponents[1]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[2]).checked.should.to.be.false;
    });

    it('should synchronizes with cursor when user select second radio', () => {
        const secondInputNode = ReactDOM.findDOMNode(radioComponents[1]);
        TestUtils.Simulate.change(secondInputNode, { target: { value: 2 } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: 2, previousValue: 1 }
        );
        tree.get('form', 'field').should.be.equal(2);
        ReactDOM.findDOMNode(radioComponents[0]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[1]).checked.should.to.be.true;
        ReactDOM.findDOMNode(radioComponents[2]).checked.should.to.be.false;
    });

    it('should synchronizes with cursor when user select third radio', () => {
        const secondInputNode = ReactDOM.findDOMNode(radioComponents[2]);
        TestUtils.Simulate.change(secondInputNode, { target: { value: 3 } });

        clock.tick(1);
        onChangeSpy.should.have.been.calledWithMatch(
            sinon.match.object,
            { value: 3, previousValue: 2 }
        );
        tree.get('form', 'field').should.be.equal(3);
        ReactDOM.findDOMNode(radioComponents[0]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[1]).checked.should.to.be.false;
        ReactDOM.findDOMNode(radioComponents[2]).checked.should.to.be.true;
    });
});
