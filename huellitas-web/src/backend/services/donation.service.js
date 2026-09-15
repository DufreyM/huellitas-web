const donationRepository = require("../repositories/donation.repository");
const ApiError = require("../utils/ApiError");

async function getAllDonations({ skip, limit } = {}) {
    return await donationRepository.getAllDonations({ skip, limit });
}

async function getDonationById(id) {
    const donation = await donationRepository.getDonationById(id);

    if (!donation) {
        throw new ApiError(404, "Donación no encontrada");
    }

    return donation;
}

async function createDonation(data) {
    return await donationRepository.createDonation(data);
}

async function updateDonation(id, data) {
    await getDonationById(id);

    return await donationRepository.updateDonation(id, data);
}

module.exports = {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation
};
