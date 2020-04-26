import * as React from 'react';

import s from './Select.module.css';

type Props = {
  options: Array<string[]>;
  selected: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
};

export default function Select({ options, selected, onChange }: Props) {
  return (
    <select className={s.select} value={selected} onChange={onChange}>
      {options.map(([value, name]) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}
