import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from './Input.module.scss';

class Input extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    type: 'number',
    placeholder: 'Please input'
  };

  state = {
    value: this.props.value,
    lastValueFromProps: this.props.value
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.lastValueFromProps) {
      return {
        lastValueFromProps: props.value,
        value: props.value
      };
    }
    return null;
  }

  handleInputOnChange = e => {
    const value = e.target.value;
    const int = parseInt(value, 10);
    if (int < 0 || int > 65535) return;
    this.setState({ value: e.target.value });
  };

  render() {
    const { onChange, name, type, placeholder } = this.props;
    const { value } = this.state;
    return (
      <div>
        <input
          className={s0.input}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onBlur={onChange}
          onChange={this.handleInputOnChange}
        />
      </div>
    );
  }
}

export default Input;
