require("dotenv").config();

const bcrypt = require("bcrypt");

const prisma = require("../src/backend/config/prisma");

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Administrador";
    const phone = process.env.ADMIN_PHONE || "00000000";

    if (!email || !password) {
        throw new Error(
            "Definí ADMIN_EMAIL y ADMIN_PASSWORD como variables de entorno antes de correr este script."
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: {
            email
        },
        update: {
            passwordHash,
            role: "Superadministrador",
            isActive: true
        },
        create: {
            name,
            email,
            phone,
            passwordHash,
            role: "Administrador"
        }
    });

    console.log(`✅ Usuario admin listo: ${user.email} (id ${user.id})`);
}

main()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
