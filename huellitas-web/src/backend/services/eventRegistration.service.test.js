jest.mock("../repositories/eventRegistration.repository");
jest.mock("./mail.service");

const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const mailService = require("./mail.service");
const eventRegistrationService = require("./eventRegistration.service");

const EVENT_DATE = "2026-10-01";

const timeSlot = { id: 10, eventId: 1, startTime: "9:00 AM", capacity: 25 };

const validData = {
    eventId: 1,
    timeSlotId: 10,
    petName: "Firulais",
    species: "Perro",
    gender: "Macho",
    breed: "Mestizo",
    birthDate: "2025-10-01", // 1 año a la fecha de la jornada
    lastDewormingDate: "2026-08-01", // 2 meses antes
    lastVaccinationDate: "2026-04-01", // 6 meses antes
    ownerName: "Juan Pérez",
    ownerPhone: "55551234",
    ownerEmail: "juan@example.com",
    procedureType: "Castracion"
};

function mockProgrammedEvent(overrides = {}) {
    eventRegistrationRepository.findEventById.mockResolvedValue({
        id: 1,
        isActive: true,
        status: "Programado",
        startDate: EVENT_DATE,
        timeSlots: [timeSlot],
        ...overrides
    });
}

function mockSlotCapacity(registrations) {
    eventRegistrationRepository.findTimeSlotById.mockResolvedValue({
        ...timeSlot,
        _count: { registrations }
    });
}

describe("eventRegistration.service — reglas del evento", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("rechaza si el evento no existe", async () => {
        eventRegistrationRepository.findEventById.mockResolvedValue(null);

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 404 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("rechaza inscripciones a un evento finalizado", async () => {
        mockProgrammedEvent({ status: "Finalizado" });

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("rechaza inscripciones a un evento cancelado", async () => {
        mockProgrammedEvent({ status: "Cancelado" });

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
    });
});

describe("eventRegistration.service — cupos por horario", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("rechaza si el horario no pertenece a la jornada", async () => {
        mockProgrammedEvent({ timeSlots: [{ ...timeSlot, id: 999 }] });

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("rechaza si el horario ya llegó a su cupo máximo", async () => {
        mockProgrammedEvent();
        mockSlotCapacity(25);

        await expect(eventRegistrationService.createRegistration(validData)).rejects.toMatchObject({ statusCode: 400 });
        expect(eventRegistrationRepository.createRegistration).not.toHaveBeenCalled();
    });

    it("permite inscribir si todavía hay cupo en el horario", async () => {
        mockProgrammedEvent();
        mockSlotCapacity(24);
        eventRegistrationRepository.createRegistration.mockResolvedValue({ id: 1, ...validData });

        const result = await eventRegistrationService.createRegistration(validData);

        expect(result.id).toBe(1);
    });
});

describe("eventRegistration.service — validaciones clínicas", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockProgrammedEvent();
        mockSlotCapacity(0);
    });

    it("rechaza una mascota más joven que la edad mínima (5 meses)", async () => {
        await expect(
            eventRegistrationService.createRegistration({ ...validData, birthDate: "2026-08-01" })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("rechaza una mascota mayor a la edad máxima (6 años)", async () => {
        await expect(
            eventRegistrationService.createRegistration({ ...validData, birthDate: "2019-10-01" })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("rechaza una desparasitación de más de 5 meses a la fecha de la jornada", async () => {
        await expect(
            eventRegistrationService.createRegistration({ ...validData, lastDewormingDate: "2026-02-01" })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("rechaza una vacunación de más de 1 año a la fecha de la jornada", async () => {
        await expect(
            eventRegistrationService.createRegistration({ ...validData, lastVaccinationDate: "2025-08-01" })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("acepta cuando la edad, desparasitación y vacunación están dentro de los rangos permitidos", async () => {
        eventRegistrationRepository.createRegistration.mockResolvedValue({ id: 1, ...validData });

        const result = await eventRegistrationService.createRegistration(validData);

        expect(eventRegistrationRepository.createRegistration).toHaveBeenCalledWith(validData);
        expect(result.id).toBe(1);
    });
});

describe("eventRegistration.service — sendReminder", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("envía el recordatorio con los datos del paciente y la jornada", async () => {
        eventRegistrationRepository.getRegistrationById.mockResolvedValue({
            id: 1,
            ownerEmail: "juan@example.com",
            ownerName: "Juan Pérez",
            petName: "Firulais",
            event: { title: "Jornada Octubre", startDate: EVENT_DATE, location: "Zona 10" },
            timeSlot: { startTime: "9:00 AM" }
        });

        await eventRegistrationService.sendReminder(1, "pre");

        expect(mailService.sendCastrationReminder).toHaveBeenCalledWith(
            "juan@example.com",
            "pre",
            expect.objectContaining({ petName: "Firulais", eventTitle: "Jornada Octubre" })
        );
    });

    it("lanza 404 si la inscripción no existe", async () => {
        eventRegistrationRepository.getRegistrationById.mockResolvedValue(null);

        await expect(eventRegistrationService.sendReminder(999, "pre")).rejects.toMatchObject({ statusCode: 404 });
    });
});
