const adoptionRepository = require("../repositories/adoption.repository");
const petService = require("./pet.service");
const ApiError = require("../utils/ApiError");

async function createAdoptionRequest(data) {
    const {
        fullName,
        dpi,
        phone,
        email,
        address,
        municipality,
        petId,
        reason,
        hasChildren,
        familyAgreement,
        hasVeterinarian,
        secureSpace
    } = data;

    const pet = await adoptionRepository.findPetById(petId);

    if (!pet || !pet.isActive) {
        throw new ApiError(404, "Mascota no encontrada");
    }

    if (pet.status !== "Disponible") {
        throw new ApiError(400, "Esta mascota ya no está disponible para adopción");
    }

    let adopter = await adoptionRepository.findAdopterByDpi(dpi);

    if (!adopter) {
        adopter = await adoptionRepository.createAdopter({
            fullName,
            dpi,
            phone,
            email,
            address,
            municipality
        });
    }

    return await adoptionRepository.createAdoptionRequest({
        adopterId: adopter.id,
        petId,
        status: "Pendiente",
        reason,
        hasChildren,
        familyAgreement,
        hasVeterinarian,
        secureSpace
    });
}

async function listAdoptionRequests({ skip, limit } = {}) {
    return await adoptionRepository.getAllAdoptionRequests({ skip, limit });
}

async function updateAdoptionRequestStatus(id, status) {
    const existing = await adoptionRepository.findById(id);

    if (!existing) {
        throw new ApiError(404, "Solicitud de adopción no encontrada");
    }

    const updated = await adoptionRepository.updateStatus(id, status);

    // Al aprobar, se completa la adopción: se registra en `adoptions` y la mascota
    // pasa a "Adoptada", quedando visible en la línea de tiempo de Seguimiento.
    if (status === "Aprobada" && existing.status !== "Aprobada" && !existing.adoption) {
        await adoptionRepository.createAdoption({
            adopterId: existing.adopterId,
            petId: existing.petId,
            requestId: existing.id,
            adoptionDate: new Date()
        });

        await petService.forceStatus(
            existing.petId,
            "Adoptada",
            `Adopción aprobada (solicitud #${existing.id})`
        );
    }

    return updated;
}

module.exports = {
    createAdoptionRequest,
    listAdoptionRequests,
    updateAdoptionRequestStatus
};
