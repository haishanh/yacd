import 'modern-normalize/modern-normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import createHistory from 'history/createHashHistory';
// import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';

import Root from './components/Root';

const history = createHistory();
const store = configureStore(history);
const props = { history, store };

Modal.setAppElement('#app');
const render = (Component, props = {}) => {
  ReactDOM.render(<Component {...props} />, document.getElementById('app'));
};

render(Root, props);
