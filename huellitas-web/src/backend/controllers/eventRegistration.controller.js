const eventRegistrationService = require("../services/eventRegistration.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, buildPaginatedResult } = require("../utils/pagination");

const getAllRegistrations = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { items, total } = await eventRegistrationService.listRegistrations({ skip, limit });

    return res.status(200).json(
        new ApiResponse(200, "Inscripciones obtenidas correctamente", buildPaginatedResult(items, total, page, limit))
    );
});

const createRegistration = asyncHandler(async (req, res) => {
    const registration = await eventRegistrationService.createRegistration(req.body);

    return res.status(201).json(
        new ApiResponse(201, "Inscripción registrada correctamente", registration)
    );
});

module.exports = {
    getAllRegistrations,
    createRegistration
};
