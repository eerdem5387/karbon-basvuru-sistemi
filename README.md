# 🎓 Sınav Başvuru Sistemi

Modern ve güvenli bir başvuru sistemi. Next.js 15, TypeScript, Prisma ve Neon Database ile geliştirilmiştir.

## ✨ Özellikler

### Kullanıcı Tarafı
- ✅ Modern ve responsive başvuru formu
- ✅ Gerçek zamanlı form validasyonu
- ✅ TC Kimlik No doğrulama algoritması
- ✅ Rate limiting ile güvenlik
- ✅ Başarı/hata bildirimleri
- ✅ Smooth animasyonlar

### Admin Paneli
- ✅ Güvenli authentication sistemi (NextAuth.js)
- ✅ Tüm başvuruları listeleme
- ✅ Gelişmiş arama ve filtreleme
- ✅ Detaylı başvuru görüntüleme
- ✅ Excel export özelliği
- ✅ İstatistikler dashboard

## 🚀 Kurulum

### 1. Projeyi İndirin

\`\`\`bash
git clone <repository-url>
cd basvuru-sistemi
\`\`\`

### 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables

\`.env.local\` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

\`\`\`env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="güçlü-bir-secret-key-buraya"

# Admin Credentials
ADMIN_EMAIL="admin@bursluluk.com"
ADMIN_PASSWORD="güçlü-bir-şifre"
\`\`\`

### 4. Database Setup

#### Neon Database Oluşturma

1. [Neon Console](https://console.neon.tech) 'a gidin
2. Yeni bir proje oluşturun
3. Connection string'i kopyalayın
4. \`.env.local\` dosyasına \`DATABASE_URL\` olarak ekleyin

#### Database ve Admin Kullanıcısını Oluşturma

\`\`\`bash
npm run setup
\`\`\`

Bu komut:
- Prisma schema'yı database'e push eder
- Prisma client'ı generate eder
- İlk admin kullanıcısını oluşturur

### 5. Development Server'ı Başlatın

\`\`\`bash
npm run dev
\`\`\`

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📚 Kullanım

### Başvuru Yapma

1. Ana sayfaya ([http://localhost:3000](http://localhost:3000)) gidin
2. Formu eksiksiz doldurun:
   - **Okul Seçimi:** 172 Rize okulu arasından arama yaparak seçin
   - **Meslek Seçimi:** 100+ meslek arasından arama yaparak seçin
   - **TC Kimlik No:** Gerçek algoritma ile doğrulanır
3. "Başvuruyu Gönder" butonuna tıklayın

### Admin Paneline Giriş

1. [http://localhost:3000/admin/login](http://localhost:3000/admin/login) adresine gidin
2. Admin email ve şifrenizi girin
3. Dashboard'da tüm başvuruları görüntüleyin
4. "Excel İndir" butonu ile verileri export edin

## 🔒 Güvenlik Özellikleri

- ✅ NextAuth.js ile güvenli authentication
- ✅ Bcrypt ile şifre hashleme
- ✅ Rate limiting (15 dakikada max 3 başvuru)
- ✅ TC Kimlik No algoritması ile validasyon
- ✅ Zod ile server-side validasyon
- ✅ CSRF koruması
- ✅ Middleware ile route koruması

## 🛠️ Teknolojiler

### Frontend
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasyonlar
- **React Hook Form** - Form yönetimi
- **Zod** - Validasyon

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - ORM
- **Neon** - PostgreSQL database
- **NextAuth.js** - Authentication
- **bcryptjs** - Şifre hashleme
- **XLSX** - Excel export

## 📁 Proje Yapısı

\`\`\`
basvuru-sistemi/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth endpoint
│   │   ├── basvuru/                # Başvuru API
│   │   └── admin/                  # Admin API
│   ├── admin/
│   │   ├── login/                  # Admin login sayfası
│   │   └── dashboard/              # Admin dashboard
│   ├── page.tsx                    # Ana başvuru formu
│   ├── layout.tsx                  # Root layout
│   └── providers.tsx               # Session provider
├── lib/
│   ├── prisma.ts                   # Prisma client
│   ├── auth.ts                     # NextAuth config
│   └── validations.ts              # Zod schemas
├── prisma/
│   └── schema.prisma               # Database schema
├── scripts/
│   └── create-admin.ts             # Admin oluşturma scripti
└── types/
    └── next-auth.d.ts              # NextAuth type definitions
\`\`\`

## 🚀 Vercel'e Deploy

### 1. GitHub'a Push

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 2. Vercel'de Proje Oluşturun

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" tıklayın
3. GitHub repository'nizi seçin

### 3. Environment Variables Ekleyin

Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

- \`DATABASE_URL\` - Neon database connection string
- \`NEXTAUTH_URL\` - Production URL (örn: https://yourapp.vercel.app)
- \`NEXTAUTH_SECRET\` - Güçlü bir secret key
- \`ADMIN_EMAIL\` - Admin email
- \`ADMIN_PASSWORD\` - Güçlü admin şifresi

### 4. Deploy

Vercel otomatik olarak deploy edecektir.

### 5. Admin Kullanıcısı Oluşturma

İlk deploy'dan sonra, Vercel terminal'den:

\`\`\`bash
npm run create-admin
\`\`\`

## 📝 Scriptler

- \`npm run dev\` - Development server
- \`npm run build\` - Production build
- \`npm run start\` - Production server
- \`npm run db:generate\` - Prisma client generate
- \`npm run db:push\` - Schema'yı database'e push et
- \`npm run db:migrate\` - Migration oluştur ve çalıştır
- \`npm run db:studio\` - Prisma Studio aç
- \`npm run create-admin\` - Admin kullanıcısı oluştur
- \`npm run setup\` - Tüm setup'ı bir kerede yap

## 🔧 Konfigürasyon

### Form Alanlarını Özelleştirme

\`app/page.tsx\` dosyasındaki \`okullar\`, \`siniflar\` ve \`meslekler\` arraylerini düzenleyebilirsiniz.

**Mevcut Veriler:**
- 📚 **172 Okul** - Rize'deki tüm resmi okullar (ilkokul, ortaokul, lise)
- 👔 **100+ Meslek** - Kapsamlı meslek listesi
- 🎓 **12 Sınıf** - 1-12. sınıflar arası

**Arama Özelliği:**
Okul ve meslek seçimlerinde otomatik arama özelliği vardır. Kullanıcılar yazarak filtreleme yapabilir.

### Rate Limiting Ayarları

\`app/api/basvuru/route.ts\` dosyasındaki rate limit değerlerini değiştirebilirsiniz.

## 🐛 Troubleshooting

### Database bağlantı hatası

- \`DATABASE_URL\`'in doğru olduğundan emin olun
- Neon database'in aktif olduğunu kontrol edin
- \`?sslmode=require\` parametresinin connection string'de olduğundan emin olun

### Admin giriş yapamıyor

- \`npm run create-admin\` komutunu çalıştırın
- Database'de admin kullanıcısının olduğunu kontrol edin
- \`NEXTAUTH_SECRET\` environment variable'ının set edildiğinden emin olun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Sorularınız için iletişime geçin.

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz!
