import { loadState, saveState, clearState } from '../misc/storage';

import { fetchConfigs } from './configs';
import { closeModal } from './modals';

export const getClashAPIConfig = s => s.app.clashAPIConfig;
export const getTheme = s => s.app.theme;
export const getSelectedChartStyleIndex = s => s.app.selectedChartStyleIndex;
export const getLatencyTestUrl = s => s.app.latencyTestUrl;

export function updateClashAPIConfig({ hostname: iHostname, port, secret }) {
  return async (dispatch, getState) => {
    const hostname = iHostname.trim().replace(/^http(s):\/\//, '');
    const clashAPIConfig = { hostname, port, secret };
    dispatch('appUpdateClashAPIConfig', s => {
      s.app.clashAPIConfig = clashAPIConfig;
    });
    // side effect
    saveState(getState().app);
    dispatch(closeModal('apiConfig'));
    dispatch(fetchConfigs(clashAPIConfig));
  };
}

const bodyElement = document.body;
function setTheme(theme = 'dark') {
  if (theme === 'dark') {
    bodyElement.classList.remove('light');
    bodyElement.classList.add('dark');
  } else {
    bodyElement.classList.remove('dark');
    bodyElement.classList.add('light');
  }
}

export function switchTheme() {
  return (dispatch, getState) => {
    const currentTheme = getTheme(getState());
    const theme = currentTheme === 'light' ? 'dark' : 'light';
    // side effect
    setTheme(theme);
    dispatch('storeSwitchTheme', s => {
      s.app.theme = theme;
    });
    // side effect
    saveState(getState().app);
  };
}

export function clearStorage() {
  clearState();
  try {
    window.location.reload();
  } catch (err) {
    // ignore
  }
}

export function selectChartStyleIndex(selectedChartStyleIndex) {
  return (dispatch, getState) => {
    dispatch('appSelectChartStyleIndex', s => {
      s.app.selectedChartStyleIndex = selectedChartStyleIndex;
    });
    // side effect
    saveState(getState().app);
  };
}

export function updateAppConfig(name, value) {
  return (dispatch, getState) => {
    dispatch('appUpdateAppConfig', s => {
      s.app[name] = value;
    });
    // side effect
    saveState(getState().app);
  };
}

// type Theme = 'light' | 'dark';
const defaultState = {
  clashAPIConfig: {
    hostname: '127.0.0.1',
    port: '7892',
    secret: ''
  },
  latencyTestUrl: 'http://www.gstatic.com/generate_204',
  selectedChartStyleIndex: 0,
  theme: 'dark'
};

function parseConfigQueryString() {
  const { search } = window.location;
  const collector = {};
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
  // TODO flat clashAPIConfig?

  const configQuery = parseConfigQueryString();
  if (configQuery.hostname) {
    s.clashAPIConfig.hostname = configQuery.hostname;
  }
  if (configQuery.port) {
    s.clashAPIConfig.port = configQuery.port;
  }
  if (configQuery.secret) {
    s.clashAPIConfig.secret = configQuery.secret;
  }
  // set initial theme
  setTheme(s.theme);
  return s;
}
