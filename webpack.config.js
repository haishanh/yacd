const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@hsjs/react-refresh-webpack-plugin');

const pkg = require('./package.json');

process.env.BABEL_ENV = process.env.NODE_ENV;
const isDev = process.env.NODE_ENV !== 'production';

const html = new HTMLPlugin({
  title: 'yacd - Yet Another Clash Dashboard',
  template: 'src/index.template.ejs',
  scriptLoading: 'defer',
  filename: 'index.html',
});

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __VERSION__: JSON.stringify(pkg.version),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

const postcssPlugins = () =>
  [
    require('postcss-import')(),
    require('postcss-simple-vars')(),
    require('postcss-custom-media')({
      importFrom: [
        {
          customMedia: {
            '--breakpoint-not-small': 'screen and (min-width: 30em)',
            '--breakpoint-medium':
              'screen and (min-width: 30em) and (max-width: 60em)',
            '--breakpoint-large': 'screen and (min-width: 60em)',
          },
        },
      ],
    }),
    require('postcss-nested')(),
    require('autoprefixer')(),
    require('postcss-extend-rule')(),
    isDev ? false : require('cssnano')(),
  ].filter(Boolean);

const cssExtractPlugin = new MiniCssExtractPlugin({
  filename: isDev ? '[name].css' : '[name].[contenthash].css',
});

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: 'report.html',
  openAnalyzer: false,
});

const plugins = [
  html,
  definePlugin,
  new ForkTsCheckerWebpackPlugin(),
  new ForkTsCheckerNotifierWebpackPlugin({
    title: 'TypeScript',
    excludeWarnings: false,
  }),
  new CopyPlugin({ patterns: [{ from: 'assets/*', flatten: true }] }),
  new CleanWebpackPlugin(),
  // chart.js requires moment
  // and we don't need locale stuff in moment
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  isDev ? new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }) : false,
  // isDev ? false : new webpack.HashedModuleIdsPlugin(),
  isDev ? false : cssExtractPlugin,
  isDev ? false : bundleAnalyzerPlugin,
].filter(Boolean);

module.exports = {
  // https://webpack.js.org/configuration/devtool/
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    // app: ['react-hot-loader/patch', './src/app.js']
    app: ['./src/app.js'],
  },
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    publicPath: '',
  },
  mode: isDev ? 'development' : 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   loader: 'ts-loader',
      //   options: {
      //     // disable type checker - we will use it in fork plugin
      //     transpileOnly: true,
      //   },
      // },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: { cacheDirectory: true } },
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?.+)?$/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]' } }],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          isDev ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { plugins: postcssPlugins } },
        ].filter(Boolean),
      },
      {
        test: /\.module\.css$/,
        use: [
          isDev ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev
                  ? '[path]_[name]_[local]_[hash:base64:5]'
                  : '[hash:base64:10]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: { plugins: postcssPlugins },
          },
        ].filter(Boolean),
      },
    ],
  },
  optimization: {
    moduleIds: isDev ? 'named' : 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        'core-js': {
          test(module, _chunks) {
            return (
              module.resource &&
              module.resource.indexOf('node_modules/core-js/') >= 0
            );
          },
        },
        react: {
          test(module, _chunks) {
            return (
              module.resource &&
              (module.resource.indexOf('node_modules/@hot-loader/react-dom/') >=
                0 ||
                module.resource.indexOf('node_modules/react-dom/') >= 0 ||
                module.resource.indexOf('node_modules/react/') >= 0)
            );
          },
        },
      },
    },
    minimizer: [new TerserPlugin()],
  },
  plugins,
};
