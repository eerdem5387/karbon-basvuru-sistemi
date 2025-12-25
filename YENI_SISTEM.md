# 🎯 Karbon Kurs Plus - Şube Seçimli Başvuru Sistemi

## ✨ Yeni Özellikler

### Kullanıcı Deneyimi İyileştirmeleri

#### 1. **Şube Seçim Ekranı**
Kullanıcılar siteye ilk girdiklerinde şık ve modern bir landing page ile karşılanır:
- **Rize Şubesi** (Yeşil tema)
- **Trabzon Şubesi** (Mavi tema)

#### 2. **Ayrılmış Okul Listeleri**
- **Rize için:** Sadece Rize okulları gösterilir (266 okul)
- **Trabzon için:** Sadece Trabzon okulları gösterilir (116 okul)
- Artık kullanıcılar karışık listelerle uğraşmaz!

#### 3. **Geri Dönüş Butonu**
Başvuru formu ekranında "Şube Seçimi" butonu ile ana sayfaya dönülebilir.

#### 4. **Dinamik Header**
Seçilen şubeye göre header rengi ve yazıları değişir:
- Rize: Yeşil vurgu
- Trabzon: Mavi vurgu

## 🎨 Tasarım Özellikleri

### Landing Page
```
┌─────────────────────────────────────────┐
│   🏢 Karbon Kurs Plus                    │
│   Bursluluk Sınavı Başvuru Sistemi      │
└─────────────────────────────────────────┘

  Hangi Şubemize Başvuru Yapmak İstersiniz?

┌──────────────────┐  ┌──────────────────┐
│   🏢 Yeşil       │  │   🏢 Mavi        │
│                  │  │                  │
│  Karbon Kurs     │  │  Karbon Kurs     │
│      Plus        │  │      Plus        │
│                  │  │                  │
│     RİZE         │  │    TRABZON       │
│                  │  │                  │
│  Başvuru Yap →   │  │  Başvuru Yap →   │
└──────────────────┘  └──────────────────┘

         ℹ️ Önemli Bilgilendirme
```

### Animasyonlar
- ✅ Fade-in animasyonları
- ✅ Hover efektleri (scale + shadow)
- ✅ Border renk geçişleri
- ✅ Smooth transitions

## 🔄 Kullanıcı Akışı

```
1. Ana Sayfa
   │
   ├─► Rize Seçimi
   │    │
   │    └─► Rize Başvuru Formu
   │         └─► Sadece Rize Okulları
   │
   └─► Trabzon Seçimi
        │
        └─► Trabzon Başvuru Formu
             └─► Sadece Trabzon Okulları
```

## 💻 Teknik Detaylar

### State Yönetimi
```typescript
const [selectedSube, setSelectedSube] = useState<'Rize' | 'Trabzon' | null>(null)

// Seçilen şubeye göre okul listesi
const okullar = selectedSube === 'Trabzon' ? trabzonOkullari : rizeOkullari
```

### Otomatik Şube Ataması
Artık okul adından değil, kullanıcının doğrudan seçiminden şube belirlenir:
```typescript
const dataWithSube = { ...data, kurumSube: selectedSube! }
```

### Başarılı Başvuru Sonrası
Form başarıyla gönderildikten sonra:
- Tüm form alanları temizlenir
- KVKK onayı sıfırlanır
- Şube seçimi sıfırlanır
- Kullanıcı tekrar landing page'e döner

## 📱 Responsive Tasarım

- ✅ Mobil uyumlu (1 kolon)
- ✅ Tablet uyumlu (1-2 kolon geçişli)
- ✅ Desktop uyumlu (2 kolon)
- ✅ Tüm ekran boyutlarında optimize

## 🎯 Avantajlar

### Kullanıcı Açısından
1. **Net Seçim:** Hangi şubeye başvuru yapacağını açıkça belirtir
2. **Karışıklık Yok:** Sadece ilgili okullar gösterilir
3. **Hızlı Erişim:** İki tıkla forma ulaşım
4. **Modern Tasarım:** Profesyonel ve güvenilir görünüm

### Admin Açısından
1. **Temiz Veri:** Şube ataması kullanıcı seçimine dayalı
2. **Hata Riski Azalır:** Otomatik şube belirleme yerine manuel seçim
3. **Analiz Kolaylığı:** Hangi şubeye ne kadar başvuru geldiği net

### Geliştirici Açısından
1. **Temiz Kod:** Ayrılmış okul listeleri
2. **Bakım Kolaylığı:** Şube bazlı yapı
3. **Genişletilebilirlik:** Yeni şube eklemek kolay

## 🚀 Canlıya Alma

Sistem şu anda çalışmaya hazır! Test etmek için:

```bash
npm run dev
```

Tarayıcıda: http://localhost:3000

## 📊 İstatistikler

- **Toplam Rize Okulu:** 266
- **Toplam Trabzon Okulu:** 116
- **Toplam Okul:** 382
- **Animasyon Süresi:** 0.5s
- **Hover Scale:** 1.05x

## 🔧 Özelleştirme

### Renkleri Değiştirmek
```typescript
// Rize için yeşil -> başka renk
className="border-green-500" // değiştir

// Trabzon için mavi -> başka renk  
className="border-blue-500" // değiştir
```

### Yeni Şube Eklemek
1. Okul listesi oluştur: `const yeniSubeOkullari = [...]`
2. State'e ekle: `'YeniSube' | 'Rize' | 'Trabzon'`
3. Landing page'e kart ekle
4. Database schema'da enum güncelle

## 📝 Notlar

- Başarılı başvuru sonrası kullanıcı landing page'e geri döner
- Her şube için farklı renk teması
- Geri dönüş butonu her zaman erişilebilir
- Responsive tasarım tüm cihazlarda test edildi

## 🎉 Sonuç

Kullanıcılar artık net bir şekilde hangi şubeye başvuru yaptıklarını biliyorlar ve sadece ilgili okulları görüyorlar. Modern, şık ve kullanıcı dostu bir deneyim!

