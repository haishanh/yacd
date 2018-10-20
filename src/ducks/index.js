import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import app from './app';
import modals from './modals';
import proxies from './proxies';
import configs from './configs';

export default combineReducers({
  router,
  app,
  modals,
  proxies,
  configs
});
