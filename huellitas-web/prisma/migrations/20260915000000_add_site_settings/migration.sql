-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "instagram_handle" TEXT NOT NULL DEFAULT '@huellitasdelacalleong',
    "contact_email" TEXT NOT NULL DEFAULT 'contacto@huellitas.org',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
