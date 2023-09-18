import React, { useCallback, useMemo } from 'react';

import s0 from './ToggleSwitch.module.scss';

type Props = {
  options?: any[];
  value?: string;
  name?: string;
  onChange?: (...args: any[]) => any;
};

function ToggleSwitch({ options, value, name, onChange }: Props) {
  const idxSelected = useMemo(() => options.map((o) => o.value).indexOf(value), [options, value]);

  const getPortionPercentage = useCallback(
    (idx: number) => {
      const w = Math.floor(100 / options.length);
      if (idx === options.length - 1) {
        return 100 - options.length * w + w;
      } else if (idx > -1) {
        return w;
      }
    },
    [options],
  );

  const sliderStyle = useMemo(() => {
    return {
      width: getPortionPercentage(idxSelected) + '%',
      left: idxSelected * getPortionPercentage(0) + '%',
    };
  }, [idxSelected, getPortionPercentage]);

  return (
    <div className={s0.ToggleSwitch}>
      <div className={s0.slider} style={sliderStyle} />
      {options.map((o, idx) => {
        const id = `${name}-${o.label}`;
        const className = idx === 0 ? '' : 'border-left';
        return (
          <label
            htmlFor={id}
            key={id}
            className={className}
            style={{
              width: getPortionPercentage(idx) + '%',
            }}
          >
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
  );
}

export default React.memo(ToggleSwitch);
