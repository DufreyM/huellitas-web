const prisma = require("../config/prisma");

async function findAdopterByDpi(dpi) {
    return prisma.adopter.findUnique({
        where: {
            dpi
        }
    });
}

async function createAdopter(data) {
    return prisma.adopter.create({
        data
    });
}

async function findPetById(petId) {
    return prisma.pet.findUnique({
        where: {
            id: petId
        }
    });
}

async function createAdoptionRequest(data) {
    return prisma.adoptionRequest.create({
        data
    });
}

async function getAllAdoptionRequests() {
    return prisma.adoptionRequest.findMany({
        include: {
            adopter: true,
            pet: true
        },
        orderBy: {
            submittedAt: "desc"
        }
    });
}

module.exports = {
    findAdopterByDpi,
    createAdopter,
    findPetById,
    createAdoptionRequest,
    getAllAdoptionRequests
};
