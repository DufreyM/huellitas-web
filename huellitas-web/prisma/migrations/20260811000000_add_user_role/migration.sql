-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Administrador', 'Voluntario');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'Voluntario';
