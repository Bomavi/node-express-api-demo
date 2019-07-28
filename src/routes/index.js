/* npm imports: common */
const express = require('express');

/* root imports: common */
const { isAuthenticated, errorHandler } = rootRequire('middleware');
const { User, Task } = rootRequire('models');
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
