import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { isMissingArsivlendiError } from "@/lib/basvuru-arsiv-db"

const bodySchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "En az bir başvuru seçmelisiniz"),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 })
    }

    const kurumSube = session.user.kurumSube
    if (!kurumSube) {
      return NextResponse.json({ error: "Kurum şubesi bilgisi bulunamadı" }, { status: 500 })
    }

    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.ids?.[0] || "Geçersiz istek" },
        { status: 400 }
      )
    }

    const okulArama = kurumSube === "Rize" ? "RİZE" : "TRABZON"

    const result = await prisma.basvuru.updateMany({
      where: {
        id: { in: parsed.data.ids },
        arsivlendi: false,
        OR: [
          { kurumSube },
          { okul: { contains: okulArama, mode: "insensitive" } },
        ],
      },
      data: { arsivlendi: true },
    })

    return NextResponse.json({
      success: true,
      arsivlenen: result.count,
      istenen: parsed.data.ids.length,
    })
  } catch (error) {
    console.error("Arşivleme hatası:", error)
    if (isMissingArsivlendiError(error)) {
      return NextResponse.json(
        {
          error:
            "Veritabanında arşiv sütunu yok. Sunucuda migration çalıştırın: npx prisma migrate deploy",
        },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: "Arşivleme sırasında bir hata oluştu" }, { status: 500 })
  }
}
