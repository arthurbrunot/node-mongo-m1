const express = require("express");
const router = express.Router();

const ClientController = require("../controllers/ClientController");

router.get("/", ClientController.clientList);
router.get("/:id", ClientController.clientDetail);
router.post("/", ClientController.addClient);
router.put("/:id", ClientController.updateClient);
router.delete("/:id", ClientController.deleteClient);

module.exports = router;