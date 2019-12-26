import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import s0 from './ToggleSwitch.module.css';

function ToggleSwitch({ options, value, name, onChange }) {
  const idxSelected = useMemo(() => options.map(o => o.value).indexOf(value), [
    options,
    value
  ]);
  const w = (100 / options.length).toPrecision(3);
  return (
    <div>
      <div className={s0.ToggleSwitch}>
        <div
          className={s0.slider}
          style={{
            width: w + '%',
            left: idxSelected * w + '%'
          }}
        />
        {options.map((o, idx) => {
          const id = `${name}-${o.label}`;
          let className = idx === 0 ? '' : 'border-left';
          return (
            <label htmlFor={id} key={id} className={className}>
              <input
                id={id}
                name={name}
                type="radio"
                value={o.value}
                checked={value === o.value}
                onChange={onChange}
              />
              <div>{o.label}</div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

ToggleSwitch.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func
};

export default React.memo(ToggleSwitch);
