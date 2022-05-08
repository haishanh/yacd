import 'modern-normalize/modern-normalize.css';
import './misc/i18n';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';

import Root from './components/Root';
import * as swRegistration from './swRegistration';

const rootEl = document.getElementById('app');
const root = createRoot(rootEl);

Modal.setAppElement(rootEl);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

swRegistration.register();

// eslint-disable-next-line no-console
console.log('Checkout the repo: https://github.com/haishanh/yacd');
// eslint-disable-next-line
console.log('Version:', __VERSION__);
