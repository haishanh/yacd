import { initialState as app } from './app';
import { initialState as proxies } from './proxies';
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
