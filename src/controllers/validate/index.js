const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const validateUser = ({ User }) => async (req, res, next) => {
	const { username, password, register } = req.body;

	if (!username) {
		return next(createError(404, `username is a required parameter!`));
	}

	const user = await User.findOne({ username });

	if (user && user.password !== password) {
		if (register) {
			return next(createError(401, `user "${username}" already exists!`));
		}
		return next(createError(401, `credentials for "${username}" invalid!`));
	}

	if (!user && (username === 'guest' || register)) {
		try {
			const newUser = await User.create({
				_id: ObjectId(),
				username,
				password,
			});

			return res.status(200).send(newUser);
		} catch (e) {
			return next(e);
		}
	}

	if (!user) {
		return next(createError(404, `user "${username}" not found or credentials invalid!`));
	}

	res.status(200).send(user);
};

module.exports = models => {
	const router = express();

	router.post('/user', validateUser(models));

	return router;
};
