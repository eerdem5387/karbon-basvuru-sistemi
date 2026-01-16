import { config } from 'dotenv'
import { prisma } from '../lib/prisma'

config({ path: '.env.local' })
config()

async function main() {
  console.log('🔍 Database\'deki başvuruları kontrol ediyorum...\n')
  
  try {
    // Tüm başvuruları say
    const toplamBasvuru = await prisma.basvuru.count()
    console.log(`📊 Toplam Başvuru Sayısı: ${toplamBasvuru}\n`)
    
    if (toplamBasvuru === 0) {
      console.log('❌ Database\'de hiç başvuru yok!')
      return
    }
    
    // KurumSube'ye göre grupla
    const rizeBasvurular = await prisma.basvuru.count({
      where: { kurumSube: 'Rize' }
    })
    
    const trabzonBasvurular = await prisma.basvuru.count({
      where: { kurumSube: 'Trabzon' }
    })
    
    console.log(`📊 Rize Başvuruları: ${rizeBasvurular}`)
    console.log(`📊 Trabzon Başvuruları: ${trabzonBasvurular}`)
    console.log(`📊 Diğer/Boş: ${toplamBasvuru - rizeBasvurular - trabzonBasvurular}\n`)
    
    // İlk 5 başvuruyu göster
    const ornekBasvurular = await prisma.basvuru.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ogrenciAdSoyad: true,
        ogrenciTc: true,
        okul: true,
        kurumSube: true,
        createdAt: true
      }
    })
    
    console.log('📋 Son 5 Başvuru Örneği:\n')
    ornekBasvurular.forEach((b, index) => {
      console.log(`${index + 1}. ${b.ogrenciAdSoyad}`)
      console.log(`   TC: ${b.ogrenciTc}`)
      console.log(`   Okul: ${b.okul}`)
      console.log(`   Kurum Şube: ${b.kurumSube}`)
      console.log(`   Tarih: ${b.createdAt}\n`)
    })
    
    // Trabzon okulları içeren başvuruları kontrol et
    const trabzonOkulBasvurular = await prisma.basvuru.findMany({
      where: {
        okul: {
          contains: 'TRABZON',
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        ogrenciAdSoyad: true,
        okul: true,
        kurumSube: true
      },
      take: 5
    })
    
    console.log(`\n📊 Okul adında "TRABZON" geçen başvurular: ${trabzonOkulBasvurular.length} (ilk 5 gösteriliyor)`)
    trabzonOkulBasvurular.forEach((b, index) => {
      console.log(`${index + 1}. ${b.ogrenciAdSoyad} - ${b.okul} - Kurum: ${b.kurumSube}`)
    })
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })

