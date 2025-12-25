# Karbon Kurs Plus - Şube Yönetimi Sistemi

Bu sistem, Karbon Kurs Plus kurumunun **Rize** ve **Trabzon** şubelerini ayrı ayrı yönetmek için geliştirilmiştir.

## 🏢 Sistem Özellikleri

### Şube Bazlı Yönetim
- Her şube için ayrı admin kullanıcıları
- Admin kullanıcıları sadece kendi şubelerinin başvurularını görebilir
- Başvuru formu otomatik olarak şubeyi belirler (okul seçimine göre)
- Excel export şube bazlı çalışır

### Başvuru Sistemi
- **Trabzon** ile başlayan okullar → Trabzon şubesi
- **RİZE** ile başlayan okullar → Rize şubesi
- Otomatik şube ataması

## 👥 Admin Kullanıcı Oluşturma

### Rize Şubesi İçin Admin Oluşturma

```bash
ADMIN_EMAIL="rize@karbonkurs.com" \
ADMIN_NAME="Rize Admin" \
ADMIN_PASSWORD="RizeAdmin2025!" \
ADMIN_KURUM_SUBE="Rize" \
npx tsx scripts/create-admin.ts
```

### Trabzon Şubesi İçin Admin Oluşturma

```bash
ADMIN_EMAIL="trabzon@karbonkurs.com" \
ADMIN_NAME="Trabzon Admin" \
ADMIN_PASSWORD="TrabzonAdmin2025!" \
ADMIN_KURUM_SUBE="Trabzon" \
npx tsx scripts/create-admin.ts
```

## 🔐 Giriş Bilgileri

Her şube admini kendi email ve şifresi ile `/admin/login` sayfasından giriş yapabilir.

### Örnek Giriş:
- **Email:** rize@karbonkurs.com
- **Şifre:** Oluştururken belirlediğiniz şifre

## 📊 Admin Paneli Özellikleri

### Dashboard
- Şube adı header'da görünür: "Admin Paneli - Karbon Kurs Plus Rize Şubesi"
- Sadece kendi şubesinin başvuruları listelenir
- Filtreleme ve arama özellikleri şube bazlı çalışır

### Excel Export
- Export edilen dosya sadece kendi şubesinin başvurularını içerir
- Excel'de "Kurum Şubesi" kolonu bulunur
- "Sınav Günü" bilgisi eklendi

### Başvuru Detayları
- Her başvurunun detayında:
  - Kurum şubesi
  - Sınav günü
  - Tüm öğrenci ve veli bilgileri

## 🎯 Kullanım Senaryoları

### Senaryo 1: Her İki Şube İçin Admin Oluşturma

```bash
# Rize admin
ADMIN_EMAIL="rize@karbonkurs.com" ADMIN_NAME="Rize Yöneticisi" ADMIN_PASSWORD="Rize2025!" ADMIN_KURUM_SUBE="Rize" npx tsx scripts/create-admin.ts

# Trabzon admin
ADMIN_EMAIL="trabzon@karbonkurs.com" ADMIN_NAME="Trabzon Yöneticisi" ADMIN_PASSWORD="Trabzon2025!" ADMIN_KURUM_SUBE="Trabzon" npx tsx scripts/create-admin.ts
```

### Senaryo 2: Mevcut Admin Güncelleme

Aynı email ile yeniden admin oluşturursanız, eski admin silinir ve yenisi oluşturulur.

```bash
# Mevcut rize@karbonkurs.com admin'ini güncelle
ADMIN_EMAIL="rize@karbonkurs.com" ADMIN_NAME="Yeni İsim" ADMIN_PASSWORD="YeniSifre!" ADMIN_KURUM_SUBE="Rize" npx tsx scripts/create-admin.ts
```

## 📝 Başvuru Formu

Başvuru formu tek sayfada her iki şube için çalışır:
- Kullanıcı okulunu seçer
- Sistem otomatik olarak şubeyi belirler
- Başvuru ilgili şubeye kaydedilir

### Okul Seçimi Örnekleri:
- **TRABZON - MERKEZ - Trabzon Fen Lisesi** → Trabzon şubesi
- **RİZE - ARDEŞEN - Alparslan Ortaokulu** → Rize şubesi

## 🔧 Veritabanı Değişiklikleri

### Basvuru Modeli
```prisma
model Basvuru {
  // ...
  kurumSube        String   @default("Rize")  // Yeni alan
  // ...
}
```

### Admin Modeli
```prisma
model Admin {
  // ...
  kurumSube String   @default("Rize")  // Yeni alan
  // ...
}
```

## 🚀 Deployment

Production'a deploy ederken:

1. Veritabanı migration'larını çalıştırın (otomatik uygulanmış)
2. Her iki şube için admin kullanıcıları oluşturun
3. Admin kullanıcılarına giriş bilgilerini güvenli bir şekilde iletin

## ⚠️ Önemli Notlar

1. **Şube Değeri:** Sadece "Rize" veya "Trabzon" olabilir (büyük/küçük harf duyarlı)
2. **Email Unique:** Her admin'in email adresi benzersiz olmalı
3. **Güvenlik:** Production ortamında güçlü şifreler kullanın
4. **Mevcut Veriler:** Eski başvurular varsayılan olarak "Rize" şubesine atanmıştır

## 📞 Destek

Sorularınız için sistem yöneticinizle iletişime geçin.

