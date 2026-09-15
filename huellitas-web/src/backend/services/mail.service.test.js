describe("mail.service — sendPasswordResetEmail", () => {
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    it("cae de vuelta a console.log si no hay SMTP configurado", async () => {
        jest.doMock("../config/mailer", () => ({
            isConfigured: false,
            transporter: null,
            from: "test@huellitas.org"
        }));

        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const mailService = require("./mail.service");

        await mailService.sendPasswordResetEmail("user@example.com", "http://localhost:5173/reset-password?token=abc");

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("user@example.com"));
    });

    it("envía el correo con nodemailer cuando el SMTP está configurado", async () => {
        const sendMail = jest.fn().mockResolvedValue(true);

        jest.doMock("../config/mailer", () => ({
            isConfigured: true,
            transporter: { sendMail },
            from: "test@huellitas.org"
        }));

        const mailService = require("./mail.service");

        await mailService.sendPasswordResetEmail("user@example.com", "http://localhost:5173/reset-password?token=abc");

        expect(sendMail).toHaveBeenCalledWith(
            expect.objectContaining({ to: "user@example.com", from: "test@huellitas.org" })
        );
    });
});
