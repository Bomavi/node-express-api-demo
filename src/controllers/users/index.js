/* npm imports: common */
const express = require('express');

const searchOrGetAll = ({ User }) => async (req, res, next) => {
	try {
		const { q = '' } = req.query;
		const users = await User.find()
			.search(q)
			.getPublic();
		res.status(200).send(users);
	} catch (e) {
		next(e);
	}
};

const getById = ({ User }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const user = await User.findById(_id).getPublic();
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const updateById = ({ User }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const { firstname, lastname, theme } = req.body;
		const user = await User.findByIdAndUpdate(
			_id,
			{ firstname, lastname, theme },
			{ new: true }
		).getPublic();
		res.status(200).send(user);
	} catch (e) {
		next(e);
	}
};

const deleteById = ({ User }) => async (req, res, next) => {
	try {
		const { _id } = req.params;
		const user = await User.findByIdAndDelete(_id);
		res.status(200).send(user._id);
	} catch (e) {
		next(e);
	}
};

module.exports = models => {
	const router = express();

	router.get('/', searchOrGetAll(models));
	router.get('/search', searchOrGetAll(models));
	router.get('/:_id', getById(models));

	router.put('/:_id', updateById(models));
	router.delete('/:_id', deleteById(models));

	return router;
};
