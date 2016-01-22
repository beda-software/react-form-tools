import React from 'react';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import BaobabPropTypes from 'baobab-prop-types';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import yup from 'yup';
import {Form, Input} from '../../src/components';

const tree = new Baobab(
  {},
  {
    immutable: false,
    asynchronous: false
  }
);

const Root = React.createClass({
  childContextTypes: {
    tree: BaobabPropTypes.baobab
  },

  getChildContext: function () {
    return {
      tree: this.props.tree
    };
  },

  render: function() {
    const Component = this.props.component;

    return (
      <div>
        <Component ref="component" {...this.props.componentProps} />
      </div>
    );
  }
});

const TestComponent = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    form: {
      firstName: null,
      lastName: null
    }
  },

  getValidationSchema: function () {
    return yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required()
    });
  },

  render: function () {
    return (
      <Form cursor={this.cursors.form} validationSchema={this.getValidationSchema()} ref="form">
        <Input cursor={this.cursors.form.select('firstName')} />
        <Input cursor={this.cursors.form.select('lastName')} />
      </Form>
    );
  }
});

describe('Check SchemaBranchMixin', () => {
  let formComponent, component, treeState;

  function renderComponent(componentProps = {}) {
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={TestComponent}
            componentProps={_.defaults(componentProps, {
              tree: tree.select()
            })} />
    );
    component = rootComponent.refs.component;
    formComponent = component.refs.form;
  }

  before(() => {
    renderComponent();

    treeState = tree.get();
  });

  after(() => {
    tree.set(treeState);
  });

  it('should Form is accessible via ref', () => {
    expect(formComponent).to.be.not.null;
  });

  it('should Form has validation errors for default data after validation', (done) => {
    formComponent.validate(null, () => {
      const errors = formComponent.getValidationErrors();

      expect(errors).to.be.have.property('firstName');
      expect(errors).to.be.have.property('lastName');
      done();
    });
  });

  it('should Form getValidationErrors works correctly for concrete param', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.getValidationErrors('firstName')).to.be.not.null;
      done();
    });
  });

  it('should Form isValid is falsy for all form and each field', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid()).to.be.false;
      expect(formComponent.isValid('firstName')).to.be.false;
      expect(formComponent.isValid('lastName')).to.be.false;
      done();
    });
  });

  it('should Form has pristine states for default data after validation', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isDirty('firstName')).to.be.false;
      expect(formComponent.isDirty('lastName')).to.be.false;
      done();
    });
  });

  it('should Form has dirty states for changed data after validation', (done) => {
    tree.set(['form', 'firstName'], 'firstName');
    formComponent.validate(null, () => {
      expect(formComponent.isDirty('firstName')).to.be.true;
      expect(formComponent.isDirty('lastName')).to.be.false;
      done();
    });
  });

  it('should Form isValid works correctly for valid field', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid('firstName')).to.be.true;
      expect(formComponent.isValid('lastName')).to.be.false;
      done();
    });
  });

  it('should Form save dirty states for reverted data after validation', (done) => {
    tree.set(['form', 'firstName'], null);
    formComponent.validate(null, () => {
      expect(formComponent.isDirty('firstName')).to.be.true;
      expect(formComponent.isDirty('lastName')).to.be.false;
      done();
    });
  });

  it('should Form has not validation errors for correct data', (done) => {
    tree.set(['form', 'firstName'], 'firstName');
    tree.set(['form', 'lastName'], 'lastName');

    formComponent.validate(() => {
      const errors = formComponent.getValidationErrors();

      expect(errors).to.be.not.have.property('firstName');
      expect(errors).to.be.not.have.property('lastName');
      done();
    });
  });

  it('should resetValidationData reverts data to initial state', () => {
    formComponent.resetValidationData();
    expect(tree.get('form', 'firstName')).to.be.null;
    expect(tree.get('form', 'lastName')).to.be.null;
  });

  it('should resetValidationErrors works correctly', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid('firstName')).to.be.false;
      expect(formComponent.isValid('lastName')).to.be.false;
      formComponent.resetValidationErrors();
      expect(formComponent.isValid('firstName')).to.be.true;
      expect(formComponent.isValid('lastName')).to.be.true;
      done();
    });
  });

  it('should setValidationErrors works correctly', () => {
    formComponent.setValidationErrors({firstName: 'error'});
    expect(formComponent.isValid('firstName')).to.be.false;
    expect(formComponent.getValidationErrors('firstName')).to.be.equal('error');
    expect(formComponent.isValid('lastName')).to.be.true;
  });

  it('should resetDirtyStates works correctly', () => {
    formComponent.resetDirtyStates();
    expect(formComponent.isDirty('firstName')).to.be.false;
    expect(formComponent.isDirty('lastName')).to.be.false;
  });
});
