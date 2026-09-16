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

const REMINDER_TEMPLATES = {
    pre: {
        subject: petName => `Recordatorio: jornada de castración de ${petName}`,
        html: ({ ownerName, petName, eventTitle, eventDate, eventLocation, timeSlot }) => `
            <p>Hola ${ownerName},</p>
            <p>Te recordamos la inscripción de <strong>${petName}</strong> a <strong>${eventTitle}</strong>:</p>
            <ul>
                <li>Fecha: ${new Date(eventDate).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</li>
                <li>Horario: ${timeSlot}</li>
                <li>Lugar: ${eventLocation}</li>
            </ul>
            <p><strong>Antes de la jornada:</strong></p>
            <ul>
                <li>Ayuno de sólidos de al menos 8 horas antes de la cirugía (sí puede tomar agua).</li>
                <li>Llegá puntual a tu horario asignado.</li>
                <li>Traé a tu mascota con collar o correa (perros) o en transportadora (gatos).</li>
            </ul>
            <p>¡Gracias por confiar en Huellitas de la Calle!</p>
        `
    },
    post: {
        subject: petName => `Cuidados posteriores a la cirugía de ${petName}`,
        html: ({ ownerName, petName }) => `
            <p>Hola ${ownerName},</p>
            <p>Estas son las indicaciones de cuidado para ${petName} después de la cirugía:</p>
            <ul>
                <li>Completá el antibiótico indicado durante todos los días recetados, aunque veas mejoría antes.</li>
                <li>Usá el collar isabelino en todo momento hasta el retiro de puntos.</li>
                <li>Evitá que se moje o se bañe la herida.</li>
                <li>Restringí el ejercicio y los saltos durante la recuperación.</li>
                <li>Si notás enrojecimiento, secreción, hinchazón o que ${petName} está decaído, contactanos de inmediato.</li>
            </ul>
            <p>¡Gracias por confiar en Huellitas de la Calle!</p>
        `
    }
};

async function sendCastrationReminder(to, type, context) {
    const template = REMINDER_TEMPLATES[type];

    if (!mailer.isConfigured) {
        console.log(`📧 Recordatorio (${type}) para ${to} — ${context.petName}`);
        return;
    }

    await mailer.transporter.sendMail({
        from: mailer.from,
        to,
        subject: template.subject(context.petName),
        html: template.html(context)
    });
}

module.exports = {
    sendPasswordResetEmail,
    sendCastrationReminder
};
