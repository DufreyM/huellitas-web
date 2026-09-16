const express = require("express");

const eventRegistrationController = require("../controllers/eventRegistration.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
    createEventRegistrationSchema,
    updateEventRegistrationSchema,
    sendReminderSchema
} = require("../validations/eventRegistration.validation");

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

router.get(
    "/:id",
    protect,
    authorize("Superadministrador", "Operador"),
    eventRegistrationController.getRegistrationById
);

router.put(
    "/:id",
    protect,
    authorize("Superadministrador", "Operador"),
    validate(updateEventRegistrationSchema),
    eventRegistrationController.updatePatientRecord
);

router.post(
    "/:id/send-reminder",
    protect,
    authorize("Superadministrador", "Operador"),
    validate(sendReminderSchema),
    eventRegistrationController.sendReminder
);

module.exports = router;
