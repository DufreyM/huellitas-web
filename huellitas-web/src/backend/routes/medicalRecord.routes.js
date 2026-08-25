const express = require("express");

const medicalRecordController = require("../controllers/medicalRecord.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createMedicalRecordSchema } = require("../validations/medicalRecord.validation");

const router = express.Router();

router.use(protect, authorize("Superadministrador", "Operador"));

router.get("/:petId", medicalRecordController.getByPet);

router.post(
    "/:petId",
    validate(createMedicalRecordSchema),
    medicalRecordController.create
);

module.exports = router;
