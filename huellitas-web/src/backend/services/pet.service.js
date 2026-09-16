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

async function updatePet(id, data, changedByUserId) {
    const currentPet = await getPetById(id);
    const statusChanged = data.status && data.status !== currentPet.status;

    if (statusChanged) {
        const allowedNextStatuses = VALID_STATUS_TRANSITIONS[currentPet.status] || [];

        if (!allowedNextStatuses.includes(data.status)) {
            throw new ApiError(
                400,
                `Transición de estado inválida: ${currentPet.status} → ${data.status}`
            );
        }
    }

    const updatedPet = await petRepository.updatePet(id, data);

    if (statusChanged) {
        await petRepository.createStatusHistory({
            petId: id,
            previousStatus: currentPet.status,
            newStatus: data.status,
            note: "Actualizado manualmente desde el panel de Adopciones",
            changedByUserId
        });
    }

    return updatedPet;
}

// Cambia el estado sin validar VALID_STATUS_TRANSITIONS: uso exclusivo de flujos internos
// ya autorizados (p. ej. al aprobar una solicitud de adopción), no de ediciones directas.
async function forceStatus(id, newStatus, note, changedByUserId) {
    const currentPet = await getPetById(id);

    if (currentPet.status === newStatus) {
        return currentPet;
    }

    const updatedPet = await petRepository.updatePet(id, { status: newStatus });

    await petRepository.createStatusHistory({
        petId: id,
        previousStatus: currentPet.status,
        newStatus,
        note,
        changedByUserId
    });

    return updatedPet;
}

async function getStatusHistory(id) {
    await getPetById(id);

    return await petRepository.getStatusHistory(id);
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
    forceStatus,
    getStatusHistory,
    deletePet
};