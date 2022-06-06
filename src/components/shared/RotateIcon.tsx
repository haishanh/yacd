import cx from 'clsx';
import * as React from 'react';
import { RotateCw } from 'react-feather';

import s from './RotateIcon.module.scss';

export function RotateIcon(props: { isRotating: boolean; size?: number }) {
  const size = props.size || 16;
  const cls = cx(s.rotate, { [s.isRotating]: props.isRotating });
  return (
    <span className={cls}>
      <RotateCw size={size} />
    </span>
  );
}
