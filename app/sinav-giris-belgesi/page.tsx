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
    if (belgeRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Sınav Giriş Belgesi - ${belge?.ogrenciTc}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .print-hidden { display: none; }
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${belgeRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
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

