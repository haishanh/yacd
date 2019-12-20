import { combineReducers } from 'redux';
import app from './app';
import modals from './modals';
import rules from './rules';
import logs from './logs';
import configs from './configs';

export default combineReducers({
  app,
  modals,
  rules,
  logs,
  configs
});
