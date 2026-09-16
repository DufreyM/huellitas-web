const { z } = require("zod");

const createEventRegistrationSchema = z.object({
    eventId: z.number().int().positive(),

    timeSlotId: z.number().int().positive(),

    petName: z.string().min(1),

    species: z.enum([
        "Perro",
        "Gato"
    ]),

    gender: z.enum([
        "Macho",
        "Hembra"
    ]),

    breed: z.string().min(1),

    birthDate: z.coerce.date(),

    lastDewormingDate: z.coerce.date(),

    lastVaccinationDate: z.coerce.date(),

    ownerName: z.string().min(2),

    ownerPhone: z.string().min(1),

    ownerEmail: z.string().email(),

    procedureType: z.enum([
        "Vacunacion",
        "Castracion"
    ]),

    notes: z.string().optional()
});

const updateEventRegistrationSchema = z.object({
    status: z.enum([
        "Inscrito",
        "Evaluado",
        "Aprobado",
        "Rechazado",
        "Pagado",
        "Castrado",
        "En_seguimiento",
        "Seguimiento_finalizado"
    ]).optional(),

    surgeryDate: z.coerce.date().nullable().optional(),

    antibioticStatus: z.enum(["Pendiente", "Finalizado"]).nullable().optional(),

    stitchRemovalStatus: z.enum(["Pendiente", "Finalizado"]).nullable().optional(),

    followUpCompleted: z.boolean().optional(),

    observations: z.string().nullable().optional()
});

const sendReminderSchema = z.object({
    type: z.enum(["pre", "post"])
});

module.exports = {
    createEventRegistrationSchema,
    updateEventRegistrationSchema,
    sendReminderSchema
};
