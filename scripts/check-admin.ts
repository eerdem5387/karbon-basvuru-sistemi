import { config } from 'dotenv'
import { prisma } from '../lib/prisma'

// Load .env.local first, then .env
config({ path: '.env.local' })
config()

async function main() {
  try {
    console.log('🔍 Database\'deki admin kullanıcılarını kontrol ediyorum...\n')
    
    const admins = await prisma.admin.findMany()
    
    if (admins.length === 0) {
      console.log('❌ Database\'de hiç admin kullanıcısı bulunamadı!')
      console.log('\n💡 Çözüm: npm run create-admin komutunu çalıştırın.')
    } else {
      console.log(`✅ ${admins.length} admin kullanıcısı bulundu:\n`)
      
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Admin:`)
        console.log(`   📧 Email: ${admin.email}`)
        console.log(`   👤 İsim: ${admin.name}`)
        console.log(`   🏢 Şube: ${admin.kurumSube}`)
        console.log(`   🔑 Şifre Hash: ${admin.password.substring(0, 20)}...`)
        console.log(`   📅 Oluşturulma: ${admin.createdAt}`)
        console.log('')
      })
    }
    
    // Test email ile arama
    const testEmail = 'admin@karbonkurs.com'
    console.log(`\n🔎 "${testEmail}" email'i ile arama yapılıyor...`)
    
    const foundAdmin = await prisma.admin.findUnique({
      where: { email: testEmail }
    })
    
    if (foundAdmin) {
      console.log('✅ Admin bulundu!')
      console.log(`   Email: ${foundAdmin.email}`)
      console.log(`   İsim: ${foundAdmin.name}`)
      console.log(`   Şube: ${foundAdmin.kurumSube}`)
    } else {
      console.log('❌ Admin bulunamadı!')
      console.log('\n💡 Email case-sensitive olabilir. Database\'deki email\'i kontrol edin.')
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

