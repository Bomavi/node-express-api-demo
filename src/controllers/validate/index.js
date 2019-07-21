const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const validateUser = ({ User }) => async (req, res, next) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });

	if (user && user.password !== password) {
		return next(createError(401, `credentials for "${username}" invalid!`));
	}

	if (!user && username === 'guest') {
		try {
			const newUser = await User.create({
				_id: ObjectId(),
				firstname: 'John',
				lastname: 'Doe',
				username,
				password: 'parol',
			});

			return res.status(200).send({ userId: newUser._id });
		} catch (e) {
			return next(e);
		}
	}

	res.status(200).send({ userId: user._id });
};

module.exports = models => {
	const router = express();

	router.post('/user', validateUser(models));

	return router;
};
