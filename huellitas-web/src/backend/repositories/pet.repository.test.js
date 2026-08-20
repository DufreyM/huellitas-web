jest.mock("../config/prisma", () => ({
    pet: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    petImage: {
        deleteMany: jest.fn()
    },
    $transaction: jest.fn()
}));

const prisma = require("../config/prisma");
const petRepository = require("./pet.repository");

describe("pet.repository — acceso a datos", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getAllPets consulta solo mascotas activas por defecto", async () => {
        prisma.pet.findMany.mockResolvedValue([]);

        await petRepository.getAllPets();

        expect(prisma.pet.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { isActive: true }
            })
        );
    });

    it("getAllPets agrega el filtro de status cuando availableOnly es true", async () => {
        prisma.pet.findMany.mockResolvedValue([]);

        await petRepository.getAllPets({ availableOnly: true });

        expect(prisma.pet.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    isActive: true,
                    status: { notIn: ["Adoptada", "En_tratamiento"] }
                }
            })
        );
    });

    it("getPetById usa findUnique con el id recibido", async () => {
        prisma.pet.findUnique.mockResolvedValue({ id: 5 });

        await petRepository.getPetById(5);

        expect(prisma.pet.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 5 } })
        );
    });

    it("createPet llama a prisma.pet.create con los datos recibidos", async () => {
        prisma.pet.create.mockResolvedValue({ id: 1 });

        await petRepository.createPet({ name: "Firulais" });

        expect(prisma.pet.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ name: "Firulais" })
            })
        );
    });

    it("deletePet hace un soft-delete (isActive: false) en vez de borrar", async () => {
        prisma.pet.update.mockResolvedValue({ id: 1, isActive: false });

        await petRepository.deletePet(1);

        expect(prisma.pet.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { isActive: false }
        });
    });
});
