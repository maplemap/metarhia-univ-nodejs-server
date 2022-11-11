'use strict';

const pino = require('pino');
const util = require('node:util');
const {Logger} = require('./native');

class PinoLogger extends Logger {
  constructor(logPath) {
    super(logPath);

    this.logger = pino(
      {},
      pino.multistream([{stream: process.stdout}, {stream: this.stream}]),
    );
  }

  write(type = 'info', s) {
    // this.stream.write();
  }

  log(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }

  dir(...args) {
    const msg = util.inspect(...args);
    this.logger.info(msg);
  }

  debug(...args) {
    const msg = util.format(...args);
    this.logger.debug(msg);
  }

  error(...args) {
    const msg = util.format(...args).replace(/[\n\r]{2,}/g, '\n');
    this.logger.error(msg);
  }

  system(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }

  access(...args) {
    const msg = util.format(...args);
    this.logger.info(msg);
  }
}

module.exports = {Logger: PinoLogger};
