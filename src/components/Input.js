import React from 'react';
import PropTypes from 'prop-types';

import s0 from './Input.module.css';

const { useState, useRef, useEffect, useCallback } = React;

export default function Input(props) {
  return <input className={s0.input} {...props} />;
}

export function SelfControlledInput({ value, ...restProps }) {
  const [internalValue, setInternalValue] = useState(value);
  const refValue = useRef(value);
  useEffect(() => {
    if (refValue.current !== value) {
      // ideally we should only do this when this input is not focused
      setInternalValue(value);
    }
    refValue.current = value;
  }, [value]);
  const onChange = useCallback(e => setInternalValue(e.target.value), [
    setInternalValue
  ]);

  return (
    <input
      className={s0.input}
      value={internalValue}
      onChange={onChange}
      {...restProps}
    />
  );
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string
};
