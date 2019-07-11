const express = require('express');

const getAll = ({ Task }) => async (_req, res, next) => {
	try {
		const tasks = await Task.find({});
		res.status(200).send({ tasks });
	} catch (e) {
		next(e);
	}
};

const getById = ({ Task }) => async (req, res, next) => {
	const { _id } = req.params;

	try {
		const task = await Task.findOne({ _id });
		res.status(200).send({ task });
	} catch (e) {
		next(e);
	}
};

module.exports = model => {
	const router = express();

	router.get('/', getAll(model));
	router.get('/:_id', getById(model));

	return router;
};
