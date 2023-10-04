import { initialState as logs } from './logs';
import { actions as proxiesActions, initialState as proxies } from './proxies';

export const initialState = {
  proxies,
  logs,
};

export const actions = {
  proxies: proxiesActions,
};
