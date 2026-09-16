jest.mock("../repositories/adoption.repository");
jest.mock("./pet.service");

const adoptionRepository = require("../repositories/adoption.repository");
const petService = require("./pet.service");
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
        adoptionRepository.findById.mockResolvedValue({ id: 1, status: "Pendiente", adoption: null });
        adoptionRepository.updateStatus.mockResolvedValue({ id: 1, status: "Aprobada" });

        const result = await adoptionService.updateAdoptionRequestStatus(1, "Aprobada");

        expect(adoptionRepository.updateStatus).toHaveBeenCalledWith(1, "Aprobada");
        expect(result.status).toBe("Aprobada");
    });

    it("al aprobar, crea el registro de adopción y fuerza el estado de la mascota con el autor", async () => {
        adoptionRepository.findById.mockResolvedValue({
            id: 5, status: "Pendiente", adopterId: 2, petId: 7, adoption: null
        });
        adoptionRepository.updateStatus.mockResolvedValue({ id: 5, status: "Aprobada" });

        await adoptionService.updateAdoptionRequestStatus(5, "Aprobada", 4);

        expect(adoptionRepository.createAdoption).toHaveBeenCalledWith(
            expect.objectContaining({ adopterId: 2, petId: 7, requestId: 5 })
        );
        expect(petService.forceStatus).toHaveBeenCalledWith(7, "Adoptada", expect.any(String), 4);
    });

    it("no duplica la adopción si la solicitud ya estaba aprobada", async () => {
        adoptionRepository.findById.mockResolvedValue({
            id: 5, status: "Aprobada", adopterId: 2, petId: 7, adoption: { id: 1 }
        });
        adoptionRepository.updateStatus.mockResolvedValue({ id: 5, status: "Aprobada" });

        await adoptionService.updateAdoptionRequestStatus(5, "Aprobada");

        expect(adoptionRepository.createAdoption).not.toHaveBeenCalled();
        expect(petService.forceStatus).not.toHaveBeenCalled();
    });

    it("no completa la adopción al rechazar una solicitud", async () => {
        adoptionRepository.findById.mockResolvedValue({
            id: 5, status: "Pendiente", adopterId: 2, petId: 7, adoption: null
        });
        adoptionRepository.updateStatus.mockResolvedValue({ id: 5, status: "Rechazada" });

        await adoptionService.updateAdoptionRequestStatus(5, "Rechazada");

        expect(adoptionRepository.createAdoption).not.toHaveBeenCalled();
        expect(petService.forceStatus).not.toHaveBeenCalled();
    });
});
