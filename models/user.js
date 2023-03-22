const mongoose = require("mongoose");
const { Schema } = mongoose;


const schema = new Schema(
	{
		id: { type: String, require: true, unique: true },
		acceptedTerms: { type: Boolean, default: false, require: true },

		fullName: { type: String, require: true, unique: true },
		class: { type: String, require: true },
		age: { type: Number, require: true },
		confidence: { type: Number, require: true },

		results: { type: Object, default: null },
	},
);

const name = "user";

module.exports = mongoose.models[name] || mongoose.model(name, schema);