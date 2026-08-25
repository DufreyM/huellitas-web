jest.mock("../repositories/eventRegistration.repository");

const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const eventRegistrationService = require("./eventRegistration.service");

const validData = {
    eventId: 1,
    petName: "Firulais",
    species: "Perro",
    breed: "Mestizo",
    ownerName: "Juan Pérez",
    ownerPhone: "55551234",
    procedureType: "Castracion"
};

describe("eventRegistration.service — reglas de negocio", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("rechaza si el evento no existe", async () => {
        eventRegistrationRepository.findEventById.mockResolvedValue(null);

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 404 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("rechaza inscripciones a un evento finalizado", async () => {
        eventRegistrationRepository.findEventById.mockResolvedValue({ id: 1, isActive: true, status: "Finalizado" });

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("rechaza inscripciones a un evento cancelado", async () => {
        eventRegistrationRepository.findEventById.mockResolvedValue({ id: 1, isActive: true, status: "Cancelado" });

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
    });

    it("crea la inscripción si el evento está programado", async () => {
        eventRegistrationRepository.findEventById.mockResolvedValue({ id: 1, isActive: true, status: "Programado" });
        eventRegistrationRepository.createRegistration.mockResolvedValue({ id: 1, ...validData });

        const result = await eventRegistrationService.createRegistration(validData);

        expect(eventRegistrationRepository.createRegistration).toHaveBeenCalledWith(validData);
        expect(result.id).toBe(1);
    });
});
