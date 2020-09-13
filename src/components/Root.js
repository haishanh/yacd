import './Root.css';

import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { About } from 'src/components/about/About';

import { actions, initialState } from '../store';
import APIConfig from './APIConfig';
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
  { path: '/', element: <Home /> },
  { path: '/connections', element: <Connections /> },
  { path: '/configs', element: <Config /> },
  { path: '/logs', element: <Logs /> },
  { path: '/proxies', element: <Proxies /> },
  { path: '/rules', element: <Rules /> },
  { path: '/about', element: <About /> },
  __DEV__ ? { path: '/style', element: <StyleGuide /> } : false,
].filter(Boolean);

function RouteInnerApp() {
  return useRoutes(routes);
}

function SideBarApp() {
  return (
    <>
      <APIDiscovery />
      <SideBar />
      <div className={s0.content}>
        <Suspense fallback={<Loading2 />}>
          <RouteInnerApp />
        </Suspense>
      </div>
    </>
  );
}

function App() {
  return useRoutes([
    { path: '/backend', element: <APIConfig /> },
    { path: '*', element: <SideBarApp /> },
  ]);
}

const Root = () => (
  <ErrorBoundary>
    <RecoilRoot>
      <StateProvider initialState={initialState} actions={actions}>
        <Router>
          <div className={s0.app}>
            <Suspense fallback={<Loading2 />}>
              <App />
            </Suspense>
          </div>
        </Router>
      </StateProvider>
    </RecoilRoot>
  </ErrorBoundary>
);

export default Root;
