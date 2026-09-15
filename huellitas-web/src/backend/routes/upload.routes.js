const express = require("express");

const uploadController = require("../controllers/upload.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
    "/image",
    protect,
    authorize("Superadministrador", "Operador"),
    upload.single("image"),
    uploadController.uploadImage
);

module.exports = router;
