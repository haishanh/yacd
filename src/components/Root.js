import React, { Suspense } from 'react';
import StateProvider from './StateProvider';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Loading2 from './Loading2';
import ErrorBoundary from './ErrorBoundary';
import SideBar from './SideBar';
import Home from './Home';
import Logs from './Logs';
import Config from './Config';
import StyleGuide from './StyleGuide';
import Connections from './Connections';
import APIDiscovery from './APIDiscovery';
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
  ['home', '/', <Home />],
  ['connections', '/connections', <Connections />],
  ['configs', '/configs', <Config />],
  ['logs', '/logs', <Logs />],
  ['proxies', '/proxies', <Proxies />],
  ['rules', '/rules', <Rules />],
  __DEV__ ? ['style', '/style', <StyleGuide />] : false
].filter(Boolean);

const Root = () => (
  <ErrorBoundary>
    <StateProvider initialState={initialState} actions={actions}>
      <Router>
        <div className={s0.app}>
          <APIDiscovery />
          <SideBar />
          <div className={s0.content}>
            <Suspense fallback={<Loading2 />}>
              <Routes>
                {routes.map(([key, path, element]) => (
                  <Route key={key} path={path} element={element} />
                ))}
              </Routes>
            </Suspense>
          </div>
        </div>
      </Router>
    </StateProvider>
  </ErrorBoundary>
);

export default Root;
