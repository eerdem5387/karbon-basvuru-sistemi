import { isAktifRizeSinav, isYedekRizeBasvuru } from "@/lib/rize-sinavlar"

type BasvuruLike = {
  kurumSube?: string | null
  okul?: string | null
  sinavSecimi?: string | null
  arsivlendi?: boolean
}

export function basvuruSubeEslesir(b: BasvuruLike, kurumSube: string): boolean {
  if (b.kurumSube === kurumSube) return true
  const okulArama = kurumSube === "Rize" ? "RİZE" : "TRABZON"
  if (b.okul && b.okul.toUpperCase().includes(okulArama)) return true
  return false
}

/** Ana panel listesi: güncel aktif sınav başvuruları, arşivde olmayan */
export function anaListeBasvurusu(b: BasvuruLike, kurumSube: string): boolean {
  if (Boolean(b.arsivlendi)) return false
  if (kurumSube === "Rize") {
    return isAktifRizeSinav(b.sinavSecimi)
  }
  return true
}

/** Manuel arşiv: aktif sınavdan arşivlenenler */
export function arsivBasvurusu(b: BasvuruLike, kurumSube: string): boolean {
  if (!Boolean(b.arsivlendi)) return false
  if (kurumSube === "Rize") {
    return isAktifRizeSinav(b.sinavSecimi)
  }
  return true
}

/** Yedek: eski / güncel olmayan sınav başvuruları (Rize) */
export function yedekBasvurusu(b: BasvuruLike, kurumSube: string): boolean {
  if (kurumSube !== "Rize") return false
  return isYedekRizeBasvuru(b.sinavSecimi)
}
