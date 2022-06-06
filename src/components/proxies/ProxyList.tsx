import * as React from 'react';

import { Proxy, ProxySmall } from './Proxy';
import s from './ProxyList.module.scss';

type ProxyListProps = {
  all: string[];
  now?: string;
  isSelectable?: boolean;
  itemOnTapCallback?: (x: string) => void;
  show?: boolean;
};

export function ProxyList({ all, now, isSelectable, itemOnTapCallback }: ProxyListProps) {
  const proxies = all;

  return (
    <div className={s.list}>
      {proxies.map((proxyName) => {
        return (
          <Proxy
            key={proxyName}
            onClick={itemOnTapCallback}
            isSelectable={isSelectable}
            name={proxyName}
            now={proxyName === now}
          />
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
    <div className={s.listSummaryView}>
      {all.map((proxyName) => {
        return (
          <ProxySmall
            key={proxyName}
            onClick={itemOnTapCallback}
            isSelectable={isSelectable}
            name={proxyName}
            now={proxyName === now}
          />
        );
      })}
    </div>
  );
}
