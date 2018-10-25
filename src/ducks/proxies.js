import { createSelector } from 'reselect';
import * as proxiesAPI from 'a/proxies';

// see all types:
// https://github.com/Dreamacro/clash/blob/master/constant/adapters.go

const ProxyTypeBuiltin = ['DIRECT', 'GLOBAL', 'REJECT'];
const ProxyGroupTypes = ['Fallback', 'URLTest', 'Selector'];

export const getProxies = s => s.proxies.proxies;
export const getDelay = s => s.proxies.delay;
export const getProxyGroupNames = s => s.proxies.groupNames;
export const getUserProxies = createSelector(getProxies, proxies => {
  let o = {};
  for (const prop in proxies) {
    if (ProxyTypeBuiltin.indexOf(prop) < 0) {
      o[prop] = proxies[prop];
    }
  }
  return o;
});

const CompletedFetchProxies = 'proxies/CompletedFetchProxies';
const OptimisticSwitchProxy = 'proxies/OptimisticSwitchProxy';
const CompletedRequestDelayForProxy = 'proxies/CompletedRequestDelayForProxy';

function retrieveGroupNamesFrom(proxies) {
  const groupNames = [];
  for (const prop in proxies) {
    // not builtin proxy
    if (ProxyTypeBuiltin.indexOf(prop) < 0) {
      const p = proxies[prop];
      // is group
      if (ProxyGroupTypes.indexOf(p.type) >= 0) {
        groupNames.push(prop);
      }
    }
  }
  return groupNames;
}

export function fetchProxies() {
  return async (dispatch, getState) => {
    // TODO handle errors

    const proxiesCurr = getProxies(getState());
    // TODO this is too aggressive...
    if (Object.keys(proxiesCurr).length > 0) return;

    // TODO show loading animation?
    const json = await proxiesAPI.fetchProxies();
    let { proxies = {} } = json;

    const groupNames = retrieveGroupNamesFrom(proxies);

    dispatch({
      type: CompletedFetchProxies,
      payload: { proxies, groupNames }
    });
    dispatch(requestDelayAll());
  };
}

export function switchProxy(name1, name2) {
  return async (dispatch, getState) => {
    // TODO display error message
    proxiesAPI
      .requestToSwitchProxy(name1, name2)
      .then(
        res => {
          if (res.ok === false) {
            console.log('failed to swith proxy', res.statusText);
          }
        },
        err => {
          console.log(err, 'failed to swith proxy');
        }
      )
      .then(() => {
        // fetchProxies again
        dispatch(fetchProxies());
      });
    // optimistic UI update
    const proxiesCurr = getProxies(getState());
    const proxiesNext = { ...proxiesCurr };
    if (proxiesNext[name1] && proxiesNext[name1].now) {
      proxiesNext[name1].now = name2;
    }
    dispatch({
      type: OptimisticSwitchProxy,
      payload: { proxies: proxiesNext }
    });
  };
}

function requestDelayForProxyOnce(name) {
  return async (dispatch, getState) => {
    const res = await proxiesAPI.requestDelayForProxy(name);
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

    dispatch({
      type: CompletedRequestDelayForProxy,
      payload: { delay: delayNext }
    });
  };
}

export function requestDelayForProxy(name) {
  return async dispatch => {
    await dispatch(requestDelayForProxyOnce(name));
    await dispatch(requestDelayForProxyOnce(name));
    await dispatch(requestDelayForProxyOnce(name));
  };
}

export function requestDelayAll() {
  return async (dispatch, getState) => {
    const state = getState();
    const proxies = getProxies(state);
    const keys = Object.keys(proxies);
    const proxyNames = [];
    keys.forEach(k => {
      if (proxies[k].type === 'Vmess' || proxies[k].type === 'Shadowsocks') {
        proxyNames.push(k);
      }
    });
    await Promise.all(proxyNames.map(p => dispatch(requestDelayForProxy(p))));
  };
}

const initialState = {
  proxies: {},
  delay: {},
  groupNames: []
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CompletedRequestDelayForProxy:
    case OptimisticSwitchProxy:
    case CompletedFetchProxies: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
