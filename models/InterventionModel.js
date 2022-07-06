var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var InterventionSchema = new Schema({
	date: {type: Date, required: true},
	label: {type: String, required: true},
	agent: {type: String, required: true},
	client: {
		type: Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	}
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Intervention", InterventionSchema);