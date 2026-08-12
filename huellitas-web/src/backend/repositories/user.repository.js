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

module.exports = {
    findByEmail,
    findById
};
