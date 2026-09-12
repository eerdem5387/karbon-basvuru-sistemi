/** Rize şubesi güncel (aktif) sınav tanımları */
export type RizeSinavTanim = {
  metin: string
  tarih: string
  saat: string
  yer: string
  siniflar: readonly string[]
}

export const rizeAktifSinavlar: readonly RizeSinavTanim[] = [
  {
    metin: "TYT hazır bulunuşluk sınavı",
    tarih: "10 Ekim Cumartesi",
    saat: "10.00",
    yer: "Sağlık Bilimleri Fakültesi",
    siniflar: ["11. Sınıf", "12. Sınıf", "Mezun"],
  },
  {
    metin: "11. Sınıf hazır bulunuşluk sınavı",
    tarih: "10 Ekim Cumartesi",
    saat: "10.00",
    yer: "Sağlık Bilimleri Fakültesi",
    siniflar: ["11. Sınıf"],
  },
  {
    metin: "Türkiye Geneli Lgs Hazır bulunuşluk sınavı",
    tarih: "10 Ekim Cumartesi",
    saat: "10.00",
    yer: "Sağlık Bilimleri Fakültesi",
    siniflar: ["8. Sınıf"],
  },
] as const

export const rizeSinavSecenekleri = rizeAktifSinavlar.map((s) => s.metin)

const aktifMetinSet = new Set<string>(rizeSinavSecenekleri)

export function isAktifRizeSinav(metin: string | null | undefined): boolean {
  if (!metin?.trim()) return false
  return aktifMetinSet.has(metin.trim())
}

export function getRizeSinavByMetin(metin: string | null | undefined): RizeSinavTanim | undefined {
  if (!metin?.trim()) return undefined
  return rizeAktifSinavlar.find((s) => s.metin === metin.trim())
}

export function getSiniflarForRizeSinav(metin: string | null | undefined): string[] {
  const sinav = getRizeSinavByMetin(metin)
  return sinav ? [...sinav.siniflar] : []
}

/** Eski / güncel olmayan sınav başvuruları (Rize yedek sayfası) */
export function isYedekRizeBasvuru(sinavSecimi: string | null | undefined): boolean {
  return !isAktifRizeSinav(sinavSecimi)
}
