const Client = require("../models/ClientModel");
const apiResponse = require("../helpers/customApiResponses");

exports.getClients = async function (query) {
	try {
		return await Client.find(query).populate("interventions", "label date agent", "Intervention");
	} catch (e) {
		// Log Errors
		throw Error("Error while Paginating Clients");
	}
};

exports.getClientById = async function (query) {
	try {
		return await Client.findById(query).populate("interventions", "label date agent", "Intervention");
	} catch (e) {
		// Log Errors
		throw Error("Error while finding client by id" + e);
	}
};

exports.getClientByEmail = async function (email) {
	try {
		return await Client.findOne({email: email}).populate("interventions", "label date agent", "Intervention");
	} catch (e) {
		// Log Errors
		throw Error("Error while finding client by email" + e);
	}
};

exports.addClient = async function (req, res) {

	const client = new Client(
		{ firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			address: req.body.address,
			phone: req.body.phone
		});

	try {
		await client.save(function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
		});
		return client;
	} catch (e) {
		// Log Errors
		throw Error("Error while Paginating Clients" + e);
	}
};

exports.updateClient = async function (req, res) {
	try {
		return 	await Client.findByIdAndUpdate(req.params.id, {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			address: req.body.address,
			phone: req.body.phone
		}, {new: true}, function (err, client) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			return client;
		}
		);
	} catch (e) {
		// Log Errors
		throw Error("Error while updating Clients" + e);
	}
};

exports.addInterventionForClient = async function (req, res,id ,query) {
	try {
		return 	await Client.findByIdAndUpdate(id, query, {new: true}, function (err, client) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			return client;
		}
		);
	} catch (e) {
		// Log Errors
		throw Error("Error while updating Clients" + e);
	}
};

exports.removeInterventionForClient = async function (req, res,id ,query) {
	try {
		return 	await Client.findByIdAndUpdate(id, query, {}, function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
		}
		);
	} catch (e) {
		// Log Errors
		throw Error("Error while updating Clients" + e);
	}
};

exports.deleteClient = async function (req, res) {
	try {
		return 	await Client.findByIdAndDelete(req.params.id, {new: true}, function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
		}
		);
	} catch (e) {
		// Log Errors
		throw Error("Error while updating Clients" + e);
	}
};