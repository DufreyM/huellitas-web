const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No se recibió ningún archivo");
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(201).json(
        new ApiResponse(201, "Imagen subida correctamente", { imageUrl })
    );
});

module.exports = { uploadImage };
