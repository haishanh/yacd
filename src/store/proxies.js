import * as proxiesAPI from '../api/proxies';
import { getLatencyTestUrl } from './app';

// eslint-disable-next-line no-unused-vars
type ProxyProvider = {
  name: string,
  type: 'Proxy',
  updatedAt: string,
  vehicleType: 'HTTP' | 'File' | 'Compatible',
  proxies: Array<{
    history: Array<{ time: string, delay: number }>,
    name: string,
    // Shadowsocks, Http ...
    type: string
  }>
};

// see all types:
// https://github.com/Dreamacro/clash/blob/master/constant/adapters.go

// const ProxyTypeBuiltin = ['DIRECT', 'GLOBAL', 'REJECT'];
// const ProxyGroupTypes = ['Fallback', 'URLTest', 'Selector', 'LoadBalance'];

// const ProxyTypes = ['Shadowsocks', 'Snell', 'Socks5', 'Http', 'Vmess'];

const NonProxyTypes = [
  'Direct',
  'Fallback',
  'Reject',
  'Selector',
  'URLTest',
  'LoadBalance',
  'Unknown'
];

export const getProxies = s => s.proxies.proxies;
export const getDelay = s => s.proxies.delay;
export const getRtFilterSwitch = s => s.proxies.filterZeroRT;
export const getProxyGroupNames = s => s.proxies.groupNames;
export const getProxyProviders = s => s.proxies.proxyProviders || [];
export const getDangleProxyNames = s => s.proxies.dangleProxyNames;

export function fetchProxies(apiConfig) {
  return async (dispatch, getState) => {
    const [proxiesData, providersData] = await Promise.all([
      proxiesAPI.fetchProxies(apiConfig),
      proxiesAPI.fetchProviderProxies(apiConfig)
    ]);

    const [proxyProviders, providerProxies] = formatProxyProviders(
      providersData.providers
    );
    const proxies = { ...providerProxies, ...proxiesData.proxies };
    const [groupNames, proxyNames] = retrieveGroupNamesFrom(proxies);

    const delayPrev = getDelay(getState());
    const delayNext = { ...delayPrev };

    for (let i = 0; i < proxyNames.length; i++) {
      const name = proxyNames[i];
      const { history } = proxies[name] || { history: [] };
      const h = history[history.length - 1];
      if (h) {
        const ret = { error: '' };
        if (h.delay === 0) {
          ret.error = 'LikelyTimeout';
        } else {
          ret.number = h.delay;
        }
        delayNext[name] = ret;
      }
    }

    // proxies that are not from a provider
    const dangleProxyNames = [];
    for (const v of proxyNames) {
      if (!providerProxies[v]) dangleProxyNames.push(v);
    }

    dispatch('store/proxies#fetchProxies', s => {
      s.proxies.proxies = proxies;
      s.proxies.groupNames = groupNames;
      s.proxies.delay = delayNext;
      s.proxies.proxyProviders = proxyProviders;
      s.proxies.dangleProxyNames = dangleProxyNames;
    });
  };
}

export function updateProviderByName(apiConfig, name) {
  return async dispatch => {
    try {
      await proxiesAPI.updateProviderByName(apiConfig, name);
    } catch (x) {
      // ignore
    }
    // should be optimized
    // but ¯\_(ツ)_/¯
    dispatch(fetchProxies(apiConfig));
  };
}

async function healthcheckProviderByNameInternal(apiConfig, name) {
  try {
    await proxiesAPI.healthcheckProviderByName(apiConfig, name);
  } catch (x) {
    // ignore
  }
}

export function healthcheckProviderByName(apiConfig, name) {
  return async dispatch => {
    await healthcheckProviderByNameInternal(apiConfig, name);
    // should be optimized
    // but ¯\_(ツ)_/¯
    await dispatch(fetchProxies(apiConfig));
  };
}

