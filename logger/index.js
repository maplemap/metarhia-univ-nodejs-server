const config = require('../config');
const {Logger} = require(`./${config.logger}.js`);

module.exports = new Logger('./log');
