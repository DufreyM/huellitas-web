const { z } = require("zod");

const createPetSchema = z.object({
    name: z.string().min(2).max(100),

    species: z.enum([
        "Perro",
        "Gato"
    ]),

    breed: z.string().min(2),

    gender: z.enum([
        "Macho",
        "Hembra"
    ]),

    estimatedAge: z.string().min(1),

    size: z.enum([
        "Pequeno",
        "Mediano",
        "Grande"
    ]),

    weight: z.number().positive(),

    color: z.string(),

    description: z.string(),

    rescueStory: z.string(),

    status: z.enum([
        "Disponible",
        "En_tratamiento",
        "Reservada",
        "Adoptada",
        "No_disponible"
    ]),

    featured: z.boolean().optional()
});

const updatePetSchema = createPetSchema.partial();

module.exports = {
    createPetSchema,
    updatePetSchema
};