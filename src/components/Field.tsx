import * as React from 'react';

import s from './Field.module.scss';

const { useCallback } = React;

type Props = {
  name: string;
  value?: string | number;
  type?: 'text' | 'number';
  onChange?: (...args: any[]) => any;
  id?: string;
  label?: string;
  placeholder?: string;
};

export default function Field({ id, label, value, onChange, ...props }: Props) {
  const valueOnChange = useCallback((e: any) => onChange(e), [onChange]);
  return (
    <div className={s.root}>
      <input id={id} value={value} onChange={valueOnChange} {...props} />
      <label htmlFor={id} className={s.floatAbove}>
        {label}
      </label>
    </div>
  );
}
