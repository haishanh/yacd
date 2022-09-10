import { DispatchFn, GetStateFn, State, StateApp } from 'src/store/types';

import { ClashAPIConfig } from '$src/types';

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

function findClashAPIConfigIndex(
  getState: GetStateFn,
  { baseURL, secret, metaLabel }: ClashAPIConfig
) {
  const arr = getClashAPIConfigs(getState());
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x.baseURL === baseURL && x.secret === secret && x.metaLabel === metaLabel) return i;
  }
}

export function addClashAPIConfig(conf: ClashAPIConfig) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, conf);
    // already exists
    if (idx) return;

    const clashAPIConfig = { ...conf, addedAt: Date.now() };
    dispatch('addClashAPIConfig', (s) => {
      s.app.clashAPIConfigs.push(clashAPIConfig);
    });
    // side effect
    saveState(getState().app);
  };
}

export function removeClashAPIConfig(conf: ClashAPIConfig) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, conf);
    dispatch('removeClashAPIConfig', (s) => {
      s.app.clashAPIConfigs.splice(idx, 1);
    });
    // side effect
    saveState(getState().app);
  };
}

export function selectClashAPIConfig(conf: ClashAPIConfig) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const idx = findClashAPIConfigIndex(getState, conf);
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
export function updateClashAPIConfig(conf: ClashAPIConfig) {
  return async (dispatch: DispatchFn, getState: GetStateFn) => {
    const clashAPIConfig = conf;
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

function insertThemeColorMeta(color: string, media?: string) {
  const meta0 = document.createElement('meta');
  meta0.setAttribute('name', 'theme-color');
  meta0.setAttribute('content', color);
  if (media) meta0.setAttribute('media', media);
  document.head.appendChild(meta0);
}

function updateMetaThemeColor(theme: ThemeType) {
  const metas = Array.from(
    document.querySelectorAll('meta[name=theme-color]')
  ) as HTMLMetaElement[];
  let meta0: HTMLMetaElement;
  for (const m of metas) {
    if (!m.getAttribute('media')) {
      meta0 = m;
    } else {
      document.head.removeChild(m);
    }
  }

  if (theme === 'auto') {
    insertThemeColorMeta('#eeeeee', '(prefers-color-scheme: light)');
    insertThemeColorMeta('#202020', '(prefers-color-scheme: dark)');
    if (meta0) {
      document.head.removeChild(meta0);
    } else {
      return;
    }
  } else {
    const color = theme === 'light' ? '#eeeeee' : '#202020';
    if (!meta0) {
      insertThemeColorMeta(color);
    } else {
      meta0.setAttribute('content', color);
    }
  }
}

function setTheme(theme: ThemeType = 'dark') {
  if (theme === 'auto') {
    rootEl.setAttribute('data-theme', 'auto');
  } else if (theme === 'dark') {
    rootEl.setAttribute('data-theme', 'dark');
  } else {
    rootEl.setAttribute('data-theme', 'light');
  }
  updateMetaThemeColor(theme);
}

export function switchTheme(nextTheme = 'auto') {
  return (dispatch: DispatchFn, getState: GetStateFn) => {
    const currentTheme = getTheme(getState());
    if (currentTheme === nextTheme) return;
    // side effect
    setTheme(nextTheme as ThemeType);
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
      if (query.hostname.indexOf('http') === 0) {
        url.href = decodeURIComponent(query.hostname);
      } else {
        url.hostname = query.hostname;
      }
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
