import * as React from 'react';

import s0 from './ProxyLatency.module.scss';

type ProxyLatencyProps = {
  number?: number;
  color: string;
};

export function ProxyLatency({ number, color }: ProxyLatencyProps) {
  return (
    <span className={s0.proxyLatency} style={{ color }}>
      {typeof number === 'number' && number !== 0 ? number + ' ms' : ' '}
    </span>
  );
}
