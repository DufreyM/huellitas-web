-- RenameEnumValue: usuarios existentes con rol "Administrador" quedan reasignados a "Superadministrador"
ALTER TYPE "UserRole" RENAME VALUE 'Administrador' TO 'Superadministrador';

-- AddEnumValue
ALTER TYPE "UserRole" ADD VALUE 'Operador';

-- AlterTable
ALTER TABLE "users" ADD COLUMN "password_reset_token_hash" TEXT;
ALTER TABLE "users" ADD COLUMN "password_reset_expires" TIMESTAMP(3);
