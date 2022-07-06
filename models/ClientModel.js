var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	phone: {type: Number, required: true},
	address: {type: String, required: true},
	interventions: [{
		type: Schema.Types.ObjectId,
		ref: "Intervention",
		required: true,
	}]
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Client", ClientSchema);