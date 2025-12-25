# 🔐 Şube Ayrımı Sistemi - Detaylı Açıklama

## ❓ Sorunuz: "Trabzona gelen başvurular Rize'ye gelmeyecek değil mi?"

## ✅ EVET! Kesinlikle Ayrı Çalışıyor!

Her admin **sadece kendi şubesinin** başvurularını görebilir. Sistemde **4 katmanlı güvenlik** var:

---

## 🏗️ Sistem Mimarisi

### 1. **Kullanıcı Kaydı (Admin Oluşturma)**
```bash
# Rize admini oluşturma
ADMIN_EMAIL="rize@karbonkursplus.com"
ADMIN_PASSWORD="güvenli123"
ADMIN_NAME="Rize Yönetici"
ADMIN_KURUM_SUBE="Rize"
npm run create-admin

# Trabzon admini oluşturma
ADMIN_EMAIL="trabzon@karbonkursplus.com"
ADMIN_PASSWORD="güvenli456"
ADMIN_NAME="Trabzon Yönetici"
ADMIN_KURUM_SUBE="Trabzon"
npm run create-admin
```

**Veritabanı:**
```sql
Admin Tablosu:
┌────────┬─────────────────────────────┬──────────────────┬────────────┐
│   id   │           email             │      name        │ kurumSube  │
├────────┼─────────────────────────────┼──────────────────┼────────────┤
│ admin1 │ rize@karbonkursplus.com     │ Rize Yönetici    │ Rize       │
│ admin2 │ trabzon@karbonkursplus.com  │ Trabzon Yönetici │ Trabzon    │
└────────┴─────────────────────────────┴──────────────────┴────────────┘
```

---

### 2. **Giriş Yapma (Authentication)**

```typescript
// lib/auth.ts - authorize fonksiyonu
const admin = await prisma.admin.findUnique({
  where: { email: credentials.email }
})

// Admin'in şubesi session'a ekleniyor
return {
  id: admin.id,
  email: admin.email,
  name: admin.name,
  kurumSube: admin.kurumSube,  // 👈 ÖNEMLİ: Şube bilgisi
}
```

**Session Yapısı:**
```json
{
  "user": {
    "id": "admin1",
    "email": "rize@karbonkursplus.com",
    "name": "Rize Yönetici",
    "kurumSube": "Rize"  // 👈 Bu bilgi her istekte geliyor
  }
}
```

---

### 3. **Başvuru Listesi Görüntüleme**

#### API Route: `/api/admin/basvurular`

```typescript
// app/api/admin/basvurular/route.ts
const session = await getServerSession(authOptions)

// Admin'in şubesini al
const kurumSube = session.user.kurumSube  // "Rize" veya "Trabzon"

// Sadece kendi şubesinin başvurularını getir
const basvurular = await prisma.basvuru.findMany({
  where: {
    kurumSube: kurumSube  // 👈 FİLTRE BURADA!
  },
  orderBy: { createdAt: 'desc' }
})
```

**Örnek Senaryolar:**

#### Senaryo 1: Rize Admin
```
1. Rize admin giriş yapıyor
2. Session: { kurumSube: "Rize" }
3. API Query:
   WHERE kurumSube = "Rize"
4. Sonuç: Sadece Rize başvuruları
```

#### Senaryo 2: Trabzon Admin
```
1. Trabzon admin giriş yapıyor
2. Session: { kurumSube: "Trabzon" }
3. API Query:
   WHERE kurumSube = "Trabzon"
4. Sonuç: Sadece Trabzon başvuruları
```

---

### 4. **Excel Export (Dışa Aktarma)**

```typescript
// app/api/admin/export/route.ts
const session = await getServerSession(authOptions)

// Admin'in şubesini al
const kurumSube = session.user.kurumSube

// Sadece kendi şubesinin başvurularını export et
const basvurular = await prisma.basvuru.findMany({
  where: {
    kurumSube: kurumSube  // 👈 FİLTRE BURADA!
  }
})

// Excel oluştur ve indir
```

---

## 📊 Veri Akışı Diyagramı

```
┌─────────────────────────────────────────────────────────────┐
│                     KULLANICI BAŞVURUSU                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Landing Page    │
                    │  Şube Seç:       │
                    │  [Rize/Trabzon]  │
                    └──────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     ┌────────────────┐              ┌────────────────┐
     │ RIZE FORMU     │              │ TRABZON FORMU  │
     │ Sınıf: 9-12    │              │ Sınıf: 4-11    │
     └────────────────┘              └────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                      ┌──────────────┐
                      │  VERİTABANI  │
                      └──────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     ┌─────────────────┐            ┌─────────────────┐
     │  RIZE ADMIN     │            │  TRABZON ADMIN  │
     │  Panel          │            │  Panel          │
     │                 │            │                 │
     │  Görür:         │            │  Görür:         │
     │  ✅ Rize        │            │  ✅ Trabzon     │
     │  ❌ Trabzon     │            │  ❌ Rize        │
     └─────────────────┘            └─────────────────┘
```

