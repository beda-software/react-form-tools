import React from 'react';
import Baobab from 'baobab';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import BaobabPropTypes from 'baobab-prop-types';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import yup from 'yup';
import {Form} from '../../src/components';

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

const FormComponentFactory = (formProps) => {
  return React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
      form: {
        firstName: null,
        lastName: null,
        second: {
          field: null
        },
        num1: null,
        num2: null
      },
      formState: {}
    },

    render: function () {
      return (
        <Form cursor={this.cursors.form} ref="form" {...formProps}>
          <input type="submit" className="submit" />
        </Form>
      );
    }
  });
};

describe('Check Form without on fly validation', () => {
  let formComponent, treeState;

  before(() => {
    const validationSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      second: yup.object().shape({
        field: yup.string().required()
      })
    });

    const FormWithoutOnFlyValidation = FormComponentFactory({
      validationSchema,
      validateOnFly: false
    });
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={FormWithoutOnFlyValidation}
            componentProps={{
              tree: tree.select()
            }} />
    );
    formComponent = rootComponent.refs.component.refs.form;
    treeState = tree.get();
  });

  after(() => {
    formComponent.componentWillUnmount();
    tree.set(treeState);
  });

  it('should is accessible via ref', () => {
    expect(formComponent).to.be.not.null;
  });

  it('should has validation errors for default data after validation', (done) => {
    formComponent.validate(null, () => {
      const errors = formComponent.getValidationErrors();

      expect(errors).to.be.have.property('firstName');
      expect(errors).to.be.have.property('lastName');
      expect(errors).to.be.have.deep.property('second.field');
      done();
    });
  });

  it('should getValidationErrors works correctly for concrete param', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.getValidationErrors('firstName')).to.be.not.null;
      done();
    });
  });

  it('should isValid is falsy for all form and each field', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid()).to.be.false;
      expect(formComponent.isValid('firstName')).to.be.false;
      expect(formComponent.isValid('lastName')).to.be.false;
      expect(formComponent.isValid('second.field')).to.be.false;
      done();
    });
  });

  it('should isValid works correctly for valid field', (done) => {
    tree.set(['form', 'firstName'], 'firstName');
    formComponent.validate(null, () => {
      expect(formComponent.isValid('firstName')).to.be.true;
      expect(formComponent.isValid('lastName')).to.be.false;
      done();
    });
  });

  it('should isValid is true and has not validation errors for correct data', (done) => {
    tree.set(['form', 'firstName'], 'firstName');
    tree.set(['form', 'lastName'], 'lastName');
    tree.set(['form', 'second', 'field'], 'field');

    formComponent.validate(() => {
      const errors = formComponent.getValidationErrors();
      expect(errors).to.be.not.have.property('firstName');
      expect(errors).to.be.not.have.property('lastName');
      expect(errors).to.be.not.have.deep.property('second.field');
      expect(formComponent.isValid()).to.be.true;
      done();
    });
  });

  it('should not validates data after cursor has been updated', (done) => {
    tree.set(['form', 'firstName'], null);

    setTimeout(() => {
      expect(formComponent.isValid('firstName')).to.be.true;
      done();
    }, 0);
  });

  it('should resetValidationErrors works correctly', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid('firstName')).to.be.false;
      expect(formComponent.isValid('lastName')).to.be.true;
      expect(formComponent.isValid('second.field')).to.be.true;
      formComponent.resetValidationErrors();
      expect(formComponent.isValid('firstName')).to.be.true;
      expect(formComponent.isValid('lastName')).to.be.true;
      expect(formComponent.isValid('second.field')).to.be.true;
      done();
    });
  });

  it('should setValidationErrors works correctly', () => {
    formComponent.setValidationErrors({firstName: 'error'});
    expect(formComponent.isValid('firstName')).to.be.false;
    expect(formComponent.getValidationErrors('firstName')).to.be.equal('error');
    expect(formComponent.isValid('lastName')).to.be.true;
    expect(formComponent.isValid('second.field')).to.be.true;
  });

  it('should resetDirtyStates works correctly', () => {
    formComponent.resetDirtyStates();
    expect(formComponent.isDirty('firstName')).to.be.false;
    expect(formComponent.isDirty('lastName')).to.be.false;
    expect(formComponent.isDirty('second.field')).to.be.false;
  });

  it('should setDirtyState works correctly', () => {
    formComponent.setDirtyState('firstName');
    expect(formComponent.isDirty('firstName')).to.be.true;
  });

  it('should setPristineState works correctly', () => {
    formComponent.setPristineState('firstName');
    expect(formComponent.isDirty('firstName')).to.be.false;
  });

  it('should submit validates form', (done) => {
    formComponent.resetValidationErrors();
    expect(formComponent.isValid()).to.be.true;

    formComponent.submit();
    setTimeout(() => {
      expect(formComponent.isValid()).to.be.false;
      done();
    }, 0);
  });

  it('should dom-level submit validates form', (done) => {
    formComponent.resetValidationErrors();
    expect(formComponent.isValid()).to.be.true;

    const submitNode = TestUtils.findRenderedDOMComponentWithClass(formComponent, 'submit');
    TestUtils.Simulate.submit(submitNode);

    setTimeout(() => {
      expect(formComponent.isValid()).to.be.false;
      done();
    }, 0);
  });
});

