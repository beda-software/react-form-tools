import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import yup from 'yup';
import {Form, Input} from '../../src/components';
import {Root} from './utils';
import sinon from 'sinon';

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
            field: '',
        },
    },

    validationSchema: yup.object().shape({
        field: yup.string().required(),
    }),

    render: function() {
        return (
            <Form cursor={this.cursors.form} validationSchema={this.validationSchema} ref="form">
                <Input cursor={this.cursors.form.select('field')} ref="input" {...this.props.inputProps} />
            </Form>
        );
    },
});


describe('Check Input without ValidationBox', () => {
    let inputComponent, formComponent, treeState, onSyncSpy, onBlurSpy, onChangeSpy, clock;

    before(() => {
        onChangeSpy = sinon.spy();
        onBlurSpy = sinon.spy();
        onSyncSpy = sinon.spy();

        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        onSync: onSyncSpy,
                        onBlur: onBlurSpy,
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
        inputComponent.componentWillUnmount();
        formComponent.componentWillUnmount();
        tree.set(treeState);
    });

    afterEach(() => {
        clock.restore();
        onChangeSpy.reset()
        onSyncSpy.reset();
        onBlurSpy.reset();
    });

    it('should getCursor returns correct cursor', () => {
        inputComponent.getCursor().should.be.equal(tree.select('form', 'field'));
    });

    it('should inValidationBox returns false', () => {
        inputComponent.inValidationBox().should.be.false;
    });

    it('should nothing happens for isDirty, isValid, setDirtyState, setPristineState', () => {
        should.not.exist(inputComponent.setDirtyState());
        should.not.exist(inputComponent.setPristineState());
        should.not.exist(inputComponent.isDirty());
        should.not.exist(inputComponent.isValid());
    });

    it('should sets inner state value and synchronizes with cursor when user types with timer', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'first'}});
        onChangeSpy.should.have.been.calledWith('first', '');

        clock.tick(1);
        inputComponent.state.value.should.be.equal('first');
        tree.get('form', 'field').should.be.equal('');
        onSyncSpy.should.have.not.been.called;

        clock.tick(inputComponent.msToPoll + 1);
        onSyncSpy.should.have.been.calledWith('first', '');
        tree.get('form', 'field').should.be.equal('first');
    });

    it('should not calls onSync with same value', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'first'}});
        onChangeSpy.should.not.have.been.called;

        clock.tick(1);
        inputComponent.state.value.should.be.equal('first');
        tree.get('form', 'field').should.be.equal('first');
        onSyncSpy.should.have.not.been.called;

        clock.tick(inputComponent.msToPoll + 1);
        onSyncSpy.should.have.not.been.called;
        tree.get('form', 'field').should.be.equal('first');
    });

    it('should not calls onSync with other value if value restored to initial after changes', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'first changed'}});
        onChangeSpy.should.have.been.calledWith('first changed', 'first');

        clock.tick(1);
        TestUtils.Simulate.change(inputNode, {target: {value: 'first'}});
        onChangeSpy.should.have.been.calledWith('first', 'first changed');

        clock.tick(inputComponent.msToPoll + 1);
        onSyncSpy.should.have.been.not.called;
        tree.get('form', 'field').should.be.equal('first');
    });

    it('should sets inner state value and synchronizes with cursor when input blurs', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'second'}});
        onChangeSpy.should.have.been.calledWith('second', 'first');

        clock.tick(1);
        inputComponent.state.value.should.be.equal('second');
        tree.get('form', 'field').should.be.equal('first');
        onSyncSpy.should.have.been.not.called;

        TestUtils.Simulate.blur(inputNode, {target: {value: 'third'}});

        clock.tick(2);
        onBlurSpy.should.have.been.called;
        tree.get('form', 'field').should.be.equal('third');

        clock.tick(inputComponent.msToPoll + 1);
        onSyncSpy.should.have.been.calledWith('third', 'first');
    });

    it('should calls onBlur when input blurs with same value', () => {
        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.blur(inputNode, {target: {value: 'third'}});
        clock.tick(1);
        onBlurSpy.should.have.been.called;
        onChangeSpy.should.have.not.been.called;
        onSyncSpy.should.have.not.been.called;
        tree.get('form', 'field').should.be.equal('third');
    });

    it('should synchronizes only on blur when syncOnlyOnBlur is set to true', () => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        onSync: onSyncSpy,
                        onBlur: onBlurSpy,
                        syncOnlyOnBlur: true,
                    },
                }} />
        );
        inputComponent = rootComponent.refs.component.refs.input;

        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'fourth'}});
        onChangeSpy.should.have.been.calledWith('fourth', 'third');

        clock.tick(1);
        inputComponent.state.value.should.be.equal('fourth');
        tree.get('form', 'field').should.be.equal('third');
        onSyncSpy.should.have.not.been.called;

        clock.tick(inputComponent.msToPoll + 1);
        inputComponent.state.value.should.be.equal('fourth');
        tree.get('form', 'field').should.be.equal('third');
        onSyncSpy.should.have.not.been.called;

        TestUtils.Simulate.blur(inputNode, {target: {value: 'fourth'}});

        clock.tick(inputComponent.msToPoll + 2);
        inputComponent.state.value.should.be.equal('fourth');
        tree.get('form', 'field').should.be.equal('fourth');
        onSyncSpy.should.have.been.called;
        onBlurSpy.should.have.been.called;
    });

    it('should empty value transforms to null if nullable is set to true', () => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        onSync: onSyncSpy,
                        onBlur: onBlurSpy,
                        nullable: true,
                    },
                }} />
        );
        inputComponent = rootComponent.refs.component.refs.input;

        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: ''}});
        onChangeSpy.should.have.been.calledWith('', 'fourth');

        clock.tick(1);
        inputComponent.state.value.should.be.equal('');
        tree.get('form', 'field').should.be.equal('fourth');
        onSyncSpy.should.have.not.been.called;

        clock.tick(inputComponent.msToPoll + 1);
        inputComponent.state.value.should.be.equal('');
        should.not.exist(tree.get('form', 'field'));
        onSyncSpy.should.have.been.calledWith(null, 'fourth');
    });

    it('should synchronizes value on every change when sync is set to true', () => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        onSync: onSyncSpy,
                        onBlur: onBlurSpy,
                        sync: true,
                    },
                }} />
        );
        inputComponent = rootComponent.refs.component.refs.input;

        const inputNode = ReactDOM.findDOMNode(inputComponent);
        TestUtils.Simulate.change(inputNode, {target: {value: 'fifth'}});
        onChangeSpy.should.have.been.calledWith('fifth', '');

        clock.tick(1);
        inputComponent.state.value.should.be.equal('fifth');
        tree.get('form', 'field').should.be.equal('fifth');
        onSyncSpy.should.have.been.calledWith('fifth', null);
    });

    it('should focuses input element when autoFocus is set to true', () => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithOneInput}
                componentProps={{
                    tree: tree.select(),
                    inputProps: {
                        onChange: onChangeSpy,
                        onSync: onSyncSpy,
                        onBlur: onBlurSpy,
                        autoFocus: true,
                    },
                }} />
        );
        inputComponent = rootComponent.refs.component.refs.input;

        const inputNode = ReactDOM.findDOMNode(inputComponent);
        clock.tick(1);

        // Unable to check focus
    });
});

