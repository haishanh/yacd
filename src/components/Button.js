import React from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/Button.module.scss';
const noop = () => {};

const Button = React.memo(function Button({ label, onClick = noop }) {
  return (
    <button className={s0.btn} onClick={onClick}>
      {label}
    </button>
  );
});

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default Button;
