const createError = require('http-errors');

const { jwt, debugLogger } = rootRequire('utils');

const isMicroservice = async (req, res, next) => {
	const token = req.headers['authorization'];

	if (!token) return next(createError(401, 'no accessToken provided!'));

	if (token.startsWith('Bearer ')) next();

	const serviceData = token.split(':');
	const serviceName = serviceData[0];
	const serviceToken = serviceData[1];

	if (!serviceName || !serviceToken) return next(createError(403, 'token invalid!'));

	debugLogger('debug', 'SERVICE TOKEN: %o', serviceToken);

	try {
		const decodedToken = await jwt.validate(serviceToken);

		if (decodedToken.service !== serviceName) return next(createError(403, 'token invalid!'));

		next();
	} catch (e) {
		next(e);
	}
};

module.exports = isMicroservice;
