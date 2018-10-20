import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/Button.module.scss';

class Button extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => {}
  };

  render() {
    return (
      <button className={s0.btn} onClick={this.props.onClick}>
        {this.props.label}
      </button>
    );
  }
}

export default Button;
