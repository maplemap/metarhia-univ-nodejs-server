'use strict';

const console = require('../../logger.js');

try {
  require.resolve('fastify');
  require.resolve('@fastify/cors');
} catch (e) {
  console.error('Please install dependencies');
  process.exit(e.code);
}

const fastify = require('fastify')();
const cors = require('@fastify/cors');

module.exports = async (routing, port, callback) => {
  await fastify.register(cors);

  fastify.register(
    (app, _, done) => {
      app.post('*', {}, async (request, reply) => {
        const [_, name, method] = request.raw.url.substring(1).split('/');

        const entity = routing[name];
        console.log('routing', routing);
        console.log('entity', entity);
        if (!entity) return reply.send('"Not found"');

        const handler = entity[method];
        console.log('handler', handler);
        if (!handler) return reply.send('"Not found"');

        const result = await handler(...request.body.args);
        reply.send(JSON.stringify(result));
      });

      done();
    },
    {prefix: '/api'},
  );

  await fastify.listen({port}, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    callback();
  });
};
