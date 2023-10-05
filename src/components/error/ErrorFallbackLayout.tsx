import React from 'react';

import SvgYacd from '../SvgYacd';
import sx from './ErrorFallbackLayout.module.scss';

export function ErrorFallbackLayout(props: { children: React.ReactNode }) {
  return (
    <div className={sx.root}>
      <div className={sx.yacd}>
        <SvgYacd
          width={140}
          height={140}
          c0="transparent"
          eye="transparent"
          shapeStroke="var(--color-text-secondary)"
          mouth="var(--color-text-secondary)"
          eyeStroke="var(--color-text-secondary)"
        />
      </div>
      {props.children}
    </div>
  );
}
