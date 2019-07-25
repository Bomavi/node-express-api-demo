const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { debugLogger } = rootRequire('utils');

const searchOrGetAll = ({ User }) => async (req, res, next) => {
	const { q = '' } = req.query;

	debugLogger('debug', `Session is: %o`, req.session);

	try {
		const users = await User.find()
			.search(q)
			.onlySafeFields();

		res.status(200).send(users);
	} catch (e) {
		next(e);
	}
};

const getById = ({ User }) => async (req, res, next) => {
	const { _id } = req.params;

	try {
		const user = await User.findById(_id).onlySafeFields();
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const create = ({ User }) => async (req, res, next) => {
	try {
		const { firstname, lastname } = req.body;
		const user = await User.create({
			_id: ObjectId(),
			firstname,
			lastname,
		});
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const updateById = ({ User }) => async (req, res, next) => {
	const { _id } = req.params;

	try {
		const { firstname, lastname } = req.body;
		const user = await User.findByIdAndUpdate(_id, { firstname, lastname }).onlySafeFields();
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const deleteById = ({ User }) => async (req, res, next) => {
	const { _id } = req.params;

	try {
		const user = await User.findByIdAndDelete(_id).onlySafeFields();
		res.status(200).send(user._id);
	} catch (e) {
		next(e);
	}
};

const authenticate = ({ User }) => async (req, res, next) => {
	const { _id } = req.params;
	debugLogger('http', 'PARAMS ID: %o', _id);

	try {
		const user = await User.findById(_id).onlySafeFields();

		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

module.exports = models => {
	const router = express();

	router.get('/', searchOrGetAll(models));
	router.get('/authenticate/:_id', authenticate(models));
	router.get('/:_id', getById(models));
	router.post('/', create(models));
	router.put('/:_id', updateById(models));
	router.delete('/:_id', deleteById(models));

	return router;
};
