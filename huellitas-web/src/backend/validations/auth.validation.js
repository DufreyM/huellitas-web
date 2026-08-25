const { z } = require("zod");

const loginSchema = z.object({
    email: z.string().email(),

    password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
    email: z.string().email()
});

const resetPasswordSchema = z.object({
    token: z.string().min(1),

    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

const updateProfileSchema = z.object({
    name: z.string().min(2).max(100),

    phone: z.string().min(1)
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),

    newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

module.exports = {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateProfileSchema,
    changePasswordSchema
};
