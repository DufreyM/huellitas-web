const express = require("express");

const adoptionController = require("../controllers/adoption.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createAdoptionRequestSchema } = require("../validations/adoption.validation");

const router = express.Router();

router.post(
    "/",
    validate(createAdoptionRequestSchema),
    adoptionController.createAdoptionRequest
);

router.get(
    "/",
    protect,
    authorize("Superadministrador", "Operador"),
    adoptionController.getAllAdoptionRequests
);

module.exports = router;
