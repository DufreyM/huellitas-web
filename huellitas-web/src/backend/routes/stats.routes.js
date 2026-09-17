const express = require("express");

const statsController = require("../controllers/stats.controller");

const router = express.Router();

router.get("/impact", statsController.getImpactStats);

module.exports = router;
