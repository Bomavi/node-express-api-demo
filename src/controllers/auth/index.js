const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

/* root imports: common */
const { jwt } = rootRequire('utils');

const ObjectId = mongoose.Types.ObjectId;

const login = ({ User }) => async (req, res, next) => {
	const { username = '', password = '', isGuest = false } = req.body;
	let user;

	try {
		const credentials = {
			username: isGuest ? process.env.GUEST_USERNAME : username,
			password: isGuest ? process.env.GUEST_PASSWORD : password,
		};

		if (!credentials.username) {
			throw Error(createError(404, `username is required`));
		}

		const foundUser = await User.findOne({ username: credentials.username });

		if (foundUser && foundUser.password !== credentials.password) {
			throw Error(createError(401, `credentials for "${credentials.username}" invalid`));
		}

		if (foundUser) user = foundUser;

		if (!foundUser && credentials.username === 'guest') {
			const newUser = await User.create({
				_id: ObjectId(),
				username: credentials.username,
				password: credentials.username,
			});

			if (newUser) user = newUser;
		}

		if (!user) {
			throw Error(createError(404, `user not found or credentials invalid`));
		}

		const token = await jwt.issue({ userId: user._id });

		req.session.accessToken = token;
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const register = ({ User }) => async (req, res, next) => {
	const { username, password } = req.body;

	try {
		if (!username) throw Error(createError(404, `username is required`));
		if (!password) throw Error(createError(404, `password is required`));

		const foundUser = await User.findOne({ username });

		if (foundUser) throw Error(createError(401, `user "${username}" already exists`));

		const user = await User.create({
			_id: ObjectId(),
			username,
			password,
		});

		const token = await jwt.issue({ userId: user._id });

		req.session.accessToken = token;
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const logout = () => async (req, res, next) => {
	try {
		req.session.destroy(err => {
			if (err) return next(err);

			res.status(200).send({ message: 'user was logged out successfuly' });
		});
	} catch (e) {
		next(e);
	}
};

const authenticate = ({ User }) => async (req, res, next) => {
	const { accessToken } = req.session;

	try {
		if (!accessToken) throw Error(createError(401, 'user not authenticated'));

		const { userId } = await jwt.validate(accessToken);
		const user = await User.findById(userId).onlySafeFields();

		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

module.exports = models => {
	const router = express();

	router.post('/login', login(models));
	router.post('/register', register(models));
	router.post('/logout', logout(models));
	router.post('/authenticate', authenticate(models));

	return router;
};
