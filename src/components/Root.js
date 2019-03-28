import React, { Suspense } from 'react';
import { Provider } from 'm/store';
import { HashRouter as Router, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import Loading from 'c/Loading';
import ErrorBoundary from 'c/ErrorBoundary';
import SideBar from 'c/SideBar';
import Home from 'c/Home';
import Logs from 'c/Logs';
import Config from 'c/Config';
import APIDiscovery from 'c/APIDiscovery';
import { store } from '../store/configureStore';
import './Root.scss';
import s0 from './Root.module.scss';

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

// testing...
// import StyleGuide from 'c/StyleGuide';

window.store = store;

const Root = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <div className={s0.app}>
          <APIDiscovery />
          <Route path="/" render={props => <SideBar {...props} />} />
          <div className={s0.content}>
            <Suspense fallback={<Loading height="200px" />} maxDuration={10}>
              <Route exact path="/" render={() => <Home />} />
              <Route exact path="/overview" render={() => <Home />} />
              <Route exact path="/configs" component={Config} />
              <Route exact path="/logs" component={Logs} />
              <Route exact path="/proxies" render={() => <Proxies />} />
              <Route exact path="/rules" render={() => <Rules />} />
            </Suspense>
          </div>
        </div>
      </Router>
    </Provider>
  </ErrorBoundary>
);
// <Route exact path="/__0" render={() => <StyleGuide />} />
// <Route exact path="/__1" component={Loading} />

export default hot(Root);
