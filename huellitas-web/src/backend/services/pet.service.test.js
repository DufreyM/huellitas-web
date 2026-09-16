jest.mock("../repositories/pet.repository");

const petRepository = require("../repositories/pet.repository");
const petService = require("./pet.service");
const ApiError = require("../utils/ApiError");

const basePet = {
    id: 1,
    name: "Firulais",
    species: "Perro",
    status: "Disponible",
    isActive: true
};

describe("pet.service — creación y validación", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("crea una mascota delegando en el repositorio", async () => {
        petRepository.createPet.mockResolvedValue(basePet);

        const result = await petService.createPet({ name: "Firulais" });

        expect(petRepository.createPet).toHaveBeenCalledWith({ name: "Firulais" });
        expect(result).toEqual(basePet);
    });
});

describe("pet.service — mascota no encontrada", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("lanza ApiError 404 si la mascota no existe", async () => {
        petRepository.getPetById.mockResolvedValue(null);

        await expect(petService.getPetById(999)).rejects.toThrow(ApiError);
        await expect(petService.getPetById(999)).rejects.toMatchObject({ statusCode: 404 });
    });

    it("lanza ApiError 404 si la mascota está inactiva (soft-deleted)", async () => {
        petRepository.getPetById.mockResolvedValue({ ...basePet, isActive: false });

        await expect(petService.getPetById(1)).rejects.toMatchObject({ statusCode: 404 });
    });

    it("propaga el error si updatePet apunta a una mascota inexistente", async () => {
        petRepository.getPetById.mockResolvedValue(null);

        await expect(petService.updatePet(999, { status: "Reservada" })).rejects.toMatchObject({ statusCode: 404 });
        expect(petRepository.updatePet).not.toHaveBeenCalled();
    });
});

describe("pet.service — transiciones de estado", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("permite una transición válida (Disponible → Reservada)", async () => {
        petRepository.getPetById.mockResolvedValue(basePet);
        petRepository.updatePet.mockResolvedValue({ ...basePet, status: "Reservada" });

        const result = await petService.updatePet(1, { status: "Reservada" });

        expect(petRepository.updatePet).toHaveBeenCalledWith(1, { status: "Reservada" });
        expect(result.status).toBe("Reservada");
    });

    it("rechaza una transición inválida (Adoptada → Disponible sin revisión)", async () => {
        petRepository.getPetById.mockResolvedValue({ ...basePet, status: "Adoptada" });

        await expect(petService.updatePet(1, { status: "Disponible" })).rejects.toMatchObject({ statusCode: 400 });
        expect(petRepository.updatePet).not.toHaveBeenCalled();
    });

    it("permite reenviar el mismo status sin validar transición (edición normal)", async () => {
        petRepository.getPetById.mockResolvedValue(basePet);
        petRepository.updatePet.mockResolvedValue(basePet);

        await petService.updatePet(1, { name: "Firulais editado", status: "Disponible" });

        expect(petRepository.updatePet).toHaveBeenCalled();
    });

    it("registra el cambio en el historial cuando el status sí cambia", async () => {
        petRepository.getPetById.mockResolvedValue(basePet);
        petRepository.updatePet.mockResolvedValue({ ...basePet, status: "Reservada" });

        await petService.updatePet(1, { status: "Reservada" });

        expect(petRepository.createStatusHistory).toHaveBeenCalledWith({
            petId: 1,
            previousStatus: "Disponible",
            newStatus: "Reservada"
        });
    });

    it("no registra historial si el status no cambia", async () => {
        petRepository.getPetById.mockResolvedValue(basePet);
        petRepository.updatePet.mockResolvedValue(basePet);

        await petService.updatePet(1, { name: "Firulais editado", status: "Disponible" });

        expect(petRepository.createStatusHistory).not.toHaveBeenCalled();
    });
});

describe("pet.service — forceStatus", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("cambia el estado sin validar VALID_STATUS_TRANSITIONS", async () => {
        petRepository.getPetById.mockResolvedValue({ ...basePet, status: "Disponible" });
        petRepository.updatePet.mockResolvedValue({ ...basePet, status: "Adoptada" });

        const result = await petService.forceStatus(1, "Adoptada", "Adopción aprobada");

        expect(petRepository.updatePet).toHaveBeenCalledWith(1, { status: "Adoptada" });
        expect(petRepository.createStatusHistory).toHaveBeenCalledWith({
            petId: 1,
            previousStatus: "Disponible",
            newStatus: "Adoptada",
            note: "Adopción aprobada"
        });
        expect(result.status).toBe("Adoptada");
    });

    it("no hace nada si ya tiene ese estado", async () => {
        petRepository.getPetById.mockResolvedValue({ ...basePet, status: "Adoptada" });

        await petService.forceStatus(1, "Adoptada", "nota");

        expect(petRepository.updatePet).not.toHaveBeenCalled();
        expect(petRepository.createStatusHistory).not.toHaveBeenCalled();
    });
});
