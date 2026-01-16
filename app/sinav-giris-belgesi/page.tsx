'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface SinavGirisBelgesi {
  ogrenciAdSoyad: string
  ogrenciTc: string
  okul: string
  ogrenciSinifi: string
  sinavSecimi: string
  sinavSaati: string
  siraNumarasi: string
  oturum: string | null
  sinavSalonu: string | null
  sinavAdresi: string | null
  sinavTarihi: string | null
  digerNotlar: string | null
}

export default function SinavGirisBelgesiPage() {
  const [tcKimlik, setTcKimlik] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [belge, setBelge] = useState<SinavGirisBelgesi | null>(null)
  const belgeRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (belgeRef.current && belge) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        // Logo için base64 veya URL
        const logoUrl = window.location.origin + '/logo.png'
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Sınav Giriş Belgesi - ${belge.ogrenciTc}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Montserrat', Arial, sans-serif;
                  padding: 20px;
                  background: white;
                  color: #111827;
                  line-height: 1.5;
                }
                
                .belge-container {
                  max-width: 100%;
                  margin: 0 auto;
                  background: white;
                }
                
                .header {
                  text-align: center;
                  margin-bottom: 25px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid #6366f1;
                }
                
                .header-content {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 18px;
                  margin-bottom: 8px;
                }
                
                .logo-container {
                  width: 70px;
                  height: 70px;
                  flex-shrink: 0;
                }
                
                .logo-container img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
                
                .header-text h1 {
                  font-size: 28px;
                  font-weight: 800;
                  color: #6366f1;
                  margin: 0;
                }
                
                .header-text p {
                  font-size: 16px;
                  color: #6b7280;
                  margin: 4px 0 0 0;
                }
                
                .section {
                  margin-bottom: 22px;
                }
                
                .section-title {
                  font-size: 18px;
                  font-weight: 700;
                  color: #111827;
                  margin-bottom: 15px;
                  padding-bottom: 8px;
                  border-bottom: 2px solid #e5e7eb;
                }
                
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 16px;
                  margin-bottom: 15px;
                }
                
                .info-item {
                  margin-bottom: 12px;
                }
                
                .info-label {
                  font-size: 11px;
                  color: #6b7280;
                  margin-bottom: 5px;
                  text-transform: uppercase;
                  letter-spacing: 0.4px;
                }
                
                .info-value {
                  font-size: 15px;
                  font-weight: 600;
                  color: #111827;
                }
                
                .info-value-large {
                  font-size: 28px;
                  font-weight: 700;
                  color: #111827;
                }
                
                .sinav-secimi-box {
                  background: #eef2ff;
                  border: 2px solid #6366f1;
                  border-radius: 8px;
                  padding: 14px;
                  margin-bottom: 18px;
                }
                
                .sinav-secimi-label {
                  font-size: 11px;
                  color: #4b5563;
                  margin-bottom: 6px;
                  text-transform: uppercase;
                  letter-spacing: 0.4px;
                }
                
                .sinav-secimi-value {
                  font-size: 14px;
                  font-weight: 600;
                  color: #1e40af;
                  line-height: 1.5;
                }
                
                .warning-box {
                  background: #fef3c7;
                  border: 2px solid #fbbf24;
                  border-radius: 8px;
                  padding: 14px;
                  margin-top: 20px;
                }
                
                .warning-text {
                  font-size: 12px;
                  color: #92400e;
                  line-height: 1.6;
                }
                
                .warning-text strong {
                  font-weight: 700;
                }
                
                .full-width {
                  grid-column: 1 / -1;
                }
                
                @media print {
                  body {
                    padding: 15px;
                    margin: 0;
                  }
                  
                  .belge-container {
                    max-width: 100%;
                    margin: 0;
                  }
                  
                  .header {
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                  }
                  
                  .section {
                    margin-bottom: 18px;
                    page-break-inside: avoid;
                  }
                  
                  .warning-box {
                    margin-top: 18px;
                    page-break-inside: avoid;
                  }
                  
                  @page {
                    margin: 1cm;
                    size: A4;
                  }
                  
                  * {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                }
              </style>
            </head>
            <body>
              <div class="belge-container">
                <!-- Header -->
                <div class="header">
                  <div class="header-content">
                    <div class="logo-container">
                      <img src="${logoUrl}" alt="Karbon Kurs Plus Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="header-text">
                      <h1>Karbon Kurs Plus</h1>
                      <p>Sınav Giriş Belgesi</p>
                    </div>
                  </div>
                </div>
                
                <!-- Öğrenci Bilgileri -->
                <div class="section">
                  <h2 class="section-title">Öğrenci Bilgileri</h2>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Ad Soyad</div>
                      <div class="info-value">${belge.ogrenciAdSoyad}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">TC Kimlik No</div>
                      <div class="info-value">${belge.ogrenciTc}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Okul</div>
                      <div class="info-value">${belge.okul}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Sınıf</div>
                      <div class="info-value">${belge.ogrenciSinifi}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Sınav Bilgileri -->
                <div class="section">
                  <h2 class="section-title">Sınav Bilgileri</h2>
                  <div class="sinav-secimi-box">
                    <div class="sinav-secimi-label">Seçilen Sınav</div>
                    <div class="sinav-secimi-value">${belge.sinavSecimi}</div>
                  </div>
                  <div class="info-grid">
                    ${belge.sinavTarihi ? `
                    <div class="info-item">
                      <div class="info-label">Sınav Tarihi</div>
                      <div class="info-value">${belge.sinavTarihi}</div>
                    </div>
                    ` : ''}
                    <div class="info-item">
                      <div class="info-label">Sınav Saati</div>
                      <div class="info-value">${belge.sinavSaati}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Sıra Numarası</div>
                      <div class="info-value-large">${belge.siraNumarasi}</div>
                    </div>
                    ${belge.oturum ? `
                    <div class="info-item">
                      <div class="info-label">Oturum</div>
                      <div class="info-value">${belge.oturum}</div>
                    </div>
                    ` : ''}
                    ${belge.sinavSalonu ? `
                    <div class="info-item">
                      <div class="info-label">Sınav Salonu</div>
                      <div class="info-value">${belge.sinavSalonu}</div>
                    </div>
                    ` : ''}
                    ${belge.sinavAdresi ? `
                    <div class="info-item full-width">
                      <div class="info-label">Sınav Adresi</div>
                      <div class="info-value">${belge.sinavAdresi}</div>
                    </div>
                    ` : ''}
                    ${belge.digerNotlar ? `
                    <div class="info-item full-width">
                      <div class="info-label">Diğer Notlar</div>
                      <div class="info-value">${belge.digerNotlar}</div>
                    </div>
                    ` : ''}
                  </div>
                </div>
                
                <!-- Uyarı -->
                <div class="warning-box">
                  <p class="warning-text">
                    <strong>Önemli:</strong> Sınav günü bu belgeyi yanınızda bulundurunuz. Sınav salonuna girişte görevliye teslim ediniz.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        
        // Logo yüklendikten sonra yazdır
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    }
  }

  const handleSorgula = async () => {
    if (!tcKimlik || tcKimlik.length !== 11) {
      setError('Lütfen 11 haneli TC Kimlik No giriniz')
      return
    }

    setIsLoading(true)
    setError(null)
    setBelge(null)

    try {
      const response = await fetch('/api/sinav-giris-belgesi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ogrenciTc: tcKimlik }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Belge bulunamadı')
      }

      setBelge(data.basvuru)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Karbon Kurs Plus Logo" 
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                Karbon Kurs Plus
              </h1>
              <p className="text-lg font-semibold text-gray-600">
                Sınav Giriş Belgesi Sorgulama
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* TC Sorgulama Formu */}
        {!belge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              TC Kimlik No ile Sorgula
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TC Kimlik No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tcKimlik}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11)
                    setTcKimlik(value)
                    setError(null)
                  }}
                  maxLength={11}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="12345678901"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleSorgula}
                disabled={isLoading || !tcKimlik || tcKimlik.length !== 11}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sorgulanıyor...' : 'Sorgula'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Sınav Giriş Belgesi */}
        {belge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Belge */}
            <div
              ref={belgeRef}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 print:shadow-none"
            >
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-indigo-500 pb-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="relative h-20 w-20">
                    <Image 
                      src="/logo.png" 
                      alt="Karbon Kurs Plus Logo" 
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-indigo-700">Karbon Kurs Plus</h1>
                    <p className="text-xl text-gray-600">Sınav Giriş Belgesi</p>
                  </div>
                </div>
              </div>

              {/* Öğrenci Bilgileri */}
              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Öğrenci Bilgileri</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-semibold text-gray-900">{belge.ogrenciAdSoyad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">TC Kimlik No</p>
                    <p className="font-semibold text-gray-900">{belge.ogrenciTc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Okul</p>
                    <p className="font-semibold text-gray-900">{belge.okul}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sınıf</p>
                    <p className="font-semibold text-gray-900">{belge.ogrenciSinifi}</p>
                  </div>
                </div>
              </div>

              {/* Sınav Bilgileri */}
              <div className="space-y-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sınav Bilgileri</h2>
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Seçilen Sınav</p>
                  <p className="font-semibold text-indigo-900">{belge.sinavSecimi}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {belge.sinavTarihi && (
                    <div>
                      <p className="text-sm text-gray-600">Sınav Tarihi</p>
                      <p className="font-semibold text-gray-900">{belge.sinavTarihi}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Sınav Saati</p>
                    <p className="font-semibold text-gray-900">{belge.sinavSaati}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sıra Numarası</p>
                    <p className="font-semibold text-gray-900 text-2xl">{belge.siraNumarasi}</p>
                  </div>
                  {belge.oturum && (
                    <div>
                      <p className="text-sm text-gray-600">Oturum</p>
                      <p className="font-semibold text-gray-900">{belge.oturum}</p>
                    </div>
                  )}
                  {belge.sinavSalonu && (
                    <div>
                      <p className="text-sm text-gray-600">Sınav Salonu</p>
                      <p className="font-semibold text-gray-900">{belge.sinavSalonu}</p>
                    </div>
                  )}
                  {belge.sinavAdresi && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Sınav Adresi</p>
                      <p className="font-semibold text-gray-900">{belge.sinavAdresi}</p>
                    </div>
                  )}
                  {belge.digerNotlar && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Diğer Notlar</p>
                      <p className="font-semibold text-gray-900">{belge.digerNotlar}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Uyarı */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Önemli:</strong> Sınav günü bu belgeyi yanınızda bulundurunuz. Sınav salonuna girişte görevliye teslim ediniz.
                </p>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200"
              >
                Belgeyi Yazdır / İndir
              </button>
              <button
                onClick={() => {
                  setBelge(null)
                  setTcKimlik('')
                  setError(null)
                }}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
              >
                Yeni Sorgulama
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

