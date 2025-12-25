# 🚀 Vercel Environment Variables Kurulum Rehberi

Bu rehber, Vercel'de deploy edilen projenize gerekli environment variable'ları eklemeniz için adım adım talimatlar içerir.

## 📋 Gereken Environment Variables

### 1. **DATABASE_URL** (Zorunlu)
Neon PostgreSQL database connection string'iniz.

### 2. **NEXTAUTH_URL** (Zorunlu)
Production URL'iniz (Vercel domain veya custom domain).

### 3. **NEXTAUTH_SECRET** (Zorunlu)
Güçlü bir secret key (NextAuth için).

### 4. **NEXT_PUBLIC_SITE_URL** (Opsiyonel ama önerilen)
Site URL'iniz (metadata için).

---

## 🔧 Adım Adım Kurulum

### Adım 1: Vercel Dashboard'a Giriş

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. Deploy edilmiş projenizi seçin
3. **Settings** sekmesine tıklayın
4. Sol menüden **Environment Variables** seçeneğine tıklayın

---

### Adım 2: DATABASE_URL Ekleme

1. **Key** alanına: `DATABASE_URL`
2. **Value** alanına Neon database connection string'inizi yapıştırın

**Neon Database URL Formatı:**
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Örnek:**
```
postgresql://neondb_owner:your_password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Nasıl Bulunur:**
- Neon Dashboard → Projeniz → **Connection Details**
- **Connection string** kısmından kopyalayın
- `?sslmode=require` parametresinin olduğundan emin olun

**Environment:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

---

### Adım 3: NEXTAUTH_URL Ekleme

1. **Key** alanına: `NEXTAUTH_URL`
2. **Value** alanına Vercel URL'inizi girin

**Vercel URL Formatı:**
```
https://your-project-name.vercel.app
```

**Örnek:**
```
https://karbon-basvuru-sistemi.vercel.app
```

**Eğer custom domain kullanıyorsanız:**
```
https://basvuru.karbonkursplus.com
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development (local için: `http://localhost:3000`)

---

### Adım 4: NEXTAUTH_SECRET Oluşturma ve Ekleme

#### Yöntem 1: Terminal'den (Önerilen)

Projenizin local klasöründe:

```bash
npm run generate-secret
```

Bu komut size güçlü bir secret key üretecek. Çıktıyı kopyalayın.

#### Yöntem 2: Online Generator

