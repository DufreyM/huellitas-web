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

module.exports = {
    createAdoptionRequest
};
