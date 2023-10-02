import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  ClashAPIConfigWithAddedAt,
  DispatchFn,
  GetStateFn,
  State,
  StateApp,
} from 'src/store/types';

import { ClashAPIConfig } from '$src/types';

import { loadState, saveState } from '../misc/storage';
import { debounce, trimTrailingSlash } from '../misc/utils';
import { fetchConfigs } from './configs';
import { closeModal } from './modals';

let iState: StateApp;

const STORAGE_KEY = {
  darkModePureBlackToggle: 'yacd_darkModePureBlackToggle',
};

const rootEl = document.querySelector('html');
type ThemeType = 'dark' | 'light' | 'auto';

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

const CONFIG_QUERY_PARAMS = ['hostname', 'port', 'secret', 'theme'];

// atoms

export const selectedClashAPIConfigIndexAtom = atom<number>(initialState().selectedClashAPIConfigIndex);
export const clashAPIConfigsAtom = atom<ClashAPIConfigWithAddedAt[]>(initialState().clashAPIConfigs);
export const selectedChartStyleIndexAtom = atom(initialState().selectedChartStyleIndex);
export const latencyTestUrlAtom = atom(initialState().latencyTestUrl);

// hooks

export function useApiConfig() {
  const [apiConfigs] = useAtom(clashAPIConfigsAtom);
  const [idx] = useAtom(selectedClashAPIConfigIndexAtom);
  return apiConfigs[idx];
}

export const getTheme = (s: State) => s.app.theme;
export const getCollapsibleIsOpen = (s: State) => s.app.collapsibleIsOpen;
export const getProxySortBy = (s: State) => s.app.proxySortBy;
export const getHideUnavailableProxies = (s: State) => s.app.hideUnavailableProxies;
export const getAutoCloseOldConns = (s: State) => s.app.autoCloseOldConns;
export const getLogStreamingPaused = (s: State) => s.app.logStreamingPaused;

const saveStateDebounced = debounce(saveState, 600);

export function findClashAPIConfigIndexTmp(
  arr: ClashAPIConfigWithAddedAt[],
  { baseURL, secret, metaLabel }: ClashAPIConfig,
) {
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x.baseURL === baseURL && x.secret === secret && x.metaLabel === metaLabel) return i;
  }
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

function insertThemeColorMeta(color: string, media?: string) {
  const meta0 = document.createElement('meta');
  meta0.setAttribute('name', 'theme-color');
  meta0.setAttribute('content', color);
  if (media) meta0.setAttribute('media', media);
  document.head.appendChild(meta0);
}

function updateMetaThemeColor(theme: ThemeType) {
  const metas = Array.from(
    document.querySelectorAll('meta[name=theme-color]'),
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

function parseConfigQueryString() {
  const { search } = window.location;
  const collector: Record<string, string> = {};
  const sp = new URLSearchParams(search);
  let shouldUpdateAddressBar = false;
  if (typeof search !== 'string' || search === '') {
    return [collector, sp, shouldUpdateAddressBar] as const;
  }
  for (const key of CONFIG_QUERY_PARAMS) {
    const v = sp.get(key);
    if (v) {
      shouldUpdateAddressBar = true;
      collector[key] = v;
      // sp can contain secret etc. and we better remove these
      sp.delete(key);
    }
  }
  return [collector, sp, shouldUpdateAddressBar] as const;
}

export function initialState(): StateApp {
  if (iState) return iState;

  let s = loadState();
  s = { ...defaultState, ...s };
  const [query, sp, shouldUpdateAddressBar] = parseConfigQueryString();
  if (shouldUpdateAddressBar && history?.replaceState) {
    const target = location.pathname + location.hash + (sp.size > 0 ? `?${sp}` : '');
    history.replaceState(null, '', target);
  }
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

  iState = s;
  return s;
}

export const darkModePureBlackToggleAtom = atomWithStorage(
  STORAGE_KEY.darkModePureBlackToggle,
  false,
);
