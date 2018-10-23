import { combineReducers } from 'redux';
import app from './app';
import modals from './modals';
import proxies from './proxies';
import configs from './configs';

export default combineReducers({
  app,
  modals,
  proxies,
  configs
});
