const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validations/auth.validation");

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

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    authController.forgotPassword
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    authController.resetPassword
);

module.exports = router;
