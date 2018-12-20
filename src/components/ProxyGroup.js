import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useActions, useStoreState } from 'm/store';

import Proxy from 'c/Proxy';

import s0 from './ProxyGroup.module.scss';

import { getUserProxies, switchProxy } from 'd/proxies';

const mapStateToProps = s => ({
  proxies: getUserProxies(s)
});

// should move this to sth like constants.js
// const userProxyTypes = ['Shadowsocks', 'Vmess', 'Socks5'];
export default function ProxyGroup2({ name }) {
  const { proxies } = useStoreState(mapStateToProps);
  const actions = useActions({ switchProxy });
  const group = proxies[name];
  const { all, now } = group;
  const list = useMemo(
    () => {
      if (all) {
        const a = [now];
        all.forEach(i => i !== now && a.push(i));
        return a;
      } else {
        return [now];
      }
    },
    [all, now]
  );

  return (
    <div className={s0.group}>
      <div className={s0.header}>
        <h2>
          <span>{name}</span>
          <span>{group.type}</span>
        </h2>
      </div>
      <div className={s0.list}>
        {list.map(proxyName => {
          return (
            <div
              className={s0.proxy}
              key={proxyName}
              onClick={() => actions.switchProxy(name, proxyName)}
            >
              <Proxy name={proxyName} now={proxyName === group.now} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

ProxyGroup2.propTypes = {
  name: PropTypes.string
};
