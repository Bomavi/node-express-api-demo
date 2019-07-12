const express = require('express');
const dotenv = require('dotenv');

global.rootRequire = name => require(`${__dirname}/${name}`);

const { debugLogger } = require('./utils');
const { api } = require('./routes');
const { mongoConnect } = require('./config');

dotenv.config();

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : process.env.DEV_PORT;
const app = express();

mongoConnect();

app.use('/api', api());

app.listen(PORT, () => {
	debugLogger('app', `Server is running on port ${PORT}`);
});
