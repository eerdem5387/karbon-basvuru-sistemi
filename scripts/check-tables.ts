import { config } from 'dotenv'
import { prisma } from '../lib/prisma'

// Load .env.local first, then .env
config({ path: '.env.local' })
config()

async function main() {
  try {
    console.log('🔍 Database tablolarını kontrol ediyorum...\n')
    
    // SQL ile tabloları listele
    const result = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
    
    if (result.length === 0) {
      console.log('❌ Database\'de hiç tablo bulunamadı!')
      console.log('\n💡 Çözüm: Migration\'ları uygulayın:')
      console.log('   npx prisma migrate deploy')
      console.log('\nVEYA schema\'yı direkt push edin:')
      console.log('   npx prisma db push')
    } else {
      console.log(`✅ ${result.length} tablo bulundu:\n`)
      result.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`)
      })
      
      // Admin ve Basvuru tablolarını kontrol et
      console.log('\n📋 Önemli tablolar:')
      const hasAdmin = result.some(r => r.table_name === 'Admin')
      const hasBasvuru = result.some(r => r.table_name === 'Basvuru')
      
      console.log(`   Admin: ${hasAdmin ? '✅ Var' : '❌ Yok'}`)
      console.log(`   Basvuru: ${hasBasvuru ? '✅ Var' : '❌ Yok'}`)
      
      if (!hasAdmin || !hasBasvuru) {
        console.log('\n⚠️  Eksik tablolar var! Migration\'ları uygulayın:')
        console.log('   npx prisma migrate deploy')
      }
    }
    
    // Database connection bilgisi
    console.log('\n📊 Database Bilgisi:')
    const dbInfo = await prisma.$queryRaw<Array<{ current_database: string }>>`
      SELECT current_database();
    `
    console.log(`   Database: ${dbInfo[0]?.current_database}`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
    console.log('\n💡 Database bağlantısını kontrol edin:')
    console.log('   - DATABASE_URL doğru mu?')
    console.log('   - Database aktif mi?')
  } finally {
    await prisma.$disconnect()
  }
}

main()

