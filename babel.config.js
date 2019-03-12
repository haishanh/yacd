'use strict';

const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      // see also zloirock/core-js https://bit.ly/2JLnrgw
      useBuiltIns: 'entry',
      corejs: 3,
      targets: {
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
      }
    }
  ],
  '@babel/preset-react'
];

const plugins = [
  'react-hot-loader/babel',
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: true
    }
  ],
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-do-expressions'
];

module.exports = api => {
  api.cache(true);
  return { presets, plugins };
};
