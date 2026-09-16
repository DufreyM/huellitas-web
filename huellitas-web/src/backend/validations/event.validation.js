const { z } = require("zod");

const createEventSchema = z.object({
    title: z.string().min(2).max(150),

    type: z.enum([
        "Jornada_adopcion",
        "Jornada_vacunacion",
        "Jornada_castracion",
        "Feria",
        "Recaudacion",
        "Otro"
    ]),

    description: z.string().min(1),

    location: z.string().min(1),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    status: z.enum([
        "Programado",
        "En_curso",
        "Finalizado",
        "Cancelado"
    ]),

    timeSlots: z.array(
        z.object({
            id: z.number().int().positive().optional(),
            startTime: z.string().min(1),
            capacity: z.number().int().positive()
        })
    ).optional()
});

const updateEventSchema = createEventSchema.partial();

module.exports = {
    createEventSchema,
    updateEventSchema
};
