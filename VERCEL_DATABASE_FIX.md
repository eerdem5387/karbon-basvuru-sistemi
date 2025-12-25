# 🔧 Vercel Database URL Düzeltme

## ❌ Sorun

Local'de test başarılı ama Vercel'de giriş yapılamıyor. Bu, Vercel'deki `DATABASE_URL`'in yanlış olduğunu gösterir.

---

## ✅ Çözüm

### Adım 1: Vercel'de DATABASE_URL'i Güncelle

Vercel Dashboard → **Settings** → **Environment Variables**

1. `DATABASE_URL` değişkenini bulun
2. **Edit** butonuna tıklayın
3. Şu değeri yapıştırın:

```
postgresql://neondb_owner:npg_fETB6QaL2qtR@ep-solitary-feather-a4irdmyp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

4. **Environment:** Production, Preview, Development (hepsini seçin)
5. **Save** butonuna tıklayın

---

### Adım 2: Redeploy Yapın

1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **⋯** (üç nokta) menüsüne tıklayın
3. **Redeploy** seçeneğini seçin

**VEYA**

Environment variable ekledikten sonra otomatik olarak yeni bir deployment başlayacaktır.

---

### Adım 3: Test Edin

Redeploy'dan sonra:

1. `https://your-app.vercel.app/admin/login` adresine gidin
2. Email: `admin@karbonkurs.com`
3. Şifre: `QAZWSX.90`
4. Giriş yapın

---

## 🔍 Kontrol Listesi

- [ ] Vercel'deki `DATABASE_URL` doğru mu?
- [ ] Connection string'de `ep-solitary-feather-a4irdmyp-pooler` var mı?
- [ ] `?sslmode=require` parametresi var mı?
- [ ] Tüm environment'larda eklendi mi? (Production, Preview, Development)
- [ ] Redeploy yapıldı mı?

---

## 📊 Doğru Connection String

Neon Dashboard'dan kopyaladığınız connection string:

```
postgresql://neondb_owner:npg_fETB6QaL2qtR@ep-solitary-feather-a4irdmyp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Önemli:** 
- Host: `ep-solitary-feather-a4irdmyp-pooler.us-east-1.aws.neon.tech`
- Database: `neondb`
- SSL Mode: `require`

---

## 🚨 Hala Çalışmıyorsa

### 1. Vercel Logs Kontrolü

Vercel Dashboard → **Deployments** → Son deployment → **Logs**

"Database connection" veya "Auth error" mesajlarını arayın.

### 2. Database Bağlantısını Test Edin

Local `.env.local` dosyanızı güncelleyip test edin:

```bash
# .env.local
DATABASE_URL="postgresql://neondb_owner:npg_fETB6QaL2qtR@ep-solitary-feather-a4irdmyp-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

Sonra:
```bash
npx tsx scripts/test-vercel-connection.ts
```

### 3. Admin Kullanıcısını Kontrol Edin

```bash
npx tsx scripts/check-admin.ts
```

Admin'in database'de olduğundan emin olun.

---

## ✅ Başarı!

DATABASE_URL'i güncelleyip redeploy yaptıktan sonra giriş yapabilmelisiniz!

