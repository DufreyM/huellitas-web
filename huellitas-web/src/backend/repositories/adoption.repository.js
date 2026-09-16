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

async function getAllAdoptionRequests({ skip, limit } = {}) {
    const [items, total] = await Promise.all([
        prisma.adoptionRequest.findMany({
            include: {
                adopter: true,
                pet: true
            },
            orderBy: {
                submittedAt: "desc"
            },
            skip,
            take: limit
        }),
        prisma.adoptionRequest.count()
    ]);

    return { items, total };
}

async function findById(id) {
    return prisma.adoptionRequest.findUnique({
        where: { id },
        include: {
            adopter: true,
            pet: true,
            adoption: true
        }
    });
}

async function updateStatus(id, status) {
    return prisma.adoptionRequest.update({
        where: { id },
        data: { status },
        include: {
            adopter: true,
            pet: true
        }
    });
}

async function createAdoption({ adopterId, petId, requestId, adoptionDate }) {
    return prisma.adoption.create({
        data: { adopterId, petId, requestId, adoptionDate }
    });
}

module.exports = {
    findAdopterByDpi,
    createAdopter,
    findPetById,
    createAdoptionRequest,
    getAllAdoptionRequests,
    findById,
    updateStatus,
    createAdoption
};
