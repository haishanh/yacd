import { loadState, saveState } from 'm/storage';
import { fetchConfigs } from 'd/configs';
import { closeModal } from 'd/modals';
import { apiBaseURL, updateAPIBaseURL } from '../config';

const UpdateClashAPIConfig = 'app/UpdateClashAPIConfig';

const StorageKey = 'yacd.haishan.me';

export const getClashAPIConfig = s => s.app.clashAPIConfig;

// TODO to support secret
export function updateClashAPIConfig(iHostname, iPort) {
  return async (dispatch, getState) => {
    const hostname = iHostname.trim().replace(/^http(s)\:\/\//, '');
    const port = iPort;

    dispatch({
      type: UpdateClashAPIConfig,
      payload: { hostname, port }
    });

    // side effect
    updateAPIBaseURL('http://' + hostname + ':' + port);
    saveState(StorageKey, getState().app);

    dispatch(closeModal('apiConfig'));
    dispatch(fetchConfigs());
  };
}

function retrieveAPIHostnameAndPort(apiBaseURL) {
  const match = /^http:\/\/(\S+?):(\d+)/.exec(apiBaseURL);
  if (!match) return {};
  return {
    hostname: match[1],
    port: match[2]
  };
}
const defaultState = {
  clashAPIConfig: retrieveAPIHostnameAndPort(apiBaseURL)
};
function getInitialState() {
  let s = loadState(StorageKey);
  if (!s) s = defaultState;

  // FIXME using data from multi source is NOT OK
  const { hostname, port } = s.clashAPIConfig;
  updateAPIBaseURL('http://' + hostname + ':' + port);

  return s;
}
const initialState = getInitialState();

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case UpdateClashAPIConfig: {
      return { ...state, clashAPIConfig: { ...payload } };
    }

    default:
      return state;
  }
}
