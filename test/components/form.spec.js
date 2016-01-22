import React from 'react';
import Baobab from 'baobab';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';

const tree = new Baobab(
  {
    form: {
      firstName: null,
      lastName: null
    }
  },
  {
    immutable: false,
    asynchronous: false
  }
);

const TestComponentInner = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    firstLevel: {
      secondLevel: {
        fieldThird: 'initialThird'
      },
      fieldSecond: 'initialSecond'
    },
    fieldFirst: 'initialFirst'
  },

  render: function () {
    return null;
  }
});

const TestComponentInnerOverride = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    _override: true,
    firstLevel: {
      secondLevel: {
        fieldThird: 'initialThird'
      },
      fieldSecond: 'initialSecond'
    },
    fieldFirst: 'initialFirst'
  },

  render: function () {
    return null;
  }
});

const TestComponent = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    componentKey: 'component1'
  },

  render: function () {
    const Component = this.props.innerComponent;
    return (
      <Component ref="component" tree={this.props.tree.select(this.state.componentKey)} />
    );
  }
});

describe('Check SchemaBranchMixin', () => {
  let component, treeState;

  function renderComponent(componentProps = {}) {
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={TestComponent}
            componentProps={_.defaults(componentProps, {
              tree: tree.select(),
              innerComponent: TestComponentInner
            })} />
    );
    component = rootComponent.refs.component.refs.component;
  }

  before(() => {
    renderComponent();

    treeState = tree.get();
  });

  after(() => {
    tree.set(treeState);
  });

  it('should component has correct cursors mapping', () => {
    expect(_.keys(component.cursors)).to.have.members(['firstLevel', 'fieldFirst']);
  });

  it('should component has correct state with initial and changed data', () => {
    expect(component.state).to.be.deep.equal({
      firstLevel: {
        secondLevel: {
          fieldThird: 'changedThird',
          notDeclaredInStateAtThirdLevel: {
            value: [1, 2, 3]
          }
        },
        fieldSecond: 'initialSecond'
      },
      fieldFirst: 'initialFirst'
    });
  });

  it('should state changed correctly when tree prop changed', () => {
    tree.set('componentKey', 'component2');

    expect(component.state).to.be.deep.equal({
      firstLevel: {
        secondLevel: {
          fieldThird: 'initialThird'
        },
        fieldSecond: 'initialSecond'
      },
      fieldFirst: 'fromComponent2'
    });
  });

  it('should changes via cursor change state directly', () => {
    tree.set(['component2', 'fieldFirst'], 'newValue');
    expect(component.state.fieldFirst).to.be.equal('newValue');
  });

  it('should _override attribute at first-level schema overrides value in tree', () => {
    tree.set('componentKey', 'component1');

    tree.set('component1', {
      notDeclaredInStateAtFirstLevel: true,
      firstLevel: {
        secondLevel: {
          fieldThird: 'changedThird',
          notDeclaredInStateAtThirdLevel: {
            value: [1, 2, 3]
          }
        }
      },
      fieldFirst: 'changed'
    });
    renderComponent({innerComponent: TestComponentInnerOverride});

    expect(component.state).to.be.deep.equal({
      _override: true,
      firstLevel: {
        secondLevel: {
          fieldThird: 'initialThird'
        },
        fieldSecond: 'initialSecond'
      },
      fieldFirst: 'initialFirst'
    });
  });
});
