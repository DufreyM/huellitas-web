const eventRepository = require("../repositories/event.repository");
const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const ApiError = require("../utils/ApiError");

async function getAllEvents({ skip, limit } = {}) {
    return await eventRepository.getAllEvents({ skip, limit });
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

// Vista consolidada de una jornada: horarios con cupo usado/disponible y
// cuántos pacientes hay en cada estado (inscrito, evaluado, castrado, etc.).
async function getJornadaDashboard(id) {
    const event = await getEventById(id);
    const statusSummary = await eventRegistrationRepository.getStatusSummary(id);

    const timeSlots = event.timeSlots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime,
        capacity: slot.capacity,
        registered: slot._count.registrations,
        available: Math.max(0, slot.capacity - slot._count.registrations)
    }));

    const totalCapacity = timeSlots.reduce((sum, slot) => sum + slot.capacity, 0);
    const totalRegistered = timeSlots.reduce((sum, slot) => sum + slot.registered, 0);

    return {
        event,
        timeSlots,
        totalCapacity,
        totalRegistered,
        statusSummary
    };
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getJornadaDashboard
};
