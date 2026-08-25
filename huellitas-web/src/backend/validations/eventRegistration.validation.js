const { z } = require("zod");

const createEventRegistrationSchema = z.object({
    eventId: z.number().int().positive(),

    petName: z.string().min(1),

    species: z.enum([
        "Perro",
        "Gato"
    ]),

    breed: z.string().min(1),

    ownerName: z.string().min(2),

    ownerPhone: z.string().min(1),

    procedureType: z.enum([
        "Vacunacion",
        "Castracion"
    ]),

    notes: z.string().optional()
});

module.exports = {
    createEventRegistrationSchema
};
