const eventService = require("../services/event.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getAllEvents();

    return res.status(200).json(
        new ApiResponse(200, "Eventos obtenidos correctamente", events)
    );
});

const getEventById = asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(200, "Evento obtenido correctamente", event)
    );
});

const createEvent = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.body, req.user.id);

    return res.status(201).json(
        new ApiResponse(201, "Evento creado correctamente", event)
    );
});

const updateEvent = asyncHandler(async (req, res) => {
    const event = await eventService.updateEvent(Number(req.params.id), req.body);

    return res.status(200).json(
        new ApiResponse(200, "Evento actualizado correctamente", event)
    );
});

const deleteEvent = asyncHandler(async (req, res) => {
    await eventService.deleteEvent(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(200, "Evento eliminado correctamente")
    );
});

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
