const express = require("express");

const eventRegistrationController = require("../controllers/eventRegistration.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createEventRegistrationSchema } = require("../validations/eventRegistration.validation");

const router = express.Router();

router.post(
    "/",
    validate(createEventRegistrationSchema),
    eventRegistrationController.createRegistration
);

router.get(
    "/",
    protect,
    authorize("Superadministrador", "Operador", "Voluntario"),
    eventRegistrationController.getAllRegistrations
);

module.exports = router;
