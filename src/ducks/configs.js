'use strict';

import * as configsAPI from 'a/configs';
import { openModal } from 'd/modals';

const CompletedFetchConfigs = 'configs/CompletedFetchConfigs';
const OptimisticUpdateConfigs = 'proxies/OptimisticUpdateConfigs';

// const CompletedRequestDelayForProxy = 'proxies/CompletedRequestDelayForProxy';

export const getConfigs = s => s.configs;

export function fetchConfigs() {
  return async (dispatch, getState) => {
    let res;
    try {
      res = await configsAPI.fetchConfigs();
    } catch (err) {
      // FIXME
      console.log('Error fetch configs', err);
      dispatch(openModal('apiConfig'));
      return;
    }

    if (!res.ok) {
      if (res.status === 404) {
        dispatch(openModal('apiConfig'));
      } else {
        console.log('Error fetch configs', res.statusText);
      }
      return;
    }

    const payload = await res.json();

    dispatch({
      type: CompletedFetchConfigs,
      payload
    });
  };
}

export function updateConfigs(partialConfg) {
  return async (dispatch, getState) => {
    configsAPI
      .updateConfigs(partialConfg)
      .then(
        res => {
          if (res.ok === false) {
            console.log('Error update configs', res.statusText);
          }
        },
        err => {
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
  'socket-port': 7891,
  'redir-port': 0,
  'allow-lan': false,
  mode: 'Rule',
  'log-level': 'info'

  /////
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    // case CompletedRequestDelayForProxy:
    // case OptimisticSwitchProxy:
    case OptimisticUpdateConfigs:
    case CompletedFetchConfigs: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
}
