const mongoose = require('mongoose');
const { schema } = require('./schema');

// schema.pre('save', function(next) {
// 	next();
// });

module.exports = mongoose.model('Task', schema);
