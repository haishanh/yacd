import React from 'react';
import cx from 'classnames';

import s0 from './Button.module.css';
const noop = () => {};

const { memo, forwardRef } = React;

function Button({ children, label, onClick = noop }, ref) {
  return (
    <button className={s0.btn} ref={ref} onClick={onClick}>
      {children || label}
    </button>
  );
}

export function ButtonPlain({ children, label, onClick = noop }) {
  return (
    <button className={cx(s0.btn, s0.plain)} onClick={onClick}>
      {children || label}
    </button>
  );
}

function WithIcon({ text, icon, onClick = noop }, ref) {
  return (
    <button className={s0.btn} ref={ref} onClick={onClick}>
      <div className={s0.withIconWrapper}>
        {icon}
        <span className={s0.txt}>{text}</span>
      </div>
    </button>
  );
}

export const ButtonWithIcon = memo(forwardRef(WithIcon));

export default memo(forwardRef(Button));
