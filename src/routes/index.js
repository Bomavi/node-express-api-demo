const express = require('express');

const { isAuthenticated, isMicroservice, errorHandler } = rootRequire('middleware');
const { User, Task } = rootRequire('models');
const { UsersController, TasksController, ValidateController } = rootRequire('controllers');

const models = { User, Task };

const api = () => {
	const router = express();

	router.use('/users', [isAuthenticated, isMicroservice], UsersController(models));
	router.use('/tasks', [isAuthenticated, isMicroservice], TasksController(models));
	router.use('/validate', isMicroservice, ValidateController(models));

	router.use(errorHandler);

	return router;
};

module.exports = { api };
