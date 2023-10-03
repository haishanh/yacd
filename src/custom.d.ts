/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />
/// <reference types="vite/client" />

// for css modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.woff2';

interface Window {
  i18n: any;
}

declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;
declare const process = {
  env: {
    NODE_ENV: string,
    PUBLIC_URL: string,
    COMMIT_HASH: string,
  },
};
