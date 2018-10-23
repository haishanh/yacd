import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import SideBar from 'c/SideBar';
import Home from 'c/Home';
import Logs from 'c/Logs';
import Proxies from 'c/Proxies';
import Config from 'c/Config';

import APIDiscovery from 'c/APIDiscovery';

// testing...
// import StyleGuide from 'c/StyleGuide';
// import Loading from 'c/Loading';

// for loading async chunk...not used yet

// import Loadable from './Loadable';
// const delay = t => new Promise(r => setTimeout(r, t));
// const AsyncAbout = Loadable({
//   loader: () => delay(800).then(() => import('./About'))
// });
// const AsyncHello = Loadable({
//   loader: () => import('./Hello')
// });

import './Root.scss';
import s0 from './Root.module.scss';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <div className={s0.app}>
        <APIDiscovery />
        <Route path="/" component={SideBar} />
        <div style={{ flexGrow: '1', overflow: 'scroll' }}>
          <Route exact path="/" component={Home} />
          <Route exact path="/overview" component={Home} />
          <Route exact path="/configs" component={Config} />
          <Route exact path="/logs" component={Logs} />
          <Route exact path="/proxies" component={Proxies} />
        </div>
      </div>
    </Router>
  </Provider>
);
// <Route exact path="/__0" component={StyleGuide} />
// <Route exact path="/__1" component={Loading} />

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
};

// hot export Root
// https://github.com/gaearon/react-hot-loader/tree/v4.0.1#getting-started
export default hot(module)(Root);
