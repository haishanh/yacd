import React from 'react';
import cx from 'classnames';

import s0 from './Button.module.css';
const noop = () => {};

const { memo, forwardRef } = React;

function Button({ children, label, text, start, onClick = noop }, ref) {
  return (
    <button className={s0.btn} ref={ref} onClick={onClick}>
      {start ? <span className={s0.btnStart}>{start}</span> : null}
      {children || label || text}
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

export default memo(forwardRef(Button));
