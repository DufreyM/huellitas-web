const adoptionService = require("../services/adoption.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createAdoptionRequest = asyncHandler(async (req, res) => {
    const adoptionRequest = await adoptionService.createAdoptionRequest(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Solicitud de adopción enviada correctamente",
            adoptionRequest
        )
    );
});

const getAllAdoptionRequests = asyncHandler(async (req, res) => {
    const adoptionRequests = await adoptionService.listAdoptionRequests();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Solicitudes de adopción obtenidas correctamente",
            adoptionRequests
        )
    );
});

module.exports = {
    createAdoptionRequest,
    getAllAdoptionRequests
};
