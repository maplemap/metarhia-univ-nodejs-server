module.exports = {
	static: {
		port: 3000,
	},
	api: {
		port: 3002,
	},
	db: {
		host: '127.0.0.1',
		port: 5432,
		database: 'example',
		user: 'marcus',
		password: 'marcus',
	},
	crypto: {
		randomBytes: 16,
		encoding: 'base64',
		keyLength: 64,
	},
	fileLoader: {
		runOptions: {
			timeout: 5000,
			displayErrors: false,
		}
	},
	transport: 'ws'
}