[NextAuth.js Secret Generator](https://generate-secret.vercel.app/32) kullanarak 32 karakterlik secret oluşturun.

#### Yöntem 3: Manuel

Terminal'de:
```bash
openssl rand -base64 32
```

**Vercel'e Ekleme:**
1. **Key** alanına: `NEXTAUTH_SECRET`
2. **Value** alanına oluşturduğunuz secret'i yapıştırın

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

**⚠️ ÖNEMLİ:** Bu secret'i güvenli tutun ve asla public repository'ye commit etmeyin!

---

### Adım 5: NEXT_PUBLIC_SITE_URL Ekleme (Opsiyonel)

1. **Key** alanına: `NEXT_PUBLIC_SITE_URL`
2. **Value** alanına site URL'inizi girin (NEXTAUTH_URL ile aynı)

**Örnek:**
```
https://karbon-basvuru-sistemi.vercel.app
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 📝 Özet Tablo

| Variable | Örnek Değer | Zorunlu | Environment |
|---------|-------------|---------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.aws.neon.tech/db?sslmode=require` | ✅ Evet | All |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ Evet | All |
| `NEXTAUTH_SECRET` | `generated-32-char-secret-key` | ✅ Evet | All |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | ⚠️ Önerilen | All |

---

## 🔄 Environment Variable'ları Ekledikten Sonra

### 1. Redeploy Yapın

Environment variable'ları ekledikten sonra **mutlaka redeploy yapın:**

1. Vercel Dashboard → Projeniz
2. **Deployments** sekmesi
3. En son deployment'ın yanındaki **⋯** (üç nokta) menüsüne tıklayın
4. **Redeploy** seçeneğini seçin

**VEYA**

1. **Settings** → **Environment Variables**
2. Variable ekledikten sonra **Save** butonuna tıklayın
3. Otomatik olarak yeni bir deployment başlayacak

---

## ✅ Kontrol Listesi

Environment variable'ları ekledikten sonra kontrol edin:

- [ ] `DATABASE_URL` eklendi ve doğru mu?
- [ ] `NEXTAUTH_URL` production URL'i ile eşleşiyor mu?
- [ ] `NEXTAUTH_SECRET` güçlü bir key mi? (32+ karakter)
- [ ] `NEXT_PUBLIC_SITE_URL` eklendi mi? (opsiyonel)
- [ ] Tüm environment'lar için eklendi mi? (Production, Preview, Development)
- [ ] Redeploy yapıldı mı?

---

## 🧪 Test Etme

### 1. Ana Sayfa Kontrolü

```
https://your-app.vercel.app
```

- ✅ Sayfa yükleniyor mu?
- ✅ Şube seçimi (Rize/Trabzon) görünüyor mu?
- ✅ Logo görünüyor mu?

### 2. Database Bağlantısı

Eğer database bağlantısı çalışmıyorsa:
- `DATABASE_URL` doğru mu?
- `?sslmode=require` parametresi var mı?
- Neon database aktif mi?

### 3. Admin Panel

```
https://your-app.vercel.app/admin/login
```

- ✅ Login sayfası açılıyor mu?
- ✅ Giriş yapabiliyor musunuz? (önce admin kullanıcısı oluşturmanız gerekir)

---

## 🚨 Yaygın Hatalar ve Çözümleri

### Hata 1: "Invalid DATABASE_URL"

**Sebep:** Connection string formatı yanlış veya eksik parametreler.

**Çözüm:**
- Neon Dashboard'dan connection string'i tekrar kopyalayın
- `?sslmode=require` parametresinin olduğundan emin olun
- Username ve password'ün doğru olduğundan emin olun

### Hata 2: "NEXTAUTH_URL mismatch"

**Sebep:** NEXTAUTH_URL, gerçek site URL'i ile eşleşmiyor.

**Çözüm:**
- Vercel Dashboard → **Settings** → **Domains** → Gerçek URL'inizi kontrol edin
- `NEXTAUTH_URL`'i gerçek URL ile güncelleyin
- Redeploy yapın

### Hata 3: "500 Internal Server Error"

**Sebep:** Environment variable'lar eksik veya yanlış.

**Çözüm:**
- Tüm zorunlu variable'ların eklendiğinden emin olun
- Vercel Dashboard → **Deployments** → **Logs** → Hata mesajlarını kontrol edin
- Redeploy yapın

### Hata 4: "Database connection failed"

**Sebep:** Neon database bağlantı sorunu.

**Çözüm:**
- Neon Dashboard → Database'inizin aktif olduğundan emin olun
- Connection string'i tekrar kontrol edin
- Neon'da IP whitelist ayarlarını kontrol edin (genelde gerekmez)

---

## 📚 Sonraki Adımlar

Environment variable'ları ekledikten ve redeploy yaptıktan sonra:

1. **Database Migration:**
   ```bash
   npx prisma migrate deploy
   ```

2. **Admin Kullanıcısı Oluşturma:**
   - `PRODUCTION_ADMIN_SETUP.md` dosyasına bakın
   - İlk admin kullanıcısını oluşturun

3. **Test:**
   - Ana sayfayı test edin
   - Başvuru formunu test edin
   - Admin panelini test edin

---

## 💡 İpuçları

- **Secret Key Güvenliği:** `NEXTAUTH_SECRET`'i asla public repository'ye commit etmeyin
- **Environment Ayrımı:** Production, Preview ve Development için farklı secret'ler kullanabilirsiniz
- **Database Backup:** Neon'da otomatik backup açık olduğundan emin olun
- **Monitoring:** Vercel Dashboard → **Analytics** → Hata loglarını takip edin

---

## 🎉 Tamamlandı!

Environment variable'ları başarıyla ekledikten sonra projeniz production'da çalışmaya hazır olacak!

**Sorun yaşarsanız:**
- Vercel Dashboard → **Deployments** → **Logs** → Hata mesajlarını kontrol edin
- Neon Dashboard → **Logs** → Database bağlantı loglarını kontrol edin

**Başarılar! 🚀**

