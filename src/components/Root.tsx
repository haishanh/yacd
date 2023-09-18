import './Root.scss';

import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { RouteObject } from 'react-router';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import { About } from 'src/components/about/About';
import Loading from 'src/components/Loading';
import { Head } from 'src/components/shared/Head';
import { queryClient } from 'src/misc/query';

import { actions, initialState } from '../store';
import APIConfig from './APIConfig';
import APIDiscovery from './APIDiscovery';
import { MutableConnRefCtx } from './conns/ConnCtx';
import ErrorBoundary from './ErrorBoundary';
import Home from './Home';
import Loading2 from './Loading2';
import s0 from './Root.module.scss';
import SideBar from './SideBar';
import StateProvider from './StateProvider';
import StyleGuide from './StyleGuide';

const { lazy, Suspense } = React;

const Connections = lazy(() => import('./Connections'));
const Config = lazy(() => import('./Config'));
const Logs = lazy(() => import('./Logs'));
const Proxies = lazy(() => import('./proxies/Proxies'));
const Rules = lazy(() => import('./Rules'));

const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/connections',
    element: (
      <MutableConnRefCtx.Provider value={{ hasProcessPath: false }}>
        <Connections />
      </MutableConnRefCtx.Provider>
    ),
  },
  { path: '/configs', element: <Config /> },
  { path: '/logs', element: <Logs /> },
  { path: '/proxies', element: <Proxies /> },
  { path: '/rules', element: <Rules /> },
  { path: '/about', element: <About /> },
  process.env.NODE_ENV === 'development' ? { path: '/style', element: <StyleGuide /> } : false,
].filter(Boolean) as RouteObject[];

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
    <StateProvider initialState={initialState} actions={actions}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className={s0.app}>
            <Head />
            <Suspense fallback={<Loading />}>
              <App />
            </Suspense>
          </div>
        </Router>
      </QueryClientProvider>
    </StateProvider>
  </ErrorBoundary>
);

export default Root;
