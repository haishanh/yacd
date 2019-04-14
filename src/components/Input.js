import React from 'react';
import PropTypes from 'prop-types';

import s0 from './Input.module.css';

export default function Input(props) {
  return <input className={s0.input} {...props} />;
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string
};
