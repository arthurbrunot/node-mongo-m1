const express = require("express");
const router = express.Router();

const InterventionController = require("../controllers/InterventionController");

router.get("/", InterventionController.interventionList);
router.get("/:id", InterventionController.interventionDetail);
router.post("/", InterventionController.addIntervention);
router.put("/:id", InterventionController.updateIntervention);
router.delete("/:id", InterventionController.deleteIntervention);

module.exports = router;