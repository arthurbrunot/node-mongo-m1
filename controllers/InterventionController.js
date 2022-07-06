const Intervention = require("../models/InterventionModel");
const Client = require("../models/ClientModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/customApiResponses");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Intervention Schema
function InterventionData(data) {
	this.id = data._id;
	this.date = data.date;
	this.label= data.label;
	this.agent = data.agent;
	this.client = data.client;
}

/**
 * Intervention List.
 * 
 * @returns {Object}
 */
exports.interventionList = [
	function (req, res) {
		try {
			// Intervention.find({},"_id title description isbn createdAt").then((interventions)=>{
			Intervention.find().then((interventions)=>{
				if(interventions.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", interventions);
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
 * Intervention Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.interventionDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Intervention.findOne({_id: req.params.id}).then((intervention)=>{
				if(intervention !== null){
					let interventionData = new InterventionData(intervention);
					return apiResponse.successResponseWithData(res, "Operation success", interventionData);
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
 * Intervention store.
 * 
 * @param {date}      date
 * @param {string}      label
 * @param {string}      agent
 *
 * @returns {Object}
 */
exports.addIntervention = [
	body("date", "date must not be empty.").isLength({ min: 1 }).trim(),
	body("label", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("agent", "Address must not be empty.").isLength({ min: 1 }).trim(),
	body("client", "Client must not be empty").isLength({ min: 1 }).trim(),
	body("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const intervention = new Intervention(
				{ date: req.body.date,
					label: req.body.label,
					agent: req.body.agent,
					client: req.body.client
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				intervention.save(function (err, intervention) {
					Client.findByIdAndUpdate(intervention.client, {$push: {interventions: intervention._id}}, {new: true}, function(err){
						if(err){
							return apiResponse.ErrorResponse(res, err);
						}
						return apiResponse.successResponseWithData(res, "Operation success", intervention);
					});
					if (err) { return apiResponse.ErrorResponse(res, err); }
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Intervention update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.updateIntervention = [
	body("firstName", "First name must not be empty.").isLength({ min: 1 }).trim(),
	body("lastName", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("address", "Address must not be empty.").isLength({ min: 1 }).trim(),
	body("phone", "Address must be valid.").isLength({ min: 10 }).trim(),
	body("email", "Email must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var intervention = {
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
					Intervention.findById(req.params.id, function (err, foundIntervention) {
						if(foundIntervention === null){
							return apiResponse.notFoundResponse(res,"Intervention not exists with this id");
						}else{
							//update intervention.
							Intervention.findByIdAndUpdate(req.params.id, intervention, {},function (err) {
								if (err) { 
									return apiResponse.ErrorResponse(res, err); 
								}else{
									let interventionData = new InterventionData(intervention);
									return apiResponse.successResponseWithData(res,"Intervention update Success.", interventionData);
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
 * Intervention Delete.
 * 
 * @param {string} id
 * 
 * @returns {Object}
 */
exports.deleteIntervention = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Intervention.findById(req.params.id, function (err, foundIntervention) {
				if(foundIntervention === null){
					return apiResponse.notFoundResponse(res,"Intervention not exists with this id");
				}else{
					//delete intervention.
					Intervention.findByIdAndRemove(req.params.id,function (err) {
						if (err) { 
							return apiResponse.ErrorResponse(res, err); 
						}else{
							return apiResponse.successResponse(res,"Intervention delete Success.");
						}
					});
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];