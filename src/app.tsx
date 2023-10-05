// import 'modern-normalize/modern-normalize.css';
import './misc/i18n';
import '@fontsource/roboto-mono/latin-400.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-800.css';

import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2';
import inter800 from '@fontsource/inter/files/inter-latin-800-normal.woff2';
import robotoMono400 from '@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff2';
import flagfont from 'country-flag-emoji-polyfill/TwemojiCountryFlags.woff2';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';

import Root from './components/Root';
import * as swRegistration from './swRegistration';

init();

const rootEl = document.getElementById('app');
const root = createRoot(rootEl);

function insertLinkElement(href: string) {
  const l = document.createElement('link');
  l.href = href;
  l.rel = 'preload';
  l.as = 'font';
  l.type = 'font/woff2';
  l.crossOrigin = '';

  document.head.appendChild(l);
}

function init() {
  // preload woff2 font files
  insertLinkElement(inter400);
  insertLinkElement(inter800);
  insertLinkElement(robotoMono400);
  insertLinkElement(flagfont);
}

Modal.setAppElement(rootEl);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

setTimeout(() => {
  import('country-flag-emoji-polyfill')
    .then((mod) => {
      mod && mod.polyfillCountryFlagEmojis('Twemoji Country Flags', flagfont);
    })
    .catch(() => {
      /* noop */
    });
}, 1);

swRegistration.register();

// eslint-disable-next-line no-console
console.log('Checkout the repo: https://github.com/haishanh/yacd');
// eslint-disable-next-line
console.log('Version:', __VERSION__);
if (__COMMIT_HASH__) {
  // eslint-disable-next-line
  console.log('Commit hash:', __COMMIT_HASH__);
}
