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
  
## Tests

  npm test
  
## Release History

* 1.0.13 Fixed problem with onBlur in Input
* 1.0.12 Fixed autoFocus (added timeout), removed useless logic for selection (mobile ff fix)
* 1.0.11 Added onBlur for Input
* 1.0.10 Added setDirtyState and setPristineState methods for Form and form context
* 1.0.9 Added disabledIfInvalid to Submit
* 1.0.8 Fixed peer dependencies
* 1.0.7 Added autoFocus to Input
* 1.0.0 Initial release
