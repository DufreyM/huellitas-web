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

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};