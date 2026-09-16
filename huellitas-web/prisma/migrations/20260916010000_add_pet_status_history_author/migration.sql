-- AddColumn (nullable first, so it doesn't break rows already logged)
ALTER TABLE "pet_status_history" ADD COLUMN "changed_by_user_id" INTEGER;

-- Backfill existing rows to the seed Superadministrador (id 1) — there is no
-- real historical record of who made these early changes.
UPDATE "pet_status_history" SET "changed_by_user_id" = 1 WHERE "changed_by_user_id" IS NULL;

-- Enforce NOT NULL now that every row has a value
ALTER TABLE "pet_status_history" ALTER COLUMN "changed_by_user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pet_status_history" ADD CONSTRAINT "pet_status_history_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
