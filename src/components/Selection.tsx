import cx from 'clsx';
import React from 'react';

import s from './Selection.module.css';

type SelectionProps = {
  OptionComponent?: (...args: any[]) => any;
  optionPropsList?: any[];
  selectedIndex?: number;
  onChange?: (...args: any[]) => any;
};

export default function Selection({
  OptionComponent,
  optionPropsList,
  selectedIndex,
  onChange,
}: SelectionProps) {
  return (
    <div className={s.root}>
      {optionPropsList.map((props, idx) => {
        const className = cx(s.item, { [s.itemActive]: idx === selectedIndex });
        const doSelect = (ev) => {
          ev.preventDefault();
          if (idx !== selectedIndex) onChange(idx);
        };
        return (
          <div
            key={idx}
            className={className}
            tabIndex={0}
            role="menuitem"
            onKeyDown={doSelect}
            onClick={doSelect}
          >
            <OptionComponent {...props} />
          </div>
        );
      })}
    </div>
  );
}

// for test
// @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
export function Option({ title }) {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    return (
      <div
        style={{
          width: 100,
          height: 60,
          backgroundColor: '#eee',
        }}
      >
        {title}
      </div>
    );
  }
}
