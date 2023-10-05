import './Root.scss';

import { QueryClientProvider } from '@tanstack/react-query';
import cx from 'clsx';
import { useAtom } from 'jotai';
import * as React from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from 'react-error-boundary';
import { RouteObject } from 'react-router';
import { HashRouter as Router, useRoutes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { About } from 'src/components/about/About';
import Loading from 'src/components/Loading';
import { Head } from 'src/components/shared/Head';
import { queryClient } from 'src/misc/query';

import { AppConfigSideEffect } from '$src/components/fn/AppConfigSideEffect';
import { ENDPOINT } from '$src/misc/constants';
import { darkModePureBlackToggleAtom } from '$src/store/app';

import { actions, initialState } from '../store';
import { Backend } from './backend/Backend';
import { MutableConnRefCtx } from './conns/ConnCtx';
import { ErrorFallback } from './error/ErrorFallback';
import { BackendBeacon } from './fn/BackendBeacon';
import Home from './Home';
import Loading2 from './Loading2';
import s0 from './Root.module.scss';
import SideBar from './SideBar';
import StateProvider from './StateProvider';

const { lazy, Suspense } = React;

const Connections = lazy(() => import('./Connections'));
const Config = lazy(() => import('./Config'));
const Logs = lazy(() => import('./Logs'));
const Proxies = lazy(() => import('./proxies/Proxies'));
const Rules = lazy(() => import('./Rules'));
const StyleGuide = lazy(() => import('$src/components/style/StyleGuide'));

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
    <div className={s0.app}>
      <BackendBeacon />
      <SideBar />
      <div className={s0.content}>
        <Suspense fallback={<Loading2 />}>
          <RouteInnerApp />
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return useRoutes([
    { path: '/backend', element: <Backend /> },
    { path: '*', element: <SideBarApp /> },
  ]);
}

function AppShell({ children }: { children: React.ReactNode }) {
  const [pureBlackDark] = useAtom(darkModePureBlackToggleAtom);
  const clazz = cx({ pureBlackDark });
  return (
    <>
      <Toaster richColors />
      <div className={clazz}>{children}</div>
    </>
  );
}

const onErrorReset: ErrorBoundaryProps['onReset'] = (_details) => {
  queryClient.invalidateQueries([ENDPOINT.config]);
};

const Root = () => (
  <Router>
    <StateProvider initialState={initialState} actions={actions}>
      <QueryClientProvider client={queryClient}>
        <AppConfigSideEffect />
        <AppShell>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onErrorReset}>
            <Head />
            <Suspense fallback={<Loading height="100vh" />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      </QueryClientProvider>
    </StateProvider>
  </Router>
);

export default Root;
