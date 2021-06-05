import * as React from 'react';

import s from './Select.module.scss';

type Props = {
  options: Array<string[]>;
  selected: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
};

export default function Select({ options, selected, onChange }: Props) {
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select className={s.select} value={selected} onChange={onChange}>
      {options.map(([value, name]) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}
