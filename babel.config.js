'use strict';

const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      // see also zloirock/core-js https://bit.ly/2JLnrgw
      useBuiltIns: 'usage',
      corejs: 3
    }
  ],
  '@babel/preset-react',
  '@babel/preset-flow'
];

module.exports = api => {
  // https://babeljs.io/docs/en/config-files#apicache
  api.cache.using(() => process.env.NODE_ENV);
  // https://babeljs.io/docs/en/config-files#apienv
  const isDev = api.env('development');
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
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-do-expressions',
    isDev ? 'react-refresh/babel' : false
  ].filter(Boolean);
  return { presets, plugins };
};
