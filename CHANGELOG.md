# Changelog


## 2.1.0
* Clever components with cursor-state synchronization #14
* Fix devDependencies #13
* MultipleCheckBox: Add checkbox component which can work with multiple values inside one validation box #21
* Form: Add nested forms support #16
* Form: Add new prop `useHtmlForm` with default true value
* Form: Add `submit`, `validate`, `isHtmlForm` methods into form child context
* Form: fix synchronizing problem with `updateDirtyState`
* Submit: Add ability to set disabledClass in Submit component #15
* FormComponentMixin: Add processKeyPress helper for form components
* FormComponentMixin: Allow setting fieldPath in ordinary inputs #19

## 2.0.5
* Fixed imports

## 2.0.3
* Fixed exports

## 2.0.2
* ValidationBox: Added data-field-path attribute
* Input: nullable is set to false as default #11

## 2.0.0
* Form: Added formStateCursor for more flexible form state manipulation (#3)
* Form: Added dynamic validationScheme (#4). validationScheme may be object or function
* Form: Removed initial state
* Form: Removed method resetValidationData
* Form: Moved dirty states manipulation from Form into Input inside ValidationBox (#7)
* Form: Context now represents with only one prop - form
* Form: Context.form contains cursor prop to form cursor
* Input: Changed callbacks (#8): onBlur, onChange, onSync
* Input inside ValidationBox has methods: setDirtyState, setPristineState, isDirty, isValid
* Input cursor now is not required because it can be get via ValidationBox context.fieldPath and Form context.form.cursor
* ValidationBox now has context prop fieldPath
* ValidationGlobalError removed
* Added ValidationError component
* Added examples and docs

## 1.0.16
* Fixed problem with syncOnlyOnBlur

## 1.0.13
* Fixed problem with onBlur in Input (#6)
* Fixed problem with monkey (#5)

## 1.0.12
* Fixed autoFocus (added timeout), removed useless logic for selection (mobile ff fix)

## 1.0.11
* Added onBlur for Input

## 1.0.10
* Added setDirtyState and setPristineState methods for Form and form context

## 1.0.9
* Added disabledIfInvalid to Submit

## 1.0.8
* Fixed peer dependencies

## 1.0.7
* Added autoFocus to Input

## 1.0.0
* Initial release
