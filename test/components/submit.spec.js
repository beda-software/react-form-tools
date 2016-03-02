// jscs:disable disallowMultipleVarDecl
import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import yup from 'yup';
import {Form, Submit} from '../../src/components';
import {Root} from '../utils';

const tree = new Baobab(
    {},
    {
        immutable: false,
        asynchronous: false,
    }
);

const FormWithSubmit = React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        form: {
            field: null,
        },
    },

    validationSchema: yup.object().shape({
        field: yup.string().required(),
    }),

    render() {
        return (
            <Form cursor={this.cursors.form} validationSchema={this.validationSchema} ref="form">
                <Submit ref="submit" {...this.props.submitProps}>Submit</Submit>
            </Form>
        );
    },
});

describe('Submit', () => {
    let submitComponent, formComponent, treeState;

    before(() => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithSubmit}
                componentProps={{
                    tree: tree.select(),
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        submitComponent = rootComponent.refs.component.refs.submit;
        treeState = tree.serialize();
    });

    after(() => {
        formComponent.componentWillUnmount();
        tree.set(treeState);
    });

    it('should has class _disabled for invalid form', (done) => {
        formComponent.validate(null, () => {
            const submitNode = ReactDOM.findDOMNode(submitComponent);
            formComponent.isValid().should.be.false;
            submitNode.className.should.be.equal('_disabled');
            submitNode.disabled.should.be.false;
            done();
        });
    });

    it('should does not have class _disabled for invalid form', (done) => {
        tree.set(['form', 'field'], 'value');
        formComponent.validate(() => {
            formComponent.isValid().should.be.true;
            ReactDOM.findDOMNode(submitComponent).className.should.be.equal('');
            done();
        });
    });

    it('should not be disabled if disableIfInvalid is set to true and form is valid', (done) => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithSubmit}
                componentProps={{
                    tree: tree.select(),
                    submitProps: {
                        disableIfInvalid: true,
                    },
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        submitComponent = rootComponent.refs.component.refs.submit;
        formComponent.validate(() => {
            const submitNode = ReactDOM.findDOMNode(submitComponent);
            formComponent.isValid().should.be.true;
            submitNode.className.should.be.equal('');
            submitNode.disabled.should.be.false;
            done();
        });
    });

    it('should be disabled if disableIfInvalid is set to true and form is invalid', (done) => {
        tree.set(['form', 'field'], '');
        formComponent.validate(null, () => {
            const submitNode = ReactDOM.findDOMNode(submitComponent);
            formComponent.isValid().should.be.false;
            submitNode.className.should.be.equal('_disabled');
            submitNode.disabled.should.be.true;
            done();
        });
    });
});
