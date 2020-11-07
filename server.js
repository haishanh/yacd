const path = require('path');
const config = require('./webpack.config');
const webpack = require('webpack');
const express = require('express');
const app = express();

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const { PORT } = process.env;
const port = PORT ? Number(PORT) : 3000;
const publicPath = config.output.publicPath;

config.entry.app.import.unshift('webpack-hot-middleware/client');
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
);

const compiler = webpack(config);

const wdm = devMiddleware(compiler, { publicPath });
const whm = hotMiddleware(compiler);

app.use(wdm);
app.use(whm);

app.get('/_dev', (_req, res) => {
  const outputPath = wdm.getFilenameFromUrl(publicPath || '/');
  const filesystem = wdm.fileSystem;
  const content = filesystem.readdirSync(outputPath);
  res.end(content.join('\n'));
});

app.use('*', (_req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) return next(err);

    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`>> Listening at http://${host}:${port}`);
});

wdm.waitUntilValid(() => {
  console.log(
    `
>> Build ready at:

  http://${host}:${port}
  http://127.0.0.1:${port}
  http://localhost:${port}
`
  );
});
