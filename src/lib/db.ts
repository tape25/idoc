import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Forcer l'URL de la base de données pour contourner le bug Turbopack/Prisma
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL n\'est pas définie')
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown pour serverless
if (process.env.NODE_ENV === 'production') {
  // Déconnexion propre lors de la fermeture
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}