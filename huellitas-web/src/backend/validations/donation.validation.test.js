const { createDonationSchema } = require("./donation.validation");

const validDonation = {
    donorName: "Juan Pérez",
    donorEmail: "juan@example.com",
    amount: 150.5,
    paymentMethod: "Transferencia"
};

describe("donation.validation — datos incompletos", () => {
    it("acepta una donación con todos los campos requeridos", () => {
        expect(createDonationSchema.safeParse(validDonation).success).toBe(true);
    });

    it("rechaza una donación sin monto", () => {
        const { amount, ...withoutAmount } = validDonation;

        expect(createDonationSchema.safeParse(withoutAmount).success).toBe(false);
    });

    it("rechaza una donación con monto negativo o cero", () => {
        expect(createDonationSchema.safeParse({ ...validDonation, amount: 0 }).success).toBe(false);
        expect(createDonationSchema.safeParse({ ...validDonation, amount: -10 }).success).toBe(false);
    });

    it("rechaza una donación sin nombre de donante", () => {
        const { donorName, ...withoutDonorName } = validDonation;

        expect(createDonationSchema.safeParse(withoutDonorName).success).toBe(false);
    });

    it("rechaza un método de pago que no existe en el enum", () => {
        expect(createDonationSchema.safeParse({ ...validDonation, paymentMethod: "Cripto" }).success).toBe(false);
    });
});
