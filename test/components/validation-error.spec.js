// jscs:disable disallowMultipleVarDecl
import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import TestUtils from 'react-addons-test-utils';
import yup from 'yup';
import { Root } from '../utils';
import { Form, ValidationError } from '../../src/components';

const tree = new Baobab(
    {},
    {
        immutable: false,
        asynchronous: false,
    }
);

const FormWithValidationError = React.createClass({
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
            <Form cursor={this.cursors.form}
                validationSchema={this.validationSchema} ref="form">
                <ValidationError fieldPath="field"
                    ref="error" {...this.props.errorProps} />
            </Form>
        );
    },
});

describe('ValidationError', () => {
    let errorComponent, formComponent, treeState;

    before(() => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithValidationError}
                componentProps={{
                    tree: tree.select(),
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        errorComponent = rootComponent.refs.component.refs.error;
        treeState = tree.serialize();
    });

    after(() => {
        formComponent.componentWillUnmount();
        tree.set(treeState);
    });

    it('should does not show error if component is pristine and form is invalid', (done) => {
        formComponent.validate(null, () => {
            const errorNode = ReactDOM.findDOMNode(errorComponent);
            should.not.exist(errorNode);
            done();
        });
    });

    it('should has a class _dirty if component is dirty and form is invalid', (done) => {
        formComponent.setDirtyState('field');
        formComponent.validate(null, () => {
            const errorNode = ReactDOM.findDOMNode(errorComponent);
            errorNode.className.should.be.equal('_dirty');
            done();
        });
    });

    it('should show error if component is pristine and form is invalid and alwaysShow is set', (done) => {
        const rootComponent = TestUtils.renderIntoDocument(
            <Root tree={tree}
                component={FormWithValidationError}
                componentProps={{
                    tree: tree.select(),
                    errorProps: {
                        alwaysShow: true,
                    },
                }} />
        );
        formComponent = rootComponent.refs.component.refs.form;
        errorComponent = rootComponent.refs.component.refs.error;

        formComponent.setPristineState('field');
        formComponent.validate(null, () => {
            const errorNode = ReactDOM.findDOMNode(errorComponent);
            errorNode.className.should.be.equal('');
            done();
        });
    });

    it('should does not show error if form is valid', (done) => {
        tree.set(['form', 'field'], 'value');
        formComponent.validate(() => {
            const errorNode = ReactDOM.findDOMNode(errorComponent);
            should.not.exist(errorNode);
            done();
        });
    });
});
