const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      // see also zloirock/core-js https://bit.ly/2JLnrgw
      useBuiltIns: 'usage',
      corejs: 3,
      // new in babel 7.9.0 https://babeljs.io/blog/2020/03/16/7.9.0
      bugfixes: true,
    },
  ],
  '@babel/preset-react',
  '@babel/preset-flow',
  '@babel/preset-typescript',
];

module.exports = (api) => {
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
        useESModules: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-do-expressions',
    isDev ? 'react-refresh/babel' : false,
  ].filter(Boolean);
  return { presets, plugins };
};
