const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

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
  ].filter(Boolean);

const postcssOptions = { plugins: postcssPlugins() };

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
  new webpack.IgnorePlugin({ resourceRegExp: /(^\.\/locale$)|(moment$)/ }),
  // https://github.com/pmmmwh/react-refresh-webpack-plugin
  isDev
    ? new ReactRefreshWebpackPlugin({
        overlay: { sockIntegration: 'whm' },
      })
    : false,
  // isDev ? false : new webpack.HashedModuleIdsPlugin(),
  isDev ? false : cssExtractPlugin,
  isDev ? false : bundleAnalyzerPlugin,
].filter(Boolean);

module.exports = {
  stats: {
    children: false,
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isDev ? 'eval-source-map' : 'source-map',
  entry: {
    app: { import: ['./src/app.tsx'], dependOn: 'libs' },
    libs: { import: ['react-query', 'react-modal'], dependOn: 'vendor' },
    vendor: { import: ['react', 'react-dom'], dependOn: 'corejs' },
    corejs: { import: 'core-js' },
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
      // to work around "Module not found" issue for babel runtime imports
      // https://github.com/webpack/webpack/issues/11467
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
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
          { loader: 'postcss-loader', options: { postcssOptions } },
        ],
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
          { loader: 'postcss-loader', options: { postcssOptions } },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins,
  bail: true,
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};
