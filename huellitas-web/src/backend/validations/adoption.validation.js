const { z } = require("zod");

const createAdoptionRequestSchema = z.object({
    fullName: z.string().min(2),

    dpi: z.string().min(1),

    phone: z.string().min(1),

    email: z.string().email(),

    address: z.string().min(1),

    municipality: z.string().min(1),

    petId: z.number().int().positive(),

    reason: z.string().min(1),

    hasChildren: z.boolean(),

    familyAgreement: z.boolean(),

    hasVeterinarian: z.boolean(),

    secureSpace: z.boolean()
});

const updateAdoptionRequestStatusSchema = z.object({
    status: z.enum(["Pendiente", "En_revision", "Aprobada", "Rechazada"])
});

module.exports = {
    createAdoptionRequestSchema,
    updateAdoptionRequestStatusSchema
};
