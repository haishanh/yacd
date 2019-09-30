import React from 'react';

import SvgYacd from './SvgYacd';

import s0 from './Loading2.module.css';

function Loading() {
  return (
    <div className={s0.lo}>
      <SvgYacd width={280} height={280} animate c0="transparent" c1="#646464" />
    </div>
  );
}

export default Loading;
