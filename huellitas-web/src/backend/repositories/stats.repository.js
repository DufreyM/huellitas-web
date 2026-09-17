const prisma = require("../config/prisma");

async function countPets() {
    return prisma.pet.count();
}

async function countPetsByStatus(status) {
    return prisma.pet.count({ where: { status } });
}

async function countRegistrationsByStatus(statuses) {
    return prisma.eventRegistration.count({ where: { status: { in: statuses } } });
}

module.exports = { countPets, countPetsByStatus, countRegistrationsByStatus };
