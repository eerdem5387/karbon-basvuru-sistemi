import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const tcSchema = z.string().length(11).regex(/^\d+$/)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ogrenciTc } = body

    // TC validasyonu
    const validatedTc = tcSchema.parse(ogrenciTc)

    // Başvuruyu bul
    const basvuru = await prisma.basvuru.findUnique({
      where: { ogrenciTc: validatedTc },
      select: {
        id: true,
        ogrenciAdSoyad: true,
        ogrenciTc: true,
        okul: true,
        ogrenciSinifi: true,
        kurumSube: true,
        sinavSecimi: true,
        sinavSaati: true,
        siraNumarasi: true,
        oturum: true,
        sinavSalonu: true,
        sinavAdresi: true,
        sinavTarihi: true,
        digerNotlar: true,
      },
    })

    if (!basvuru) {
      return NextResponse.json(
        { error: "Bu TC Kimlik No ile başvuru bulunamadı." },
        { status: 404 }
      )
    }

    // Sadece Rize başvuruları için sınav giriş belgesi
    if (basvuru.kurumSube !== 'Rize') {
      return NextResponse.json(
        { error: "Bu özellik sadece Rize şubesi için geçerlidir." },
        { status: 400 }
      )
    }

    // Sınav giriş belgesi bilgileri dolu mu kontrol et
    if (!basvuru.sinavSaati || !basvuru.siraNumarasi) {
      return NextResponse.json(
        { error: "Sınav giriş belgesi henüz hazırlanmamış. Lütfen daha sonra tekrar deneyiniz." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, basvuru },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz TC Kimlik No" },
        { status: 400 }
      )
    }

    console.error("Sınav giriş belgesi sorgulama hatası:", error)
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

