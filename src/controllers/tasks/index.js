/* npm imports: common */
const express = require('express');
const mongoose = require('mongoose');

/* root imports: common */
const { jwt } = rootRequire('utils');

const ObjectId = mongoose.Types.ObjectId;

const searchOrGetAll = ({ Task }) => async (req, res, next) => {
	try {
		const { q = '' } = req.query;
		const tasks = await Task.find()
			.search(q)
			.onlySafeFields();
		res.status(200).send(tasks);
	} catch (e) {
		next(e);
	}
};

const getById = ({ Task }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const task = await Task.findById(_id).onlySafeFields();
		res.status(200).send(task);
	} catch (e) {
		next(e);
	}
};

const create = ({ Task }) => async (req, res, next) => {
	try {
		const { accessToken } = req.session;
		const { userId } = await jwt.validate(accessToken);
		const { description, completed } = req.body;
		const newTask = await new Task({
			_id: ObjectId(),
			description,
			completed,
			createdBy: userId,
		});
		newTask.save(async err => {
			if (err) throw Error(err);
			const task = await Task.findById(newTask._id).onlySafeFields();
			res.status(200).send(task);
		});
	} catch (e) {
		next(e);
	}
};

const updateById = ({ Task }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const { description, completed } = req.body;
		const task = await Task.findByIdAndUpdate(
			_id,
			{ description, completed },
			{ new: true }
		).onlySafeFields();
		res.status(200).send(task);
	} catch (e) {
		next(e);
	}
};

const deleteById = ({ Task }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const task = await Task.findByIdAndDelete(_id);
		res.status(200).send(task._id);
	} catch (e) {
		next(e);
	}
};

module.exports = models => {
	const router = express();

	router.get('/', searchOrGetAll(models));
	router.get('/search', searchOrGetAll(models));
	router.get('/:_id', getById(models));

	router.post('/', create(models));

	router.put('/:_id', updateById(models));
	router.delete('/:_id', deleteById(models));

	return router;
};
