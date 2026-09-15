jest.mock("../repositories/adoption.repository");

const adoptionRepository = require("../repositories/adoption.repository");
const adoptionService = require("./adoption.service");

describe("adoption.service — updateAdoptionRequestStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("lanza ApiError 404 si la solicitud no existe", async () => {
        adoptionRepository.findById.mockResolvedValue(null);

        await expect(
            adoptionService.updateAdoptionRequestStatus(999, "Aprobada")
        ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("actualiza el estado cuando la solicitud existe", async () => {
        adoptionRepository.findById.mockResolvedValue({ id: 1, status: "Pendiente" });
        adoptionRepository.updateStatus.mockResolvedValue({ id: 1, status: "Aprobada" });

        const result = await adoptionService.updateAdoptionRequestStatus(1, "Aprobada");

        expect(adoptionRepository.updateStatus).toHaveBeenCalledWith(1, "Aprobada");
        expect(result.status).toBe("Aprobada");
    });
});
