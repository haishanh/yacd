import React from 'react';

import s0 from './Loading2.module.scss';
import SvgYacd from './SvgYacd';

function Loading() {
  return (
    <div className={s0.lo}>
      <SvgYacd width={280} height={280} animate c0="transparent" c1="#646464" />
    </div>
  );
}

export default Loading;
