const Client = require("../models/ClientModel");
const apiResponse = require("../helpers/customApiResponses");
const { response } = require("express");

function ClientData(data) {
	this.id = data._id;
	this.firstName = data.firstName;
	this.lastName= data.lastName;
	this.email = data.email;
	this.phone = data.phone;
	this.address = data.address;
}

exports.getClients = async function (query) {

	try {
		return await Client.find(query);
	} catch (e) {
		// Log Errors
		throw Error("Error while Paginating Clients");
	}
};

exports.getClientById = async function (query) {
	try {
		return await Client.findById(query);
	} catch (e) {
		// Log Errors
		throw Error("Error while Paginating Clients");
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
