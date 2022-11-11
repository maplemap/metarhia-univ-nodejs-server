'use strict';

const console = require('../../logger.js');

try {
  require.resolve('express');
  require.resolve('cors');
} catch (e) {
  console.error('Please install dependencies');
  process.exit(e.code);
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = async (routing, port, callback) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post('*', async (req, res) => {
    const [place, name, method] = req.url.substring(1).split('/');
    if (place !== 'api') return res.end('"Not found"');

    const entity = routing[name];
    if (!entity) return res.end('"Not found"');

    const handler = entity[method];
    if (!handler) return res.end('"Not found"');

    const result = await handler(...req.body.args);
    res.send(JSON.stringify(result));
  })

  app.listen(port, callback);
};
