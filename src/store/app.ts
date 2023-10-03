import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { loadState } from '$src/misc/storage';
import { trimTrailingSlash } from '$src/misc/utils';
import { StateApp, ThemeType } from '$src/store/types';
import { ClashAPIConfig } from '$src/types';

let iState: StateApp;

const STORAGE_KEY = {
  darkModePureBlackToggle: 'yacd_darkModePureBlackToggle',
};

const rootEl = document.querySelector('html');

const defaultClashAPIConfig = {
  baseURL: document.getElementById('app')?.getAttribute('data-base-url') ?? 'http://127.0.0.1:9090',
  secret: '',
  addedAt: 0,
};

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

export const selectedClashAPIConfigIndexAtom = atom(initialState().selectedClashAPIConfigIndex);
export const clashAPIConfigsAtom = atom(initialState().clashAPIConfigs);
export const latencyTestUrlAtom = atom(initialState().latencyTestUrl);
export const selectedChartStyleIndexAtom = atom(initialState().selectedChartStyleIndex);
export const themeAtom = atom(initialState().theme);
export const collapsibleIsOpenAtom = atom(initialState().collapsibleIsOpen);
export const proxySortByAtom = atom(initialState().proxySortBy);
export const hideUnavailableProxiesAtom = atom(initialState().hideUnavailableProxies);
export const autoCloseOldConnsAtom = atom(initialState().autoCloseOldConns);
export const logStreamingPausedAtom = atom(initialState().logStreamingPaused);

// prettier-ignore
export const darkModePureBlackToggleAtom = atomWithStorage(STORAGE_KEY.darkModePureBlackToggle, false);

// hooks

export function useApiConfig() {
  const [apiConfigs] = useAtom(clashAPIConfigsAtom);
  const [idx] = useAtom(selectedClashAPIConfigIndexAtom);
  return apiConfigs[idx];
}

export function findClashAPIConfigIndex(arr: ClashAPIConfig[], needle: ClashAPIConfig) {
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (
      x.baseURL === needle.baseURL &&
      x.secret === needle.secret &&
      x.metaLabel === needle.metaLabel
    ) {
      return i;
    }
  }
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

export function setTheme(theme: ThemeType = 'dark') {
  if (theme === 'auto') {
    rootEl.setAttribute('data-theme', 'auto');
  } else if (theme === 'dark') {
    rootEl.setAttribute('data-theme', 'dark');
  } else {
    rootEl.setAttribute('data-theme', 'light');
  }
  updateMetaThemeColor(theme);
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
