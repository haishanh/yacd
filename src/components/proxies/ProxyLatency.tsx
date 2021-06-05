import * as React from 'react';

import s0 from './ProxyLatency.module.scss';

type ProxyLatencyProps = {
  number: number;
  color: string;
};

export function ProxyLatency({ number, color }: ProxyLatencyProps) {
  return (
    <span className={s0.proxyLatency} style={{ color }}>
      <span>{number} ms</span>
    </span>
  );
}
