const express = require("express");

const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createUserSchema } = require("../validations/user.validation");

const router = express.Router();

router.use(protect, authorize("Superadministrador"));

router.get("/", userController.getAllUsers);

router.post(
    "/",
    validate(createUserSchema),
    userController.createUser
);

module.exports = router;
