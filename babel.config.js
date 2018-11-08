'use strict';

// "react-hot-loader/babel"

const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      useBuiltIns: 'usage',
      targets: {
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
      }
    }
  ],
  '@babel/preset-react'
];

const plugins = [
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
  '@babel/plugin-syntax-import-meta',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-json-strings',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-do-expressions'
];

module.exports = api => {
  api.cache(true);
  return { presets, plugins };
};
