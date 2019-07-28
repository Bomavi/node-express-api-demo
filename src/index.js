/* npm imports: common */
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

/* Declare global rootRequire for root imports */
global.rootRequire = name => require(`${__dirname}/${name}`);

/* root imports: common */
const { logger } = rootRequire('utils');
const { api } = rootRequire('routes');
const {
	service,
	mongoConnect,
	redis: { session, redisOptions, redisStore },
} = rootRequire('config');

/* Get .env constants */
dotenv.config();

/* Initialize microservice with credentials */
service.init();

// const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || process.env.DEV_PORT;
const maxAge = Number(process.env.SESSION_EXPIRES_IN) * 1000;
const app = express();

/* Initialize middlewares and express-session with REDIS */
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		store: new redisStore(redisOptions),
		secret: process.env.SESSION_SECRET,
		resave: true,
		rolling: false,
		saveUninitialized: false,
		proxy: true,
		cookie: {
			path: '/',
			domain: 'localhost',
			maxAge,
			httpOnly: true,
			sameSite: true,
			// secure: isProd,
			secure: false,
		},
	})
);

/* Initialize MONGO configuration */
mongoConnect();

/* Initialize app routes */
app.use(`/services/${process.env.SERVICE_NAME}`, api());

/* Start app */
app.listen(PORT, () => {
	logger.app(`Server is running on port ${PORT}`);
});
