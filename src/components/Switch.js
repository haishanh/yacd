import React from 'react';
import PropTypes from 'prop-types';

import s0 from './Switch.module.css';
const noop = () => {};

function Switch({ checked = false, onChange = noop, name = '' }) {
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

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string
};

export default React.memo(Switch);
