'use strict';

const console = require('../../logger.js');

try {
  require.resolve('express');
  require.resolve('express-ws');
} catch (e) {
  console.error('Please install dependencies');
  process.exit(e.code);
}

const express = require('express');

const app = express();
require('express-ws')(app);

module.exports = async (routing, port, callback) => {
  app.ws('/', (ws) => {
    ws.on('message', async (msg) => {
      const obj = JSON.parse(msg);
      const {name, method, args = []} = obj;
      const entity = routing[name];
      if (!entity) return ws.send('"Not found"', {binary: false});
      const handler = entity[method];
      if (!handler) return ws.send('"Not found"', {binary: false});

      try {
        const result = await handler(...args);
        ws.send(JSON.stringify(result), {binary: false});
      } catch (err) {
        console.error(err);
        ws.send('"Server error"', {binary: false});
      }
    });
  });

  app.listen(port, callback);
};
