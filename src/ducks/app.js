import { loadState, saveState, clearState } from '../misc/storage';
import { fetchConfigs } from './configs';
import { closeModal } from './modals';

const UpdateClashAPIConfig = 'app/UpdateClashAPIConfig';
const SwitchTheme = 'app/SwitchTheme';
const SELECT_CHART_STYLE_INDEX = 'app/SELECT_CHART_STYLE_INDEX';

export const getClashAPIConfig = s => s.app.clashAPIConfig;
export const getTheme = s => s.app.theme;
export const getSelectedChartStyleIndex = s => s.app.selectedChartStyleIndex;

export function updateClashAPIConfig({ hostname: iHostname, port, secret }) {
  return async (dispatch, getState) => {
    const hostname = iHostname.trim().replace(/^http(s):\/\//, '');
    dispatch({
      type: UpdateClashAPIConfig,
      payload: { hostname, port, secret }
    });

    // side effect
    saveState(getState().app);

    dispatch(closeModal('apiConfig'));
    dispatch(fetchConfigs());
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
    dispatch({ type: SwitchTheme, payload: { theme } });
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
    dispatch({
      type: SELECT_CHART_STYLE_INDEX,
      payload: {
        selectedChartStyleIndex
      }
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

function getInitialState() {
  let s = loadState();
  s = { ...defaultState, ...s };
  // TODO flat clashAPIConfig?

  const configQuery = parseConfigQueryString();
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

export default function reducer(state = getInitialState(), { type, payload }) {
  switch (type) {
    case UpdateClashAPIConfig: {
      return { ...state, clashAPIConfig: { ...payload } };
    }

    case SwitchTheme: {
      return { ...state, ...payload };
    }

    case SELECT_CHART_STYLE_INDEX: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
