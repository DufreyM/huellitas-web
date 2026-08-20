const prisma = require("../config/prisma");

async function getAllDonations() {
    return prisma.donation.findMany({
        orderBy: {
            donationDate: "desc"
        }
    });
}

async function getDonationById(id) {
    return prisma.donation.findUnique({
        where: {
            id
        }
    });
}

async function createDonation(data) {
    return prisma.donation.create({
        data
    });
}

async function updateDonation(id, data) {
    return prisma.donation.update({
        where: {
            id
        },
        data
    });
}

module.exports = {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation
};
