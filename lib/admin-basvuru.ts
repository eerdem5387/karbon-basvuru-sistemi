export interface AdminBasvuru {
  id: string
  ogrenciAdSoyad: string
  ogrenciTc: string
  okul: string
  ogrenciSinifi: string
  ogrenciSube: string
  kurumSube: string
  sinavGunu: string
  sinavSecimi: string | null
  sinavSaati: string | null
  siraNumarasi: string | null
  oturum: string | null
  sinavSalonu: string | null
  sinavAdresi: string | null
  sinavTarihi: string | null
  digerNotlar: string | null
  babaAdSoyad: string
  babaMeslek: string
  babaDurumu: string
  babaIsAdresi: string
  babaCepTel: string
  anneAdSoyad: string
  anneMeslek: string
  anneDurumu: string
  anneIsAdresi: string
  anneCepTel: string
  email: string
  arsivlendi?: boolean
  createdAt: string
  updatedAt: string
}
