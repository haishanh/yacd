import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'm/store';

import Icon from 'c/Icon';
import ProxyLatency from 'c/ProxyLatency';

import globe from 's/globe.svg';
import ss from 's/ss.svg';
import vmess from 's/vmess.svg';
import auto from 's/auto.svg';
import fallback from 's/fallback.svg';
import direct from 's/direct.svg';
import http from 's/http.svg';
import group from 's/group.svg';

import s0 from './Proxy.module.scss';

import { getDelay, getProxies } from 'd/proxies';

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

const icons = {
  Direct: direct.id,
  Fallback: fallback.id,
  // TOOD Reject
  Selector: group.id,
  Shadowsocks: ss.id,
  Socks5: globe.id,
  Http: http.id,
  URLTest: auto.id,
  Vmess: vmess.id
};

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
  const color = now ? colors[proxy.type] : '#555';
  const iconId = icons[proxy.type];

  return (
    <div className={s0.proxy}>
      <div className={s0.left} style={{ color }}>
        <Icon id={iconId} width={80} height={80} />
      </div>
      <div className={s0.right}>
        <div className={s0.proxyName}>{name}</div>
        {latency ? <ProxyLatency latency={latency} /> : null}
      </div>
    </div>
  );
}
Proxy.propTypes = {
  now: PropTypes.bool,
  delay: PropTypes.object,
  proxies: PropTypes.object,
  name: PropTypes.string
};

export default Proxy;
