import './Root.css';

import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { About } from 'src/components/about/About';

import { actions, initialState } from '../store';
import APIDiscovery from './APIDiscovery';
import ErrorBoundary from './ErrorBoundary';
import Home from './Home';
import Loading2 from './Loading2';
import s0 from './Root.module.css';
import SideBar from './SideBar';
import StateProvider from './StateProvider';
import StyleGuide from './StyleGuide';

const Connections = lazy(() =>
  import(
    /* webpackChunkName: "conns" */
    /* webpackPrefetch: true */
    './Connections'
  )
);
const Config = lazy(() =>
  import(
    /* webpackChunkName: "config" */
    /* webpackPrefetch: true */
    './Config'
  )
);
const Logs = lazy(() =>
  import(
    /* webpackChunkName: "logs" */
    /* webpackPrefetch: true */
    './Logs'
  )
);
const Proxies = lazy(() =>
  import(
    /* webpackChunkName: "proxies" */
    /* webpackPrefetch: true */
    './proxies/Proxies'
  )
);
const Rules = lazy(() =>
  import(
    /* webpackChunkName: "rules" */
    /* webpackPrefetch: true */
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
  ['about', '/about', <About />],
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
