/* npm imports: common */
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

/* root imports: common */
const { logger } = rootRequire('utils');

const redisClientOptions = {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: process.env.REDIS_PORT || '6379',
};

const redisClient = redis.createClient(redisClientOptions);

const redisOptions = {
	client: redisClient,
};

redisClient.on('ready', () => {
	logger.redis(
		`Redis connection is open to: ${redisClientOptions.host}:${redisClientOptions.port}`
	);
});

redisClient.on('error', err => {
	logger.redis('Redis connection has occured error: %O', err);
});

module.exports = {
	session,
	redisOptions,
	redisStore,
};
