// Script pour tester différentes configurations de connexion Supabase
// Exécutez avec: node test-db-connection.js

const { PrismaClient } = require('@prisma/client')

const regions = [
  'eu-west-1',
  'eu-west-2', 
  'eu-west-3',
  'us-east-1',
  'us-west-1',
  'us-east-2'
]

const PROJECT_REF = 'uvbxhvvgppgsganeqmzh'
const PASSWORD = 'Choupi@2509'
const ENCODED_PASSWORD = encodeURIComponent(PASSWORD)

async function testConnection(url, name) {
  console.log(`\n🔍 Test: ${name}`)
  console.log(`   URL: ${url.replace(PASSWORD, '****')}`)
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: { url }
      }
    })
    
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    await prisma.$disconnect()
    
    console.log(`   ✅ SUCCÈS! Connexion établie!`)
    console.log(`   📋 Utilisez cette URL:`)
    console.log(`   ${url}`)
    return true
  } catch (error) {
    console.log(`   ❌ Échec: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('🧪 TEST DE CONNEXION SUPABASE')
  console.log('═'.repeat(60))
  
  // Test 1: Connexion directe (IPv6 - ne fonctionnera pas sur Vercel)
  const directUrl = `postgresql://postgres:${ENCODED_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`
  await testConnection(directUrl, 'Connexion directe (port 5432)')
  
  // Test 2: Pooler avec différentes régions
  for (const region of regions) {
    const poolerUrl = `postgresql://postgres.${PROJECT_REF}:${ENCODED_PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`
    const success = await testConnection(poolerUrl, `Pooler ${region} (port 6543)`)
    if (success) {
      console.log('\n' + '═'.repeat(60))
      console.log('🎉 RÉGION TROUVÉE!')
      console.log('═'.repeat(60))
      break
    }
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('📝 INSTRUCTIONS:')
  console.log('═'.repeat(60))
  console.log('1. Si aucun test ne fonctionne, vérifiez:')
  console.log('   - Le mot de passe de la base de données')
  console.log('   - Que le projet Supabase est actif')
  console.log('2. Allez sur Supabase Dashboard > Settings > Database')
  console.log('3. Cherchez "Connection Pooler" et copiez l\'URL exacte')
}

main().catch(console.error)
