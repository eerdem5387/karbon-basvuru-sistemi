import { config } from 'dotenv'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Load .env.local first, then .env
config({ path: '.env.local' })
config()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@bursluluk.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!@#'
  const name = process.env.ADMIN_NAME || 'Admin'
  const kurumSube = process.env.ADMIN_KURUM_SUBE || 'Rize'

  // Validate kurumSube
  if (kurumSube !== 'Rize' && kurumSube !== 'Trabzon') {
    console.error('❌ ADMIN_KURUM_SUBE sadece "Rize" veya "Trabzon" olabilir!')
    process.exit(1)
  }

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('⚠️  Mevcut admin kullanıcısı bulundu, güncelleniyor...')
    // Delete existing admin
    await prisma.admin.delete({
      where: { email }
    })
    console.log('✅ Eski admin kullanıcısı silindi')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create admin
  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
      kurumSube,
    }
  })

  console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!')
  console.log('📧 Email:', email)
  console.log('👤 İsim:', name)
  console.log('🏢 Kurum Şubesi:', kurumSube)
  console.log('🔑 Şifre:', password)
  console.log('\n⚠️  Lütfen production ortamında bu şifreyi değiştirin!')
  console.log('\n📝 İpucu: Başka şube için admin oluşturmak için:')
  console.log('   ADMIN_EMAIL="trabzon@karbon.com" ADMIN_NAME="Trabzon Admin" ADMIN_KURUM_SUBE="Trabzon" ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

