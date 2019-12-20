import React from 'react';
import cx from 'classnames';

import Proxy, { ProxySmall } from './Proxy';
import { SectionNameType } from './shared/Basic';

import s0 from './ProxyGroup.module.css';

import { switchProxy } from '../store/proxies';

const { memo, useCallback, useMemo } = React;

function ProxyGroup({ name, proxies, apiConfig, dispatch }) {
  const group = proxies[name];
  const { all, type, now } = group;

  const isSelectable = useMemo(() => type === 'Selector', [type]);

  const itemOnTapCallback = useCallback(
    proxyName => {
      if (!isSelectable) return;

      dispatch(switchProxy(apiConfig, name, proxyName));
      // switchProxyFn(name, proxyName);
    },
    [apiConfig, dispatch, name, isSelectable]
  );

  return (
    <div className={s0.group}>
      <div className={s0.header}>
        <SectionNameType name={name} type={group.type} />
      </div>
      <ProxyList
        all={all}
        now={now}
        isSelectable={isSelectable}
        itemOnTapCallback={itemOnTapCallback}
      />
    </div>
  );
}

type ProxyListProps = {
  all: string[],
  now?: string,
  isSelectable?: boolean,
  itemOnTapCallback?: string => void
};
export function ProxyList({
  all,
  now,
  isSelectable,
  itemOnTapCallback
}: ProxyListProps) {
  return (
    <div className={s0.list}>
      {all.map(proxyName => {
        const proxyClassName = cx(s0.proxy, {
          [s0.proxySelectable]: isSelectable
        });
        return (
          <div
            className={proxyClassName}
            key={proxyName}
            onClick={() => {
              if (!isSelectable || !itemOnTapCallback) return;
              itemOnTapCallback(proxyName);
            }}
          >
            <Proxy name={proxyName} now={proxyName === now} />
          </div>
        );
      })}
    </div>
  );
}

export function ProxyListSummaryView({
  all,
  now,
  isSelectable,
  itemOnTapCallback
}: ProxyListProps) {
  return (
    <div className={s0.list}>
      {all.map(proxyName => {
        const proxyClassName = cx(s0.proxy, {
          [s0.proxySelectable]: isSelectable
        });
        return (
          <div
            className={proxyClassName}
            key={proxyName}
            onClick={() => {
              if (!isSelectable || !itemOnTapCallback) return;
              itemOnTapCallback(proxyName);
            }}
          >
            <ProxySmall name={proxyName} now={proxyName === now} />
          </div>
        );
      })}
    </div>
  );
}

export default memo(ProxyGroup);
