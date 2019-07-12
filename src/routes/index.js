const express = require('express');

const { errorHandler } = require('../middleware');
const { User, Task } = require('../models');
const { UsersController, TasksController } = require('../controllers');

const models = { User, Task };

const api = () => {
	const router = express();

	router.use('/users', UsersController(models));
	router.use('/tasks', TasksController(models));
	router.use(errorHandler);

	return router;
};

module.exports = { api };
