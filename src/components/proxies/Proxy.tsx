import * as React from 'react';

import cx from 'clsx';

import { connect } from '../StateProvider';
import { ProxyLatency } from './ProxyLatency';
import { getProxies, getDelay } from '../../store/proxies';

import s0 from './Proxy.module.css';

const { useMemo } = React;

const colorMap = {
  // green
  good: '#67c23a',
  // yellow
  normal: '#d4b75c',
  // orange
  bad: '#e67f3c',
  // bad: '#F56C6C',
  na: '#909399',
};

function getLabelColor({
  number,
}: {
  number?: number;
} = {}) {
  if (number < 200) {
    return colorMap.good;
  } else if (number < 400) {
    return colorMap.normal;
  } else if (typeof number === 'number') {
    return colorMap.bad;
  }
  return colorMap.na;
}

type ProxyProps = {
  name: string;
  now?: boolean;
  proxy: any;
  latency: any;
  isSelectable?: boolean;
  onClick?: (proxyName: string) => unknown;
};

function ProxySmallImpl({
  now,
  name,
  latency,
  isSelectable,
  onClick,
}: ProxyProps) {
  const color = useMemo(() => getLabelColor(latency), [latency]);
  const title = useMemo(() => {
    let ret = name;
    if (latency && typeof latency.number === 'number') {
      ret += ' ' + latency.number + ' ms';
    }
    return ret;
  }, [name, latency]);
  return (
    <div
      title={title}
      className={cx(s0.proxySmall, {
        [s0.now]: now,
        [s0.selectable]: isSelectable,
      })}
      style={{ backgroundColor: color }}
      onClick={() => {
        isSelectable && onClick && onClick(name);
      }}
    />
  );
}

function ProxyImpl({
  now,
  name,
  proxy,
  latency,
  isSelectable,
  onClick,
}: ProxyProps) {
  const color = useMemo(() => getLabelColor(latency), [latency]);
  return (
    <div
      className={cx(s0.proxy, {
        [s0.now]: now,
        [s0.error]: latency && latency.error,
        [s0.selectable]: isSelectable,
      })}
      onClick={() => {
        isSelectable && onClick && onClick(name);
      }}
    >
      <div className={s0.proxyName}>{name}</div>
      <div className={s0.row}>
        <span className={s0.proxyType} style={{ opacity: now ? 0.6 : 0.2 }}>
          {proxy.type}
        </span>
        {latency && latency.number ? (
          <ProxyLatency number={latency.number} color={color} />
        ) : null}
      </div>
    </div>
  );
}

const mapState = (s: any, { name }) => {
  const proxies = getProxies(s);
  const delay = getDelay(s);
  return {
    proxy: proxies[name],
    latency: delay[name],
  };
};

export const Proxy = connect(mapState)(ProxyImpl);
export const ProxySmall = connect(mapState)(ProxySmallImpl);
