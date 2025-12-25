import { config } from 'dotenv'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Load .env.local first, then .env
config({ path: '.env.local' })
config()

async function main() {
  try {
    console.log('🔍 Vercel Connection Test\n')
    console.log('📊 Database Connection String:')
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl) {
      // Password'u gizle
      const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@')
      console.log(`   ${maskedUrl}`)
    } else {
      console.log('   ❌ DATABASE_URL bulunamadı!')
      return
    }
    
    console.log('\n🔐 Admin Login Test\n')
    
    const email = 'admin@karbonkurs.com'
    const password = 'QAZWSX.90'
    
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Şifre: ${password}\n`)
    
    // Database bağlantısını test et
    console.log('1️⃣ Database bağlantısı test ediliyor...')
    await prisma.$connect()
    console.log('   ✅ Database bağlantısı başarılı!\n')
    
    // Admin'i bul
    console.log('2️⃣ Admin kullanıcısı aranıyor...')
    const admin = await prisma.admin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      console.log('   ❌ Admin bulunamadı!')
      console.log('\n💡 Çözüm: Admin oluşturun:')
      console.log('   npm run create-admin')
      return
    }
    
    console.log('   ✅ Admin bulundu!')
    console.log(`   📧 Email: ${admin.email}`)
    console.log(`   👤 İsim: ${admin.name}`)
    console.log(`   🏢 Şube: ${admin.kurumSube}\n`)
    
    // Şifre kontrolü
    console.log('3️⃣ Şifre kontrol ediliyor...')
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    
    if (isPasswordValid) {
      console.log('   ✅ Şifre DOĞRU!\n')
      console.log('✅ TÜM TESTLER BAŞARILI!')
      console.log('\n📝 Giriş Bilgileri:')
      console.log(`   Email: ${email}`)
      console.log(`   Şifre: ${password}`)
      console.log(`   Şube: ${admin.kurumSube}`)
      console.log('\n💡 Eğer hala giriş yapamıyorsanız:')
      console.log('   1. Vercel\'de DATABASE_URL\'in aynı olduğundan emin olun')
      console.log('   2. Vercel\'de redeploy yapın')
      console.log('   3. Browser cache\'ini temizleyin')
      console.log('   4. Vercel Logs\'u kontrol edin (Deployments → Logs)')
    } else {
      console.log('   ❌ Şifre YANLIŞ!')
      console.log('\n💡 Çözüm: Admin\'i yeniden oluşturun:')
      console.log('   npm run create-admin')
    }
    
  } catch (error) {
    console.error('\n❌ Hata:', error)
    console.log('\n💡 Olası Sorunlar:')
    console.log('   1. DATABASE_URL yanlış olabilir')
    console.log('   2. Database bağlantısı başarısız')
    console.log('   3. Network sorunu')
  } finally {
    await prisma.$disconnect()
  }
}

main()

