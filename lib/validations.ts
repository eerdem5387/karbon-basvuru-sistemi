import { z } from "zod"

// TC Kimlik No validasyonu
export const tcKimlikValidator = (tc: string): boolean => {
  if (!/^\d{11}$/.test(tc)) return false
  
  const digits = tc.split('').map(Number)
  
  // İlk rakam 0 olamaz
  if (digits[0] === 0) return false
  
  // 10. rakam kontrolü
  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
  const digit10 = (sum1 - sum2) % 10
  if (digits[9] !== digit10) return false
  
  // 11. rakam kontrolü
  const sum3 = digits.slice(0, 10).reduce((a, b) => a + b, 0)
  const digit11 = sum3 % 10
  if (digits[10] !== digit11) return false
  
  return true
}

// Sınav seçenekleri
export const rizeSinavSecenekleri = [
  "7 Şubat 4,5,6,7,8,9,10,11. sınıflar bursluluk sınavı (ücretsiz)",
  "7 Şubat 12. sınıflar ve mezunlar TYT Simulasyon Türkiye Geneli (ücretsiz)",
  "11 Nisan Bilgi Sarmalı Türkiye Geneli TYT (ücretsiz)",
  "2 Mayıs 3,4,5 yayınları Türkiye Geneli TYT Son Prova (ücretsiz)"
] as const

export const basvuruSchema = z.object({
  ogrenciAdSoyad: z.string()
    .min(3, "Öğrenci adı soyadı en az 3 karakter olmalıdır")
    .max(100, "Öğrenci adı soyadı en fazla 100 karakter olabilir")
    .regex(/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/, "Sadece harf ve boşluk kullanılabilir"),
  
  ogrenciTc: z.string()
    .length(11, "TC Kimlik No 11 haneli olmalıdır")
    .regex(/^\d+$/, "TC Kimlik No sadece rakamlardan oluşmalıdır")
    .refine(tcKimlikValidator, "Geçersiz TC Kimlik No"),
  
  okul: z.string()
    .min(1, "Okul seçimi zorunludur"),
  
  ogrenciSinifi: z.string()
    .min(1, "Sınıf seçimi zorunludur"),
  
  kurumSube: z.enum(["Rize", "Trabzon"]).optional(),
  
  // Rize için sınav seçimi (opsiyonel - frontend'de kontrol edilecek)
  sinavSecimi: z.string().optional(),
  
  babaAdSoyad: z.string()
    .min(3, "Baba adı soyadı en az 3 karakter olmalıdır")
    .max(100, "Baba adı soyadı en fazla 100 karakter olabilir")
    .regex(/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/, "Sadece harf ve boşluk kullanılabilir"),
  
  babaMeslek: z.string()
    .min(1, "Baba meslek seçimi zorunludur"),
  
  babaIsAdresi: z.string()
    .min(15, "Baba iş adresi en az 15 karakter olmalıdır")
    .max(500, "Baba iş adresi en fazla 500 karakter olabilir"),
  
  babaCepTel: z.string()
    .min(10, "Telefon numarası en az 10 haneli olmalıdır")
    .max(10, "Telefon numarası en fazla 10 haneli olmalıdır")
    .regex(/^5\d{9}$/, "Geçerli bir cep telefonu numarası giriniz (5XXXXXXXXX - tam 10 hane)"),
  
  anneAdSoyad: z.string()
    .min(3, "Anne adı soyadı en az 3 karakter olmalıdır")
    .max(100, "Anne adı soyadı en fazla 100 karakter olabilir")
    .regex(/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/, "Sadece harf ve boşluk kullanılabilir"),
  
  anneMeslek: z.string()
    .min(1, "Anne meslek seçimi zorunludur"),
  
  anneIsAdresi: z.string()
    .min(15, "Anne iş adresi en az 15 karakter olmalıdır")
    .max(500, "Anne iş adresi en fazla 500 karakter olabilir"),
  
  anneCepTel: z.string()
    .min(10, "Telefon numarası en az 10 haneli olmalıdır")
    .max(10, "Telefon numarası en fazla 10 haneli olmalıdır")
    .regex(/^5\d{9}$/, "Geçerli bir cep telefonu numarası giriniz (5XXXXXXXXX - tam 10 hane)"),
  
  email: z.string()
    .email("Geçerli bir e-posta adresi giriniz")
    .toLowerCase(),
}).superRefine((data, ctx) => {
  // Rize için sınav seçimi zorunlu
  if (data.kurumSube === "Rize" && !data.sinavSecimi) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sınav seçimi zorunludur",
      path: ["sinavSecimi"],
    })
  }
  
  // Sınav seçimine göre sınıf kontrolü
  if (data.kurumSube === "Rize" && data.sinavSecimi) {
    const burslulukSinavi = "7 Şubat 4,5,6,7,8,9,10,11. sınıflar bursluluk sınavı (ücretsiz)"
    
    if (data.sinavSecimi === burslulukSinavi) {
      // Bursluluk sınavı seçildiyse 12. sınıf seçilemez
      if (data.ogrenciSinifi === "12. Sınıf") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bu sınav için 12. sınıf seçilemez. Lütfen 4-11. sınıflar arasından seçim yapın.",
          path: ["ogrenciSinifi"],
        })
      }
    } else {
      // Diğer sınavlar için sadece 12. sınıf veya mezun seçilebilir
      if (data.ogrenciSinifi !== "12. Sınıf" && data.ogrenciSinifi !== "Mezun") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bu sınav için sadece 12. sınıf veya mezun seçilebilir.",
          path: ["ogrenciSinifi"],
        })
      }
    }
  }
})

export type BasvuruFormData = z.infer<typeof basvuruSchema>

