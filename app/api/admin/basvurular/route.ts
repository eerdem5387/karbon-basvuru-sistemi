import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      console.error('[Admin API] Session yok veya user yok')
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }
    
    // Admin kullanıcısının şubesine göre başvuruları filtrele
    const kurumSube = session.user.kurumSube
    
    if (!kurumSube) {
      console.error('[Admin API] kurumSube yok:', session.user)
      return NextResponse.json(
        { error: "Kurum şubesi bilgisi bulunamadı" },
        { status: 500 }
      )
    }
    
    console.log('[Admin API] Kurum Şube:', kurumSube)
    
    // Önce tüm başvuruları say
    const toplamBasvuru = await prisma.basvuru.count()
    console.log('[Admin API] Toplam başvuru:', toplamBasvuru)
    
    // Tüm başvuruları çek (güvenli yaklaşım)
    const tumBasvurular = await prisma.basvuru.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('[Admin API] Tüm başvuru sayısı:', tumBasvurular.length)
    
    // JavaScript'te filtrele (daha güvenli)
    const okulArama = kurumSube === 'Rize' ? 'RİZE' : 'TRABZON'
    const basvurular = tumBasvurular.filter(b => {
      // KurumSube eşleşiyorsa göster
      if (b.kurumSube === kurumSube) {
        return true
      }
      // Okul adında şube adı geçiyorsa göster (eski başvurular için)
      if (b.okul && b.okul.toUpperCase().includes(okulArama)) {
        return true
      }
      return false
    })
    
    console.log('[Admin API] Filtrelenmiş başvuru sayısı:', basvurular.length)
    
    console.log('[Admin API] Filtrelenmiş başvuru sayısı:', basvurular.length)
    
    // Eski başvuruların kurumSube değerini güncelle (asenkron, kullanıcıyı bekletme)
    const guncellenecekBasvurular = basvurular.filter(b => 
      !b.kurumSube || b.kurumSube === '' || b.kurumSube === 'Belirtilmedi'
    )
    
    if (guncellenecekBasvurular.length > 0) {
      // Arka planda güncelle, kullanıcıyı bekletme
      Promise.all(
        guncellenecekBasvurular.map(async (basvuru) => {
          const okulAdi = basvuru.okul.toUpperCase()
          const yeniKurumSube = okulAdi.includes('RİZE') ? 'Rize' : okulAdi.includes('TRABZON') ? 'Trabzon' : kurumSube
          
          return prisma.basvuru.update({
            where: { id: basvuru.id },
            data: { kurumSube: yeniKurumSube }
          }).catch(() => {
            // Hata olsa bile devam et
          })
        })
      ).catch(() => {
        // Toplu güncelleme hatası - logla ama kullanıcıya gösterme
      })
    }
    
    return NextResponse.json(basvurular)
  } catch (error) {
    console.error("Başvurular getirme hatası:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: JSON.stringify(error, null, 2)
    })
    
    // Prisma connection errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P1001' || error.code === 'P1002') {
        return NextResponse.json(
          { error: "Veritabanı bağlantı hatası" },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Başvurular getirilirken bir hata oluştu",
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}

