const medicalRecordService = require("../services/medicalRecord.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getByPet = asyncHandler(async (req, res) => {
    const records = await medicalRecordService.listByPet(Number(req.params.petId));

    return res.status(200).json(
        new ApiResponse(200, "Historial médico obtenido correctamente", records)
    );
});

const create = asyncHandler(async (req, res) => {
    const record = await medicalRecordService.createMedicalRecord(Number(req.params.petId), req.body);

    return res.status(201).json(
        new ApiResponse(201, "Registro médico agregado correctamente", record)
    );
});

module.exports = {
    getByPet,
    create
};
