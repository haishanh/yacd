import 'modern-normalize/modern-normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Root from './components/Root';

Modal.setAppElement('#app');

// use async React
const root = ReactDOM.unstable_createRoot(document.getElementById('app'));
root.render(<Root />);

// const render = (Component, props = {}) => {
//   ReactDOM.render(<Component {...props} />, document.getElementById('app'));
// };
// render(Root, props);
