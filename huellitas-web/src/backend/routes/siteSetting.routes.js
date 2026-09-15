const express = require("express");

const siteSettingController = require("../controllers/siteSetting.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { updateSiteSettingsSchema } = require("../validations/siteSetting.validation");

const router = express.Router();

router.get("/", siteSettingController.getSiteSettings);

router.put(
    "/",
    protect,
    authorize("Superadministrador"),
    validate(updateSiteSettingsSchema),
    siteSettingController.updateSiteSettings
);

module.exports = router;
