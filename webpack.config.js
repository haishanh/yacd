'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

process.env.BABEL_ENV = process.env.NODE_ENV;
const isDev = process.env.NODE_ENV !== 'production';

const resolveDir = dir => path.resolve(__dirname, dir);
const HTMLPlugin = require('html-webpack-plugin');
const html = new HTMLPlugin({
  title: 'yacd - Yet Another Clash Dashboard',
  template: 'src/index.template.ejs',
  inject: false,
  filename: 'index.html'
});

const svgSpriteRule = {
  test: /\.svg$/,
  use: ['svg-sprite-loader']
};

const mode = isDev ? 'development' : 'production';

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __VERSION__: JSON.stringify(pkg.version),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});

const loaders = {
  style: {
    loader: 'style-loader'
    // options: {
    // workaround css modules HMR issue
    // see https://github.com/webpack-contrib/style-loader/issues/320
    // hmr: false
    // }
    //
    // the options hmr is removed in style-loader v1.0.0
  },
  css: { loader: 'css-loader' },
  cssModule: {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev
          ? '[path]_[name]_[local]_[hash:base64:5]'
          : '[hash:base64:10]'
      }
    }
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      plugins: () =>
        [
          require('postcss-import')(),
          require('postcss-custom-media')({
            importFrom: [
              {
                customMedia: {
                  '--breakpoint-not-small': 'screen and (min-width: 30em)',
                  '--breakpoint-medium':
                    'screen and (min-width: 30em) and (max-width: 60em)',
                  '--breakpoint-large': 'screen and (min-width: 60em)'
                }
              }
            ]
          }),
          require('postcss-nested')(),
          require('autoprefixer')(),
          require('postcss-extend-rule')(),
          isDev ? false : require('cssnano')()
        ].filter(Boolean)
    }
  }
};

const rulesCss = {
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [
    isDev ? loaders.style : MiniCssExtractPlugin.loader,
    loaders.css,
    loaders.postcss
  ].filter(Boolean)
};

const rulesCssModules = {
  test: /\.module\.css$/,
  use: [
    isDev ? loaders.style : MiniCssExtractPlugin.loader,
    loaders.cssModule,
    loaders.postcss
  ].filter(Boolean)
};

const cssExtractPlugin = new MiniCssExtractPlugin({
  filename: isDev ? '[name].bundle.css' : '[name].[chunkhash].css'
});

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: 'report.html',
  openAnalyzer: false
});

const plugins = [
  // in webpack 4 namedModules will be enabled by default
  html,
  definePlugin,
  new CopyPlugin([{ from: 'assets/*', flatten: true }]),
  new CleanWebpackPlugin(),
  // chart.js requires moment
  // and we don't need locale stuff in moment
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  isDev ? false : new webpack.HashedModuleIdsPlugin(),
  isDev ? false : cssExtractPlugin,
  isDev ? false : bundleAnalyzerPlugin
].filter(Boolean);

module.exports = {
  // https://webpack.js.org/configuration/devtool/
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    app: ['react-hot-loader/patch', './src/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    // use contenthash instead of chunkhash to take advantage of caching
    filename: isDev ? '[name].bundle.js' : '[name].[contenthash].js',
    publicPath: ''
  },
  mode,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      a: resolveDir('src/api'),
      s: resolveDir('src/svg'),
      m: resolveDir('src/misc'),
      d: resolveDir('src/ducks'),
      c: resolveDir('src/components')
    }
  },
  module: {
    rules: [
      svgSpriteRule,
      // js loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      // file loader
      {
        test: /\.(ttf|eot|woff|woff2)(\?.+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      rulesCss,
      rulesCssModules
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        'core-js': {
          test(module, chunks) {
            return (
              module.resource &&
              module.resource.indexOf('node_modules/core-js/') >= 0
            );
          }
        },
        react: {
          test(module, chunks) {
            return (
              module.resource &&
              (module.resource.indexOf('node_modules/@hot-loader/react-dom/') >=
                0 ||
                module.resource.indexOf('node_modules/react-dom/') >= 0 ||
                module.resource.indexOf('node_modules/react/') >= 0)
            );
          }
        }
      }
    },
    runtimeChunk: true,
    minimizer: [new TerserPlugin()]
  },
  plugins
};
