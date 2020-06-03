import * as React from 'react';

import cx from 'clsx';

import { Proxy, ProxySmall } from './Proxy';

import s from './ProxyList.module.css';

type ProxyListProps = {
  all: string[];
  now?: string;
  isSelectable?: boolean;
  itemOnTapCallback?: (x: string) => void;
  show?: boolean;
};

export function ProxyList({
  all,
  now,
  isSelectable,
  itemOnTapCallback,
}: ProxyListProps) {
  const proxies = all;

  return (
    <div className={s.list}>
      {proxies.map((proxyName) => {
        const proxyClassName = cx(s.proxy, {
          [s.proxySelectable]: isSelectable,
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
  itemOnTapCallback,
}: ProxyListProps) {
  return (
    <div className={s.list}>
      {all.map((proxyName) => {
        const proxyClassName = cx(s.proxy, {
          [s.proxySelectable]: isSelectable,
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
