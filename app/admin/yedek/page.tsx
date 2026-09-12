'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { AdminBasvuru } from '@/lib/admin-basvuru'
import { BasvuruDetailModal } from '@/components/admin/BasvuruDetailModal'

export default function AdminYedekPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [basvurular, setBasvurular] = useState<AdminBasvuru[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBasvuru, setSelectedBasvuru] = useState<AdminBasvuru | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [filterTarihBaslangic, setFilterTarihBaslangic] = useState('')
  const [filterTarihBitis, setFilterTarihBitis] = useState('')
  const [filterSinif, setFilterSinif] = useState('')
  const [filterOkul, setFilterOkul] = useState('')
  const [filterSinav, setFilterSinav] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated' && session?.user?.kurumSube !== 'Rize') {
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  const fetchBasvurular = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/basvurular?yedek=true&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      })

      if (!response.ok) {
        throw new Error('Yedek listesi yüklenemedi')
      }

      const data = await response.json()
      setBasvurular(data)

      if (selectedBasvuru) {
        const updated = data.find((b: AdminBasvuru) => b.id === selectedBasvuru.id)
        setSelectedBasvuru(updated ?? null)
      }
    } catch {
      setBasvurular([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.kurumSube === 'Rize') {
      fetchBasvurular()
    }
  }, [status, session?.user?.kurumSube])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const params = new URLSearchParams()
      params.set('yedek', 'true')
      if (filterTarihBaslangic) params.append('tarihBaslangic', filterTarihBaslangic)
      if (filterTarihBitis) params.append('tarihBitis', filterTarihBitis)
      if (filterSinif) params.append('sinif', filterSinif)
      if (filterOkul) params.append('okul', filterOkul)
      if (filterSinav) params.append('sinav', filterSinav)
      params.set('_t', String(Date.now()))
      const response = await fetch(`/api/admin/export?${params.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })

      if (!response.ok) {
        throw new Error('Excel oluşturulamadı')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const filterSuffix =
        filterTarihBaslangic || filterTarihBitis || filterSinif || filterOkul || filterSinav
          ? '-filtrelenmis'
          : ''
      a.download = `yedek-basvurular${filterSuffix}-${new Date().toISOString().split('T')[0]}.xlsx`
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

  const uniqueOkullar = Array.from(new Set(basvurular.map((b) => b.okul))).sort()
  const uniqueSiniflar = Array.from(new Set(basvurular.map((b) => b.ogrenciSinifi))).sort()
  const uniqueSinavlar = useMemo(
    () =>
      Array.from(
        new Set(basvurular.map((b) => b.sinavSecimi?.trim() || 'Belirtilmedi'))
      ).sort(),
    [basvurular]
  )

  const filteredBasvurular = basvurular.filter((b) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      b.ogrenciAdSoyad.toLowerCase().includes(search) ||
      b.ogrenciTc.includes(search) ||
      b.email.toLowerCase().includes(search) ||
      b.okul.toLowerCase().includes(search)

    const basvuruTarihi = new Date(b.createdAt)
    const matchesTarihBaslangic = !filterTarihBaslangic || basvuruTarihi >= new Date(filterTarihBaslangic)
    const matchesTarihBitis = !filterTarihBitis || basvuruTarihi <= new Date(filterTarihBitis + 'T23:59:59')

    const matchesSinif = !filterSinif || b.ogrenciSinifi === filterSinif
    const matchesOkul = !filterOkul || b.okul === filterOkul
    const sinavKey = b.sinavSecimi?.trim() || 'Belirtilmedi'
    const matchesSinav = !filterSinav || sinavKey === filterSinav

    return matchesSearch && matchesTarihBaslangic && matchesTarihBitis && matchesSinif && matchesOkul && matchesSinav
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.kurumSube !== 'Rize') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yedek — eski sınav başvuruları</h1>
              <p className="text-sm text-gray-600">
                Güncel olmayan sınavlara yapılan başvurular. Ana listede görünmez; veri silinmedi.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Ana liste
              </Link>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting || basvurular.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'İndiriliyor…' : 'Excel (yedek)'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Yedekteki toplam</p>
            <p className="text-2xl font-bold text-gray-900">{basvurular.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Farklı sınav türü</p>
            <p className="text-2xl font-bold text-gray-900">{uniqueSinavlar.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Filtrelenen</p>
            <p className="text-2xl font-bold text-gray-900">{filteredBasvurular.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4 flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Öğrenci adı, TC, email veya okul ile ara..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition duration-200"
            >
              Filtrele
            </button>
            {(filterTarihBaslangic || filterTarihBitis || filterSinif || filterOkul || filterSinav) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Filtreleri temizle
              </button>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç</label>
                  <input
                    type="date"
                    value={filterTarihBaslangic}
                    onChange={(e) => setFilterTarihBaslangic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş</label>
                  <input
                    type="date"
                    value={filterTarihBitis}
                    onChange={(e) => setFilterTarihBitis(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sınıf</label>
                  <select
                    value={filterSinif}
                    onChange={(e) => setFilterSinif(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tümü</option>
                    {uniqueSiniflar.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Okul</label>
                  <select
                    value={filterOkul}
                    onChange={(e) => setFilterOkul(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tümü</option>
                    {uniqueOkullar.map((o) => (
                      <option key={o} value={o}>
                        {o.length > 60 ? `${o.slice(0, 60)}…` : o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eski sınav</label>
                  <select
                    value={filterSinav}
                    onChange={(e) => setFilterSinav(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tümü</option>
                    {uniqueSinavlar.map((sinav) => (
                      <option key={sinav} value={sinav}>
                        {sinav.length > 70 ? `${sinav.slice(0, 70)}…` : sinav}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öğrenci</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Okul / Sınıf</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eski sınav</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İletişim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBasvurular.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {basvurular.length === 0 ? 'Yedekte kayıt yok.' : 'Filtreye uygun kayıt yok.'}
                    </td>
                  </tr>
                ) : (
                  filteredBasvurular.map((basvuru, index) => (
                    <motion.tr
                      key={basvuru.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{basvuru.ogrenciAdSoyad}</div>
                        <div className="text-sm text-gray-500">TC: {basvuru.ogrenciTc}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={basvuru.okul}>
                          {basvuru.okul}
                        </div>
                        <div className="text-sm text-gray-500">{basvuru.ogrenciSinifi}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-900 truncate" title={basvuru.sinavSecimi || 'Belirtilmedi'}>
                          {basvuru.sinavSecimi || 'Belirtilmedi'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{basvuru.email}</div>
                        <div className="text-sm text-gray-500">{basvuru.babaCepTel}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(basvuru.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedBasvuru(basvuru)}
                          className="text-slate-700 hover:text-slate-900 font-medium text-sm"
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

      {selectedBasvuru && (
        <BasvuruDetailModal
          basvuru={selectedBasvuru}
          onClose={() => setSelectedBasvuru(null)}
          onUpdate={fetchBasvurular}
        />
      )}
    </div>
  )
}
