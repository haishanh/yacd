import React from 'react';
import cx from 'classnames';

import { connect } from './StateProvider';
import ProxyLatency from './ProxyLatency';

import { getProxies, getDelay } from '../store/proxies';

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
  na: '#909399'
};

function getLabelColor({ number, error } = {}) {
  if (number < 200) {
    return colorMap.good;
  } else if (number < 400) {
    return colorMap.normal;
  } else if (typeof number === 'number') {
    return colorMap.bad;
  }
  return colorMap.na;
}

/*
const colors = {
  Direct: '#408b43',
  Fallback: '#3483e8',
  Selector: '#387cec',
  Vmess: '#ca3487',
  Shadowsocks: '#1a7dc0',
  Socks5: '#2a477a',
  URLTest: '#3483e8',
  Http: '#d3782d'
};
*/

type ProxyProps = {
  name: string,
  now?: boolean,

  // connect injected
  // TODO refine type
  proxy: any,
  latency: any
};

function ProxySmallImpl({ now, name, proxy, latency }: ProxyProps) {
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
      className={cx(s0.proxySmall, { [s0.now]: now })}
      style={{ backgroundColor: color }}
    />
  );
}

function Proxy({ now, name, proxy, latency }: ProxyProps) {
  const color = useMemo(() => getLabelColor(latency), [latency]);
  return (
    <div
      className={cx(s0.proxy, {
        [s0.now]: now,
        [s0.error]: latency && latency.error
      })}
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

const mapState = (s, { name }) => {
  const proxies = getProxies(s);
  const delay = getDelay(s);
  return {
    proxy: proxies[name],
    latency: delay[name]
  };
};

export default connect(mapState)(Proxy);
export const ProxySmall = connect(mapState)(ProxySmallImpl);
