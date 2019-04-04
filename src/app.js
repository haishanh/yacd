import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'modern-normalize/modern-normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Root from './components/Root';

const rootEl = document.getElementById('app');

Modal.setAppElement(rootEl);

const { unstable_createRoot: createRoot } = ReactDOM;

// use async React
const root = createRoot(rootEl);
root.render(<Root />);

// const render = (Component, props = {}) => {
//   ReactDOM.render(<Component {...props} />, document.getElementById('app'));
// };
// render(Root, props);

// eslint-disable-next-line no-console
console.log('Checkout the repo: https://github.com/haishanh/yacd');
