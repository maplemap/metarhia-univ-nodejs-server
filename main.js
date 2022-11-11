'use strict';

const staticServer = require('./static.js');
const config = require('./config.js');
const {getRouting} = require('./routing');
const server = require(`./framework/${config.framework}`);
const console = require('./logger.js');

(async () => {
  staticServer('./static', config.static.port);

  const routing = await getRouting();
  server(routing, config.api.port, () => {
    console.log(
      `Server was running on port ${config.api.port} as '${config.framework}' framework`,
    );
  });
})();
