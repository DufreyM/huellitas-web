const petService = require("../services/pet.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, buildPaginatedResult } = require("../utils/pagination");

const getAllPets = asyncHandler(async (req, res) => {
    const availableOnly = req.query.availableOnly === "true";
    const { page, limit, skip } = parsePagination(req.query);

    const { items, total } = await petService.getAllPets({ availableOnly, skip, limit });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Mascotas obtenidas correctamente",
            buildPaginatedResult(items, total, page, limit)
        )
    );
});

const getPetById = asyncHandler(async (req, res) => {
    const pet = await petService.getPetById(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(
            200,
            "Mascota obtenida correctamente",
            pet
        )
    );
});

const createPet = asyncHandler(async (req, res) => {
    const pet = await petService.createPet(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Mascota creada correctamente",
            pet
        )
    );
});

const updatePet = asyncHandler(async (req, res) => {
    const pet = await petService.updatePet(
        Number(req.params.id),
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Mascota actualizada correctamente",
            pet
        )
    );
});

const deletePet = asyncHandler(async (req, res) => {
    await petService.deletePet(Number(req.params.id));

    return res.status(200).json(
        new ApiResponse(
            200,
            "Mascota eliminada correctamente"
        )
    );
});

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};