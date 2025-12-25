import { config } from 'dotenv'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Load .env.local first, then .env
config({ path: '.env.local' })
config()

async function main() {
  try {
    const email = 'admin@karbonkurs.com'
    const password = 'QAZWSX.90'
    
    console.log('🔐 Login testi yapılıyor...\n')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Şifre: ${password}\n`)
    
    // Admin'i bul
    const admin = await prisma.admin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      console.log('❌ Admin bulunamadı!')
      return
    }
    
    console.log('✅ Admin bulundu:')
    console.log(`   Email: ${admin.email}`)
    console.log(`   İsim: ${admin.name}`)
    console.log(`   Şube: ${admin.kurumSube}`)
    console.log(`   Şifre Hash: ${admin.password.substring(0, 30)}...\n`)
    
    // Şifre kontrolü
    console.log('🔍 Şifre kontrol ediliyor...')
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    
    if (isPasswordValid) {
      console.log('✅ Şifre DOĞRU!')
      console.log('\n💡 Eğer hala giriş yapamıyorsanız:')
      console.log('   1. Vercel\'deki DATABASE_URL\'in aynı olduğundan emin olun')
      console.log('   2. Vercel\'de redeploy yapın')
      console.log('   3. Browser cache\'ini temizleyin')
    } else {
      console.log('❌ Şifre YANLIŞ!')
      console.log('\n💡 Çözüm: Admin\'i yeniden oluşturun:')
      console.log('   npm run create-admin')
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

