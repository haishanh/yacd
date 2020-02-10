import React from 'react';
import cx from 'classnames';
import memoizeOne from 'memoize-one';

import { connect } from './StateProvider';
import { getProxies, getRtFilterSwitch } from '../store/proxies';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';
import Proxy, { ProxySmall } from './Proxy';
import { useToggle } from '../hooks/basic';

import s0 from './ProxyGroup.module.css';

import { switchProxy } from '../store/proxies';

const { useCallback, useMemo } = React;

function ProxyGroup({ name, all, type, now, apiConfig, dispatch }) {
  const isSelectable = useMemo(() => type === 'Selector', [type]);
  const [isOpen, toggle] = useToggle(true);
  const itemOnTapCallback = useCallback(
    proxyName => {
      if (!isSelectable) return;
      dispatch(switchProxy(apiConfig, name, proxyName));
    },
    [apiConfig, dispatch, name, isSelectable]
  );

  return (
    <div className={s0.group}>
      <CollapsibleSectionHeader
        name={name}
        type={type}
        toggle={toggle}
        qty={all.length}
        isOpen={isOpen}
      />
      {isOpen ? (
        <ProxyList
          all={all}
          now={now}
          isSelectable={isSelectable}
          itemOnTapCallback={itemOnTapCallback}
        />
      ) : (
        <ProxyListSummaryView all={all} />
      )}
    </div>
  );
}

type ProxyListProps = {
  all: string[],
  now?: string,
  isSelectable?: boolean,
  itemOnTapCallback?: string => void,
  show?: boolean
};
export function ProxyList({
  all,
  now,
  isSelectable,
  itemOnTapCallback,
  sortedAll
}: ProxyListProps) {
  const proxies = sortedAll || all;

  return (
    <div className={s0.list}>
      {proxies.map(proxyName => {
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

const getSortDelay = (d, w) => {
  if (d === undefined) {
    return 0;
  }
  if (!d.error && d.number > 0) {
    return d.number;
  }

  return w;
};

function filterAvailableProxies(list, delay) {
  return list.filter(name => {
    const d = delay[name];
    if (d === undefined) {
      return true;
    }
    if (d.error || d.number === 0) {
      return false;
    } else {
      return true;
    }
  });
}

function filterAvailableProxiesAndSortImpl(all, delay, filterByRt) {
  // all is freezed
  let filtered = [...all];
  if (filterByRt) {
    filtered = filterAvailableProxies(all, delay);
  }

  return filtered.sort((first, second) => {
    const d1 = getSortDelay(delay[first], 999999);
    const d2 = getSortDelay(delay[second], 999999);
    return d1 - d2;
  });
}
export const filterAvailableProxiesAndSort = memoizeOne(
  filterAvailableProxiesAndSortImpl
);

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

export default connect((s, { name, delay }) => {
  const proxies = getProxies(s);
  const filterByRt = getRtFilterSwitch(s);
  const group = proxies[name];
  const { all, type, now } = group;
  return {
    all: filterAvailableProxiesAndSort(all, delay, filterByRt),
    type,
    now
  };
})(ProxyGroup);
