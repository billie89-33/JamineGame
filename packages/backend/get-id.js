const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst().then(u => console.log("ID:", u.id)).finally(() => prisma.$disconnect());
