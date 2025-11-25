import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Si usas SQLite local
  adapter: {
    type: 'sqlite',
    url: process.env.DATABASE_URL, 
  },
});

export default prisma;
