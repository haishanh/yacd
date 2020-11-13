import cx from 'clsx';
import React from 'react';

import s from './Field.module.css';

const { useCallback } = React;

type Props = {
  value?: string | number;
  type?: 'text' | 'number';
  onChange?: (...args: any[]) => any;
  id?: string;
  label?: string;
};

export default function Field({ id, label, value, onChange, ...props }: Props) {
  const valueOnChange = useCallback((e) => onChange(e), [onChange]);
  const labelClassName = cx({
    [s.floatAbove]: typeof value === 'string' && value !== '',
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
