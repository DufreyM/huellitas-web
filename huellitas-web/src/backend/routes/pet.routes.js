const express = require("express");

const petController = require("../controllers/pet.controller");
const validate = require("../middlewares/validate.middleware");
const { createPetSchema } = require("../validations/pet.validation");

const router = express.Router();

router.get("/", petController.getAllPets);

router.get("/:id", petController.getPetById);

router.post(
    "/",
    validate(createPetSchema),
    petController.createPet
);

router.put(
    "/:id",
    validate(createPetSchema),
    petController.updatePet
);

router.delete("/:id", petController.deletePet);

module.exports = router;