describe('Check Form with on fly validation', () => {
  let formComponent, treeState;

  before(() => {
    const validationSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required()
    });

    const FormWithOnFlyValidation = FormComponentFactory({
      validationSchema,
      validateOnFly: true
    });
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={FormWithOnFlyValidation}
            componentProps={{
              tree: tree.select()
            }} />
    );
    formComponent = rootComponent.refs.component.refs.form;
    treeState = tree.get();
  });

  after(() => {
    formComponent.componentWillUnmount();
    tree.set(treeState);
  });

  it('should validates data after cursor has been updated', (done) => {
    tree.set(['form', 'firstName'], 'firstName');

    setTimeout(() => {
      expect(formComponent.isValid('firstName')).to.be.true;
      done();
    }, 0);
  });
});

describe('Check Form with dynamic validation schema', () => {
  let formComponent, treeState;

  before(() => {
    const validationSchema = (data) => {
      return yup.object().shape({
        num1: yup.number(),
        num2: yup.number().min(data.num1)
      });
    };

    const FormWithOnFlyValidation = FormComponentFactory({
      validationSchema,
      validateOnFly: false
    });
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={FormWithOnFlyValidation}
            componentProps={{
              tree: tree.select()
            }} />
    );
    formComponent = rootComponent.refs.component.refs.form;
    treeState = tree.get();
  });

  after(() => {
    formComponent.componentWillUnmount();
    tree.set(treeState);
  });

  it('should validation works correctly', (done) => {
    tree.set('form', {num1: 1, num2: 0});
    formComponent.validate(null, () => {
      expect(formComponent.isValid('num1')).to.be.true;
      expect(formComponent.isValid('num2')).to.be.false;
      done();
    });
  });
});

describe('Check Form formStateCursor', () => {
  let formComponent, treeState;

  before(() => {
    const validationSchema = () => {
      return yup.object().shape({
        num1: yup.string().required('required'),
        num2: yup.string().required('required')
      });
    };

    const FormWithOnFlyValidation = FormComponentFactory({
      validationSchema,
      formStateCursor: tree.select('formState'),
      validateOnFly: false
    });
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={FormWithOnFlyValidation}
            componentProps={{
              tree: tree.select()
            }} />
    );
    formComponent = rootComponent.refs.component.refs.form;
    treeState = tree.get();
  });

  after(() => {
    formComponent.componentWillUnmount();
    tree.set(treeState);
  });

  it('should formStateCursor has correct state', (done) => {
    formComponent.validate(null, () => {
      expect(formComponent.isValid('num1')).to.be.false;
      expect(formComponent.isValid('num2')).to.be.false;
      expect(tree.get('formState')).to.be.deep.equal({
        errors: {
          num1: ['required'],
          num2: ['required']
        }
      });
      done();
    });
  });

  it('should formStateCursor has correct state for valid field', (done) => {
    tree.set(['form', 'num1'], 1);
    formComponent.validate(null, () => {
      expect(formComponent.isValid('num1')).to.be.true;
      expect(formComponent.isValid('num2')).to.be.false;
      expect(tree.get('formState')).to.be.deep.equal({
        errors: {
          num2: ['required']
        }
      });
      done();
    });
  });
  it('should formStateCursor has correct state for dirty field', (done) => {
    formComponent.setDirtyState('num1');
    formComponent.validate(null, () => {
      expect(formComponent.isDirty('num1')).to.be.true;
      expect(formComponent.isDirty('num2')).to.be.false;
      expect(tree.get('formState')).to.be.deep.equal({
        errors: {
          num2: ['required']
        },
        dirtyStates: {
          num1: true
        }
      });
      done();
    });
  });
  it('should formStateCursor has correct state for valid form', (done) => {
    formComponent.setDirtyState('num1');
    formComponent.setDirtyState('num2');
    tree.set(['form', 'num2'], 2);

    formComponent.validate(() => {
      expect(formComponent.isDirty('num1')).to.be.true;
      expect(formComponent.isDirty('num2')).to.be.true;
      expect(tree.get('formState')).to.be.deep.equal({
        errors: {},
        dirtyStates: {
          num1: true,
          num2: true
        }
      });
      done();
    });
  });
});
