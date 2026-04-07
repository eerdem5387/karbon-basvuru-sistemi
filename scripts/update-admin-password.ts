/**
 * Şube veya e-postaya göre admin şifresini günceller (bcrypt, auth ile uyumlu).
 *
 * Tüm Rize adminleri:
 *   NEW_PASSWORD="..." ADMIN_KURUM_SUBE=Rize npx tsx scripts/update-admin-password.ts
 *
 * Tek e-posta:
 *   NEW_PASSWORD="..." ADMIN_EMAIL=ornek@site.com npx tsx scripts/update-admin-password.ts
 */
import { config } from 'dotenv'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

config({ path: '.env.local' })
config()

async function main() {
  const newPassword = process.env.NEW_PASSWORD?.trim()
  if (!newPassword || newPassword.length < 6) {
    console.error('❌ NEW_PASSWORD ortam değişkeni gerekli (en az 6 karakter).')
    process.exit(1)
  }

  const email = process.env.ADMIN_EMAIL?.trim()
  const kurumSube = process.env.ADMIN_KURUM_SUBE?.trim() || 'Rize'

  if (kurumSube !== 'Rize' && kurumSube !== 'Trabzon') {
    console.error('❌ ADMIN_KURUM_SUBE sadece "Rize" veya "Trabzon" olabilir.')
    process.exit(1)
  }

  const admins = email
    ? await prisma.admin.findMany({ where: { email } })
    : await prisma.admin.findMany({ where: { kurumSube } })

  if (admins.length === 0) {
    console.error(email ? `❌ Bu e-posta ile admin yok: ${email}` : `❌ ${kurumSube} şubesinde admin yok.`)
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  for (const a of admins) {
    await prisma.admin.update({
      where: { id: a.id },
      data: { password: hashedPassword },
    })
  }

  console.log(`✅ ${admins.length} admin hesabının şifresi güncellendi.`)
  for (const a of admins) {
    console.log(`   — ${a.email} (${a.kurumSube})`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
