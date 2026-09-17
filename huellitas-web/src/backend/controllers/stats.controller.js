const statsService = require("../services/stats.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getImpactStats = asyncHandler(async (req, res) => {
    const stats = await statsService.getImpactStats();

    return res.status(200).json(
        new ApiResponse(200, "Estadísticas obtenidas correctamente", stats)
    );
});

module.exports = { getImpactStats };
