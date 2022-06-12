import cx from 'clsx';
import * as React from 'react';

import s from './ZapAnimated.module.scss';

export function ZapAnimated(props: { size?: number; animate?: boolean }) {
  const size = props.size || 24;
  const cls = cx({ [s.animate]: props.animate });
  return (
    <svg
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
