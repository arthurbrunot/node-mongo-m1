const Client = require("../models/ClientModel");
const ClientService = require("../services/ClientService");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/customApiResponses");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Client Schema
function ClientData(data) {
	this.id = data._id;
	this.firstName = data.firstName;
	this.lastName= data.lastName;
	this.email = data.email;
	this.phone = data.phone;
	this.address = data.address;
}

/**
 * Client List.
 * 
 * @returns {Object}
 */
exports.clientList = [
	function (req, res) {
		try {
			// Client.find({},"_id title description isbn createdAt").then((clients)=>{
			ClientService.getClients({}).then((clients)=>{
				if(clients.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", clients);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Client Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.clientDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			ClientService.getClientById({_id: req.params.id}).then((client)=>{
				if(client !== null){
					let clientData = new ClientData(client);
					return apiResponse.successResponseWithData(res, "Operation success", clientData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Client store.
 * 
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      address
 * @param {number}      phone
 *
 * @returns {Object}
 */
exports.addClient = [
	body("firstName", "First name must not be empty.").isLength({ min: 1 }).trim(),
	body("lastName", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("address", "Address must not be empty.").isLength({ min: 1 }).trim(),
	body("phone", "Address must be valid.").isLength({ min: 10 }).trim(),
	body("email", "Email must not be empty.").isLength({ min: 1 }).trim().custom((value) => {
		return Client.findOne({email : value}).then(client => {
			if (client) {
				return Promise.reject("Client already exist with this email.");
			}
		});
	}),
	body("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save client.
				ClientService.addClient(req, res).then((client) => {
					let clientData = new ClientData(client);
					return apiResponse.successResponseWithData(res,"Client add Success.", clientData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Client update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.updateClient = [
	body("firstName", "First name must not be empty.").isLength({ min: 1 }).trim(),
	body("lastName", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("address", "Address must not be empty.").isLength({ min: 1 }).trim(),
	body("phone", "Address must be valid.").isLength({ min: 10 }).trim(),
	body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var client = { 
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				address: req.body.address,
				phone: req.body.phone
			};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Client.findById(req.params.id, function (err, foundClient) {
						if(foundClient === null){
							return apiResponse.notFoundResponse(res,"Client not exists with this id");
						}else{
							//update client.
							Client.findByIdAndUpdate(req.params.id, client, {},function (err) {
								if (err) { 
									return apiResponse.ErrorResponse(res, err); 
								}else{
									let clientData = new ClientData(client);
									return apiResponse.successResponseWithData(res,"Client update Success.", clientData);
								}
							});
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Client Delete.
 * 
 * @param {string} id
 * 
 * @returns {Object}
 */
exports.deleteClient = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Client.findById(req.params.id, function (err, foundClient) {
				if(foundClient === null){
					return apiResponse.notFoundResponse(res,"Client not exists with this id");
				}else{
					//delete client.
					Client.findByIdAndRemove(req.params.id,function (err) {
						if (err) { 
							return apiResponse.ErrorResponse(res, err); 
						}else{
							return apiResponse.successResponse(res,"Client delete Success.");
						}
					});
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];