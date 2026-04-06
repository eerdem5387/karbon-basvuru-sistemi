'use client'

import { useState } from 'react'
import type { AdminBasvuru } from '@/lib/admin-basvuru'

export function SinavGirisBelgesiForm({
  basvuru,
  onUpdate,
}: {
  basvuru: AdminBasvuru
  onUpdate: () => void
}) {
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
    } catch {
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
            type="button"
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
              type="button"
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
              type="button"
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
