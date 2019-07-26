const express = require('express');

const { isAuthenticated, errorHandler } = rootRequire('middleware');
const { User, Task } = rootRequire('models');

// TODO!!! FIX SHIT BELOW
const { AuthController, UsersController, TasksController } = rootRequire('controllers');

const models = { User, Task };

const api = () => {
	const router = express();

	router.use('/users', isAuthenticated, UsersController(models));
	router.use('/tasks', isAuthenticated, TasksController(models));
	router.use('/auth', AuthController(models));

	router.use(errorHandler);

	return router;
};

module.exports = { api };
