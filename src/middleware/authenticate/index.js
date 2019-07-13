const createError = require('http-errors');
const JWT = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	let token;

	if (req.session && req.session.cookie) {
		token = req.session.cookie.accessToken;
	} else {
		const accessToken = req.headers['x-access-token'] || req.headers['authorization'];

		if (accessToken.startsWith('Bearer ')) {
			token = accessToken.slice(7, accessToken.length - 7);
		} else {
			token = accessToken;
		}
	}

	if (!token) return next(createError(401, 'no accessToken provided!'));

	JWT.verify(token, { secret: 'secret' }, (err, _decodedToken) => {
		if (err) return next(createError(401, 'accessToken not valid or expired!'));

		next();
	});
};

module.exports = authenticate;
