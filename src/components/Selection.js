import cx from 'clsx';
import { array, func, number } from 'prop-types';
import React from 'react';

import s from './Selection.module.css';

export default function Selection({
  OptionComponent,
  optionPropsList,
  selectedIndex,
  onChange,
}) {
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

Selection.propTypes = {
  OptionComponent: func,
  optionPropsList: array,
  selectedIndex: number,
  onChange: func,
};

// for test
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
