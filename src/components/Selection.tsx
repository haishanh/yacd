import cx from 'clsx';
import React from 'react';

import s from './Selection.module.scss';

type SelectionProps = {
  OptionComponent?: (...args: any[]) => any;
  optionPropsList?: any[];
  selectedIndex?: number;
  onChange?: (...args: any[]) => any;
};

export function Selection2({
  OptionComponent,
  optionPropsList,
  selectedIndex,
  onChange,
}: SelectionProps) {
  const inputCx = cx('visually-hidden', s.input);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <fieldset className={s.fieldset}>
      {optionPropsList.map((props, idx) => {
        return (
          <label key={idx}>
            <input
              type="radio"
              checked={selectedIndex === idx}
              name="selection"
              value={idx}
              aria-labelledby={'traffic chart type ' + idx}
              onChange={onInputChange}
              className={inputCx}
            />
            <div className={s.cnt}>
              <OptionComponent {...props} />
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
