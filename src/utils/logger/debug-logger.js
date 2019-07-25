const debug = require('debug');

const debugLogger = (name, msg, format = '') => {
	debug(name)(msg, format);
};

module.exports = debugLogger;
