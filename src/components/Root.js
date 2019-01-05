import React, { Suspense } from 'react';
import { Provider } from 'm/store';
import { HashRouter as Router, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
// import createHistory from 'history/createHashHistory';
// import createHistory from 'history/createBrowserHistory';
import Loading from 'c/Loading';
import ErrorBoundary from 'c/ErrorBoundary';
import SideBar from 'c/SideBar';
import Home from 'c/Home';
import Logs from 'c/Logs';
// import Proxies from 'c/Proxies';
import Config from 'c/Config';

const Proxies = React.lazy(() =>
  import(/* webpackChunkName: "proxies" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  './Proxies')
);
const Rules = React.lazy(() =>
  import(/* webpackChunkName: "rules" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  './Rules')
);

import APIDiscovery from 'c/APIDiscovery';

import { store } from '../store/configureStore';

// testing...
// import StyleGuide from 'c/StyleGuide';

import './Root.scss';
import s0 from './Root.module.scss';

window.store = store;

const Root = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <div className={s0.app}>
          <APIDiscovery />
          <Route path="/" render={() => <SideBar />} />
          <div className={s0.content}>
            <Suspense fallback={<Loading height="200px" />} maxDuration={10}>
              <Route exact path="/" render={() => <Home />} />
              <Route exact path="/overview" render={() => <Home />} />
              <Route exact path="/configs" render={() => <Config />} />
              <Route exact path="/logs" render={() => <Logs />} />
              <Route exact path="/proxies" render={() => <Proxies />} />
              <Route exact path="/rules" render={() => <Rules />} />
            </Suspense>
          </div>
        </div>
      </Router>
    </Provider>
  </ErrorBoundary>
);
// <Route exact path="/__0" component={StyleGuide} />
// <Route exact path="/__1" component={Loading} />

export default hot(Root);
