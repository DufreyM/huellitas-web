const petRepository = require("../repositories/pet.repository");
const ApiError = require("../utils/ApiError");

async function getAllPets() {
    return await petRepository.getAllPets();
}

async function getPetById(id) {
    const pet = await petRepository.getPetById(id);

    if (!pet || !pet.isActive) {
        throw new ApiError(404, "Mascota no encontrada");
    }

    return pet;
}

async function createPet(data) {
    return await petRepository.createPet(data);
}

async function updatePet(id, data) {
    await getPetById(id);

    return await petRepository.updatePet(id, data);
}

async function deletePet(id) {
    await getPetById(id);

    return await petRepository.deletePet(id);
}

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};