-- AddColumn (nullable first, to backfill from existing data)
ALTER TABLE "pets" ADD COLUMN "intake_date" DATE;

-- Backfill: usar la fecha del registro ya existente como mejor aproximación
-- del ingreso real para las mascotas creadas antes de este campo.
UPDATE "pets" SET "intake_date" = "created_at"::date WHERE "intake_date" IS NULL;

-- Enforce NOT NULL + default for new rows
ALTER TABLE "pets" ALTER COLUMN "intake_date" SET NOT NULL;
ALTER TABLE "pets" ALTER COLUMN "intake_date" SET DEFAULT CURRENT_DATE;
