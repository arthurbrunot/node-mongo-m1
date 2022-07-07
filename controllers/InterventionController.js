const Intervention = require("../models/InterventionModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/customApiResponses");
const mongoose = require("mongoose");
const authenticate = require("../middlewares/jwt");
const InterventionService = require("../services/InterventionService");
const ClientService = require("../services/ClientService");
mongoose.set("useFindAndModify", false);

// Intervention Schema
function InterventionData(data) {
	this.id = data._id;
	this.date = data.date;
	this.label= data.label;
	this.agent = data.agent;
	this.client = data.client;
}

exports.interventionList = [
	authenticate,
	function (req, res) {
		try {
			InterventionService.getInterventions().then((interventions)=>{
				if(interventions.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", interventions);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.interventionsForClient = [
	authenticate,
	function (req, res) {
		try {
			InterventionService.getInterventionsForClient(req).then((clients)=>{
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

exports.interventionDetail = [
	authenticate,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			InterventionService.getInterventionById({_id: req.params.id}).then((intervention)=>{
				if(intervention !== null){
					let interventionData = new InterventionData(intervention);
					return apiResponse.successResponseWithData(res, "Operation success", interventionData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.addIntervention = [
	authenticate,
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
					ClientService.addInterventionForClient(req,res,intervention.client, {$push: {interventions: intervention._id}}).then((err)=>{
						if(err){
							return apiResponse.ErrorResponse(res, err);
						}
						return apiResponse.successResponseWithData(res, "Operation success", intervention);
					});
					if (err) { return apiResponse.ErrorResponse(res, err); }
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.updateIntervention = [
	authenticate,
	body("date", "date must not be empty.").isLength({ min: 1 }).trim(),
	body("label", "Last name must not be empty.").isLength({ min: 1 }).trim(),
	body("agent", "Address must not be empty.").isLength({ min: 1 }).trim(),
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
					InterventionService.updateIntervention(req, res).then((intervention) => {
						return apiResponse.successResponseWithData(res,"Client update Success.", intervention);
					});
				}
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.deleteIntervention = [
	authenticate,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			//DELETE CLIENT
			InterventionService.deleteIntervention(req, res).then((err) => {
				if (err) {
					return apiResponse.ErrorResponse(res, err);
				}else{
					return apiResponse.successResponse(res,"Intervention delete Success.");
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];