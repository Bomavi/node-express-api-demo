const express = require('express');

const { authenticate, errorHandler } = rootRequire('middleware');
const { User, Task } = rootRequire('models');
const { UsersController, TasksController, ValidateController } = rootRequire('controllers');

const models = { User, Task };

const api = () => {
	const router = express();

	router.use('/users', authenticate, UsersController(models));
	router.use('/tasks', authenticate, TasksController(models));
	router.use('/validate', ValidateController(models));

	router.use(errorHandler);

	return router;
};

module.exports = { api };
