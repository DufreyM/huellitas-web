import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { petInclude, resolveBreedId, toPetDTO } from "@/lib/pets";
import { readPetFields, readPetPhoto, validatePetFields, type PetFieldValues } from "@/lib/petForm";
import { getAdminUserId } from "@/lib/adminUser";

export async function GET() {
  const pets = await prisma.pet.findMany({
    include: petInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(pets.map(toPetDTO));
}

const EMPTY_DEFAULTS: PetFieldValues = {
  name: "",
  speciesId: 0,
  breedName: "Mestizo",
  genderId: 0,
  sizeId: 0,
  statusId: 1, // Disponible
  estimatedBirthDate: null,
  weightLbs: null,
  temperament: null,
  traits: [],
  rescueStory: null,
  healthNotes: [],
  needs: [],
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const fields = readPetFields(formData, EMPTY_DEFAULTS);

  const validationError = validatePetFields(fields);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const [breedId, adminUserId, imageUrl] = await Promise.all([
    resolveBreedId(prisma, fields.speciesId, fields.breedName),
    getAdminUserId(prisma),
    readPetPhoto(formData),
  ]);

  const now = new Date();
  const pet = await prisma.pet.create({
    data: {
      name: fields.name,
      breedId,
      genderId: fields.genderId,
      sizeId: fields.sizeId,
      currentStatusId: fields.statusId,
      estimatedBirthDate: fields.estimatedBirthDate,
      weightLbs: fields.weightLbs,
      temperament: fields.temperament,
      traits: fields.traits,
      rescueStory: fields.rescueStory,
      healthNotes: fields.healthNotes,
      imageUrl: imageUrl ?? null,
      createdBy: adminUserId,
      createdAt: now,
      updatedAt: now,
      needs: {
        create: fields.needs.map((title) => ({
          title,
          needTypeId: 1,
          createdAt: now,
          updatedAt: now,
        })),
      },
    },
    include: petInclude,
  });

  return NextResponse.json(toPetDTO(pet), { status: 201 });
}
