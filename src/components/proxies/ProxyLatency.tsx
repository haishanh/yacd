import * as React from 'react';

import { ProxyDelayItem } from '$src/store/types';

import s0 from './ProxyLatency.module.scss';

type ProxyLatencyProps = {
  latency: ProxyDelayItem | undefined;
  color: string;
};

export function ProxyLatency({ latency, color }: ProxyLatencyProps) {
  let text = ' ';
  if (latency) {
    switch (latency.kind) {
      case 'Error':
      case 'Testing':
        text = '- ms';
        break;
      case 'Result':
        text = (latency.number !== 0 ? latency.number : '-') + ' ms';
        break;
      default:
        break;
    }
  }
  return (
    <span className={s0.proxyLatency} style={{ color }}>
      {text}
    </span>
  );
}
