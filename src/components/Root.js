import './Root.css';

import React, { Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { actions, initialState } from '../store';
import APIDiscovery from './APIDiscovery';
import Config from './Config';
import Connections from './Connections';
import ErrorBoundary from './ErrorBoundary';
import Home from './Home';
import Loading2 from './Loading2';
import Logs from './Logs';
import s0 from './Root.module.css';
import SideBar from './SideBar';
import StateProvider from './StateProvider';
import StyleGuide from './StyleGuide';

const Proxies = React.lazy(() =>
  import(
    /* webpackChunkName: "proxies" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    './proxies/Proxies'
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
  __DEV__ ? ['style', '/style', <StyleGuide />] : false,
].filter(Boolean);

const Root = () => (
  <ErrorBoundary>
    <RecoilRoot>
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
    </RecoilRoot>
  </ErrorBoundary>
);

export default Root;
