const createError = require('http-errors');

const { jwt, debugLogger } = rootRequire('utils');

const isAuthenticated = async (req, res, next) => {
	let token = '';

	if (req.session.accessToken) {
		token = req.session.accessToken;
		debugLogger('debug', 'Session TOKEN: %o', token);
	} else {
		const accessToken = req.headers['authorization'];
		debugLogger('debug', 'HTTP TOKEN: %o', accessToken);

		if (!accessToken) return next(createError(401, 'no accessToken provided!'));

		if (accessToken.startsWith('service_')) return next();

		if (accessToken.startsWith('Bearer ')) {
			const tokenData = accessToken.split(' ');
			token = tokenData[1];
		}
	}

	if (!token) return next(createError(401, 'no accessToken provided!'));

	try {
		const decodedToken = await jwt.validate(token);

		if (!decodedToken.userId) return next(createError(403, 'token invalid!'));

		next();
	} catch (e) {
		next(e);
	}
};

module.exports = isAuthenticated;
