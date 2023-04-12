const mongoose = require("mongoose");
const { Schema } = mongoose;


const schema = new Schema(
	{
		id: { type: String, require: true, unique: true },
		verified: { type: Boolean, default: false },

		results: { type: Object, default: null },
	},
);

const name = "demouser";

module.exports = mongoose.models[name] || mongoose.model(name, schema);