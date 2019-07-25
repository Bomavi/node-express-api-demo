const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
	{
		// firstname: {
		// 	type: String,
		// 	required: true,
		// },
		// lastname: {
		// 	type: String,
		// 	required: true,
		// },
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		theme: {
			type: String,
			default: 'light',
		},
		role: {
			type: ObjectId,
			// required: true,
			ref: 'Role',
		},
	},
	{
		timestamps: true,
	}
);

schema.query.search = function(value) {
	const val = value.toLowerCase();
	return this.where({
		$or: [{ firstname: new RegExp(val, 'i'), lastname: new RegExp(val, 'i') }],
	});
};

schema.query.onlySafeFields = function() {
	return this.select('-password -role -__v');
};

module.exports = { schema };
