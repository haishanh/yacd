import { useAtom } from 'jotai';
import * as React from 'react';
import {
  // types
  NonProxyTypes,
  // atom
  proxyFilterTextAtom,
} from 'src/store/proxies';
import { DelayMapping, ProxiesMapping, ProxyDelayItem, ProxyItem } from 'src/store/types';

const { useMemo } = React;

function filterAvailableProxies(list: string[], delay: DelayMapping) {
  return list.filter((name) => {
    const d = delay[name];
    if (d === undefined) {
      return true;
    }
    if ('number' in d && d.number === 0) {
      return false;
    } else {
      return true;
    }
  });
}

const getSortDelay = (d: undefined | ProxyDelayItem, proxyInfo: ProxyItem) => {
  if (d && 'number' in d && d.number > 0) {
    return d.number;
  }

  const type = proxyInfo && proxyInfo.type;
  if (type && NonProxyTypes.indexOf(type) > -1) return -1;

  return 999999;
};

const ProxySortingFns = {
  Natural: (proxies: string[]) => proxies,
  LatencyAsc: (proxies: string[], delay: DelayMapping, proxyMapping?: ProxiesMapping) => {
    return proxies.sort((a, b) => {
      const d1 = getSortDelay(delay[a], proxyMapping && proxyMapping[a]);
      const d2 = getSortDelay(delay[b], proxyMapping && proxyMapping[b]);
      return d1 - d2;
    });
  },
  LatencyDesc: (proxies: string[], delay: DelayMapping, proxyMapping?: ProxiesMapping) => {
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

function filterStrArr(all: string[], searchText: string) {
  const segments = searchText
    .toLowerCase()
    .split(' ')
    .map((x) => x.trim())
    .filter((x) => !!x);

  if (segments.length === 0) return all;

  return all.filter((name) => {
    let i = 0;
    for (; i < segments.length; i++) {
      const seg = segments[i];
      if (name.toLowerCase().indexOf(seg) > -1) return true;
    }
    return false;
  });
}

function filterAvailableProxiesAndSort(
  all: string[],
  delay: DelayMapping,
  hideUnavailableProxies: boolean,
  filterText: string,
  proxySortBy: string,
  proxies?: ProxiesMapping,
) {
  // all is freezed
  let filtered = [...all];
  if (hideUnavailableProxies) {
    filtered = filterAvailableProxies(all, delay);
  }

  if (typeof filterText === 'string' && filterText !== '') {
    filtered = filterStrArr(filtered, filterText);
  }
  return ProxySortingFns[proxySortBy](filtered, delay, proxies);
}

export function useFilteredAndSorted(
  all: string[],
  delay: DelayMapping,
  hideUnavailableProxies: boolean,
  proxySortBy: string,
  proxies?: ProxiesMapping,
) {
  const [filterText] = useAtom(proxyFilterTextAtom);
  return useMemo(
    () =>
      filterAvailableProxiesAndSort(
        all,
        delay,
        hideUnavailableProxies,
        filterText,
        proxySortBy,
        proxies,
      ),
    [all, delay, hideUnavailableProxies, filterText, proxySortBy, proxies],
  );
}
