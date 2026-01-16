import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import * as XLSX from "xlsx"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    // Query parametrelerini al
    const { searchParams } = new URL(request.url)
    const tarihBaslangic = searchParams.get('tarihBaslangic')
    const tarihBitis = searchParams.get('tarihBitis')
    const sinif = searchParams.get('sinif')
    const okul = searchParams.get('okul')

    // Admin kullanıcısının şubesine göre filtreleme
    const kurumSube = session.user.kurumSube

    // Filtreleme için where koşulları - eski başvuruları da dahil et
    const where: Prisma.BasvuruWhereInput = {
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
    }

    if (tarihBaslangic || tarihBitis) {
      where.createdAt = {}
      if (tarihBaslangic) {
        where.createdAt.gte = new Date(tarihBaslangic)
      }
      if (tarihBitis) {
        where.createdAt.lte = new Date(tarihBitis + 'T23:59:59')
      }
    }

    if (sinif) {
      where.ogrenciSinifi = sinif
    }

    if (okul) {
      where.okul = okul
    }

    const basvurular = await prisma.basvuru.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Excel için veriyi hazırla
    const excelData = basvurular.map((b, index) => ({
      'Sıra': index + 1,
      'Kurum Şubesi': b.kurumSube,
      'Öğrenci Ad Soyad': b.ogrenciAdSoyad,
      'TC Kimlik No': b.ogrenciTc,
      'Okul': b.okul,
      'Sınıf': b.ogrenciSinifi,
      // Rize için sınav bilgileri
      ...(b.kurumSube === 'Rize' && {
        'Sınav Seçimi': b.sinavSecimi || '-',
        'Sınav Tarihi': b.sinavTarihi || '-',
        'Sınav Saati': b.sinavSaati || '-',
        'Sıra Numarası': b.siraNumarasi || '-',
        'Oturum': b.oturum || '-',
        'Sınav Salonu': b.sinavSalonu || '-',
        'Sınav Adresi': b.sinavAdresi || '-',
        'Diğer Notlar': b.digerNotlar || '-',
      }),
      'Baba Ad Soyad': b.babaAdSoyad,
      'Baba Meslek': b.babaMeslek,
      'Baba İş Adresi': b.babaIsAdresi || '-',
      'Baba Cep Tel': b.babaCepTel,
      'Anne Ad Soyad': b.anneAdSoyad,
      'Anne Meslek': b.anneMeslek,
      'Anne İş Adresi': b.anneIsAdresi || '-',
      'Anne Cep Tel': b.anneCepTel,
      'E-posta': b.email,
      'Başvuru Tarihi': new Date(b.createdAt).toLocaleString('tr-TR'),
    }))

    // Excel workbook oluştur
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Başvurular")

    // Buffer'a çevir
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    // Response oluştur
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="basvurular-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Excel export hatası:", error)

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
      { error: "Excel dosyası oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}

