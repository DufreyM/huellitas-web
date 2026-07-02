import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { petInclude, resolveBreedId, toPetDTO } from "@/lib/pets";
import { readPetFields, readPetPhoto, validatePetFields, type PetFieldValues } from "@/lib/petForm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const petId = Number(id);

  if (!Number.isInteger(petId)) {
    return NextResponse.json({ error: "Invalid pet id" }, { status: 400 });
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: petInclude,
  });

  if (!pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  return NextResponse.json(toPetDTO(pet));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const petId = Number(id);

  if (!Number.isInteger(petId)) {
    return NextResponse.json({ error: "Invalid pet id" }, { status: 400 });
  }

  const existing = await prisma.pet.findUnique({
    where: { id: petId },
    include: { breed: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const currentDefaults: PetFieldValues = {
    name: existing.name,
    speciesId: existing.breed.speciesId,
    breedName: existing.breed.name,
    genderId: existing.genderId,
    sizeId: existing.sizeId,
    statusId: existing.currentStatusId,
    estimatedBirthDate: existing.estimatedBirthDate,
    weightLbs: existing.weightLbs ? Number(existing.weightLbs) : null,
    temperament: existing.temperament,
    traits: existing.traits,
    rescueStory: existing.rescueStory,
    healthNotes: existing.healthNotes,
    needs: [],
  };

  const fields = readPetFields(formData, currentDefaults);

  const validationError = validatePetFields(fields);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const [breedId, imageUrl] = await Promise.all([
    resolveBreedId(prisma, fields.speciesId, fields.breedName),
    readPetPhoto(formData),
  ]);

  // Needs aren't tracked with stable ids on the frontend, so a full replace
  // is simplest: only touch them when the form actually sent a `needs` field.
  if (formData.has("needs")) {
    await prisma.petNeed.deleteMany({ where: { petId } });
  }

  const now = new Date();
  const pet = await prisma.pet.update({
    where: { id: petId },
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
      imageUrl: imageUrl ?? existing.imageUrl,
      updatedAt: now,
      ...(formData.has("needs")
        ? {
            needs: {
              create: fields.needs.map((title) => ({
                title,
                needTypeId: 1,
                createdAt: now,
                updatedAt: now,
              })),
            },
          }
        : {}),
    },
    include: petInclude,
  });

  return NextResponse.json(toPetDTO(pet));
}
