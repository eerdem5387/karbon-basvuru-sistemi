'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { rizeSinavSecenekleri } from '@/lib/validations'

interface Basvuru {
  id: string
  ogrenciAdSoyad: string
  ogrenciTc: string
  okul: string
  ogrenciSinifi: string
  ogrenciSube: string
  kurumSube: string
  sinavGunu: string
  sinavSecimi: string | null
  sinavSaati: string | null
  siraNumarasi: string | null
  oturum: string | null
  sinavSalonu: string | null
  sinavAdresi: string | null
  sinavTarihi: string | null
  digerNotlar: string | null
  babaAdSoyad: string
  babaMeslek: string
  babaIsAdresi: string
  babaCepTel: string
  anneAdSoyad: string
  anneMeslek: string
  anneIsAdresi: string
  anneCepTel: string
  email: string
  createdAt: string
  updatedAt: string
}

// Sınav Giriş Belgesi Form Component
function SinavGirisBelgesiForm({ basvuru, onUpdate }: { basvuru: Basvuru; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    sinavSaati: basvuru.sinavSaati || '',
    siraNumarasi: basvuru.siraNumarasi || '',
    oturum: basvuru.oturum || '',
    sinavSalonu: basvuru.sinavSalonu || '',
    sinavAdresi: basvuru.sinavAdresi || '',
    sinavTarihi: basvuru.sinavTarihi || '',
    digerNotlar: basvuru.digerNotlar || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/basvuru/${basvuru.id}/sinav-giris-belgesi`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Kayıt başarısız')
      }

      setIsEditing(false)
      onUpdate()
    } catch (error) {
      alert('Kayıt sırasında bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 pb-2 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Sınav Giriş Belgesi Bilgileri</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            {basvuru.sinavSaati ? 'Düzenle' : 'Bilgileri Gir'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sınav Tarihi</label>
            <input
              type="text"
              value={formData.sinavTarihi}
              onChange={(e) => setFormData({ ...formData, sinavTarihi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: 7 Şubat 2025"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sınav Saati</label>
            <input
              type="text"
              value={formData.sinavSaati}
              onChange={(e) => setFormData({ ...formData, sinavSaati: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: 09:00"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sıra Numarası</label>
            <input
              type="text"
              value={formData.siraNumarasi}
              onChange={(e) => setFormData({ ...formData, siraNumarasi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: 15"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Oturum</label>
            <input
              type="text"
              value={formData.oturum}
              onChange={(e) => setFormData({ ...formData, oturum: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: 1. Oturum"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sınav Salonu</label>
            <input
              type="text"
              value={formData.sinavSalonu}
              onChange={(e) => setFormData({ ...formData, sinavSalonu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Örn: Salon A"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Sınav Adresi</label>
            <input
              type="text"
              value={formData.sinavAdresi}
              onChange={(e) => setFormData({ ...formData, sinavAdresi: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Sınav yapılacak adres"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Diğer Notlar</label>
            <textarea
              value={formData.digerNotlar}
              onChange={(e) => setFormData({ ...formData, digerNotlar: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Ek bilgiler..."
            />
          </div>
          <div className="col-span-2 flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  sinavSaati: basvuru.sinavSaati || '',
                  siraNumarasi: basvuru.siraNumarasi || '',
                  oturum: basvuru.oturum || '',
                  sinavSalonu: basvuru.sinavSalonu || '',
                  sinavAdresi: basvuru.sinavAdresi || '',
                  sinavTarihi: basvuru.sinavTarihi || '',
                  digerNotlar: basvuru.digerNotlar || '',
                })
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              disabled={isSaving}
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
            >
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Sınav Tarihi</p>
            <p className="font-medium text-gray-900">{basvuru.sinavTarihi || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sınav Saati</p>
            <p className="font-medium text-gray-900">{basvuru.sinavSaati || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sıra Numarası</p>
            <p className="font-medium text-gray-900">{basvuru.siraNumarasi || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Oturum</p>
            <p className="font-medium text-gray-900">{basvuru.oturum || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sınav Salonu</p>
            <p className="font-medium text-gray-900">{basvuru.sinavSalonu || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sınav Adresi</p>
            <p className="font-medium text-gray-900">{basvuru.sinavAdresi || '-'}</p>
          </div>
          {basvuru.digerNotlar && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Diğer Notlar</p>
              <p className="font-medium text-gray-900">{basvuru.digerNotlar}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [basvurular, setBasvurular] = useState<Basvuru[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBasvuru, setSelectedBasvuru] = useState<Basvuru | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [filterTarihBaslangic, setFilterTarihBaslangic] = useState('')
  const [filterTarihBitis, setFilterTarihBitis] = useState('')
  const [filterSinif, setFilterSinif] = useState('')
  const [filterOkul, setFilterOkul] = useState('')
  const [filterSinav, setFilterSinav] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const isRize = session?.user?.kurumSube === 'Rize'

  // Rize: sınava göre başvuru sayıları
  const sinavBasvuruSayilari = useMemo(() => {
    if (!isRize) return []
    const counts: { sinav: string; count: number }[] = []
    const map = new Map<string, number>()
    for (const b of basvurular) {
      const key = b.sinavSecimi?.trim() || 'Belirtilmedi'
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    rizeSinavSecenekleri.forEach((s) => {
      const count = map.get(s) ?? 0
      if (count > 0) counts.push({ sinav: s, count })
    })
    const belirtilmedi = map.get('Belirtilmedi') ?? 0
    if (belirtilmedi > 0) counts.push({ sinav: 'Belirtilmedi', count: belirtilmedi })
    return counts
  }, [basvurular, isRize])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBasvurular()
    }
  }, [status])

  const fetchBasvurular = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/basvurular')
      
      if (!response.ok) {
        throw new Error('Başvurular yüklenemedi')
      }
      
      const data = await response.json()
      setBasvurular(data)
      
      // Eğer bir başvuru seçiliyse, güncellenmiş veriyi yükle
      if (selectedBasvuru) {
        const updatedBasvuru = data.find((b: Basvuru) => b.id === selectedBasvuru.id)
        if (updatedBasvuru) {
          setSelectedBasvuru(updatedBasvuru)
        }
      }
    } catch {
      // Error handling - could be logged to error tracking service
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      // Filtre parametrelerini query string olarak gönder
      const params = new URLSearchParams()
      if (filterTarihBaslangic) params.append('tarihBaslangic', filterTarihBaslangic)
      if (filterTarihBitis) params.append('tarihBitis', filterTarihBitis)
      if (filterSinif) params.append('sinif', filterSinif)
      if (filterOkul) params.append('okul', filterOkul)
      
      const response = await fetch(`/api/admin/export?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Excel dosyası oluşturulamadı')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const filterSuffix = filterTarihBaslangic || filterTarihBitis || filterSinif || filterOkul ? '-filtrelenmis' : ''
      a.download = `basvurular${filterSuffix}-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      alert('Excel dosyası oluşturulurken bir hata oluştu')
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = () => {
    setFilterTarihBaslangic('')
    setFilterTarihBitis('')
    setFilterSinif('')
    setFilterOkul('')
    setFilterSinav('')
    setSearchTerm('')
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  // Benzersiz okul ve sınıf listeleri
  const uniqueOkullar = Array.from(new Set(basvurular.map(b => b.okul))).sort()
  const uniqueSiniflar = Array.from(new Set(basvurular.map(b => b.ogrenciSinifi))).sort()

  const filteredBasvurular = basvurular.filter((b) => {
    // Arama filtresi
    const search = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || (
      b.ogrenciAdSoyad.toLowerCase().includes(search) ||
      b.ogrenciTc.includes(search) ||
      b.email.toLowerCase().includes(search) ||
      b.okul.toLowerCase().includes(search)
    )

    // Tarih filtresi
    const basvuruTarihi = new Date(b.createdAt)
    const matchesTarihBaslangic = !filterTarihBaslangic || basvuruTarihi >= new Date(filterTarihBaslangic)
    const matchesTarihBitis = !filterTarihBitis || basvuruTarihi <= new Date(filterTarihBitis + 'T23:59:59')

    // Sınıf filtresi
    const matchesSinif = !filterSinif || b.ogrenciSinifi === filterSinif

    // Okul filtresi
    const matchesOkul = !filterOkul || b.okul === filterOkul

    // Sınav filtresi (sadece Rize)
    const matchesSinav = !filterSinav || (
      filterSinav === 'Belirtilmedi'
        ? !b.sinavSecimi?.trim()
        : b.sinavSecimi === filterSinav
    )

    return matchesSearch && matchesTarihBaslangic && matchesTarihBitis && matchesSinif && matchesOkul && matchesSinav
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Paneli - Karbon Kurs Plus {session?.user?.kurumSube} Şubesi
              </h1>
              <p className="text-sm text-gray-600">Hoş geldiniz, {session?.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                disabled={isExporting || basvurular.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{isExporting ? 'İndiriliyor...' : 'Excel İndir'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Başvuru</p>
                <p className="text-2xl font-bold text-gray-900">{basvurular.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugünkü Başvurular</p>
                <p className="text-2xl font-bold text-gray-900">
                  {basvurular.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtrelenen</p>
                <p className="text-2xl font-bold text-gray-900">{filteredBasvurular.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rize: Sınava göre başvuru sayıları */}
        {isRize && sinavBasvuruSayilari.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sınava Göre Başvuru Sayıları</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sinavBasvuruSayilari.map(({ sinav, count }, idx) => (
                <motion.div
                  key={sinav}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500"
                >
                  <p className="text-xs font-medium text-gray-500 line-clamp-2 mb-1" title={sinav}>
                    {sinav}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-400">başvuru</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Öğrenci adı, TC, email veya okul ile ara..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtrele</span>
            </button>
            {(filterTarihBaslangic || filterTarihBitis || filterSinif || filterOkul || filterSinav) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Filtreleri Temizle</span>
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tarih Başlangıç */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={filterTarihBaslangic}
                    onChange={(e) => setFilterTarihBaslangic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Tarih Bitiş */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={filterTarihBitis}
                    onChange={(e) => setFilterTarihBitis(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Sınıf Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sınıf
                  </label>
                  <select
                    value={filterSinif}
                    onChange={(e) => setFilterSinif(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Tüm Sınıflar</option>
                    {uniqueSiniflar.map((sinif) => (
                      <option key={sinif} value={sinif}>
                        {sinif}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Okul Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okul
                  </label>
                  <select
                    value={filterOkul}
                    onChange={(e) => setFilterOkul(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Tüm Okullar</option>
                    {uniqueOkullar.map((okul) => (
                      <option key={okul} value={okul}>
                        {okul}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sınav Filtresi (sadece Rize) */}
                {isRize && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sınav
                    </label>
                    <select
                      value={filterSinav}
                      onChange={(e) => setFilterSinav(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Tüm Sınavlar</option>
                      {rizeSinavSecenekleri.map((sinav) => (
                        <option key={sinav} value={sinav}>
                          {sinav}
                        </option>
                      ))}
                      <option value="Belirtilmedi">Belirtilmedi</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öğrenci Bilgileri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Okul/Sınıf
                  </th>
                  {isRize && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sınav
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBasvurular.length === 0 ? (
                  <tr>
                    <td colSpan={isRize ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                      {basvurular.length === 0 ? 'Henüz başvuru bulunmamaktadır.' : 'Arama sonucu bulunamadı.'}
                    </td>
                  </tr>
                ) : (
                  filteredBasvurular.map((basvuru, index) => (
                    <motion.tr
                      key={basvuru.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{basvuru.ogrenciAdSoyad}</div>
                          <div className="text-sm text-gray-500">TC: {basvuru.ogrenciTc}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{basvuru.okul}</div>
                        <div className="text-sm text-gray-500">
                          {basvuru.ogrenciSinifi}
                        </div>
                      </td>
                      {isRize && (
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-900 truncate" title={basvuru.sinavSecimi || 'Belirtilmedi'}>
                            {basvuru.sinavSecimi || 'Belirtilmedi'}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{basvuru.email}</div>
                        <div className="text-sm text-gray-500">{basvuru.babaCepTel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(basvuru.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedBasvuru(basvuru)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Detay
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedBasvuru && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white">Başvuru Detayları</h2>
              <button
                onClick={() => setSelectedBasvuru(null)}
                className="text-white hover:text-gray-200 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Öğrenci Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Öğrenci Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.ogrenciAdSoyad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">TC Kimlik No</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.ogrenciTc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Okul</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.okul}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sınıf</p>
                    <p className="font-medium text-gray-900">
                      {selectedBasvuru.ogrenciSinifi}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kurum Şubesi</p>
                    <p className="font-medium text-indigo-700">{selectedBasvuru.kurumSube}</p>
                  </div>
                  {selectedBasvuru.kurumSube === 'Rize' && selectedBasvuru.sinavSecimi && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Seçilen Sınav</p>
                      <p className="font-medium text-green-700 bg-green-50 p-2 rounded">
                        {selectedBasvuru.sinavSecimi}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rize için Sınav Giriş Belgesi Bilgileri */}
              {selectedBasvuru.kurumSube === 'Rize' && (
                <SinavGirisBelgesiForm 
                  basvuru={selectedBasvuru} 
                  onUpdate={fetchBasvurular}
                />
              )}

              {/* Baba Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Baba Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.babaAdSoyad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meslek</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.babaMeslek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cep Telefonu</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.babaCepTel}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">İş Adresi</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.babaIsAdresi || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Anne Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Anne Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ad Soyad</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.anneAdSoyad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meslek</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.anneMeslek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cep Telefonu</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.anneCepTel}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">İş Adresi</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.anneIsAdresi || '-'}</p>
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">İletişim Bilgileri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">E-posta</p>
                    <p className="font-medium text-gray-900">{selectedBasvuru.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başvuru Tarihi</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedBasvuru.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedBasvuru(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

