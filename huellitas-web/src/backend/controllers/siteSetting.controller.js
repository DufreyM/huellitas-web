const siteSettingService = require("../services/siteSetting.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getSiteSettings = asyncHandler(async (req, res) => {
    const settings = await siteSettingService.getSiteSettings();

    return res.status(200).json(
        new ApiResponse(200, "Configuración obtenida correctamente", settings)
    );
});

const updateSiteSettings = asyncHandler(async (req, res) => {
    const settings = await siteSettingService.updateSiteSettings(req.body);

    return res.status(200).json(
        new ApiResponse(200, "Configuración actualizada correctamente", settings)
    );
});

module.exports = { getSiteSettings, updateSiteSettings };
