import type { Prisma, PrismaClient } from "@prisma/client";

export const petInclude = {
  breed: { include: { species: true } },
  gender: true,
  size: true,
  currentStatus: true,
  needs: true,
} satisfies Prisma.PetInclude;

type PetWithRelations = Prisma.PetGetPayload<{ include: typeof petInclude }>;

export interface PetDTO {
  id: string;
  name: string;
  species: string;
  speciesId: number;
  breed: string;
  age: string;
  estimatedBirthDate: string | null;
  weight: string | null;
  weightLbs: number | null;
  size: string;
  sizeId: number;
  gender: string;
  genderId: number;
  temperament: string | null;
  traits: string[];
  status: string;
  statusId: number;
  image: string | null;
  rescueStory: string | null;
  health: string[];
  needs: string[];
}

export async function resolveBreedId(client: PrismaClient, speciesId: number, breedName: string): Promise<number> {
  const breed = await client.breed.upsert({
    where: { speciesId_name: { speciesId, name: breedName } },
    update: {},
    create: { speciesId, name: breedName },
  });
  return breed.id;
}

function formatAge(birthDate: Date | null): string {
  if (!birthDate) return "Edad desconocida";

  const now = new Date();
  let months =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());
  if (now.getDate() < birthDate.getDate()) months -= 1;

  if (months < 1) return "Menos de 1 mes";
  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
}

export function toPetDTO(pet: PetWithRelations): PetDTO {
  const weightLbs = pet.weightLbs ? Number(pet.weightLbs) : null;

  return {
    id: String(pet.id),
    name: pet.name,
    species: pet.breed.species.name,
    speciesId: pet.breed.speciesId,
    breed: pet.breed.name,
    age: formatAge(pet.estimatedBirthDate),
    estimatedBirthDate: pet.estimatedBirthDate ? pet.estimatedBirthDate.toISOString().slice(0, 10) : null,
    weight: weightLbs ? `${weightLbs} libras` : null,
    weightLbs,
    size: pet.size.name,
    sizeId: pet.sizeId,
    gender: pet.gender.name,
    genderId: pet.genderId,
    temperament: pet.temperament,
    traits: pet.traits,
    status: pet.currentStatus.name,
    statusId: pet.currentStatusId,
    image: pet.imageUrl,
    rescueStory: pet.rescueStory,
    health: pet.healthNotes,
    needs: pet.needs.map((need) => need.title),
  };
}
