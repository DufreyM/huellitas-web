const statsRepository = require("../repositories/stats.repository");

const CASTRATED_STATUSES = ["Castrado", "En_seguimiento", "Seguimiento_finalizado"];

async function getImpactStats() {
    const [rescatados, adoptados, castrados] = await Promise.all([
        statsRepository.countPets(),
        statsRepository.countPetsByStatus("Adoptada"),
        statsRepository.countRegistrationsByStatus(CASTRATED_STATUSES)
    ]);

    return { rescatados, adoptados, castrados };
}

module.exports = { getImpactStats };
