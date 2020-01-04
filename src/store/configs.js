import * as configsAPI from '../api/configs';
import * as trafficAPI from '../api/traffic';
import { openModal } from './modals';

export const getConfigs = s => s.configs.configs;
export const getLogLevel = s => s.configs.configs['log-level'];

export function fetchConfigs(apiConfig) {
  return async (dispatch, getState) => {
    let res;
    try {
      res = await configsAPI.fetchConfigs(apiConfig);
    } catch (err) {
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

    dispatch('store/configs#fetchConfigs', s => {
      s.configs.configs = payload;
    });

    const configsCurr = getConfigs(getState());

    if (configsCurr.haveFetchedConfig) {
      // normally user will land on the "traffic chart" page first
      // calling this here will let the data start streaming
      // the traffic chart should already subscribed to the streaming
      trafficAPI.fetchData(apiConfig);
    } else {
      dispatch(markHaveFetchedConfig());
    }
  };
}

function markHaveFetchedConfig() {
  return dispatch => {
    dispatch('store/configs#markHaveFetchedConfig', s => {
      s.configs.haveFetchedConfig = true;
    });
  };
}

export function updateConfigs(apiConfig, partialConfg) {
  return async dispatch => {
    configsAPI
      .updateConfigs(apiConfig, partialConfg)
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
        dispatch(fetchConfigs(apiConfig));
      });

    dispatch('storeConfigsOptimisticUpdateConfigs', s => {
      s.configs.configs = { ...s.configs.configs, ...partialConfg };
    });
  };
}

export const initialState = {
  configs: {
    port: 7890,
    'socks-port': 7891,
    'redir-port': 0,
    'allow-lan': false,
    mode: 'Rule',
    'log-level': 'info'
  },
  haveFetchedConfig: false
};
