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

#### Form props

* **cursor** *cursor* - cursor to form data
* **validationSchema** *object* - validation schema which uses with **strategy**
* **strategy** *function* - validation strategy instance
* **validateOnFly** *boolean* [`true`] - validate form on every change into form components  
* **formStateCursor** *cursor* [`null`] - if `formStateCursor` is set to cursor, 
then this cursor will be used for storing `dirtyStates` and `errors`
* **onSubmit(data)** *function* [`optional`] - callback of successful validation which will be called when user will submit form
* **onInvalidSubmit(errors)** *function* [`optional`] - callback of unsuccessful validation which will be called when user will submit form 

#### Form API

Form API is available across refs. This methods are available in child context via `form`, which contains also `cursor` attribute to form data.

* **isValid([fieldPath])**
* **isDirty(fieldPath)**
* **getValidationErrors([fieldPath])**
* **setDirtyState(fieldPath)**
* **setPristineState(fieldPath)**             

### Input
  
```
<Input cursor={this.cursors.form.select('field')} />
```

#### Input props

* **cursor** *cursor* - cursor to input. Cursor must be set if Input is used outside ValidationBox
* **nullable** *boolean* [`false`] - if `nullable` is set to true, then empty value will be converted to null  
* **sync** *boolean* [`false`] - if `sync` is set to true, then synchronization will be applied on every change
* **syncOnlyOnBlur** *boolean* [`false`] - if `syncOnlyOnBlur` is set to true, then synchronization will be applied only on blur
* **onChange(value, previousValue)** *function* [`optional`] - callback which will be called on every change
* **onBlur(event)** *function* [`optional`] - callback which will be called only on blur
* **toRepresentation** *function* [`identity`] - function of transformation which is used for output
* **toInternal** *function* [`identity`] - function of transformation which is used for inner storing

And other html input props also available such as `autoFocus`, `readOnly` and etc.

#### Input API

Input API is available across refs. Use this methods only if Input is inside ValidationBox.

* **isDirty()**
* **isValid()**
* **setDirtyState()**
* **setPristineState()**

## Tests

  npm test
