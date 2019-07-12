const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
	{
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		role: {
			type: ObjectId,
			required: true,
			ref: 'Role',
		},
	},
	{
		timestamps: true,
	}
);

schema.query.search = function(value) {
	return this.where({
		$or: [{ firstname: new RegExp(value, 'i'), lastname: new RegExp(value, 'i') }],
	});
};

module.exports = { schema };
