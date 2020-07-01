import {
  initialState as app,
  selectChartStyleIndex,
  updateAppConfig,
  updateCollapsibleIsOpen,
} from './app';
import { initialState as configs } from './configs';
import { initialState as logs } from './logs';
import { initialState as modals } from './modals';
import { actions as proxiesActions, initialState as proxies } from './proxies';

export const initialState = {
  app: app(),
  modals,
  configs,
  proxies,
  logs,
};

export const actions = {
  selectChartStyleIndex,
  updateAppConfig,

  app: {
    updateCollapsibleIsOpen,
    updateAppConfig,
  },
  proxies: proxiesActions,
};
