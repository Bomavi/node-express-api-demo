const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
	description: {
		type: String,
		required: true,
	},
	completed: {
		type: Boolean,
		required: true,
	},
	createdBy: {
		type: ObjectId,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
});

module.exports = { schema };
