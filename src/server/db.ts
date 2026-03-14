// import { PrismaClient } from '@prisma/client';
// import { PrismaNeonHttp } from '@prisma/adapter-neon';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// function createClient() {
//   const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!);
//   return new PrismaClient({ adapter });
// }

// export const db = globalForPrisma.prisma ?? createClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = db;
// }
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  const adapter = new PrismaNeon({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
