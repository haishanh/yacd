/// <reference types="react/experimental" />
/// <reference types="react-dom/experimental" />

// for css modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// webpack definePlugin replacing variables
declare const __VERSION__: string;
declare const __DEV__: string;
