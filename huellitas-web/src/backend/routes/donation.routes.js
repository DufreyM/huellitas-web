const express = require("express");

const donationController = require("../controllers/donation.controller");
const validate = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createDonationSchema, updateDonationSchema } = require("../validations/donation.validation");

const router = express.Router();

router.use(protect, authorize("Superadministrador"));

router.get("/", donationController.getAllDonations);

router.get("/:id", donationController.getDonationById);

router.post(
    "/",
    validate(createDonationSchema),
    donationController.createDonation
);

router.put(
    "/:id",
    validate(updateDonationSchema),
    donationController.updateDonation
);

module.exports = router;
