import cx from 'clsx';
import * as React from 'react';
import { RotateCw } from 'react-feather';

import s from './RotateIcon.module.scss';

export function RotateIcon({ isRotating }: { isRotating: boolean }) {
  const cls = cx(s.rotate, {
    [s.isRotating]: isRotating,
  });
  return (
    <span className={cls}>
      <RotateCw width={16} />
    </span>
  );
}
