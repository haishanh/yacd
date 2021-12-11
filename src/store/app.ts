import { DispatchFn, GetStateFn, State, StateApp } from 'src/store/types';

import { loadState, saveState } from '../misc/storage';
import { debounce, trimTrailingSlash } from '../misc/utils';
import { fetchConfigs } from './configs';
import { closeModal } from './modals';

export const getClashAPIConfig = (s: State) => {
  const idx = s.app.selectedClashAPIConfigIndex;
  return s.app.clashAPIConfigs[idx];
};
export const getSelectedClashAPIConfigIndex = (s: State) => s.app.selectedClashAPIConfigIndex;
export const getClashAPIConfigs = (s: State) => s.app.clashAPIConfigs;
export const getTheme = (s: State) => s.app.theme;
export const getSelectedChartStyleIndex = (s: State) => s.app.selectedChartStyleIndex;
export const getLatencyTestUrl = (s: State) => s.app.latencyTestUrl;
export const getCollapsibleIsOpen = (s: State) => s.app.collapsibleIsOpen;
export const getProxySortBy = (s: State) => s.app.proxySortBy;
export const getHideUnavailableProxies = (s: State) => s.app.hideUnavailableProxies;
export const getAutoCloseOldConns = (s: State) => s.app.autoCloseOldConns;
export const getLogStreamingPaused = (s: State) => s.app.logStreamingPaused;

const saveStateDebounced = debounce(saveState, 600);

// @ts-expect-error ts-migrate(7030) FIXME: Not all code paths return a value.
function findClashAPIConfigIndex(getState: GetStateFn, { baseURL, secret }) {
  const arr = getClashAPIConfigs(getState());
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x.baseURL === baseURL && x.secret === secret) return i;
  }
}

export function addClashAPIConfig({ baseURL, secret }) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, { baseURL, secret });
    // already exists
    if (idx) return;

    const clashAPIConfig = { baseURL, secret, addedAt: Date.now() };
    dispatch('addClashAPIConfig', (s) => {
      s.app.clashAPIConfigs.push(clashAPIConfig);
    });
    // side effect
    saveState(getState().app);
  };
}

export function removeClashAPIConfig({ baseURL, secret }) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, { baseURL, secret });
    dispatch('removeClashAPIConfig', (s) => {
      s.app.clashAPIConfigs.splice(idx, 1);
    });
    // side effect
    saveState(getState().app);
  };
}

export function selectClashAPIConfig({ baseURL, secret }) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, { baseURL, secret });
    const curr = getSelectedClashAPIConfigIndex(getState());
    if (curr !== idx) {
      dispatch('selectClashAPIConfig', (s) => {
        s.app.selectedClashAPIConfigIndex = idx;
      });
    }
    // side effect
    saveState(getState().app);

    // manual clean up is too complex
    // we just reload the app
    try {
      window.location.reload();
    } catch (err) {
      // ignore
    }
  };
}

// unused
export function updateClashAPIConfig({ baseURL, secret }) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const clashAPIConfig = { baseURL, secret };
    dispatch('appUpdateClashAPIConfig', (s) => {
      s.app.clashAPIConfigs[0] = clashAPIConfig;
    });
    // side effect
    saveState(getState().app);
    dispatch(closeModal('apiConfig'));
    dispatch(fetchConfigs(clashAPIConfig));
  };
}

const rootEl = document.querySelector('html');
type ThemeType = 'dark' | 'light' | 'auto';
function setTheme(theme: ThemeType = 'dark') {
  if (theme === 'auto') {
    rootEl.setAttribute('data-theme', 'auto');
  } else if (theme === 'dark') {
    rootEl.setAttribute('data-theme', 'dark');
  } else {
    rootEl.setAttribute('data-theme', 'light');
  }
}

export function switchTheme() {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    const currentTheme = getTheme(getState());
    let nextTheme: ThemeType = 'auto';
    switch (currentTheme) {
      case 'light':
        nextTheme = 'dark';
        break;
      case 'dark':
        nextTheme = 'auto';
        break;
      case 'auto':
        nextTheme = 'light';
        break;
    }

    // side effect
    setTheme(nextTheme);
    dispatch('storeSwitchTheme', (s) => {
      s.app.theme = nextTheme;
    });
    // side effect
    saveState(getState().app);
  };
}

export function selectChartStyleIndex(selectedChartStyleIndex: number | string) {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    dispatch('appSelectChartStyleIndex', (s) => {
      s.app.selectedChartStyleIndex = Number(selectedChartStyleIndex);
    });
    // side effect
    saveState(getState().app);
  };
}

export function updateAppConfig(name: string, value: unknown) {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    dispatch('appUpdateAppConfig', (s) => {
      s.app[name] = value;
    });
    // side effect
    saveState(getState().app);
  };
}

export function updateCollapsibleIsOpen(prefix: string, name: string, v: boolean) {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    dispatch('updateCollapsibleIsOpen', (s: State) => {
      s.app.collapsibleIsOpen[`${prefix}:${name}`] = v;
    });
    // side effect
    saveStateDebounced(getState().app);
  };
}

const defaultClashAPIConfig = {
  baseURL: document.getElementById('app')?.getAttribute('data-base-url') ?? 'http://127.0.0.1:9090',
  secret: '',
  addedAt: 0,
};
// type Theme = 'light' | 'dark';
const defaultState: StateApp = {
  selectedClashAPIConfigIndex: 0,
  clashAPIConfigs: [defaultClashAPIConfig],

  latencyTestUrl: 'http://www.gstatic.com/generate_204',
  selectedChartStyleIndex: 0,
  theme: 'dark',

  // type { [string]: boolean }
  collapsibleIsOpen: {},
  // how proxies are sorted in a group or provider
  proxySortBy: 'Natural',
  hideUnavailableProxies: false,
  autoCloseOldConns: false,
  logStreamingPaused: false,
};

function parseConfigQueryString() {
  const { search } = window.location;
  const collector: Record<string, string> = {};
  if (typeof search !== 'string' || search === '') return collector;
  const qs = search.replace(/^\?/, '').split('&');
  for (let i = 0; i < qs.length; i++) {
    const [k, v] = qs[i].split('=');
    collector[k] = encodeURIComponent(v);
  }
  return collector;
}

export function initialState() {
  let s = loadState();
  s = { ...defaultState, ...s };
  const query = parseConfigQueryString();

  const conf = s.clashAPIConfigs[s.selectedClashAPIConfigIndex];
  if (conf) {
    const url = new URL(conf.baseURL);
    if (query.hostname) {
      url.hostname = query.hostname;
    }
    if (query.port) {
      url.port = query.port;
    }
    // url.href is a stringifier and it appends a trailing slash
    // that is not we want
    conf.baseURL = trimTrailingSlash(url.href);
    if (query.secret) {
      conf.secret = query.secret;
    }
  }

  if (query.theme === 'dark' || query.theme === 'light') {
    s.theme = query.theme;
  }
  // set initial theme
  setTheme(s.theme);
  return s;
}
