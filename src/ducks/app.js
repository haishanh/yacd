import { loadState, saveState } from 'm/storage';
import { fetchConfigs } from 'd/configs';
import { closeModal } from 'd/modals';

const UpdateClashAPIConfig = 'app/UpdateClashAPIConfig';

const StorageKey = 'yacd.haishan.me';

export const getClashAPIConfig = s => s.app.clashAPIConfig;

// TODO to support secret
export function updateClashAPIConfig({ hostname: iHostname, port, secret }) {
  return async (dispatch, getState) => {
    const hostname = iHostname.trim().replace(/^http(s)\:\/\//, '');
    dispatch({
      type: UpdateClashAPIConfig,
      payload: { hostname, port, secret }
    });

    // side effect
    saveState(StorageKey, getState().app);

    dispatch(closeModal('apiConfig'));
    dispatch(fetchConfigs());
  };
}

const defaultState = {
  clashAPIConfig: {
    hostname: '127.0.0.1',
    port: '7892',
    secret: ''
  }
};

function getInitialState() {
  let s = loadState(StorageKey);
  if (!s) s = defaultState;
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
