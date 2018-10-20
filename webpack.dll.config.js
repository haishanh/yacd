'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'redux',
      'react-router-dom'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    // this will generate vendor.bundle.js
    // commons chunk plugin will also vendor.bundle.js
    // the benefit is we reuse the vendor <script /> tag in our index.html
    //
    // since this dll plugin is only used in dev
    // and commons chunk plugin is only used in prod
    // there is no conflict
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'public', '[name]-manifest.json'),
      name: '[name]_[hash]'
    })
  ]
};

// const output = {
//   filename: '[name].bundle.js',
//   publicPath: '/assets'
// };