export function switchProxy(apiConfig, name1, name2) {
  return async dispatch => {
    proxiesAPI
      .requestToSwitchProxy(apiConfig, name1, name2)
      .then(
        res => {
          if (res.ok === false) {
            // eslint-disable-next-line no-console
            console.log('failed to swith proxy', res.statusText);
          }
        },
        err => {
          // eslint-disable-next-line no-console
          console.log(err, 'failed to swith proxy');
        }
      )
      .then(() => {
        dispatch(fetchProxies(apiConfig));
      });
    // optimistic UI update
    dispatch('store/proxies#switchProxy', s => {
      const proxies = s.proxies.proxies;
      if (proxies[name1] && proxies[name1].now) {
        proxies[name1].now = name2;
      }
    });
  };
}

function requestDelayForProxyOnce(apiConfig, name) {
  return async (dispatch, getState) => {
    const latencyTestUrl = getLatencyTestUrl(getState());
    const res = await proxiesAPI.requestDelayForProxy(
      apiConfig,
      name,
      latencyTestUrl
    );
    let error = '';
    if (res.ok === false) {
      error = res.statusText;
    }
    const { delay } = await res.json();

    const delayPrev = getDelay(getState());
    const delayNext = {
      ...delayPrev,
      [name]: {
        error,
        number: delay
      }
    };

    dispatch('requestDelayForProxyOnce', s => {
      s.proxies.delay = delayNext;
    });
  };
}

export function requestDelayForProxy(apiConfig, name) {
  return async dispatch => {
    await dispatch(requestDelayForProxyOnce(apiConfig, name));
  };
}

export function requestDelayAll(apiConfig) {
  return async (dispatch, getState) => {
    const proxyNames = getDangleProxyNames(getState());
    await Promise.all(
      proxyNames.map(p => dispatch(requestDelayForProxy(apiConfig, p)))
    );
    const proxyProviders = getProxyProviders(getState());
    // one by one
    for (const p of proxyProviders) {
      await healthcheckProviderByNameInternal(apiConfig, p.name);
    }
    await dispatch(fetchProxies(apiConfig));
  };
}

export function toggleUnavailableProxiesFilter() {
  return (dispatch, getState) => {
    const preState = getRtFilterSwitch(getState());
    dispatch('store/proxies#toggleUnavailableProxiesFilter', s => {
      s.proxies.filterZeroRT = !preState;
    });
  };
}

function retrieveGroupNamesFrom(proxies) {
  let groupNames = [];
  let globalAll;
  let proxyNames = [];
  for (const prop in proxies) {
    const p = proxies[prop];
    if (p.all && Array.isArray(p.all)) {
      groupNames.push(prop);
      if (prop === 'GLOBAL') {
        globalAll = p.all;
      }
    } else if (NonProxyTypes.indexOf(p.type) < 0) {
      proxyNames.push(prop);
    }
  }
  if (globalAll) {
    // Put GLOBAL in the end
    globalAll.push('GLOBAL');
    // Sort groups according to its index in GLOBAL group
    groupNames = groupNames
      .map(name => [globalAll.indexOf(name), name])
      .sort((a, b) => a[0] - b[0])
      .map(group => group[1]);
  }
  return [groupNames, proxyNames];
}

function formatProxyProviders(providersInput) {
  const keys = Object.keys(providersInput);
  const providers = [];
  const proxies = {};
  for (let i = 0; i < keys.length; i++) {
    const provider = providersInput[keys[i]];
    if (provider.name === 'default' || provider.vehicleType === 'Compatible')
      continue;
    const proxiesArr = provider.proxies;
    const names = [];
    for (let j = 0; j < proxiesArr.length; j++) {
      const proxy = proxiesArr[j];
      proxies[proxy.name] = proxy;
      names.push(proxy.name);
    }

    // mutate directly
    provider.proxies = names;
    providers.push(provider);
  }

  return [providers, proxies];
}

export const initialState = {
  proxies: {},
  delay: {},
  groupNames: [],
  filterZeroRT: false
};
