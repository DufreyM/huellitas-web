const prisma = require("../config/prisma");

async function getAllDonations({ skip, limit } = {}) {
    const [items, total, aggregate] = await Promise.all([
        prisma.donation.findMany({
            orderBy: {
                donationDate: "desc"
            },
            skip,
            take: limit
        }),
        prisma.donation.count(),
        prisma.donation.aggregate({ _sum: { amount: true } })
    ]);

    return { items, total, totalAmount: Number(aggregate._sum.amount ?? 0) };
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
