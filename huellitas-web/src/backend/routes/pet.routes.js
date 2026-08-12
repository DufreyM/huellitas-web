const express = require("express");

const petController = require("../controllers/pet.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { createPetSchema, updatePetSchema } = require("../validations/pet.validation");

const router = express.Router();

router.get("/", petController.getAllPets);

router.get("/:id", petController.getPetById);

router.post(
    "/",
    protect,
    validate(createPetSchema),
    petController.createPet
);

router.put(
    "/:id",
    protect,
    validate(updatePetSchema),
    petController.updatePet
);

router.delete("/:id", protect, petController.deletePet);

module.exports = router;