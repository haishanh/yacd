import * as React from 'react';
import memoizeOne from 'memoize-one';
import { Zap } from 'react-feather';

import { connect, useStoreActions } from '../StateProvider';
import { getProxies } from '../../store/proxies';
import {
  getCollapsibleIsOpen,
  getProxySortBy,
  getHideUnavailableProxies,
} from '../../store/app';
import { switchProxy } from '../../store/proxies';
import CollapsibleSectionHeader from '../CollapsibleSectionHeader';
import Button from '../Button';
import { ProxyList, ProxyListSummaryView } from './ProxyList';

import s0 from './ProxyGroup.module.css';

const { useCallback, useMemo, useState } = React;

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
  Natural: (proxies, _delay) => {
    return proxies;
  },
  LatencyAsc: (proxies, delay) => {
    return proxies.sort((a, b) => {
      const d1 = getSortDelay(delay[a], 999999);
      const d2 = getSortDelay(delay[b], 999999);
      return d1 - d2;
    });
  },
  LatencyDesc: (proxies, delay) => {
    return proxies.sort((a, b) => {
      const d1 = getSortDelay(delay[a], 999999);
      const d2 = getSortDelay(delay[b], 999999);
      return d2 - d1;
    });
  },
  NameAsc: (proxies) => {
    return proxies.sort();
  },
  NameDesc: (proxies) => {
    return proxies.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
  },
};

function filterAvailableProxiesAndSortImpl(
  all,
  delay,
  hideUnavailableProxies,
  proxySortBy
) {
  // all is freezed
  let filtered = [...all];
  if (hideUnavailableProxies) {
    filtered = filterAvailableProxies(all, delay);
  }
  return ProxySortingFns[proxySortBy](filtered, delay);
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
      proxySortBy
    ),
    type,
    now,
    isOpen: collapsibleIsOpen[`proxyGroup:${name}`],
  };
})(ProxyGroupImpl);
