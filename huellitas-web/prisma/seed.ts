import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getAdminUserId } from "../lib/adminUser";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

function monthsAgo(months: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

async function main() {
  const [, genders, sizes, statuses] = await Promise.all([
    Promise.all([
      prisma.species.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "Perro" } }),
      prisma.species.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "Gato" } }),
      prisma.species.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: "Otra" } }),
    ]),
    Promise.all([
      prisma.gender.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "Macho" } }),
      prisma.gender.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "Hembra" } }),
    ]),
    Promise.all([
      prisma.petSize.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "Pequeño" } }),
      prisma.petSize.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "Mediano" } }),
      prisma.petSize.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: "Grande" } }),
    ]),
    Promise.all([
      prisma.petStatus.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "Disponible" } }),
      prisma.petStatus.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "En proceso" } }),
      prisma.petStatus.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: "Adoptado" } }),
    ]),
  ]);

  await prisma.petNeedType.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "General" } });

  const breeds = await Promise.all([
    prisma.breed.upsert({
      where: { speciesId_name: { speciesId: 1, name: "Mestizo" } },
      update: {},
      create: { speciesId: 1, name: "Mestizo" },
    }),
    prisma.breed.upsert({
      where: { speciesId_name: { speciesId: 2, name: "Mestizo" } },
      update: {},
      create: { speciesId: 2, name: "Mestizo" },
    }),
    prisma.breed.upsert({
      where: { speciesId_name: { speciesId: 3, name: "Mestizo" } },
      update: {},
      create: { speciesId: 3, name: "Mestizo" },
    }),
  ]);
  const [dogBreed, catBreed, otherBreed] = breeds;

  const adminUserId = await getAdminUserId(prisma);

  const [macho, hembra] = genders;
  const [pequeno, mediano, grande] = sizes;
  const [disponible] = statuses;

  // Wipe previously seeded pets so re-running this script doesn't duplicate rows.
  // Intended for local/dev use only.
  await prisma.petNeed.deleteMany({});
  await prisma.pet.deleteMany({});

  const petsToSeed = [
    {
      name: "Algodón Messi",
      breedId: dogBreed.id,
      genderId: macho.id,
      sizeId: mediano.id,
      estimatedBirthDate: monthsAgo(24),
      weightLbs: 23,
      temperament: "Noble, Guerrero y Leal. Siempre protector.",
      traits: ["Noble", "Guerrero", "Leal"],
      rescueStory:
        "Algodón Messi fue rescatado de las calles de la zona 3 de Guatemala Ciudad. A pesar de sus días difíciles en la calle, su espíritu noble y guerrero nunca se quebró. Lleva ese nombre porque, como el gran campeón, nunca se rinde y siempre da lo mejor.",
      healthNotes: ["Vacunado al día", "Desparasitado", "Esterilizado", "Revisado por veterinario"],
      needs: ["Concentrado", "Tratamiento médico preventivo", "Medicamentos desparasitantes", "Hogar temporal"],
    },
    {
      name: "Peluche Yamal",
      breedId: dogBreed.id,
      genderId: macho.id,
      sizeId: pequeno.id,
      estimatedBirthDate: monthsAgo(3),
      weightLbs: 6,
      temperament: "Muy juguetón, cariñoso y lleno de energía.",
      traits: ["Noble", "Cariñoso", "Juguetón"],
      rescueStory:
        "Este pequeño campeón fue encontrado solo en Mixco cuando apenas tenía semanas de vida. Tierno como un peluche y talentoso como Yamal, este cachorrito llegó para robar corazones. Le encanta jugar y nunca falta con sus abrazos.",
      healthNotes: ["Vacunas iniciales", "Desparasitado", "Control veterinario mensual", "Examen completo"],
      needs: ["Hogar temporal", "Concentrado para cachorro", "Medicamentos pediátricos", "Arena o pads de entrenamiento"],
    },
    {
      name: "Princesa JR",
      breedId: dogBreed.id,
      genderId: hembra.id,
      sizeId: mediano.id,
      estimatedBirthDate: monthsAgo(18),
      weightLbs: 14,
      temperament: "Sociable, paciente y luchadora.",
      traits: ["Sociable", "Luchadora", "Valiente"],
      rescueStory:
        "Princesa JR llegó a nosotros desde Villa Nueva, donde sobrevivió en condiciones muy difíciles. Como toda guerrera, superó cada obstáculo con una sonrisa. Es sociable con otros perros y adora la compañía de personas de todas las edades.",
      healthNotes: ["Vacunada al día", "Desparasitada", "Esterilizada", "Chequeo dental realizado"],
      needs: ["Concentrado", "Tratamiento médico", "Hogar temporal"],
    },
    {
      name: "Rocky Ronaldo",
      breedId: dogBreed.id,
      genderId: macho.id,
      sizeId: grande.id,
      estimatedBirthDate: monthsAgo(48),
      weightLbs: 45,
      temperament: "Protector, calmado en casa y leal.",
      traits: ["Guerrero", "Leal", "Protector"],
      rescueStory:
        "Rocky Ronaldo es el más grande de nuestra familia, rescatado de la zona 6 donde vivía en las calles desde pequeño. Con la lealtad de un campeón y la fuerza de un luchador, Rocky solo necesita una familia que le dé el hogar que siempre mereció.",
      healthNotes: ["Vacunado al día", "Desparasitado", "Esterilizado", "Control articular realizado"],
      needs: ["Medicamentos articulares", "Concentrado adulto", "Apadrinamiento de paseos"],
    },
    {
      name: "Luna",
      breedId: catBreed.id,
      genderId: hembra.id,
      sizeId: pequeno.id,
      estimatedBirthDate: monthsAgo(12),
      weightLbs: 8,
      temperament: "Independiente pero muy cariñosa por las noches.",
      traits: ["Curiosa", "Tranquila", "Cazadora"],
      rescueStory:
        "Luna fue encontrada en un techo en época de lluvias. Muy asustada al principio, poco a poco fue ganando confianza hasta convertirse en la gata más ronroneadora del refugio.",
      healthNotes: ["Vacunada", "Esterilizada", "Negativa a leucemia felina"],
      needs: ["Arena sanitaria", "Concentrado para gato", "Hogar temporal seguro"],
    },
    {
      name: "Tambor",
      breedId: otherBreed.id,
      genderId: macho.id,
      sizeId: pequeno.id,
      estimatedBirthDate: monthsAgo(6),
      weightLbs: 3,
      temperament: "Tímido, curioso y saltarín.",
      traits: ["Silencioso", "Suave", "Tragón"],
      rescueStory:
        "Tambor fue dejado en una caja cerca de una veterinaria local. Necesita un espacio adecuado para saltar y ser feliz fuera de jaulas convencionales.",
      healthNotes: ["Desparasitado", "Control de dientes sanos", "Dieta especial iniciada"],
      needs: ["Heno", "Verduras frescas", "Tratamiento médico preventivo"],
    },
  ];

  for (const p of petsToSeed) {
    await prisma.pet.create({
      data: {
        name: p.name,
        breedId: p.breedId,
        genderId: p.genderId,
        sizeId: p.sizeId,
        estimatedBirthDate: p.estimatedBirthDate,
        weightLbs: p.weightLbs,
        temperament: p.temperament,
        traits: p.traits,
        rescueStory: p.rescueStory,
        healthNotes: p.healthNotes,
        currentStatusId: disponible.id,
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        needs: {
          create: p.needs.map((title) => ({
            title,
            needTypeId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      },
    });
  }

  console.log(`Seed complete: ${petsToSeed.length} pets created.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
