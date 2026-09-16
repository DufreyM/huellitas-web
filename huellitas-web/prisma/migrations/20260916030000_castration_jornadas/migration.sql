-- CreateEnum
CREATE TYPE "CastrationPatientStatus" AS ENUM ('Inscrito', 'Evaluado', 'Aprobado', 'Rechazado', 'Pagado', 'Castrado', 'En_seguimiento', 'Seguimiento_finalizado');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('Pendiente', 'Finalizado');

-- CreateTable
CREATE TABLE "event_time_slots" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "event_time_slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_time_slots" ADD CONSTRAINT "event_time_slots_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Las inscripciones existentes son datos de prueba de esta sesión (sin horario,
-- fecha de nacimiento, desparasitación, vacunación ni correo real) — se limpian
-- en vez de inventar valores ficticios para columnas que ahora son obligatorias.
DELETE FROM "event_registrations";

-- AlterTable: agregar las columnas nuevas
ALTER TABLE "event_registrations"
    ADD COLUMN "time_slot_id" INTEGER,
    ADD COLUMN "gender" "PetGender",
    ADD COLUMN "birth_date" DATE,
    ADD COLUMN "last_deworming_date" DATE,
    ADD COLUMN "last_vaccination_date" DATE,
    ADD COLUMN "owner_email" TEXT,
    ADD COLUMN "status" "CastrationPatientStatus" NOT NULL DEFAULT 'Inscrito',
    ADD COLUMN "surgery_date" DATE,
    ADD COLUMN "antibiotic_status" "FollowUpStatus",
    ADD COLUMN "stitch_removal_status" "FollowUpStatus",
    ADD COLUMN "follow_up_completed" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "observations" TEXT;

-- Ahora que la tabla está vacía, forzar NOT NULL en los campos clínicos obligatorios
ALTER TABLE "event_registrations"
    ALTER COLUMN "time_slot_id" SET NOT NULL,
    ALTER COLUMN "gender" SET NOT NULL,
    ALTER COLUMN "birth_date" SET NOT NULL,
    ALTER COLUMN "last_deworming_date" SET NOT NULL,
    ALTER COLUMN "last_vaccination_date" SET NOT NULL,
    ALTER COLUMN "owner_email" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "event_time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
