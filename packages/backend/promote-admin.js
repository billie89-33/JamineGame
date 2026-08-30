const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const result = await prisma.user.updateMany({
      data: { role: 'ADMIN' }
    });
    console.log(`Successfully promoted ${result.count} user(s) to ADMIN!`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
