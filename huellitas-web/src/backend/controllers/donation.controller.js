const donationService = require("../services/donation.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllDonations = asyncHandler(async (req, res) => {
    const donations = await donationService.getAllDonations();

    return res.status(200).json(
        new ApiResponse(200, "Donaciones obtenidas correctamente", donations)
    );
});

const getDonationById = asyncHandler(async (req, res) => {
    const donation = await donationService.getDonationById(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(200, "Donación obtenida correctamente", donation)
    );
});

const createDonation = asyncHandler(async (req, res) => {
    const donation = await donationService.createDonation(req.body);

    return res.status(201).json(
        new ApiResponse(201, "Donación registrada correctamente", donation)
    );
});

const updateDonation = asyncHandler(async (req, res) => {
    const donation = await donationService.updateDonation(Number(req.params.id), req.body);

    return res.status(200).json(
        new ApiResponse(200, "Donación actualizada correctamente", donation)
    );
});

module.exports = {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation
};
