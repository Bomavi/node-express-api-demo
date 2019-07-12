const express = require('express');

const { errorHandler } = rootRequire('middleware');
const { User, Task } = rootRequire('models');
const { UsersController, TasksController } = rootRequire('controllers');

const models = { User, Task };

const api = () => {
	const router = express();

	router.use('/users', UsersController(models));
	router.use('/tasks', TasksController(models));
	router.use(errorHandler);

	return router;
};

module.exports = { api };
