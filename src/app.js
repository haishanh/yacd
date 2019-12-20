import 'modern-normalize/modern-normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Root from './components/Root';

const rootEl = document.getElementById('app');

Modal.setAppElement(rootEl);

const { createRoot } = ReactDOM;
const root = createRoot(rootEl);
root.render(<Root />);

// eslint-disable-next-line no-console
console.log('Checkout the repo: https://github.com/haishanh/yacd');
// eslint-disable-next-line
console.log('Version:', __VERSION__);
