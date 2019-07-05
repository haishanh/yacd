import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useStoreState } from 'm/store';

import ProxyLatency from 'c/ProxyLatency';

import s0 from './Proxy.module.css';

import { getDelay, getProxies } from 'd/proxies';

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

const mapStateToProps = s => {
  return {
    proxies: getProxies(s),
    delay: getDelay(s)
  };
};

function Proxy({ now, name }) {
  const { proxies, delay } = useStoreState(mapStateToProps);
  const latency = delay[name];
  const proxy = proxies[name];

  return (
    <div className={cx(s0.proxy, { [s0.now]: now })}>
      <div className={s0.proxyName}>{name}</div>
      <div className={s0.proxyType} style={{ opacity: now ? 0.6 : 0.2 }}>
        {proxy.type}
      </div>
      <div className={s0.proxyLatencyWrap}>
        {latency ? <ProxyLatency latency={latency} /> : null}
      </div>
    </div>
  );
}
Proxy.propTypes = {
  now: PropTypes.bool,
  name: PropTypes.string
};

export default Proxy;
