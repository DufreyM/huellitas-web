const { z } = require("zod");

const createMedicalRecordSchema = z.object({
    consultationDate: z.coerce.date(),

    recordType: z.enum([
        "Consulta",
        "Desparasitacion",
        "Tratamiento",
        "Vacunacion",
        "Castracion"
    ]),

    description: z.string().min(1),

    treatment: z.string().min(1),

    observations: z.string().min(1)
});

module.exports = {
    createMedicalRecordSchema
};
