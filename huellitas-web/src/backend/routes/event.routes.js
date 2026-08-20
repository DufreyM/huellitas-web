const express = require("express");

const eventController = require("../controllers/event.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createEventSchema, updateEventSchema } = require("../validations/event.validation");

const router = express.Router();

router.get("/", eventController.getAllEvents);

router.get("/:id", eventController.getEventById);

router.post(
    "/",
    protect,
    authorize("Superadministrador"),
    validate(createEventSchema),
    eventController.createEvent
);

router.put(
    "/:id",
    protect,
    authorize("Superadministrador"),
    validate(updateEventSchema),
    eventController.updateEvent
);

router.delete(
    "/:id",
    protect,
    authorize("Superadministrador"),
    eventController.deleteEvent
);

module.exports = router;
