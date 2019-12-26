import * as configsAPI from '../api/configs';
import * as trafficAPI from '../api/traffic';
import { openModal } from './modals';
import { getClashAPIConfig } from './app';

const CompletedFetchConfigs = 'configs/CompletedFetchConfigs';
const OptimisticUpdateConfigs = 'configs/OptimisticUpdateConfigs';
const MarkHaveFetchedConfig = 'configs/MarkHaveFetchedConfig';

export const getConfigs = s => s.configs;
export const getLogLevel = s => s.configs['log-level'];

export function fetchConfigs() {
  return async (dispatch, getState) => {
    let res;
    try {
      const apiSetup = getClashAPIConfig(getState());
      res = await configsAPI.fetchConfigs(apiSetup);
    } catch (err) {
      // FIXME
      // eslint-disable-next-line no-console
      console.log('Error fetch configs', err);
      dispatch(openModal('apiConfig'));
      return;
    }

    if (!res.ok) {
      if (res.status === 404 || res.status === 401) {
        dispatch(openModal('apiConfig'));
      } else {
        // eslint-disable-next-line no-console
        console.log('Error fetch configs', res.statusText);
      }
      return;
    }

    const payload = await res.json();

    dispatch({
      type: CompletedFetchConfigs,
      payload
    });

    const configsCurr = getConfigs(getState());

    if (configsCurr.haveFetchedConfig) {
      // normally user will land on the "traffic chart" page first
      // calling this here will let the data start streaming
      // the traffic chart should already subscribed to the streaming
      const apiSetup = getClashAPIConfig(getState());
      trafficAPI.fetchData(apiSetup);
    } else {
      dispatch(markHaveFetchedConfig());
    }
  };
}

function markHaveFetchedConfig() {
  return {
    type: MarkHaveFetchedConfig,
    payload: {
      haveFetchedConfig: true
    }
  };
}

export function updateConfigs(partialConfg) {
  return async (dispatch, getState) => {
    const apiSetup = getClashAPIConfig(getState());
    configsAPI
      .updateConfigs(apiSetup, partialConfg)
      .then(
        res => {
          if (res.ok === false) {
            // eslint-disable-next-line no-console
            console.log('Error update configs', res.statusText);
          }
        },
        err => {
          // eslint-disable-next-line no-console
          console.log('Error update configs', err);
          throw err;
        }
      )
      .then(() => {
        // fetch updated configs to refresh to UI
        dispatch(fetchConfigs());
      });
    const configsCurr = getConfigs(getState());

    dispatch({
      type: OptimisticUpdateConfigs,
      payload: {
        ...configsCurr,
        ...partialConfg
      }
    });
  };
}

const initialState = {
  port: 7890,
  'socks-port': 7891,
  'redir-port': 0,
  'allow-lan': false,
  mode: 'Rule',
  'log-level': 'info',

  /////
  haveFetchedConfig: false
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case MarkHaveFetchedConfig:
    case OptimisticUpdateConfigs:
    case CompletedFetchConfigs: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
