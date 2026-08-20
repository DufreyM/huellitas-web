const prisma = require("../config/prisma");

async function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id
        }
    });
}

async function findByResetTokenHash(tokenHash) {
    return prisma.user.findFirst({
        where: {
            passwordResetTokenHash: tokenHash
        }
    });
}

async function findAll() {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}

async function create(data) {
    return prisma.user.create({
        data
    });
}

async function update(id, data) {
    return prisma.user.update({
        where: {
            id
        },
        data
    });
}

module.exports = {
    findByEmail,
    findById,
    findByResetTokenHash,
    findAll,
    create,
    update
};
