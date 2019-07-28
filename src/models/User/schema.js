/* npm imports: common */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
	{
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
