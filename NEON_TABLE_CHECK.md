# 🔍 Neon Panelinde Tablo Görünmüyor - Çözüm

## ✅ Durum

Database'de tablolar **VAR**:
- ✅ `Admin` tablosu
- ✅ `Basvuru` tablosu  
- ✅ `_prisma_migrations` tablosu

Ama Neon panelinde görünmüyor. Bu durumda şunları kontrol edin:

---

## 🔧 Çözüm Adımları

### 1. Doğru Database'i Seçin

Neon Dashboard'da:
1. **Projects** → Projenizi seçin
2. **Databases** → Doğru database'i seçin
3. Database adı: `neondb` olmalı

**Önemli:** Neon'da birden fazla database olabilir. Doğru database'e bakıyor musunuz?

---

### 2. SQL Editor'ü Kullanın

Neon Dashboard → **SQL Editor** → Şu sorguyu çalıştırın:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Bu sorgu tüm tabloları gösterecektir.

---

### 3. Schema'yı Kontrol Edin

Neon panelinde:
1. **Tables** sekmesine gidin
2. **Schema** dropdown'ından `public` seçildiğinden emin olun
3. Bazı panellerde `information_schema` veya başka schema'lar varsayılan olabilir

---

### 4. Database Connection String'i Kontrol Edin

Neon Dashboard → **Connection Details** → Connection string:

```
postgresql://neondb_owner:npg_fETB6QaL2qtR@ep-solitary-feather-a4irdmyp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Database adı:** `neondb` (connection string'in sonunda)

Eğer farklı bir database adı görüyorsanız, yanlış database'e bakıyor olabilirsiniz.

---

### 5. Neon Panelini Yenileyin

1. Browser'da **hard refresh** yapın: `Ctrl+Shift+R` (veya `Cmd+Shift+R` Mac'te)
2. Veya Neon Dashboard'u kapatıp tekrar açın
3. Bazen cache sorunu olabilir

---

### 6. Direct SQL Sorgusu ile Kontrol

Neon Dashboard → **SQL Editor** → Şu sorguları çalıştırın:

#### Admin tablosunu kontrol:
```sql
SELECT * FROM "Admin" LIMIT 5;
```

#### Basvuru tablosunu kontrol:
```sql
SELECT * FROM "Basvuru" LIMIT 5;
```

Eğer bu sorgular çalışıyorsa, tablolar var demektir!

---

## 🎯 Hızlı Test

Local'den database'e bağlanıp kontrol edin:

```bash
npx tsx scripts/check-tables.ts
```

Bu script size tabloları gösterecektir.

---

## 📊 Beklenen Sonuç

Neon SQL Editor'de şu sorguyu çalıştırdığınızda:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Şunları görmelisiniz:
- `Admin`
- `Basvuru`
- `_prisma_migrations`

---

## 🚨 Hala Görünmüyorsa

### Senaryo 1: Farklı Database
- Neon'da birden fazla database var
- Yanlış database'e bakıyorsunuz
- **Çözüm:** Connection string'deki database adını kontrol edin

### Senaryo 2: Schema Sorunu
- Tablolar farklı bir schema'da
- **Çözüm:** `public` schema'yı seçin

### Senaryo 3: Panel Bug
- Neon panelinde görsel bir sorun
- **Çözüm:** SQL Editor kullanın, tablolar orada görünecektir

---

## ✅ Doğrulama

Tabloların var olduğunu doğrulamak için:

1. **SQL Editor'de:**
   ```sql
   SELECT COUNT(*) FROM "Admin";
   SELECT COUNT(*) FROM "Basvuru";
   ```

2. **Local'den:**
   ```bash
   npx tsx scripts/check-admin.ts
   ```

Eğer bu komutlar çalışıyorsa, tablolar kesinlikle var demektir!

---

## 💡 İpucu

Neon panelinde tablolar görünmese bile, **SQL Editor** ile her zaman erişebilirsiniz. Tablolar database'de var, sadece panel görünümünde bir sorun olabilir.

**Önemli:** Admin kullanıcısı database'de var ve şifre doğru. Giriş sorunu başka bir nedenden kaynaklanıyor olabilir (Vercel'deki DATABASE_URL farklı olabilir).

