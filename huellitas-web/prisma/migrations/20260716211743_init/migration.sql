-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('Perro', 'Gato');

-- CreateEnum
CREATE TYPE "PetGender" AS ENUM ('Macho', 'Hembra');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('Pequeno', 'Mediano', 'Grande');

-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('Disponible', 'En_tratamiento', 'Reservada', 'Adoptada', 'No_disponible');

-- CreateEnum
CREATE TYPE "MedicalRecordType" AS ENUM ('Consulta', 'Desparasitacion', 'Tratamiento', 'Vacunacion', 'Castracion');

-- CreateEnum
CREATE TYPE "AdoptionRequestStatus" AS ENUM ('Pendiente', 'En_revision', 'Aprobada', 'Rechazada');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Jornada_adopcion', 'Jornada_vacunacion', 'Jornada_castracion', 'Feria', 'Recaudacion', 'Otro');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Programado', 'En_curso', 'Finalizado', 'Cancelado');

-- CreateEnum
CREATE TYPE "ProcedureType" AS ENUM ('Vacunacion', 'Castracion');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Efectivo', 'Transferencia', 'Deposito', 'Tarjeta', 'Otro');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" "PetGender" NOT NULL,
    "estimated_age" TEXT NOT NULL,
    "size" "PetSize" NOT NULL,
    "weight" DECIMAL(5,2) NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rescue_story" TEXT NOT NULL,
    "status" "PetStatus" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_images" (
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pet_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "consultation_date" DATE NOT NULL,
    "record_type" "MedicalRecordType" NOT NULL,
    "description" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "observations" TEXT NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adopters" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "dpi" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adopters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_requests" (
    "id" SERIAL NOT NULL,
    "adopter_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "status" "AdoptionRequestStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "has_children" BOOLEAN NOT NULL,
    "family_agreement" BOOLEAN NOT NULL,
    "has_veterinarian" BOOLEAN NOT NULL,
    "secure_space" BOOLEAN NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoptions" (
    "id" SERIAL NOT NULL,
    "adopter_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "request_id" INTEGER NOT NULL,
    "adoption_date" DATE NOT NULL,
    "is_returned" BOOLEAN NOT NULL DEFAULT false,
    "return_reason" TEXT,
    "observations" TEXT,

    CONSTRAINT "adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL,
    "created_by" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "pet_name" TEXT NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "breed" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_phone" TEXT NOT NULL,
    "procedure_type" "ProcedureType" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" SERIAL NOT NULL,
    "donor_name" TEXT NOT NULL,
    "donor_email" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "current_stock" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_donations" (
    "id" SERIAL NOT NULL,
    "supply_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "donor_name" TEXT NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "supply_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "success_stories" (
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "publication_date" DATE NOT NULL,

    CONSTRAINT "success_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "adopters_dpi_key" ON "adopters"("dpi");

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_request_id_key" ON "adoptions"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplies_name_key" ON "supplies"("name");

-- AddForeignKey
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_requests" ADD CONSTRAINT "adoption_requests_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_requests" ADD CONSTRAINT "adoption_requests_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "adoption_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_donations" ADD CONSTRAINT "supply_donations_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_stories" ADD CONSTRAINT "success_stories_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