---

## 🔒 Güvenlik Katmanları

### Katman 1: Session Kontrolü ✅
```typescript
// Her API isteğinde session kontrol ediliyor
const session = await getServerSession(authOptions)
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Katman 2: Şube Bilgisi ✅
```typescript
// Session'dan şube bilgisi alınıyor
const kurumSube = session.user.kurumSube
```

### Katman 3: Database Filtresi ✅
```typescript
// Database sorgusu şubeye göre filtreleniyor
where: { kurumSube: kurumSube }
```

### Katman 4: Frontend Gösterimi ✅
```typescript
// Admin panelinde sadece kendi şubesi gösteriliyor
<h1>Yönetim Paneli - {session?.user?.kurumSube}</h1>
```

---

## 💡 Pratik Örnekler

### Örnek 1: Başvuru Sayıları

```
Veritabanı:
- 50 Rize başvurusu
- 75 Trabzon başvurusu
Toplam: 125 başvuru

Rize Admin giriş yapınca:
- Görür: 50 başvuru
- Görmez: Trabzon başvuruları

Trabzon Admin giriş yapınca:
- Görür: 75 başvuru
- Görmez: Rize başvuruları
```

### Örnek 2: Excel Export

```
Rize Admin "Excel İndir" butonuna basınca:
📥 rize_basvurular_2025.xlsx
   - Sadece 50 Rize başvurusu

Trabzon Admin "Excel İndir" butonuna basınca:
📥 trabzon_basvurular_2025.xlsx
   - Sadece 75 Trabzon başvurusu
```

### Örnek 3: Arama

```
Rize Admin "Ahmet" araması yaptığında:
- Sadece Rize şubesindeki "Ahmet"ler bulunur
- Trabzon'daki "Ahmet"ler görünmez
```

---

## 🧪 Test Senaryosu

### Test 1: Rize Admin
```bash
1. Rize admin ile giriş yap
   Email: rize@karbonkursplus.com
   
2. Dashboard'da kontrol et:
   ✅ Başlık: "Yönetim Paneli - Rize"
   ✅ Sadece Rize başvuruları görünüyor
   
3. Excel indir:
   ✅ Sadece Rize başvuruları var
   
4. Başvuru detayına bak:
   ✅ "Kurum Şubesi: Rize" görünüyor
```

### Test 2: Trabzon Admin
```bash
1. Trabzon admin ile giriş yap
   Email: trabzon@karbonkursplus.com
   
2. Dashboard'da kontrol et:
   ✅ Başlık: "Yönetim Paneli - Trabzon"
   ✅ Sadece Trabzon başvuruları görünüyor
   
3. Excel indir:
   ✅ Sadece Trabzon başvuruları var
   
4. Başvuru detayına bak:
   ✅ "Kurum Şubesi: Trabzon" görünüyor
```

---

## 🎯 SONUÇ

### ✅ Trabzon → Trabzon
- Trabzon admin **sadece** Trabzon başvurularını görür
- Trabzon admin **sadece** Trabzon başvurularını export edebilir

### ✅ Rize → Rize  
- Rize admin **sadece** Rize başvurularını görür
- Rize admin **sadece** Rize başvurularını export edebilir

### ❌ Çapraz Erişim YOK!
- Trabzon admin → Rize başvurularını **GÖREMEZ**
- Rize admin → Trabzon başvurularını **GÖREMEZ**

---

## 📝 Teknik Detaylar

### Database Schema
```prisma
model Basvuru {
  id             String   @id @default(cuid())
  kurumSube      String   // "Rize" veya "Trabzon"
  // ... diğer alanlar
  
  @@index([kurumSube])  // Hızlı filtreleme için index
}

model Admin {
  id             String   @id @default(cuid())
  kurumSube      String   // "Rize" veya "Trabzon"
  // ... diğer alanlar
  
  @@index([kurumSube])  // Hızlı filtreleme için index
}
```

### Middleware Koruması
```typescript
// middleware.ts
// Admin rotaları korunuyor
if (pathname.startsWith('/admin') && !token) {
  return NextResponse.redirect(new URL('/admin/login', req.url))
}
```

---

## 🎉 Özet

**EVET, sistemde tam ayrım var!** 

Her şube **bağımsız** çalışıyor ve **birbirinin verilerine erişemiyor**. 

Bu sayede:
- ✅ Güvenli veri yönetimi
- ✅ Şubelere özel raporlama
- ✅ Kolay yönetim
- ✅ Veri gizliliği

**Her şube kendi krallığının efendisi! 👑**

