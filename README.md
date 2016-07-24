[![Build Status](https://travis-ci.org/Brogency/baobab-react-schemabranchmixin.svg)](https://travis-ci.org/Brogency/react-form-tools)
[![Coverage Status](https://coveralls.io/repos/Brogency/react-form-tools/badge.svg?branch=master&service=github)](https://coveralls.io/github/Brogency/react-form-tools?branch=master)
[![npm version](https://badge.fury.io/js/react-form-tools.svg)](https://badge.fury.io/js/react-form-tools)

react-form-tools
=========

Form validation and base form components for React+Baobab.
Based on [Baobab cursors](https://github.com/Yomguithereal/baobab).

Form validation is inspired by [react-validation-mixin](https://github.com/jurassix/react-validation-mixin).

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
* **useHtmlForm** *boolean* [`true`] - use html form instead of own emulation. Own emulation always used for nested form if both forms have `useHtmlForm=true`

#### Form API

Form API is available across refs. These methods are available in child context via `form`, which contains also `cursor` attribute to form data.

* **isValid([fieldPath])**
* **isDirty(fieldPath)**
* **getValidationErrors([fieldPath])**
* **setDirtyState(fieldPath)**
* **setPristineState(fieldPath)**
* **submit()**
* **validate(successCallback, invalidCallback)**
* **isHtmlForm()**

### Input

```
<Input cursor={this.cursors.form.select('field')} />
```

#### Input props

* **cursor** *cursor* - cursor to input. Cursor must be set if Input is used outside ValidationBox
* **fieldPath** *string* - relative path to input cursor from form cursor.
* **nullable** *boolean* [`false`] - if `nullable` is set to true, then empty value will be converted to null
* **sync** *boolean* [`false`] - if `sync` is set to true, then synchronization will be applied on every change
* **syncOnlyOnBlur** *boolean* [`false`] - if `syncOnlyOnBlur` is set to true, then synchronization will be applied only on blur
* **onChange(value, previousValue)** *function* [`optional`] - callback which will be called on every change
* **onSync(value, previousValue)** *function* [`optional`] - callback which will be called on every synchronization with cursor
* **onBlur(event)** *function* [`optional`] - callback which will be called only on blur
* **toRepresentation** *function* [`identity`] - function of transformation which is used for output
* **toInternal** *function* [`identity`] - function of transformation which is used for inner storing

And other html input props also available such as `autoFocus`, `readOnly` and etc.

### ValidationBox

```
<ValidationBox fieldPath="path.to.field">
    <AnyFormComponent />
</ValidationBox>
```

Any component can be used inside ValidationBox. When you use Component inside ValidationBox, component will use cursor
from fieldPath is cursor is not set.
If component inside ValidationBox is dirty, ValidationBox will have a class '_dirty'

#### ValidationBox props

* **alwaysShowError** *boolean* [`false`] - if `alwaysShowError` is set to true, error will be shown even if component is dirty
* **displayError** *boolean* [`true`] - if `displayError` is set to true, error will be shown
### ValidationError

```
<ValidationError fieldPath="path.to.field" />
```

If component inside ValidationBox is dirty, ValidationError will have a class '_dirty'

#### ValidationError Props

* **alwaysShow** *boolean* [`false`] - is `alwaysShow` if set to true, error will be showed even if component is dirty

### Radio

```
<ValidationBox fieldPath="path.to.field">
    <Radio value={1} />
    <Radio value={2} />
    <Radio value={3} />
</ValidationBox>
```

### CheckBox

```
<CheckBox value={1} cursor={this.cursors.field} />
```


### MultipleCheckBox

*Warning*: cursor must be an array!

```
<ValidationBox fieldPath="path.to.field">
    <MultipleCheckBox value={1} />
    <MultipleCheckBox value={2} />
    <MultipleCheckBox value={3} />
</ValidationBox>
```


### Submit

```
<Submit>
    Submit
</Submit>
```

If form is invalid, button will have a class '_disabled'

#### Submit props

* **disableIfInvalid** *boolean* [`false`] - if `disableIfInvalid` is set to true, button will be disabled
* **disabledClassName** *string* [`_disabled`]
### Own Form component

For creating own component you can use FormComponentMixin from this package.
`import { FormComponentMixin } from 'react-form-tools';`

FormComponentMixin provides next useful methods:
* **inValidationBox()** - returns true if component inside ValidationBox
* **getCursor()** - returns current cursor of component
* **setValue(value, callback)** - sets cursor value and calls callback after synchronization
* **isValid()** - returns true if component has valid value
* **isDirty()** - returns true if component is dirty
* **setDirtyState()** - set dirty state for component
* **setPristineState()** - set pristine state for component
* **processKeyPress(event)** - process key press event and catch only Enter key pressing for form submission

Always use `processKeyPress` helper as `onKeyPress` attribute for own components if you wish to do form submission on enter (default html form component behaviour).

### All Form Components API

All components have FormComponentMixin, and all methods from mixin are available across refs.

## Examples

    cd examples/form-example
    npm i
    npm run start

Example app starts on http://localhost:3000 by default


## Tests

    npm test
