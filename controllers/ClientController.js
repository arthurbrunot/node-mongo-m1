const Client = require("../models/ClientModel");
const ClientService = require("../services/ClientService");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/customApiResponses");
const mongoose = require("mongoose");
const authenticate = require("../middlewares/jwt");
mongoose.set("useFindAndModify", false);

exports.clientList = [
	authenticate,
	function (req, res) {
		try {
			// CLIENT LIST
			ClientService.getClients({}).then((clients)=>{
				if(clients.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", clients);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.clientDetail = [
	authenticate,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			// GET CLIENT BY ID
			ClientService.getClientById({_id: req.params.id}).then((client)=>{
				if(client !== null){
					return apiResponse.successResponseWithData(res, "Operation success", client);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.addClient = [
	authenticate,
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


				// ADD CLIENT
				ClientService.addClient(req, res).then((client) => {
					return apiResponse.successResponseWithData(res,"Client add Success.", client);
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.updateClient = [
	authenticate,
	body("firstName", "First name must not be empty.").isLength({ min: 1 }).trim(),
	body("lastName", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("address", "Address must not be empty.").isLength({ min: 1 }).trim(),
	body("phone", "Address must be valid.").isLength({ min: 10 }).trim(),
	body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					//UPDATE CLIENT
					ClientService.updateClient(req, res).then((client) => {
						console.log(client);
						return apiResponse.successResponseWithData(res,"Client update Success.", client);
					});
				}
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.deleteClient = [
	authenticate,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			//DELETE CLIENT
			ClientService.deleteClient(req, res).then((err) => {
				if (err) { 
					return apiResponse.ErrorResponse(res, err); 
				}else{
					return apiResponse.successResponse(res,"Client delete Success.");
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];