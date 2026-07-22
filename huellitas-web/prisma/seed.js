const prisma = require("../src/backend/config/prisma")
const pets = require("../src/backend/data/pets");

async function main() {
  await prisma.pet.deleteMany();

  await prisma.pet.createMany({
    data: pets
  });

  console.log("✅ Se cargaron 20 mascotas de prueba.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });