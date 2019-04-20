import React from 'react';
import { func, array, number } from 'prop-types';
import cx from 'classnames';

import s from './Selection.module.css';

export default function Selection({
  OptionComponent,
  optionPropsList,
  selectedIndex,
  onChange
}) {
  return (
    // TODO a11y
    // tabIndex="0"
    <div className={s.root}>
      {optionPropsList.map((props, idx) => {
        const className = cx(s.item, { [s.itemActive]: idx === selectedIndex });
        return (
          <div
            key={idx}
            className={className}
            onClick={ev => {
              ev.preventDefault();
              if (idx !== selectedIndex) {
                onChange(idx);
              }
            }}
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
  onChange: func
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
          backgroundColor: '#eee'
        }}
      >
        {title}
      </div>
    );
  }
}
