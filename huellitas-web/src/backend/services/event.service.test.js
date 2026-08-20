jest.mock("../repositories/event.repository");

const eventRepository = require("../repositories/event.repository");
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
