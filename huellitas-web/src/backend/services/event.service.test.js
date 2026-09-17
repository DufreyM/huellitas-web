jest.mock("../repositories/event.repository");
jest.mock("../repositories/eventRegistration.repository");

const eventRepository = require("../repositories/event.repository");
const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const eventService = require("./event.service");

const validData = {
    title: "Jornada de vacunación",
    type: "Jornada_vacunacion",
    description: "prueba",
    location: "Parque central",
    startDate: "2026-09-01T09:00:00.000Z",
    endDate: "2026-09-01T13:00:00.000Z",
    status: "Programado"
};

describe("event.service — validaciones", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("crea el evento cuando las fechas son válidas", async () => {
        eventRepository.createEvent.mockResolvedValue({ id: 1, ...validData });

        await eventService.createEvent(validData, 1);

        expect(eventRepository.createEvent).toHaveBeenCalledWith(
            expect.objectContaining({ createdBy: 1 })
        );
    });

    it("rechaza un evento cuya fecha de fin es anterior a la de inicio", async () => {
        const invalidData = { ...validData, startDate: "2026-09-05T09:00:00.000Z", endDate: "2026-09-01T09:00:00.000Z" };

        await expect(eventService.createEvent(invalidData, 1)).rejects.toMatchObject({ statusCode: 400 });
        expect(eventRepository.createEvent).not.toHaveBeenCalled();
    });
});

describe("event.service — cupo disponible por horario", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calcula el cupo disponible a partir del _count de inscripciones", async () => {
        eventRepository.getEventById.mockResolvedValue({
            id: 1,
            isActive: true,
            timeSlots: [
                { id: 10, eventId: 1, startTime: "9:00 AM", capacity: 25, _count: { registrations: 20 } },
                { id: 11, eventId: 1, startTime: "11:00 AM", capacity: 25, _count: { registrations: 25 } }
            ]
        });

        const event = await eventService.getEventById(1);

        expect(event.timeSlots).toEqual([
            { id: 10, eventId: 1, startTime: "9:00 AM", capacity: 25, registered: 20, available: 5 },
            { id: 11, eventId: 1, startTime: "11:00 AM", capacity: 25, registered: 25, available: 0 }
        ]);
    });
});

describe("event.service — getJornadaDashboard", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("suma la capacidad total y agrupa el resumen por estado", async () => {
        eventRepository.getEventById.mockResolvedValue({
            id: 1,
            isActive: true,
            timeSlots: [
                { id: 10, eventId: 1, startTime: "9:00 AM", capacity: 25, _count: { registrations: 25 } },
                { id: 11, eventId: 1, startTime: "11:00 AM", capacity: 25, _count: { registrations: 5 } }
            ]
        });
        eventRegistrationRepository.getStatusSummary.mockResolvedValue({ Inscrito: 20, Castrado: 10 });

        const dashboard = await eventService.getJornadaDashboard(1);

        expect(dashboard.totalCapacity).toBe(50);
        expect(dashboard.totalRegistered).toBe(30);
        expect(dashboard.statusSummary).toEqual({ Inscrito: 20, Castrado: 10 });
    });
});
