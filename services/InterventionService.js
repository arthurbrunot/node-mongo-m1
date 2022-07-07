const Intervention = require("../models/InterventionModel");
const apiResponse = require("../helpers/customApiResponses");
const ClientService = require("../services/ClientService");

exports.getInterventions = async function () {
	try {
		return await Intervention.find().populate("clients", {}, "Client");
	} catch (e) {
		throw Error("Error while Paginating Interventions");
	}
};

exports.getInterventionById = async function (query) {
	try {
		return await Intervention.findById(query).populate("clients", {}, "Client");
	} catch (e) {
		throw Error("Error while finding intervention by id" + e);
	}
};

exports.getInterventionsForClient = async function (req, res) {
	try {
		return await Intervention.find({ "client": req.params.id }, function (err, interventions) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			console.log(interventions);
			return interventions;
		}).populate("clients", {}, "Client");
	} catch (e) {
		throw Error("Error while Paginating Interventions" + e);
	}
};

exports.addIntervention = async function (req, res) {
	const intervention = new Intervention(
		{ date: req.body.date,
			label: req.body.label,
			agent: req.body.agent,
			intervention: req.body.intervention
		});

	try {
		await intervention.save(function (err) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
		});
		return intervention;
	} catch (e) {
		throw Error("Error while Paginating Interventions" + e);
	}
};

exports.updateIntervention = async function (req, res) {
	try {
		return 	await Intervention.findByIdAndUpdate(req.params.id, {
			date: req.body.date,
			label: req.body.label,
			agent: req.body.agent,
		}, {}, function (err, intervention) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			return intervention;
		}
		);
	} catch (e) {
		throw Error("Error while updating Interventions" + e);
	}
};

exports.deleteIntervention = async function (req, res) {
	try {
		return 	await Intervention.findByIdAndDelete(req.params.id, {}, function (err, intervention) {
			if (err) {
				return apiResponse.ErrorResponse(res, err);
			}
			ClientService.removeInterventionForClient(req, res, req.params.id, { $pull: { interventions: intervention._id } }).then(function () {
				if(err){
					return apiResponse.ErrorResponse(res, err);
				}
				return apiResponse.successResponseWithData(res, "Operation success");
			});
		}
		);
	} catch (e) {
		throw Error("Error while updating Interventions" + e);
	}
};