/* npm imports: common */
const { connect, connection } = require('mongoose');

/* root imports: common */
const { logger } = rootRequire('utils');

const MONGO_DB_HOST = process.env.MONGO_DB_HOST || process.env.MONGO_DB_DEV_HOST;
const MONGO_DB_PORT = process.env.MONGO_DB_PORT || process.env.MONGO_DB_DEV_PORT;
const DB_NAME = process.env.DB_NAME || process.env.DB_DEV_NAME;
const connectionUrl = `${MONGO_DB_HOST}:${MONGO_DB_PORT}/${DB_NAME}`;
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
};

const mongoConnect = () => {
	connect(
		connectionUrl,
		options
	);

	connection.on('connected', () => {
		logger.mongo(`Mongoose connection is open to: ${connectionUrl}`);
	});

	connection.on('error', e => {
		logger.mongo(`Mongoose connection has occured ${e} error`);
	});

	connection.on('disconnected', () => {
		logger.mongo('Mongoose connection was disconnected!');
	});

	process.on('SIGINT', () => {
		connection.close(() => {
			process.exit(0);
		});
	});
};

module.exports = mongoConnect;
