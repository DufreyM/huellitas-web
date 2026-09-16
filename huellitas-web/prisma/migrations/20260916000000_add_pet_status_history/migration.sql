-- CreateTable
CREATE TABLE "pet_status_history" (
    "id" SERIAL NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "previous_status" "PetStatus",
    "new_status" "PetStatus" NOT NULL,
    "note" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_status_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pet_status_history" ADD CONSTRAINT "pet_status_history_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
