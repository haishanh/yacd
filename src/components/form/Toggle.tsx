import React, { useCallback, useEffect, useRef, useState } from 'react';

import s0 from './Toggle.module.scss';

type ToggleInputProps = {
  id: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => unknown;
};

export function ToggleInput({
  id,
  checked: theirChecked,
  disabled,
  onChange: theirOnChange,
}: ToggleInputProps) {
  const [checked, setChecked] = useState(!!theirChecked);
  const theirCheckedRef = useRef(!!theirChecked);
  useEffect(() => {
    if (theirCheckedRef.current !== theirChecked) setChecked(!!theirChecked);
    theirCheckedRef.current = !!theirChecked;
  }, [theirChecked]);
  const onChange = useCallback(
    (e: boolean) => {
      if (disabled) return;
      setChecked(e);
      if (theirOnChange) theirOnChange(e);
    },
    [disabled, theirOnChange],
  );
  return (
    <label className={s0.toggle}>
      <input
        className={s0.input}
        id={id}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
        disabled={disabled}
      />
      <span className={s0.track} />
    </label>
  );
}
