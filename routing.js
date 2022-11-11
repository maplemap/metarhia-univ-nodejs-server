const path = require('node:path');
const {promises: fsp} = require('node:fs');
const logger = require('./logger');
const hash = require('./hash');
const load = require('./load');
const config = require('./config.js');
const db = require('./db.js')(config.db);

const getRouting = async () => {
	const sandbox = {
		console: Object.freeze(logger),
		db: Object.freeze(db),
		common: { hash },
	};
	const routing = {};

	const apiPath = path.join(process.cwd(), './api');
	const files = await fsp.readdir(apiPath);
	for (const fileName of files) {
		if (!fileName.endsWith('.js')) continue;

		const filePath = path.join(apiPath, fileName);
		const serviceName = path.basename(fileName, '.js');
		routing[serviceName] = await load(filePath, sandbox);
	}

	return routing;
}

module.exports = {getRouting};
