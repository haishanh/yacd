import 'modern-normalize/modern-normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { history, store } from './store/configureStore';
import Root from './components/Root';

const props = { history, store };

Modal.setAppElement('#app');
const render = (Component, props = {}) => {
  ReactDOM.render(<Component {...props} />, document.getElementById('app'));
};

render(Root, props);
