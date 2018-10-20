import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/Switch.module.scss';

class Switch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string
  };

  static defaultProps = {
    checked: false,
    name: '',
    onChange: () => {}
  };

  render() {
    const { checked, onChange, name } = this.props;
    return (
      <div>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          className={s0.switch}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default Switch;
