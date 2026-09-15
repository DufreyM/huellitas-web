const mailer = require("../config/mailer");

async function sendPasswordResetEmail(to, resetUrl) {
    if (!mailer.isConfigured) {
        // Sin SMTP_HOST/SMTP_USER/SMTP_PASS configurados en .env: se deja el enlace en el
        // log del servidor para no bloquear el flujo en desarrollo.
        console.log(`🔑 Enlace de recuperación para ${to}: ${resetUrl}`);
        return;
    }

    await mailer.transporter.sendMail({
        from: mailer.from,
        to,
        subject: "Recuperación de contraseña — Huellitas de la Calle",
        html: `
            <p>Solicitaste recuperar tu contraseña en Huellitas de la Calle.</p>
            <p><a href="${resetUrl}">Hacé click acá para elegir una nueva contraseña</a>.</p>
            <p>Este enlace expira en 60 minutos. Si no fuiste vos, podés ignorar este correo.</p>
        `
    });
}

module.exports = {
    sendPasswordResetEmail
};
