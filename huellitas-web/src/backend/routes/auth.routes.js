const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { loginSchema } = require("../validations/auth.validation");

const router = express.Router();

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

router.get(
    "/me",
    protect,
    authController.me
);

module.exports = router;
