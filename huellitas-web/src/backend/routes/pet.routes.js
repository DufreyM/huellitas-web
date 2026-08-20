const express = require("express");

const petController = require("../controllers/pet.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createPetSchema, updatePetSchema } = require("../validations/pet.validation");

const router = express.Router();

router.get("/", petController.getAllPets);

router.get("/:id", petController.getPetById);

router.post(
    "/",
    protect,
    authorize("Superadministrador", "Operador"),
    validate(createPetSchema),
    petController.createPet
);

router.put(
    "/:id",
    protect,
    authorize("Superadministrador", "Operador"),
    validate(updatePetSchema),
    petController.updatePet
);

router.delete(
    "/:id",
    protect,
    authorize("Superadministrador", "Operador"),
    petController.deletePet
);

module.exports = router;