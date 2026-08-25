const prisma = require("../config/prisma");

async function getByPetId(petId) {
    return prisma.medicalRecord.findMany({
        where: {
            petId
        },
        orderBy: {
            consultationDate: "desc"
        }
    });
}

async function createMedicalRecord(data) {
    return prisma.medicalRecord.create({
        data
    });
}

module.exports = {
    getByPetId,
    createMedicalRecord
};
