import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

/** Production DB migration henüz uygulanmadıysa arsivlendi sütunu yoktur. */
export function isMissingArsivlendiError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  if (o.code === "P2022") return true
  const meta = o.meta as Record<string, unknown> | undefined
  if (meta && String(meta.column_name ?? "") === "arsivlendi") return true
  const msg =
    typeof o.message === "string" ? o.message : e instanceof Error ? e.message : JSON.stringify(e)
  return (
    /\barsivlendi\b/i.test(msg) &&
    (/column/i.test(msg) || /does not exist/i.test(msg) || /Unknown column/i.test(msg))
  )
}

/** Admin listesi / API yanıtı için (arsivlendi hariç — DB’de yoksa kullanılır) */
export const basvuruSelectAdminWithoutArsiv: Prisma.BasvuruSelect = {
  id: true,
  ogrenciAdSoyad: true,
  ogrenciTc: true,
  okul: true,
  ogrenciSinifi: true,
  ogrenciSube: true,
  kurumSube: true,
  sinavGunu: true,
  sinavSecimi: true,
  sinavSaati: true,
  siraNumarasi: true,
  oturum: true,
  sinavSalonu: true,
  sinavAdresi: true,
  sinavTarihi: true,
  digerNotlar: true,
  babaAdSoyad: true,
  babaMeslek: true,
  babaDurumu: true,
  babaIsAdresi: true,
  babaCepTel: true,
  anneAdSoyad: true,
  anneMeslek: true,
  anneDurumu: true,
  anneIsAdresi: true,
  anneCepTel: true,
  email: true,
  createdAt: true,
  updatedAt: true,
}

export const basvuruSelectAdminWithArsiv: Prisma.BasvuruSelect = {
  ...basvuruSelectAdminWithoutArsiv,
  arsivlendi: true,
}

export async function findManyBasvuruForAdminApi() {
  const orderBy = { createdAt: "desc" as const }
  try {
    return await prisma.basvuru.findMany({
      select: basvuruSelectAdminWithArsiv,
      orderBy,
    })
  } catch (e) {
    if (!isMissingArsivlendiError(e)) throw e
    const rows = await prisma.basvuru.findMany({
      select: basvuruSelectAdminWithoutArsiv,
      orderBy,
    })
    return rows.map((r) => ({ ...r, arsivlendi: false }))
  }
}
