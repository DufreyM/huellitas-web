const { z } = require("zod");

const createUserSchema = z.object({
    name: z.string().min(2).max(100),

    email: z.string().email(),

    phone: z.string().min(1),

    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),

    role: z.enum([
        "Superadministrador",
        "Voluntario",
        "Operador"
    ])
});

module.exports = {
    createUserSchema
};
