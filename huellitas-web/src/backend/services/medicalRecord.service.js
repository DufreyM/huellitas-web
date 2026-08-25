const medicalRecordRepository = require("../repositories/medicalRecord.repository");
const petService = require("./pet.service");

async function listByPet(petId) {
    // Lanza 404 si la mascota no existe o está inactiva.
    await petService.getPetById(petId);

    return await medicalRecordRepository.getByPetId(petId);
}

async function createMedicalRecord(petId, data) {
    await petService.getPetById(petId);

    return await medicalRecordRepository.createMedicalRecord({
        ...data,
        petId
    });
}

module.exports = {
    listByPet,
    createMedicalRecord
};
