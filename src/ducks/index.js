import { combineReducers } from 'redux';
import app from './app';
import modals from './modals';
import proxies from './proxies';
import rules from './rules';
import logs from './logs';
import configs from './configs';

export default combineReducers({
  app,
  modals,
  proxies,
  rules,
  logs,
  configs
});
