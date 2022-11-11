const config = require('../../config.js');
const transport = require(`./${config.api.transport}.js`);

module.exports = transport;
