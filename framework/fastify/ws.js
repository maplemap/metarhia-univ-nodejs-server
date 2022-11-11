'use strict';

const console = require('../../logger');

try {
  require.resolve('fastify');
  require.resolve('@fastify/websocket');
} catch (e) {
  console.error('Please install dependencies');
  process.exit(e.code);
}

const fastify = require('fastify')();

module.exports = async (routing, port, callback) => {
  fastify.register(require('@fastify/websocket'));

  fastify.register(async function (fastify) {
    fastify.get('/', {websocket: true}, (connection, req) => {
      connection.socket.on('message', async (message) => {
        const obj = JSON.parse(message);
        const {name, method, args = []} = obj;
        const entity = routing[name];
        if (!entity) return connection.socket.send('"Not found"', {binary: false});
        const handler = entity[method];
        if (!handler) return connection.socket.send('"Not found"', {binary: false});

        try {
          const result = await handler(...args);
          connection.socket.send(JSON.stringify(result), {binary: false});
        } catch (err) {
          console.error(err);
          connection.socket.send('"Server error"', {binary: false});
        }
      });
    });
  });

  await fastify.listen({port}, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    callback();
  });
};
