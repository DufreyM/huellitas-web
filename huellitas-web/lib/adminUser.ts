import type { PrismaClient } from "@prisma/client";

// There is no real authentication yet. Every action taken from the admin
// panel is attributed to this single simulated admin account until a real
// login flow exists.
export const ADMIN_EMAIL = "admin@huellitasdelacalle.org";
export const ADMIN_FULL_NAME = "Administrador Huellitas";

export async function getAdminUserId(client: PrismaClient): Promise<number> {
  const admin = await client.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      fullName: ADMIN_FULL_NAME,
      passwordHash: "simulated-admin-no-login",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return admin.id;
}
