import {
  initialState as app,
  selectChartStyleIndex,
  updateAppConfig
} from './app';
import {
  initialState as proxies,
  toggleUnavailableProxiesFilter
} from './proxies';
import { initialState as modals } from './modals';
import { initialState as configs } from './configs';
import { initialState as rules } from './rules';
import { initialState as logs } from './logs';

export const initialState = {
  app: app(),
  modals,
  configs,
  proxies,
  rules,
  logs
};

export const actions = {
  selectChartStyleIndex,
  updateAppConfig,
  // proxies
  toggleUnavailableProxiesFilter
};
