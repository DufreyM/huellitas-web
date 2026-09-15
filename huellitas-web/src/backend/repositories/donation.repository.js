const prisma = require("../config/prisma");

async function getAllDonations({ skip, limit } = {}) {
    const [items, total] = await Promise.all([
        prisma.donation.findMany({
            orderBy: {
                donationDate: "desc"
            },
            skip,
            take: limit
        }),
        prisma.donation.count()
    ]);

    return { items, total };
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
