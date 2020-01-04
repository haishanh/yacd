import React, { Suspense } from 'react';
// import { Provider } from '../misc/store';
import StateProvider from './StateProvider';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loading2 from './Loading2';
import ErrorBoundary from './ErrorBoundary';
import SideBar from './SideBar';
import Home from './Home';
import Logs from './Logs';
import Config from './Config';
import StyleGuide from './StyleGuide';
import Connections from './Connections';
import APIDiscovery from './APIDiscovery';
// import { store } from '../store/configureStore';
import { initialState, actions } from '../store';
import './Root.css';
import s0 from './Root.module.css';

const Proxies = React.lazy(() =>
  import(
    /* webpackChunkName: "proxies" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Proxies'
  )
);
const Rules = React.lazy(() =>
  import(
    /* webpackChunkName: "rules" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './Rules'
  )
);

const routes = [
  ['home', '/', Home],
  ['connections', '/connections', Connections],
  ['configs', '/configs', Config],
  ['logs', '/logs', Logs],
  ['proxies', '/proxies', Proxies],
  ['rules', '/rules', Rules],
  __DEV__ ? ['style', '/style', StyleGuide] : false
].filter(Boolean);

const Root = () => (
  <ErrorBoundary>
    <StateProvider initialState={initialState} actions={actions}>
      <Router>
        <div className={s0.app}>
          <APIDiscovery />
          <Route path="/" render={props => <SideBar {...props} />} />
          <div className={s0.content}>
            <Suspense fallback={<Loading2 />}>
              {routes.map(([key, path, component]) => (
                <Route exact key={key} path={path} component={component} />
              ))}
            </Suspense>
          </div>
        </div>
      </Router>
    </StateProvider>
  </ErrorBoundary>
);

export default Root;
