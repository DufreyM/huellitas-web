const eventService = require("../services/event.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, buildPaginatedResult } = require("../utils/pagination");

const getAllEvents = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { items, total } = await eventService.getAllEvents({ skip, limit });

    return res.status(200).json(
        new ApiResponse(200, "Eventos obtenidos correctamente", buildPaginatedResult(items, total, page, limit))
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

const getJornadaDashboard = asyncHandler(async (req, res) => {
    const dashboard = await eventService.getJornadaDashboard(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(200, "Resumen de la jornada obtenido correctamente", dashboard)
    );
});

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getJornadaDashboard
};
