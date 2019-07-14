const express = require('express');
const createError = require('http-errors');

const validateUser = ({ User }) => async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (user.password !== password) {
			return next(createError(404, `user "${username}" not found!`));
		}

		res.status(200).send({ userId: user._id });
	} catch (e) {
		next(e);
	}
};

module.exports = models => {
	const router = express();

	router.post('/user', validateUser(models));

	return router;
};
