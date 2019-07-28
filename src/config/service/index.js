/* root imports: common */
const { jwt, logger } = rootRequire('utils');

const init = async () => {
	const serviceName = process.env.SERVICE_NAME;
	const token = await jwt.issue({ service: serviceName }, null);

	global.SERVICE_NAME = serviceName;
	global.SERVICE_TOKEN = token;

	logger.app('SERVICE_NAME: %o', SERVICE_NAME);
	logger.app('SERVICE_TOKEN: %o', SERVICE_TOKEN);
};

module.exports = {
	init,
};
