const eventRegistrationService = require("../services/eventRegistration.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, buildPaginatedResult } = require("../utils/pagination");

const getAllRegistrations = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const eventId = req.query.eventId ? Number(req.query.eventId) : undefined;
    const { status } = req.query;
    const { items, total } = await eventRegistrationService.listRegistrations({ skip, limit, eventId, status });

    return res.status(200).json(
        new ApiResponse(200, "Inscripciones obtenidas correctamente", buildPaginatedResult(items, total, page, limit))
    );
});

const getRegistrationById = asyncHandler(async (req, res) => {
    const registration = await eventRegistrationService.getRegistrationById(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(200, "Inscripción obtenida correctamente", registration)
    );
});

const createRegistration = asyncHandler(async (req, res) => {
    const registration = await eventRegistrationService.createRegistration(req.body);

    return res.status(201).json(
        new ApiResponse(201, "Inscripción registrada correctamente", registration)
    );
});

const updatePatientRecord = asyncHandler(async (req, res) => {
    const registration = await eventRegistrationService.updatePatientRecord(Number(req.params.id), req.body);

    return res.status(200).json(
        new ApiResponse(200, "Registro del paciente actualizado correctamente", registration)
    );
});

const sendReminder = asyncHandler(async (req, res) => {
    await eventRegistrationService.sendReminder(Number(req.params.id), req.body.type);

    return res.status(200).json(
        new ApiResponse(200, "Recordatorio enviado correctamente")
    );
});

module.exports = {
    getAllRegistrations,
    getRegistrationById,
    createRegistration,
    updatePatientRecord,
    sendReminder
};
