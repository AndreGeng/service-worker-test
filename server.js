const http = require('http');
const fs = require('fs');
const path = require('path');

const promisify = require('util').promisify;
const stat = promisify(fs.stat);

const wsPrefix = '/service-worker-test/';

const extMap = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  const url = req.url;
  let prefix = '/';
  if (url === wsPrefix) {
    res.setHeader('Content-type', 'text/html');
    return fs.createReadStream(path.resolve(__dirname, 'index.html'))
      .pipe(res);
  }
  if (url.indexOf(wsPrefix) === 0) { 
    prefix = wsPrefix;
  }
  const filepath = path.resolve(__dirname, url.slice(prefix.length));
  const extname = path.extname(filepath);
  console.log('content-type', extMap[extname]);
  console.log('url', url);
  res.setHeader('Content-type', extMap[extname]);
  try {
    await stat(filepath);
    fs.createReadStream(filepath)
      .pipe(res);
  } catch (e) {
    if (e && e.code === 'ENOENT') {
      res.statusCode = 404;
      res.end();
    }
  }
});
server.listen(8080);

process.on('uncaughtException', err => {
  console.log('whoops! there was an error', err.stack);
  process.exit(1);
});
