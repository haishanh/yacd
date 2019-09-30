import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../ducks';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    window.getState = store.getState;
  }

  return store;
}

const store = configureStore();

export { store };
