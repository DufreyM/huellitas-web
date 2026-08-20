const express = require("express");

const adoptionController = require("../controllers/adoption.controller");
const validate = require("../middlewares/validate.middleware");
const { createAdoptionRequestSchema } = require("../validations/adoption.validation");

const router = express.Router();

router.post(
    "/",
    validate(createAdoptionRequestSchema),
    adoptionController.createAdoptionRequest
);

module.exports = router;
