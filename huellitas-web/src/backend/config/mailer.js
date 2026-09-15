const nodemailer = require("nodemailer");

const isConfigured = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);

const transporter = isConfigured
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null;

module.exports = {
    transporter,
    isConfigured,
    from: process.env.EMAIL_FROM || "Huellitas de la Calle <no-reply@huellitas.org>"
};
