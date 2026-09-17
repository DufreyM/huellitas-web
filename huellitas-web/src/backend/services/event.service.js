const eventRepository = require("../repositories/event.repository");
const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const ApiError = require("../utils/ApiError");

// Aplana el _count de Prisma a un cupo usado/disponible legible tanto para el
// formulario público como para el dashboard administrativo.
function withSlotAvailability(event) {
    return {
        ...event,
        timeSlots: (event.timeSlots ?? []).map(slot => ({
            id: slot.id,
            eventId: slot.eventId,
            startTime: slot.startTime,
            capacity: slot.capacity,
            registered: slot._count.registrations,
            available: Math.max(0, slot.capacity - slot._count.registrations)
        }))
    };
}

async function getAllEvents({ skip, limit } = {}) {
    const { items, total } = await eventRepository.getAllEvents({ skip, limit });

    return { items: items.map(withSlotAvailability), total };
}

async function getEventById(id) {
    const event = await eventRepository.getEventById(id);

    if (!event || !event.isActive) {
        throw new ApiError(404, "Evento no encontrado");
    }

    return withSlotAvailability(event);
}

async function createEvent(data, createdBy) {
    if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new ApiError(400, "La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    const event = await eventRepository.createEvent({
        ...data,
        createdBy
    });

    return withSlotAvailability(event);
}

async function updateEvent(id, data) {
    await getEventById(id);

    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
        throw new ApiError(400, "La fecha de fin no puede ser anterior a la fecha de inicio");
    }

    const event = await eventRepository.updateEvent(id, data);

    return withSlotAvailability(event);
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

    const totalCapacity = event.timeSlots.reduce((sum, slot) => sum + slot.capacity, 0);
    const totalRegistered = event.timeSlots.reduce((sum, slot) => sum + slot.registered, 0);

    return {
        event,
        timeSlots: event.timeSlots,
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
