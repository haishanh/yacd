import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useActions, useStoreState } from 'm/store';

import Proxy from 'c/Proxy';

import s0 from './ProxyGroup.module.scss';

import { getProxies, switchProxy } from 'd/proxies';

const mapStateToProps = s => ({
  proxies: getProxies(s)
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
          const isSelectable = group.type === 'Selector';
          const proxyClassName = cx(s0.proxy, {
            [s0.proxySelectable]: isSelectable
          });
          return (
            <div
              className={proxyClassName}
              key={proxyName}
              onClick={() => {
                if (!isSelectable) return;
                actions.switchProxy(name, proxyName);
              }}
            >
              <Proxy
                isSelectable={isSelectable}
                name={proxyName}
                now={proxyName === group.now}
              />
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
