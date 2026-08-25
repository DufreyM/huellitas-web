const eventRegistrationService = require("../services/eventRegistration.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllRegistrations = asyncHandler(async (req, res) => {
    const registrations = await eventRegistrationService.listRegistrations();

    return res.status(200).json(
        new ApiResponse(200, "Inscripciones obtenidas correctamente", registrations)
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
