import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './Field.module.css';

const { useCallback } = React;

export default function Field({ id, label, value, onChange, ...props }) {
  const valueOnChange = useCallback(e => onChange(e), [onChange]);
  const labelClassName = cx({
    [s.floatAbove]: typeof value === 'string' && value !== ''
  });
  return (
    <div className={s.root}>
      <input id={id} value={value} onChange={valueOnChange} {...props} />
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['text', 'number']),
  onChange: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string
};
