const prisma = require("../config/prisma");

async function getAllPets() {
    return prisma.pet.findMany({
        where: {
            isActive: true
        },
        include: {
            images: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

async function getPetById(id) {
    return prisma.pet.findUnique({
        where: {
            id
        },
        include: {
            images: true,
            medicalRecords: true
        }
    });
}

async function createPet(data) {
    return prisma.pet.create({
        data
    });
}

async function updatePet(id, data) {
    return prisma.pet.update({
        where: {
            id
        },
        data
    });
}

async function deletePet(id) {
    return prisma.pet.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
}

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};