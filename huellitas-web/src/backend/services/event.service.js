const eventRepository = require("../repositories/event.repository");
const ApiError = require("../utils/ApiError");

async function getAllEvents() {
    return await eventRepository.getAllEvents();
}

async function getEventById(id) {
    const event = await eventRepository.getEventById(id);

    if (!event || !event.isActive) {
        throw new ApiError(404, "Evento no encontrado");
    }

    return event;
}

async function createEvent(data, createdBy) {
    if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new ApiError(400, "La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    return await eventRepository.createEvent({
        ...data,
        createdBy
    });
}

async function updateEvent(id, data) {
    await getEventById(id);

    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
        throw new ApiError(400, "La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    return await eventRepository.updateEvent(id, data);
}

async function deleteEvent(id) {
    await getEventById(id);

    return await eventRepository.deleteEvent(id);
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
