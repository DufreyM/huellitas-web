const { z } = require("zod");

const createDonationSchema = z.object({
    donorName: z.string().min(2),

    donorEmail: z.string().email(),

    amount: z.number().positive(),

    paymentMethod: z.enum([
        "Efectivo",
        "Transferencia",
        "Deposito",
        "Tarjeta",
        "Otro"
    ]),

    donationDate: z.coerce.date().optional(),

    notes: z.string().optional()
});

const updateDonationSchema = createDonationSchema.partial();

module.exports = {
    createDonationSchema,
    updateDonationSchema
};
