[![Build Status](https://travis-ci.org/Brogency/baobab-react-schemabranchmixin.svg)](https://travis-ci.org/Brogency/react-form-tools)
[![Coverage Status](https://coveralls.io/repos/Brogency/react-form-tools/badge.svg?branch=master&service=github)](https://coveralls.io/github/Brogency/react-form-tools?branch=master)
[![npm version](https://badge.fury.io/js/react-form-tools.svg)](https://badge.fury.io/js/react-form-tools)

react-form-tools
=========

Form validation and base form components for React+Baobab. 
Based on [Baobab cursors](https://github.com/Yomguithereal/baobab).

Form validation inspired by [react-validation-mixin](https://github.com/jurassix/react-validation-mixin).

## Installation

  npm install baobab --save
  
  npm install react-form-tools --save
  
## Usage

There are some useful components which provide flexible interface for validation and clever input.

### Form

Form component provides tools for validation using validation schema (for example, yup, joi and etc.)

```
React.createClass({
  // Schema from baobab-react-schemabranchmixin
  schema: {
    form: {
      field: '',
    },
  },

  // Validation schema from yup
  validationSchema: yup.object().shape({
    field: yup.string().required(),
  }),
  
  render: function () {
    return (
      <Form cursor={this.cursors.form} validationSchema={this.validationSchema}>
        <ValidationBox fieldPath='field'>
          <Input />
        </ValidationBox>
      </Form>
    );
  },
});
```

#### Form params

* **cursor** *cursor* - cursor to form
* **validationSchema** *object* - validation schema which uses with **strategy**
* **strategy** *function* - validation strategy instance
* **validateOnFly** *boolean* [`true`] - validate form on every change into form components  
* **formStateCursor** *cursor* [`null`] - if formStateCursor is set to cursor, 
then this cursor will be used for storing `dirtyStates` and `errors`
* **onSubmit** *function* [`optional`] - callback of successful validation which will be called when user will submit form
* **onInvalidSubmit** *function* [`optional`] - callback of unsuccessful validation which will be called when user will submit form 

### Input
  
```
<Input cursor={this.cursors.form.select('field')} />
```
  
## Tests

  npm test
