const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const ApiError = require("../utils/ApiError");

async function listRegistrations({ skip, limit } = {}) {
    return await eventRegistrationRepository.getAllRegistrations({ skip, limit });
}

async function createRegistration(data) {
    const event = await eventRegistrationRepository.findEventById(data.eventId);

    if (!event || !event.isActive) {
        throw new ApiError(404, "Evento no encontrado");
    }

    if (event.status === "Finalizado" || event.status === "Cancelado") {
        throw new ApiError(400, "Este evento ya no acepta inscripciones");
    }

    return await eventRegistrationRepository.createRegistration(data);
}

module.exports = {
    listRegistrations,
    createRegistration
};
