import * as React from 'react';
import memoizeOne from 'memoize-one';
import { Zap } from 'react-feather';

import { connect, useStoreActions } from '../StateProvider';
import {
  DelayMapping,
  ProxiesMapping,
  NonProxyTypes,
  getProxies,
  switchProxy,
} from '../../store/proxies';
import {
  getCollapsibleIsOpen,
  getProxySortBy,
  getHideUnavailableProxies,
} from '../../store/app';
import CollapsibleSectionHeader from '../CollapsibleSectionHeader';
import Button from '../Button';
import { ProxyList, ProxyListSummaryView } from './ProxyList';

import s0 from './ProxyGroup.module.css';

const { createElement, useCallback, useMemo, useState } = React;

function ZapWrapper() {
  return (
    <div className={s0.zapWrapper}>
      <Zap size={16} />
    </div>
  );
}

function ProxyGroupImpl({ name, all, type, now, isOpen, apiConfig, dispatch }) {
  const isSelectable = useMemo(() => type === 'Selector', [type]);

  const {
    app: { updateCollapsibleIsOpen },
    proxies: { requestDelayForProxies },
  } = useStoreActions();

  const toggle = useCallback(() => {
    updateCollapsibleIsOpen('proxyGroup', name, !isOpen);
  }, [isOpen, updateCollapsibleIsOpen, name]);

  const itemOnTapCallback = useCallback(
    (proxyName) => {
      if (!isSelectable) return;
      dispatch(switchProxy(apiConfig, name, proxyName));
    },
    [apiConfig, dispatch, name, isSelectable]
  );

  const [isTestingLatency, setIsTestingLatency] = useState(false);
  const testLatency = useCallback(async () => {
    setIsTestingLatency(true);
    try {
      await requestDelayForProxies(apiConfig, all);
    } catch (err) {}
    setIsTestingLatency(false);
  }, [all, apiConfig, requestDelayForProxies]);

  return (
    <div className={s0.group}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CollapsibleSectionHeader
          name={name}
          type={type}
          toggle={toggle}
          qty={all.length}
          isOpen={isOpen}
        />
        <Button
          kind="minimal"
          onClick={testLatency}
          isLoading={isTestingLatency}
        >
          <ZapWrapper />
        </Button>
      </div>
      {createElement(isOpen ? ProxyList : ProxyListSummaryView, {
        all,
        now,
        isSelectable,
        itemOnTapCallback,
      })}
    </div>
  );
}

const getSortDelay = (d, proxyInfo) => {
  if (d && typeof d.number === 'number' && d.number > 0) {
    return d.number;
  }

  const type = proxyInfo && proxyInfo.type;
  if (type && NonProxyTypes.indexOf(type) > -1) return 999998;

  return 999999;
};

function filterAvailableProxies(list, delay) {
  return list.filter((name) => {
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

const ProxySortingFns = {
  Natural: (proxies: string[]) => proxies,
  LatencyAsc: (
    proxies: string[],
    delay: DelayMapping,
    proxyMapping?: ProxiesMapping
  ) => {
    return proxies.sort((a, b) => {
      const d1 = getSortDelay(delay[a], proxyMapping && proxyMapping[a]);
      const d2 = getSortDelay(delay[b], proxyMapping && proxyMapping[b]);
      return d1 - d2;
    });
  },
  LatencyDesc: (
    proxies: string[],
    delay: DelayMapping,
    proxyMapping?: ProxiesMapping
  ) => {
    return proxies.sort((a, b) => {
      const d1 = getSortDelay(delay[a], proxyMapping && proxyMapping[a]);
      const d2 = getSortDelay(delay[b], proxyMapping && proxyMapping[b]);
      return d2 - d1;
    });
  },
  NameAsc: (proxies: string[]) => {
    return proxies.sort();
  },
  NameDesc: (proxies: string[]) => {
    return proxies.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
  },
};

function filterAvailableProxiesAndSortImpl(
  all: string[],
  delay: DelayMapping,
  hideUnavailableProxies: boolean,
  proxySortBy: string,
  proxies?: ProxiesMapping
) {
  // all is freezed
  let filtered = [...all];
  if (hideUnavailableProxies) {
    filtered = filterAvailableProxies(all, delay);
  }
  return ProxySortingFns[proxySortBy](filtered, delay, proxies);
}

export const filterAvailableProxiesAndSort = memoizeOne(
  filterAvailableProxiesAndSortImpl
);

export const ProxyGroup = connect((s, { name, delay }) => {
  const proxies = getProxies(s);
  const collapsibleIsOpen = getCollapsibleIsOpen(s);
  const proxySortBy = getProxySortBy(s);
  const hideUnavailableProxies = getHideUnavailableProxies(s);

  const group = proxies[name];
  const { all, type, now } = group;
  return {
    all: filterAvailableProxiesAndSort(
      all,
      delay,
      hideUnavailableProxies,
      proxySortBy,
      proxies
    ),
    type,
    now,
    isOpen: collapsibleIsOpen[`proxyGroup:${name}`],
  };
})(ProxyGroupImpl);
