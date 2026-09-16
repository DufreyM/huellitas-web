const prisma = require("../config/prisma");

async function getAllPets({ availableOnly = false, skip, limit } = {}) {
    const where = {
        isActive: true,
        ...(availableOnly && {
            status: {
                notIn: ["Adoptada", "En_tratamiento"]
            }
        })
    };

    const [items, total] = await Promise.all([
        prisma.pet.findMany({
            where,
            include: {
                images: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        }),
        prisma.pet.count({ where })
    ]);

    return { items, total };
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
    const { images, ...petData } = data;

    return prisma.pet.create({
        data: {
            ...petData,
            images: images?.length ? { create: images } : undefined
        },
        include: {
            images: true
        }
    });
}

async function updatePet(id, data) {
    const { images, ...petData } = data;

    if (!images) {
        return prisma.pet.update({
            where: {
                id
            },
            data: petData,
            include: {
                images: true
            }
        });
    }

    const [, updatedPet] = await prisma.$transaction([
        prisma.petImage.deleteMany({
            where: {
                petId: id
            }
        }),
        prisma.pet.update({
            where: {
                id
            },
            data: {
                ...petData,
                images: images.length ? { create: images } : undefined
            },
            include: {
                images: true
            }
        })
    ]);

    return updatedPet;
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

async function createStatusHistory({ petId, previousStatus, newStatus, note }) {
    return prisma.petStatusHistory.create({
        data: { petId, previousStatus, newStatus, note }
    });
}

async function getStatusHistory(petId) {
    return prisma.petStatusHistory.findMany({
        where: { petId },
        orderBy: { changedAt: "desc" }
    });
}

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    createStatusHistory,
    getStatusHistory
};