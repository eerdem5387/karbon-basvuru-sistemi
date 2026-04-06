'use client'

import { motion } from 'framer-motion'
import type { AdminBasvuru } from '@/lib/admin-basvuru'
import { SinavGirisBelgesiForm } from '@/components/admin/SinavGirisBelgesiForm'

export function BasvuruDetailModal({
  basvuru,
  onClose,
  onUpdate,
}: {
  basvuru: AdminBasvuru
  onClose: () => void
  onUpdate: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Başvuru Detayları</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Öğrenci Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ad Soyad</p>
                <p className="font-medium text-gray-900">{basvuru.ogrenciAdSoyad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">TC Kimlik No</p>
                <p className="font-medium text-gray-900">{basvuru.ogrenciTc}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Okul</p>
                <p className="font-medium text-gray-900">{basvuru.okul}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sınıf</p>
                <p className="font-medium text-gray-900">{basvuru.ogrenciSinifi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kurum Şubesi</p>
                <p className="font-medium text-indigo-700">{basvuru.kurumSube}</p>
              </div>
              {basvuru.kurumSube === 'Rize' && basvuru.sinavSecimi && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Seçilen Sınav</p>
                  <p className="font-medium text-green-700 bg-green-50 p-2 rounded">{basvuru.sinavSecimi}</p>
                </div>
              )}
            </div>
          </div>

          {basvuru.kurumSube === 'Rize' && (
            <SinavGirisBelgesiForm basvuru={basvuru} onUpdate={onUpdate} />
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Baba Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ad Soyad</p>
                <p className="font-medium text-gray-900">{basvuru.babaAdSoyad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Meslek</p>
                <p className="font-medium text-gray-900">{basvuru.babaMeslek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durumu</p>
                <p className="font-medium text-gray-900">{basvuru.babaDurumu || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cep Telefonu</p>
                <p className="font-medium text-gray-900">{basvuru.babaCepTel}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">İş Adresi</p>
                <p className="font-medium text-gray-900">{basvuru.babaIsAdresi || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">Anne Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ad Soyad</p>
                <p className="font-medium text-gray-900">{basvuru.anneAdSoyad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Meslek</p>
                <p className="font-medium text-gray-900">{basvuru.anneMeslek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durumu</p>
                <p className="font-medium text-gray-900">{basvuru.anneDurumu || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cep Telefonu</p>
                <p className="font-medium text-gray-900">{basvuru.anneCepTel}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">İş Adresi</p>
                <p className="font-medium text-gray-900">{basvuru.anneIsAdresi || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">İletişim Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">E-posta</p>
                <p className="font-medium text-gray-900">{basvuru.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Başvuru Tarihi</p>
                <p className="font-medium text-gray-900">
                  {new Date(basvuru.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  )
}
