const path = require('node:path');
const {promises: fsp} = require('node:fs');

const makeRoutes = async () => {
	const routing = {};

	const apiPath = path.join(process.cwd(), './api');
	const files = await fsp.readdir(apiPath);
	for (const fileName of files) {
		if (!fileName.endsWith('.js')) continue;

		const filePath = path.join(apiPath, fileName);
		const serviceName = path.basename(fileName, '.js');

		routing[serviceName] = require(filePath);
	}

	return routing;
}

module.exports = {makeRoutes};
