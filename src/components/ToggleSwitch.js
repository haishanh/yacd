import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import s0 from 'c/ToggleSwitch.module.scss';

function ToggleSwitch2({ options, value, name, onChange }) {
  const idxRef = useRef(null);
  const w = (100 / options.length).toPrecision(3);
  return (
    <div>
      <div className={s0.ToggleSwitch}>
        {options.map((o, idx) => {
          if (value === o.value) idxRef.current = idx;
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
        <a
          className={s0.slider}
          style={{
            width: w + '%',
            left: idxRef.current * w + '%'
          }}
        />
      </div>
    </div>
  );
}

ToggleSwitch2.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func
};

export default React.memo(ToggleSwitch2);
