const { createEventSchema } = require("./event.validation");

const validEvent = {
    title: "Jornada de vacunación",
    type: "Jornada_vacunacion",
    description: "Vacunación gratuita para mascotas",
    location: "Parque central",
    startDate: "2026-09-01T09:00:00.000Z",
    endDate: "2026-09-01T13:00:00.000Z",
    status: "Programado"
};

describe("event.validation — datos incompletos", () => {
    it("acepta un evento con todos los campos requeridos", () => {
        expect(createEventSchema.safeParse(validEvent).success).toBe(true);
    });

    it("rechaza un evento sin fecha de inicio", () => {
        const { startDate, ...withoutStartDate } = validEvent;

        expect(createEventSchema.safeParse(withoutStartDate).success).toBe(false);
    });

    it("rechaza un evento sin título", () => {
        const { title, ...withoutTitle } = validEvent;

        expect(createEventSchema.safeParse(withoutTitle).success).toBe(false);
    });

    it("rechaza un tipo de evento que no existe en el enum", () => {
        expect(createEventSchema.safeParse({ ...validEvent, type: "Invalido" }).success).toBe(false);
    });
});
