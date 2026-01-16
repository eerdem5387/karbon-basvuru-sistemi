import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }
    
    // Admin kullanıcısının şubesine göre başvuruları filtrele
    const kurumSube = session.user.kurumSube
    
    // Eski başvurular için: kurumSube eşleşmese bile okul adına göre göster
    const basvurular = await prisma.basvuru.findMany({
      where: {
        OR: [
          { kurumSube: kurumSube },
          // Eski başvurular için: okul adına göre otomatik tespit
          {
            okul: {
              contains: kurumSube === 'Rize' ? 'RİZE' : 'TRABZON',
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
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
      { error: "Başvurular getirilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

