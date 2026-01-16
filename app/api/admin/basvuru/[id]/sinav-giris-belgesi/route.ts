import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { sinavSaati, siraNumarasi, oturum, sinavSalonu, sinavAdresi, sinavTarihi, digerNotlar } = body

    // Başvuruyu güncelle
    const basvuru = await prisma.basvuru.update({
      where: { id },
      data: {
        sinavSaati: sinavSaati || null,
        siraNumarasi: siraNumarasi || null,
        oturum: oturum || null,
        sinavSalonu: sinavSalonu || null,
        sinavAdresi: sinavAdresi || null,
        sinavTarihi: sinavTarihi || null,
        digerNotlar: digerNotlar || null,
      },
    })

    return NextResponse.json(
      { success: true, basvuru },
      { status: 200 }
    )
  } catch (error) {
    console.error("Sınav giriş belgesi güncelleme hatası:", error)
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 }
    )
  }
}

