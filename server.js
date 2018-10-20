'use strict';

const path = require('path');
const config = require('./webpack.config');
const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
const express = require('express');
const app = express();

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const { PORT } = process.env;
const port = PORT ? Number(PORT) : 3000;

config.entry.app.unshift(
  // activate HMR for React
  // 'react-hot-loader/patch',

  'webpack-hot-middleware/client'
  // // bundle the client for webpack-dev-server
  // // and connect to the provided endpoint
  // 'webpack-dev-server/client?http://0.0.0.0:' + port,
  // // bundle the client for hot reloading
  // // only- means to only hot reload for successful updates
  // 'webpack/hot/only-dev-server'
);
config.plugins.push(
  // enable HMR globally
  new webpack.HotModuleReplacementPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new webpack.NamedModulesPlugin()
);

const compiler = webpack(config);
// webpack-dev-server config
const publicPath = config.output.publicPath;
const stats = {
  colors: true,
  cached: false,
  cachedAssets: false,
  chunks: false,
  chunkModules: false
};

// webpack-dev-server options
// const options = {
//   hotOnly: true,
//   host: '0.0.0.0',
//   contentBase: path.join(__dirname, 'public'),
//   publicPath,
//   stats,
//   overlay: {
//     warnings: true,
//     errors: true
//   },
//   historyApiFallback: true
// };

const options = { publicPath, stats };

app.use(devMiddleware(compiler, options));
app.use(hotMiddleware(compiler));

app.use('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err);

    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log('\n>> Listening at http://0.0.0.0:' + port + '\n');
});
