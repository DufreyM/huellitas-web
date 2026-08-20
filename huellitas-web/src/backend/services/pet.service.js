const petRepository = require("../repositories/pet.repository");
const ApiError = require("../utils/ApiError");

const VALID_STATUS_TRANSITIONS = {
    Disponible: ["En_tratamiento", "Reservada", "No_disponible"],
    En_tratamiento: ["Disponible", "No_disponible"],
    Reservada: ["Adoptada", "Disponible", "No_disponible"],
    Adoptada: ["En_tratamiento", "No_disponible"],
    No_disponible: ["Disponible", "En_tratamiento"]
};

async function getAllPets(options) {
    return await petRepository.getAllPets(options);
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
    const currentPet = await getPetById(id);

    if (data.status && data.status !== currentPet.status) {
        const allowedNextStatuses = VALID_STATUS_TRANSITIONS[currentPet.status] || [];

        if (!allowedNextStatuses.includes(data.status)) {
            throw new ApiError(
                400,
                `Transición de estado inválida: ${currentPet.status} → ${data.status}`
            );
        }
    }

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