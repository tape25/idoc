import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// URL de la base de données - peut être undefined pendant le build
const databaseUrl = process.env.DATABASE_URL

// Créer le client Prisma seulement si l'URL est définie
// Pendant le build, DATABASE_URL peut ne pas être disponible
function createPrismaClient() {
  if (!databaseUrl) {
    console.warn('DATABASE_URL non définie - mode build ou variables manquantes')
    // Retourner un proxy qui lève une erreur explicite si utilisé
    return new Proxy({} as PrismaClient, {
      get: () => {
        throw new Error('Prisma Client non initialisé - DATABASE_URL manquante. Configurez les variables d\'environnement dans Vercel.')
      }
    })
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown pour serverless
if (process.env.NODE_ENV === 'production') {
  // Déconnexion propre lors de la fermeture
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}