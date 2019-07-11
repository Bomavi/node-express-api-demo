const express = require('express');

const { errorHandler } = require('../middleware');
const { Task } = require('../models');
const { TasksController } = require('../controllers');

const models = { Task };

const api = () => {
	const router = express();

	router.use('/tasks', TasksController(models));
	router.use(errorHandler);

	return router;
};

module.exports = { api };
