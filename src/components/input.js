import React from 'react'
import {getSelection, setSelection} from 'react/lib/ReactInputSelection';
import {PureRenderMixin} from 'libs/mixins';
import config from '~/config';

export default React.createClass({
  displayName: 'Input',

  mixins: [PureRenderMixin],

  propTypes: {
    onChange : React.PropTypes.func,
    cursor: React.PropTypes.any.isRequired,
    sync: React.PropTypes.bool,
    syncOnlyOnBlur: React.PropTypes.bool
  },

  updateTimer: null,

  selection: null,

  getInitialState: function () {
    return {
      value: this.props.toInternal(this.props.cursor.get())
    }
  },

  getDefaultProps: function () {
    return {
      type: "text",
      toInternal: x => x,
      toRepresentation: x => x
    };
  },

  componentWillReceiveProps (nextProps) {
    if (this.updateTimer) {
      // Does not set state when component received props while user inputs
      return;
    }
    this.setState({
      value: this.props.toInternal(nextProps.cursor.get())
    });
  },

  componentWillUnmount: function () {
    this.clearUpdateTimer();
  },

  clearUpdateTimer: function () {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  },

  setUpdateTimer: function () {
    this.clearUpdateTimer();
    this.updateTimer = setTimeout(this.syncValue, config.msToPoll);
  },

  onChange: function(evt) {
    const value = this.props.toInternal(evt.target.value);

    if (value == this.state.value) {
      // Skip sync if no changes
      return;
    }

    this.setState({ value }, function () {
      if (!this.props.syncOnlyOnBlur) {
        if (this.props.sync) {
          this.syncValue();
        } else {
          this.setUpdateTimer();
        }
      }
    });
  },

  syncValue: function () {
    const value = this.state.value || null;

    this.props.cursor.set(value);
    if (this.props.onChange) {
      setTimeout(() => this.props.onChange(value), 0);
    }
  },

  onBlur: function () {
    this.clearUpdateTimer();

    this.syncValue();
  },

  updateSelection: function () {
    const input = this.refs.input;
    const value = this.refs.input.value;
    let selection = getSelection(input);
    selection.start = selection.end = value.length;

    setSelection(input, selection);
  },

  componentDidUpdate: function () {
    if (_.contains(['text', 'password', 'tel', 'url', 'search'], this.props.type)) {
      // For mobile firefox we need to updated selection for correct output
      setTimeout(this.updateSelection, 30);
    }
  },

  render: function () {
    const props = {
      value: this.props.toRepresentation(this.state.value),
      onChange: this.onChange,
      onBlur: this.onBlur
    };

    if (this.props.type == 'textarea') {
      return <textarea {...this.props} {...props} ref="input" />
    } else {
      return <input type={this.props.type} {...this.props} {...props} ref="input" />;
    }
  }
});
