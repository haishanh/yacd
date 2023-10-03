import { initialState as logs } from './logs';
import { initialState as modals } from './modals';
import { actions as proxiesActions, initialState as proxies } from './proxies';

export const initialState = {
  modals,
  proxies,
  logs,
};

export const actions = {
  proxies: proxiesActions,
};
