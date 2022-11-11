'use strict';

const staticServer = require('./static.js');
const config = require('./config.js');
const {makeRoutes} = require('./routing');
const server = require(`./framework/${config.framework}`);
const console = require('./logger');
require('./db.js').init(config.db);

(async () => {
  staticServer('./static', config.static.port);

  server(await makeRoutes(), config.api.port, () => {
    console.log(
      `Server was running on port ${config.api.port} as '${config.framework}' framework with '${config.api.transport}' api transport`,
    );
  });
})();
