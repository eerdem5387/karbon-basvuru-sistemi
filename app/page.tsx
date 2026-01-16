'use client'

import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { basvuruSchema, type BasvuruFormData, rizeSinavSecenekleri } from '@/lib/validations'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Trabzon okulları
const trabzonOkullari = [
  'TRABZON - AKCAABAT - Akçaabat Bilim ve Sanat Merkezi',
  'TRABZON - AKCAABAT - Akçaabat Rehberlik ve Araştırma Merkezi',
  'TRABZON - AKCAABAT - Demirkapı İlkokulu',
  'TRABZON - AKCAABAT - Sarıtaş Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - AKCAABAT - Sarıtaş Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - AKCAABAT - Sarıtaş Özel Eğitim Uygulama Okulu III. Kademe',
  'TRABZON - AKCAABAT - Söğütlü Fatih İlkokulu',
  'TRABZON - AKÇAABAT - 100.Yıl İlkokulu',
  'TRABZON - AKÇAABAT - 17 Şubat Anadolu Lisesi',
  'TRABZON - AKÇAABAT - 23 Nisan İlkokulu',
  'TRABZON - AKÇAABAT - Abdullah Fazıl Ağanoğlu İlkokulu',
  'TRABZON - AKÇAABAT - Ağaçlı Ortaokulu',
  'TRABZON - AKÇAABAT - Akçaabat Anadolu İmam Hatip Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Anaokulu',
  'TRABZON - AKÇAABAT - Akçaabat Atatürk Turizm Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Borsa İstanbul Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Fen Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Güzel Sanatlar Ortaokulu',
  'TRABZON - AKÇAABAT - Akçaabat Hakkı Zeki Başaran Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - AKÇAABAT - Akçaabat Halk Eğitimi Merkezi',
  'TRABZON - AKÇAABAT - Akçaabat İbni Sina Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Mesleki Eğitim Merkezi',
  'TRABZON - AKÇAABAT - Akçaabat Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçaabat Yıldızlı Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Akçakale Anaokulu',
  'TRABZON - AKÇAABAT - Akçaköy İlkokulu',
  'TRABZON - AKÇAABAT - Akçaköy Ortaokulu',
  'TRABZON - AKÇAABAT - Akpınar Ortaokulu',
  'TRABZON - AKÇAABAT - Atatürk İlkokulu',
  'TRABZON - AKÇAABAT - Aydın İlkokulu',
  'TRABZON - AKÇAABAT - Cumhuriyet Ortaokulu',
  'TRABZON - AKÇAABAT - Çiçeklidüz İlkokulu',
  'TRABZON - AKÇAABAT - Darıca İlkokulu',
  'TRABZON - AKÇAABAT - Darıca Ortaokulu',
  'TRABZON - AKÇAABAT - Demirci İlkokulu',
  'TRABZON - AKÇAABAT - Demirci Ortaokulu',
  'TRABZON - AKÇAABAT - Demirkapı Ortaokulu',
  'TRABZON - AKÇAABAT - Derecik Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Derecik İlkokulu',
  'TRABZON - AKÇAABAT - Derecik Ortaokulu',
  'TRABZON - AKÇAABAT - Doğanköy Anaokulu',
  'TRABZON - AKÇAABAT - Doğanköy İlkokulu',
  'TRABZON - AKÇAABAT - Doğanköy Ortaokulu',
  'TRABZON - AKÇAABAT - Dörtyol Ortaokulu',
  'TRABZON - AKÇAABAT - Erikli İlkokulu',
  'TRABZON - AKÇAABAT - Fevzipaşa İlkokulu',
  'TRABZON - AKÇAABAT - Hakkı Altıntaş Ortaokulu',
  'TRABZON - AKÇAABAT - Hasan Saka İlkokulu',
  'TRABZON - AKÇAABAT - Hasan Saka Ortaokulu',
  'TRABZON - AKÇAABAT - Işıklar Çok Programlı Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Işıklar İlkokulu',
  'TRABZON - AKÇAABAT - Işıklar Ortamahalle İlkokulu',
  'TRABZON - AKÇAABAT - Işıklar Ortamahalle Ortaokulu',
  'TRABZON - AKÇAABAT - Işıklar Ortaokulu',
  'TRABZON - AKÇAABAT - İbrahim Erdemoğlu Spor Lisesi',
  'TRABZON - AKÇAABAT - İbrahim Erdemoğlu Spor Ortaokulu',
  'TRABZON - AKÇAABAT - Kaleönü Murat Köse İlkokulu',
  'TRABZON - AKÇAABAT - Kaleönü Murat Köse Ortaokulu',
  'TRABZON - AKÇAABAT - Kavaklı İlkokulu',
  'TRABZON - AKÇAABAT - Kavaklı Ortaokulu',
  'TRABZON - AKÇAABAT - Mecit Pirhasoğlu İlkokulu',
  'TRABZON - AKÇAABAT - Mersin Şehit Engin Saraç İlkokulu',
  'TRABZON - AKÇAABAT - Mersin Şehit Engin Saraç Ortaokulu',
  'TRABZON - AKÇAABAT - Meşeli İlkokulu',
  'TRABZON - AKÇAABAT - Meşeli Ortaokulu',
  'TRABZON - AKÇAABAT - Metinkale İlkokulu',
  'TRABZON - AKÇAABAT - Metinkale Ortaokulu',
  'TRABZON - AKÇAABAT - Mevlüt Selami Yardım Ortaokulu',
  'TRABZON - AKÇAABAT - MİNİK KALPLER ANAOKULU',
  'TRABZON - AKÇAABAT - Osmanbaba İlkokulu',
  'TRABZON - AKÇAABAT - Osmanbaba Ortaokulu',
  'TRABZON - AKÇAABAT - Salacık İlkokulu',
  'TRABZON - AKÇAABAT - Salacık Ortaokulu',
  'TRABZON - AKÇAABAT - Sarıtaş İmam Hatip Ortaokulu',
  'TRABZON - AKÇAABAT - Sebat İlkokulu',
  'TRABZON - AKÇAABAT - Söğütlü Anaokulu',
  'TRABZON - AKÇAABAT - Söğütlü Esentepe Anadolu Lisesi',
  'TRABZON - AKÇAABAT - SÖĞÜTLÜ İLKOKULU',
  'TRABZON - AKÇAABAT - Söğütlü Ortaokulu',
  'TRABZON - AKÇAABAT - Şehit Gökhan Uzun İmam Hatip Ortaokulu',
  'TRABZON - AKÇAABAT - Şehit Samet Uslu Kız Anadolu İmam Hatip Lisesi',
  'TRABZON - AKÇAABAT - Şinik İlkokulu',
  'TRABZON - AKÇAABAT - Trabzon Akçaabat Güzel Sanatlar Lisesi',
  'TRABZON - AKÇAABAT - Uğurlu İlkokulu',
  'TRABZON - AKÇAABAT - Vakıfbank Merkez İlkokulu',
  'TRABZON - AKÇAABAT - Yaylacık Anaokulu',
  'TRABZON - AKÇAABAT - Yaylacık İlkokulu',
  'TRABZON - AKÇAABAT - Yaylacık Ortaokulu',
  'TRABZON - AKÇAABAT - Yıldızlı Anaokulu',
  'TRABZON - AKÇAABAT - Yıldızlı TOKİ İlkokulu',
  'TRABZON - AKÇAABAT - Yıldızlı TOKİ Ortaokulu',
  'TRABZON - ARAKLI - Araklı Anadolu İmam Hatip Lisesi',
  'TRABZON - ARAKLI - Araklı Anadolu Lisesi',
  'TRABZON - ARAKLI - Araklı Bereketli İmam Hatip Ortaokulu',
  'TRABZON - ARAKLI - Araklı Bilim ve Sanat Merkezi',
  'TRABZON - ARAKLI - Araklı Halk Eğitimi Merkezi',
  'TRABZON - ARAKLI - Araklı Mehmet Akif Ersoy Anadolu Lisesi',
  'TRABZON - ARAKLI - Araklı Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - ARAKLI - Atatürk Ortaokulu',
  'TRABZON - ARAKLI - Cumhuriyet İlkokulu',
  'TRABZON - ARAKLI - Çankaya İlkokulu',
  'TRABZON - ARAKLI - Çankaya Ortaokulu',
  'TRABZON - ARAKLI - Değirmencik İlkokulu',
  'TRABZON - ARAKLI - Değirmencik Ortaokulu',
  'TRABZON - ARAKLI - ERENLER İLKOKULU',
  'TRABZON - ARAKLI - ERENLER İMAM HATİP ORTAOKULU',
  'TRABZON - ARAKLI - Hamit Özdağ İmam Hatip Ortaokulu',
  'TRABZON - ARAKLI - Hamit Özdağ Kız Anadolu İmam Hatip Lisesi',
  'TRABZON - ARAKLI - İstanbul Ticaret Odası Şehit Er Zeki Ayvenli İmam Hatip Ortaokulu',
  'TRABZON - ARAKLI - Merkez Anaokulu',
  'TRABZON - ARAKLI - Merkez İlkokulu',
  'TRABZON - ARAKLI - Muhittin Öztürk Saffet Çebi İlkokulu',
  'TRABZON - ARAKLI - Muhittin Öztürk Saffet Çebi Ortaokulu',
  'TRABZON - ARAKLI - Saffet Çebi Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ARAKLI - Taştepe İlkokulu',
  'TRABZON - ARAKLI - Taştepe Ortaokulu',
  'TRABZON - ARAKLI - Yeşilce İlkokulu',
  'TRABZON - ARAKLI - Yeşilce Ortaokulu',
  'TRABZON - ARAKLI - Yeşilyurt İlkokulu',
  'TRABZON - ARAKLI - Yeşilyurt Ortaokulu',
  'TRABZON - ARAKLI - Yılmaz Çebi İlkokulu',
  'TRABZON - ARAKLI - Yılmaz Çebi Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ARAKLI - Yılmaz Çebi Ortaokulu',
  'TRABZON - ARSİN - Arsin Anadolu Lisesi',
  'TRABZON - ARSİN - Arsin Anaokulu',
  'TRABZON - ARSİN - Arsin Halk Eğitimi Merkezi',
  'TRABZON - ARSİN - Arsin İmam Hatip Ortaokulu',
  'TRABZON - ARSİN - Arsin Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ARSİN - Arsin Öğretmenevi ve Akşam Sanat Okulu Müdürlüğü',
  'TRABZON - ARSİN - Arsin Yeşilce Özel Eğitim Meslek Okulu',
  'TRABZON - ARSİN - Atatürk İlkokulu',
  'TRABZON - ARSİN - Atatürk Ortaokulu',
  'TRABZON - ARSİN - Atayurt Alparslan İlkokulu',
  'TRABZON - ARSİN - Atayurt İmam Hatip Ortaokulu',
  'TRABZON - ARSİN - Cumhuriyet İlkokulu',
  'TRABZON - ARSİN - Cumhuriyet Ortaokulu',
  'TRABZON - ARSİN - Kuzguncuk Cemal Azmi Bey İlkokulu',
  'TRABZON - ARSİN - Kuzguncuk Cemal Azmi Bey Ortaokulu',
  'TRABZON - ARSİN - Mahmut Taviloğlu İlkokulu',
  'TRABZON - ARSİN - Mehmet Akif Ersoy İlkokulu',
  'TRABZON - ARSİN - Mehmet Akif Ersoy Ortaokulu',
  'TRABZON - ARSİN - Mehmet Rüştü Aşıkkutlu Anadolu İmam Hatip Lisesi',
  'TRABZON - ARSİN - Organize Sanayi Bölgesi (OSB) Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ARSİN - Şehit Fahreddin Sarı Ortaokulu',
  'TRABZON - ARSİN - Yeşilköy Şehit Haydar Arslan İlkokulu',
  'TRABZON - ARSİN - Yeşilköy Şehit Haydar Arslan Ortaokulu',
  'TRABZON - ARSİN - Yeşilyalı İbni Sina İlkokulu',
  'TRABZON - ARSİN - Yeşilyalı İbni Sina Ortaokulu',
  'TRABZON - ARSİN - Yeşilyalı İmam Hatip Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Ahmet Gün Anadolu İmam Hatip Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Akkese İlkokulu',
  'TRABZON - BEŞİKDÜZÜ - Akkese Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Atatürk Anaokulu',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Adalet Meslekî Eğitim Merkezi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Anadolu Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Borsa İstanbul Fen Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Farabi Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Fatih Ticaret Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Halk Eğitimi Merkezi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü İmam Hatip Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Sabancı Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Sevim - Nerim Demircioğlu Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - BEŞİKDÜZÜ - Beşikdüzü Sevim - Nerim Demircioğlu Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - BEŞİKDÜZÜ - Çeşmeönü İlkokulu',
  'TRABZON - BEŞİKDÜZÜ - Çeşmeönü Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Merkez İlkokulu',
  'TRABZON - BEŞİKDÜZÜ - Merkez Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Şehit Öğretmen Gürhan Yardım İlkokulu',
  'TRABZON - BEŞİKDÜZÜ - Şehit Öğretmen Gürhan Yardım Ortaokulu',
  'TRABZON - BEŞİKDÜZÜ - Zübeyde Hanım Anaokulu',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Anadolu Lisesi',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Anaokulu',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Halk Eğitimi Merkezi',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - ÇARŞIBAŞI - Çarşıbaşı Yavuz İmam Hatip Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Fener Şehit Muhammet Türk İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Gazi İlkokulu',
  'TRABZON - ÇARŞIBAŞI - İsmail Çavuş Anadolu İmam Hatip Lisesi',
  'TRABZON - ÇARŞIBAŞI - İsmail Çavuş İmam Hatip Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Kadıköy İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Kadıköy Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Kerem Mahalle Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Kovanlıköy İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Şahinli İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Yavuzköy Fatih İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Yavuzköy Fatih Ortaokulu',
  'TRABZON - ÇARŞIBAŞI - Yavuzköy İlkokulu',
  'TRABZON - ÇARŞIBAŞI - Yavuzköy Ortaokulu',
  'TRABZON - ÇAYKARA - Cevdet Sunay Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ÇAYKARA - Çaykara Anadolu Lisesi',
  'TRABZON - ÇAYKARA - Çaykara Çok Programlı Anadolu Lisesi',
  'TRABZON - ÇAYKARA - Çaykara Fatma Bilge Anaokulu',
  'TRABZON - ÇAYKARA - Çaykara Halk Eğitimi Merkezi',
  'TRABZON - ÇAYKARA - Çaykara Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - ÇAYKARA - Hüseyin Vehbi Fettahoğlu İlkokulu',
  'TRABZON - ÇAYKARA - Karaçam İlkokulu',
  'TRABZON - ÇAYKARA - Karaçam Ortaokulu',
  'TRABZON - ÇAYKARA - Şehit Ahmet Çamur Anadolu İmam Hatip Lisesi',
  'TRABZON - ÇAYKARA - Şehit Mehmet Aygün İlkokulu',
  'TRABZON - ÇAYKARA - Şehit Mehmet Aygün İmam Hatip Ortaokulu',
  'TRABZON - ÇAYKARA - Taşkıran İmam Hatip Ortaokulu',
  'TRABZON - ÇAYKARA - Taşkıran Mustafa Özer Ortaokulu',
  'TRABZON - ÇAYKARA - Zeki Bilge İlkokulu',
  'TRABZON - ÇAYKARA - Zeki Bilge Ortaokulu',
  'TRABZON - DERNEKPAZARI - Atatürk İlkokulu',
  'TRABZON - DERNEKPAZARI - Atatürk Ortaokulu',
  'TRABZON - DERNEKPAZARI - Dernekpazarı Halk Eğitimi Merkezi',
  'TRABZON - DERNEKPAZARI - Dernekpazarı İmam Hatip Ortaokulu',
  'TRABZON - DERNEKPAZARI - Hasan Cansız Kom Çok Programlı Anadolu Lisesi',
  'TRABZON - DERNEKPAZARI - İbrahim Ağa Anaokulu',
  'TRABZON - DÜZKÖY - Alazlı İlkokulu',
  'TRABZON - DÜZKÖY - Alazlı Ortaokulu',
  'TRABZON - DÜZKÖY - Aykut Lütfü Ofluoğlu İlkokulu',
  'TRABZON - DÜZKÖY - Aykut Lütfü Ofluoğlu Ortaokulu',
  'TRABZON - DÜZKÖY - Çal İlkokulu',
  'TRABZON - DÜZKÖY - Çal Ortaokulu',
  'TRABZON - DÜZKÖY - Çamlıca İlkokulu',
  'TRABZON - DÜZKÖY - Çamlıca Ortaokulu',
  'TRABZON - DÜZKÖY - Çayırbağı Çok Programlı Anadolu Lisesi',
  'TRABZON - DÜZKÖY - Çayırbağı İlkokulu',
  'TRABZON - DÜZKÖY - Çayırbağı İmam Hatip Ortaokulu',
  'TRABZON - DÜZKÖY - Çayırbağı Ortaokulu',
  'TRABZON - DÜZKÖY - Çayırbağı Yusuflu İlkokulu',
  'TRABZON - DÜZKÖY - Doğankaya İlkokulu',
  'TRABZON - DÜZKÖY - Doğankaya Ortaokulu',
  'TRABZON - DÜZKÖY - Düzalan İlkokulu',
  'TRABZON - DÜZKÖY - Düzalan Ortaokulu',
  'TRABZON - DÜZKÖY - Düzköy Anadolu Lisesi',
  'TRABZON - DÜZKÖY - Düzköy Halk Eğitimi Merkezi',
  'TRABZON - DÜZKÖY - Düzköy Metin Onur Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - DÜZKÖY - Düzköy Metin Onur Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - DÜZKÖY - Düzköy Nazım Kayhan Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - DÜZKÖY - Gökçeler Ortaokulu',
  'TRABZON - DÜZKÖY - Gürgendağ İlkokulu',
  'TRABZON - DÜZKÖY - Gürgendağ Ortaokulu',
  'TRABZON - DÜZKÖY - H.Mehmet Ofluoğlu İlkokulu',
  'TRABZON - DÜZKÖY - H.Mehmet Ofluoğlu Ortaokulu',
  'TRABZON - DÜZKÖY - Haçkalı Baba İmam Hatip Ortaokulu',
  'TRABZON - DÜZKÖY - Lütfü Ofluoğlu Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - DÜZKÖY - Mehmet Akkaya Anadolu İmam Hatip Lisesi',
  'TRABZON - DÜZKÖY - Minik Kalpler Anaokulu',
  'TRABZON - DÜZKÖY - Taşocağı İlkokulu',
  'TRABZON - HAYRAT - Balaban Hacısalih Musaoğlu İlkokulu',
  'TRABZON - HAYRAT - Balaban Hacısalih Musaoğlu Ortaokulu',
  'TRABZON - HAYRAT - Hayrat Borsa İstanbul Çok Programlı Anadolu Lisesi',
  'TRABZON - HAYRAT - Hayrat Borsa İstanbul İlkokulu',
  'TRABZON - HAYRAT - Hayrat Borsa İstanbul Ortaokulu',
  'TRABZON - HAYRAT - Hayrat İmam Hatip Ortaokulu',
  'TRABZON - HAYRAT - Hayrat Nuhoğlu Vakfı Ramiz Yıldırım Halk Eğitimi Merkezi',
  'TRABZON - HAYRAT - Taflancık Fazlı Rıza Zengin İlkokulu',
  'TRABZON - KÖPRÜBAŞI - Adnan Kahveci İlkokulu',
  'TRABZON - KÖPRÜBAŞI - Adnan Kahveci İmam Hatip Ortaokulu',
  'TRABZON - KÖPRÜBAŞI - Köprübaşı Çok Programlı Anadolu Lisesi',
  'TRABZON - KÖPRÜBAŞI - Köprübaşı Hatice Aslan Aksoy Anaokulu',
  'TRABZON - KÖPRÜBAŞI - Merkez İlkokulu',
  'TRABZON - KÖPRÜBAŞI - Merkez Ortaokulu',
  'TRABZON - KÖPRÜBAŞI - Trabzon Köprübaşı Halk Eğitimi Merkezi',
  'TRABZON - MAÇKA - Başar İlkokulu',
  'TRABZON - MAÇKA - Başar Ortaokulu',
  'TRABZON - MAÇKA - Ce-zi-ne Kardeşler İlkokulu',
  'TRABZON - MAÇKA - Cumhuriyet Ortaokulu',
  'TRABZON - MAÇKA - Çatak İlkokulu',
  'TRABZON - MAÇKA - Çatak Ortaokulu',
  'TRABZON - MAÇKA - Esiroğlu Kenan Oltan Anadolu Lisesi',
  'TRABZON - MAÇKA - Esiroğlu Şehit Er Mehmet Akyüz İlkokulu',
  'TRABZON - MAÇKA - Kayalar Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - MAÇKA - Konaklar İlkokulu',
  'TRABZON - MAÇKA - Konaklar Ortaokulu',
  'TRABZON - MAÇKA - Maçka Anaokulu',
  'TRABZON - MAÇKA - Maçka Esiroğlu Şehit Er Mehmet Akyüz Ortaokulu',
  'TRABZON - MAÇKA - Maçka Halk Eğitimi Merkezi',
  'TRABZON - MAÇKA - Maçka Mehmet Akif Ersoy Anadolu Lisesi',
  'TRABZON - MAÇKA - Maçka Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - MAÇKA - Maçka Şehit Eren Bülbül Anadolu İmam Hatip Lisesi',
  'TRABZON - MAÇKA - Maçka Tevfik İleri İmam Hatip Ortaokulu',
  'TRABZON - OF - 28 Şubat İlkokulu',
  'TRABZON - OF - Ali Yeşilyurt İmam Hatip Ortaokulu',
  'TRABZON - OF - Bölümlü Mehmet Akif Ersoy İlkokulu',
  'TRABZON - OF - Bölümlü Şehit İhsan Yıldız Ortaokulu',
  'TRABZON - OF - Cumapazarı İlkokulu',
  'TRABZON - OF - Cumapazarı Ortaokulu',
  'TRABZON - OF - Eskipazar İlkokulu',
  'TRABZON - OF - Eskipazar Ortaokulu',
  'TRABZON - OF - Fatih Sultan Mehmet Ortaokulu',
  'TRABZON - OF - Gürpınar İlkokulu',
  'TRABZON - OF - Gürpınar İmam Hatip Ortaokulu',
  'TRABZON - OF - Hacıahmetoğlu Ortaokulu',
  'TRABZON - OF - İhsan Karadeniz İlkokulu',
  'TRABZON - OF - İhsan Karadeniz Ortaokulu',
  'TRABZON - OF - İsmail Yıldırım İlkokulu',
  'TRABZON - OF - Kıyıcık İlkokulu',
  'TRABZON - OF - Kıyıcık Ortaokulu',
  'TRABZON - OF - Kireçli Dursun Dumangöz İlkokulu',
  'TRABZON - OF - Kireçli Dursun Dumangöz Ortaokulu',
  'TRABZON - OF - Mikdat Sarıalioğlu Ortaokulu',
  'TRABZON - OF - Of Anadolu İmam Hatip Lisesi',
  'TRABZON - OF - Of Bilim ve Sanat Merkezi',
  'TRABZON - OF - Of Fen Lisesi',
  'TRABZON - OF - Of Hacı Mehmet Bahattin Ulusoy Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - OF - Of Halk Eğitimi Merkezi',
  'TRABZON - OF - Of Mesleki Eğitim Merkezi',
  'TRABZON - OF - Of Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - OF - Of Rehberlik ve Araştırma Merkezi',
  'TRABZON - OF - Pınaraltı İlkokulu',
  'TRABZON - OF - Pınaraltı Ortaokulu',
  'TRABZON - OF - Serince Şehit Fahrettin Yavuz İmam Hatip Ortaokulu',
  'TRABZON - OF - Şehit Ahmet Türkkan Çok Programlı Anadolu Lisesi',
  'TRABZON - OF - Şehit Hüsnü Uyan Anaokulu',
  'TRABZON - OF - Şehit Necmi Çakır Anadolu Lisesi',
  'TRABZON - OF - Şehit Öğretmen Ali Bulut İlkokulu',
  'TRABZON - OF - Taşhan Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - OF - Yakup Türköz Özel Eğitim Meslek Okulu',
  'TRABZON - ORTAHİSAR - 100.Yıl İlkokulu',
  'TRABZON - ORTAHİSAR - 24 Şubat Ortaokulu',
  'TRABZON - ORTAHİSAR - 80. Yıl Çok Programlı Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - 88.Yıl Cumhuriyet Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Affan Kitapçıoğlu Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Ahmet Saka İlkokulu',
  'TRABZON - ORTAHİSAR - Ahmet Yahya Subaşı İlkokulu',
  'TRABZON - ORTAHİSAR - Ahmet Yahya Subaşı Ortaokulu',
  'TRABZON - ORTAHİSAR - Akoluk İlkokulu',
  'TRABZON - ORTAHİSAR - Akoluk Ortaokulu',
  'TRABZON - ORTAHİSAR - Akyazı İlkokulu',
  'TRABZON - ORTAHİSAR - Akyazı Ortaokulu',
  'TRABZON - ORTAHİSAR - Ali Kemal Aktürk İlkokulu',
  'TRABZON - ORTAHİSAR - Ali Soylu Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Aliye Aşırbaylı Anaokulu',
  'TRABZON - ORTAHİSAR - Ata İlkokulu',
  'TRABZON - ORTAHİSAR - Ata Ortaokulu',
  'TRABZON - ORTAHİSAR - Atatürk İlkokulu',
  'TRABZON - ORTAHİSAR - Atatürk Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Atatürk Ortaokulu',
  'TRABZON - ORTAHİSAR - Aydınlıkevler İmam Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Ayfer Karakullukçu İlkokulu',
  'TRABZON - ORTAHİSAR - Bahçecik İmam Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Bedri Rahmi Eyüboğlu İlkokulu',
  'TRABZON - ORTAHİSAR - Bedri Rahmi Eyüboğlu Ortaokulu',
  'TRABZON - ORTAHİSAR - Bener Cordan Ortaokulu',
  'TRABZON - ORTAHİSAR - Beşirli Anaokulu',
  'TRABZON - ORTAHİSAR - Beşirli Borsa İstanbul Ortaokulu',
  'TRABZON - ORTAHİSAR - Borsa İstanbul Kız Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Bostancı İlkokulu',
  'TRABZON - ORTAHİSAR - Bostancı Ortaokulu',
  'TRABZON - ORTAHİSAR - Boztepe İlkokulu',
  'TRABZON - ORTAHİSAR - Cudibey Ortaokulu',
  'TRABZON - ORTAHİSAR - Cumhuriyet İlkokulu',
  'TRABZON - ORTAHİSAR - Cumhuriyet Ortaokulu',
  'TRABZON - ORTAHİSAR - Çağlayan Adnan Menderes Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Çağlayan İmam Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Çağlayan Merkez Şehit Gürcan Bayrak İlkokulu',
  'TRABZON - ORTAHİSAR - Çağlayan Merkez Şehit Gürcan Bayrak Ortaokulu',
  'TRABZON - ORTAHİSAR - Çamlık İşitme Engelliler Ortaokulu',
  'TRABZON - ORTAHİSAR - ÇAMOBA ANAOKULU',
  'TRABZON - ORTAHİSAR - Çimenli İlkokulu',
  'TRABZON - ORTAHİSAR - Çimenli Ortaokulu',
  'TRABZON - ORTAHİSAR - Çukurçayır Anaokulu',
  'TRABZON - ORTAHİSAR - Çukurçayır İlkokulu',
  'TRABZON - ORTAHİSAR - ÇUKURÇAYIR MİNİK ADIMLAR ANAOKULU',
  'TRABZON - ORTAHİSAR - Çukurçayır Ortaokulu',
  'TRABZON - ORTAHİSAR - Dolaylı İlkokulu',
  'TRABZON - ORTAHİSAR - Dolaylı Ortaokulu',
  'TRABZON - ORTAHİSAR - Dumlupınar İlkokulu',
  'TRABZON - ORTAHİSAR - Dursun Ali Kurt Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Düzyurt İlkokulu',
  'TRABZON - ORTAHİSAR - Düzyurt Ortaokulu',
  'TRABZON - ORTAHİSAR - Erdoğdu Anaokulu',
  'TRABZON - ORTAHİSAR - Erdoğdu Bey Ortaokulu',
  'TRABZON - ORTAHİSAR - Erdoğdu İlkokulu',
  'TRABZON - ORTAHİSAR - ERDOĞDU ÖZEL EĞİTİM UYGULAMA MERKEZİ II. KADEME',
  'TRABZON - ORTAHİSAR - Erdoğdu Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - ORTAHİSAR - Fatih Anaokulu',
  'TRABZON - ORTAHİSAR - Fatih Sultan Mehmet Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Fatma Tuna Kızılay Anaokulu',
  'TRABZON - ORTAHİSAR - Gazi Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Gazipaşa Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - ORTAHİSAR - Gazipaşa Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - ORTAHİSAR - Gölçayır İlkokulu',
  'TRABZON - ORTAHİSAR - Gölçayır Ortaokulu',
  'TRABZON - ORTAHİSAR - Gülbahar Hatun Anaokulu',
  'TRABZON - ORTAHİSAR - Gürbulak İlkokulu',
  'TRABZON - ORTAHİSAR - GÜRBULAK ORTAOKULU',
  'TRABZON - ORTAHİSAR - Hami Yıldırım İlkokulu',
  'TRABZON - ORTAHİSAR - Hasan Ali Yücel İlkokulu',
  'TRABZON - ORTAHİSAR - Hasan Tahsin Kırali İlkokulu',
  'TRABZON - ORTAHİSAR - HIZIRBEY ÜLKÜ İLKOKULU',
  'TRABZON - ORTAHİSAR - Hüseyin Hüsnü Aker Anaokulu',
  'TRABZON - ORTAHİSAR - İbrahim Alemdağ Ortaokulu',
  'TRABZON - ORTAHİSAR - İskenderpaşa Ortaokulu',
  'TRABZON - ORTAHİSAR - İsmail Hakkı Bereketoğlu Anaokulu',
  'TRABZON - ORTAHİSAR - İsmetpaşa İlkokulu',
  'TRABZON - ORTAHİSAR - Kaan Dinler Anaokulu',
  'TRABZON - ORTAHİSAR - Kanuni Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Kanuni Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Kanuni İlkokulu',
  'TRABZON - ORTAHİSAR - Kanuni Ortaokulu',
  'TRABZON - ORTAHİSAR - Karadeniz Özel Eğitim Meslek Okulu',
  'TRABZON - ORTAHİSAR - Karakaya İlkokulu',
  'TRABZON - ORTAHİSAR - Karakaya Ortaokulu',
  'TRABZON - ORTAHİSAR - Karbeyaz Anaokulu',
  'TRABZON - ORTAHİSAR - Kardelen Anaokulu',
  'TRABZON - ORTAHİSAR - Karlık İlkokulu',
  'TRABZON - ORTAHİSAR - Karlık Ortaokulu',
  'TRABZON - ORTAHİSAR - Karşıyaka İmam Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Kireçhane İlkokulu',
  'TRABZON - ORTAHİSAR - Kireçhane Ortaokulu',
  'TRABZON - ORTAHİSAR - Kutlugün İlkokulu',
  'TRABZON - ORTAHİSAR - Kutlugün Ortaokulu',
  'TRABZON - ORTAHİSAR - Mahmut Celaleddin Ökten Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Mehmet Akif Ersoy Ortaokulu',
  'TRABZON - ORTAHİSAR - Mimar Sinan Ortaokulu',
  'TRABZON - ORTAHİSAR - Necip Fazıl Kısakürek İmam-Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Ortahisar Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Ortahisar Bilim ve Sanat Merkezi',
  'TRABZON - ORTAHİSAR - Ortahisar Çamlık İşitme Engelliler İlkokulu',
  'TRABZON - ORTAHİSAR - Ortahisar Çamlık Özel Eğitim Meslek Lisesi',
  'TRABZON - ORTAHİSAR - Ortahisar Halk Eğitimi Merkezi',
  'TRABZON - ORTAHİSAR - Ortahisar Mesleki Eğitim Merkezi',
  'TRABZON - ORTAHİSAR - Ortahisar Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - ORTAHİSAR - Ortahisar Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - ORTAHİSAR - Osman Altıntaş Ortaokulu',
  'TRABZON - ORTAHİSAR - Osman Kalyoncu İmam Hatip Ortaokulu',
  'TRABZON - ORTAHİSAR - Ömer Burak Terzi Özel Eğitim Anaokulu',
  'TRABZON - ORTAHİSAR - Pelitli 75. Yıl Cumhuriyet Ortaokulu',
  'TRABZON - ORTAHİSAR - Pelitli Ahmet Can Bali Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Pelitli Mareşal Fevzi Çakmak İlkokulu',
  'TRABZON - ORTAHİSAR - Pelitli Şehit Kadir Tuncer İlkokulu',
  'TRABZON - ORTAHİSAR - Pınaraltı Keleşli İlkokulu',
  'TRABZON - ORTAHİSAR - Piri Reis İlkokulu',
  'TRABZON - ORTAHİSAR - Piri Reis Ortaokulu',
  'TRABZON - ORTAHİSAR - Prof. Dr. Necmettin Erbakan Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Prof. İhsan Koz İlkokulu',
  'TRABZON - ORTAHİSAR - Soğuksu İstiklal İlkokulu',
  'TRABZON - ORTAHİSAR - Şehit Ali Yasin Erosmanoğlu Anaokulu',
  'TRABZON - ORTAHİSAR - Şehit Pilot Yüzbaşı Burak Gençcelep İlkokulu',
  'TRABZON - ORTAHİSAR - Şehit Pilot Yüzbaşı Burak Gençcelep Ortaokulu',
  'TRABZON - ORTAHİSAR - Şehit Ünal Bıçakçı Ticaret Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Temel Yaşar Çoruh İlkokulu',
  'TRABZON - ORTAHİSAR - Tevfik Serdar Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Tevfikbey Anaokulu',
  'TRABZON - ORTAHİSAR - Ticaret İlkokulu',
  'TRABZON - ORTAHİSAR - Trabzon 15 Temmuz Şehitleri Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Faruk Başaran Bilim ve Sanat Merkezi',
  'TRABZON - ORTAHİSAR - Trabzon Kız Anadolu İmam Hatip Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Merkez Fen Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Olgunlaşma Enstitüsü',
  'TRABZON - ORTAHİSAR - Trabzon Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - ORTAHİSAR - Trabzon Rehberlik ve Araştırma Merkezi',
  'TRABZON - ORTAHİSAR - Trabzon Sosyal Bilimler Lisesi',
  'TRABZON - ORTAHİSAR - Trabzon Spor Lisesi',
  'TRABZON - ORTAHİSAR - Uğurlu İlkokulu',
  'TRABZON - ORTAHİSAR - Uğurlu Ortaokulu',
  'TRABZON - ORTAHİSAR - Yalıncak İlkokulu',
  'TRABZON - ORTAHİSAR - YALINCAK İMAM HATİP ORTAOKULU',
  'TRABZON - ORTAHİSAR - Yalıncak Ortaokulu',
  'TRABZON - ORTAHİSAR - Yavuz Selim İlkokulu',
  'TRABZON - ORTAHİSAR - Yavuz Sultan Selim Anadolu Lisesi',
  'TRABZON - ORTAHİSAR - Yeşilova İlkokulu',
  'TRABZON - ORTAHİSAR - Yeşilova Kemal Bülbüloğlu Ortaokulu',
  'TRABZON - ORTAHİSAR - Yeşiltepe İlkokulu',
  'TRABZON - ORTAHİSAR - Yol-İş Sendikası Ortaokulu',
  'TRABZON - ORTAHİSAR - Yunus Emre Anaokulu',
  'TRABZON - ORTAHİSAR - Yunus Emre Ortaokulu',
  'TRABZON - ORTAHİSAR - Zafer Özel Eğitim Uygulama Okulu III. Kademe',
  'TRABZON - ORTAHİSAR - Zehra Kitapçıoğlu Anaokulu',
  'TRABZON - ORTAHİSAR - Zehra Kitapçıoğlu İlkokulu',
  'TRABZON - ORTAHİSAR - Zübeyde Hanım Kız Anadolu Lisesi',
  'TRABZON - SÜRMENE - Aşağı Aksu İlkokulu',
  'TRABZON - SÜRMENE - Aşağı Aksu Ortaokulu',
  'TRABZON - SÜRMENE - Ayşe Kırali Ortaokulu',
  'TRABZON - SÜRMENE - Cevdet Cavit Şenkaya Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - SÜRMENE - Cevher Özden Kız Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - SÜRMENE - Çamburnu Fazıloğlu Mahmut Bıçakçı Ortaokulu',
  'TRABZON - SÜRMENE - Çamburnu İlkokulu',
  'TRABZON - SÜRMENE - Çavuşlu Ali Kırali İlkokulu',
  'TRABZON - SÜRMENE - Çavuşlu Ortaokulu',
  'TRABZON - SÜRMENE - Dursun Karabacak İlkokulu',
  'TRABZON - SÜRMENE - Dursun Karabacak Ortaokulu',
  'TRABZON - SÜRMENE - Halis Çebi Mesleki Eğitim Merkezi',
  'TRABZON - SÜRMENE - Küçükdere Enver Dursun Yılmaz İlkokulu',
  'TRABZON - SÜRMENE - Küçükdere Enver Dursun Yılmaz Ortaokulu',
  'TRABZON - SÜRMENE - Ormanseven İlkokulu',
  'TRABZON - SÜRMENE - Ormanseven Ortaokulu',
  'TRABZON - SÜRMENE - Oylum İlkokulu',
  'TRABZON - SÜRMENE - Sürmene Ahmet Yılmaz Özel Eğitim Uygulama Okulu III. Kademe',
  'TRABZON - SÜRMENE - Sürmene Halk Eğitimi Merkezi',
  'TRABZON - SÜRMENE - Sürmene Hasan Sadri Yetmişbir Anadolu Lisesi',
  'TRABZON - SÜRMENE - Sürmene Hasan Tahsin Kırali Anadolu Lisesi',
  'TRABZON - SÜRMENE - Sürmene İmam Hatip Ortaokulu',
  'TRABZON - SÜRMENE - Sürmene İnci-Hamitcan Aksoy Öğretmenevi ve Akşam Sanat Okulu Müdürlüğü',
  'TRABZON - SÜRMENE - Sürmene Muratlı Özel Eğitim Anaokulu',
  'TRABZON - SÜRMENE - Sürmene Şehit Muhammet Yıldız Anadolu İmam Hatip Lisesi',
  'TRABZON - SÜRMENE - Sürmene Türk Telekom Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - SÜRMENE - Şehit Kaymakam Muhammet Fatih Safitürk İlkokulu',
  'TRABZON - SÜRMENE - Talat Orhon Anaokulu',
  'TRABZON - SÜRMENE - Yakup Kalafatoğlu İlkokulu',
  'TRABZON - SÜRMENE - Yakup Kalafatoğlu Ortaokulu',
  'TRABZON - SÜRMENE - Yardımlaşma Vakfı Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - SÜRMENE - Yardımlaşma Vakfı Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - SÜRMENE - Zübeyde Hanım Anaokulu',
  'TRABZON - ŞALPAZARI - Ali İbrahimağaoğlu Anaokulu',
  'TRABZON - ŞALPAZARI - Atatürk İlkokulu',
  'TRABZON - ŞALPAZARI - Atatürk Ortaokulu',
  'TRABZON - ŞALPAZARI - Doğancı İlkokulu',
  'TRABZON - ŞALPAZARI - Gökçeköy İlkokulu',
  'TRABZON - ŞALPAZARI - Gökçeköy Ortaokulu',
  'TRABZON - ŞALPAZARI - Simenli İlkokulu',
  'TRABZON - ŞALPAZARI - Şalpazarı Anadolu İmam Hatip Lisesi',
  'TRABZON - ŞALPAZARI - Şalpazarı Anadolu Lisesi',
  'TRABZON - ŞALPAZARI - Şalpazarı Ayten Yılmaz Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - ŞALPAZARI - Şalpazarı Halk Eğitimi Merkezi',
  'TRABZON - TONYA - 125. Yıl Anaokulu',
  'TRABZON - TONYA - 17 Şubat İlkokulu',
  'TRABZON - TONYA - 17 Şubat Ortaokulu',
  'TRABZON - TONYA - Feride-Ahmet Şener Ortaokulu',
  'TRABZON - TONYA - Hoşarlı İlkokulu',
  'TRABZON - TONYA - Hoşarlı Ortaokulu',
  'TRABZON - TONYA - Karaağaçlı İlkokulu',
  'TRABZON - TONYA - Karaağaçlı Ortaokulu',
  'TRABZON - TONYA - Necmettin Karaduman İlkokulu',
  'TRABZON - TONYA - Şehit Ayhan Güner İlkokulu',
  'TRABZON - TONYA - ŞEHİT KENAN KUMAŞ İLKOKULU',
  'TRABZON - TONYA - ŞEHİT KENAN KUMAŞ ORTAOKULU',
  'TRABZON - TONYA - Tonya Anadolu İmam Hatip Lisesi',
  'TRABZON - TONYA - Tonya Atatürk Çok Programlı Anadolu Lisesi',
  'TRABZON - TONYA - Tonya Halk Eğitimi Merkezi',
  'TRABZON - TONYA - Tonya İmam Hatip Ortaokulu',
  'TRABZON - TONYA - Tonya Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - TONYA - Tonya Şehit Soner Yıldırım Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - TONYA - Trabzon Tonya Anadolu Lisesi',
  'TRABZON - VAKFIKEBİR - Atatürk Ortaokulu',
  'TRABZON - VAKFIKEBİR - Büyükliman İlkokulu',
  'TRABZON - VAKFIKEBİR - Cumhuriyet Anaokulu',
  'TRABZON - VAKFIKEBİR - Cumhuriyet İlkokulu',
  'TRABZON - VAKFIKEBİR - Cumhuriyet Ortaokulu',
  'TRABZON - VAKFIKEBİR - Deregözü İlkokulu',
  'TRABZON - VAKFIKEBİR - Deregözü Ortaokulu',
  'TRABZON - VAKFIKEBİR - Fevziye İlkokulu',
  'TRABZON - VAKFIKEBİR - Fevziye Ortaokulu',
  'TRABZON - VAKFIKEBİR - Kemaliye Adnan Demirtürk İlkokulu',
  'TRABZON - VAKFIKEBİR - Osman Tan Ortaokulu',
  'TRABZON - VAKFIKEBİR - Ömer Nakkaş Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Anadolu İmam Hatip Lisesi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Bilim ve Sanat Merkezi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Fen Lisesi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Gülbahar Hatun Anadolu Lisesi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Halk Eğitimi Merkezi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Hikmet Kaan İmam Hatip Ortaokulu',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Mesleki Eğitim Merkezi',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Öğretmenevi ve Akşam Sanat Okulu',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Özel Eğitim Meslek Okulu',
  'TRABZON - VAKFIKEBİR - Vakfıkebir Turizm Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - VAKFIKEBİR - Yalıköy İlkokulu',
  'TRABZON - VAKFIKEBİR - Yalıköy İmam Hatip Ortaokulu',
  'TRABZON - VAKFIKEBİR - Yalıköy Ortaokulu',
  'TRABZON - YOMRA - Çamlıyurt İlkokulu',
  'TRABZON - YOMRA - Hacı Hakkı Çalık Anadolu İmam Hatip Lisesi',
  'TRABZON - YOMRA - Hafız Murat Köseoğlu İmam Hatip Ortaokulu',
  'TRABZON - YOMRA - Kaşüstü Cumhuriyet İlkokulu',
  'TRABZON - YOMRA - Kaşüstü Cumhuriyet Ortaokulu',
  'TRABZON - YOMRA - Kaşüstü Çok Programlı Anadolu Lisesi',
  'TRABZON - YOMRA - Kaşüstü İlkokulu',
  'TRABZON - YOMRA - Kaşüstü Ortaokulu',
  'TRABZON - YOMRA - Kömürcü Ortaokulu',
  'TRABZON - YOMRA - Maden Ortaokulu',
  'TRABZON - YOMRA - Merkez Anaokulu',
  'TRABZON - YOMRA - Merkez İlkokulu',
  'TRABZON - YOMRA - Merkez Ortaokulu',
  'TRABZON - YOMRA - Oymalıtepe İlkokulu',
  'TRABZON - YOMRA - Oymalıtepe Şehit Sedat Kaplan Ortaokulu',
  'TRABZON - YOMRA - Özdil Çok Programlı Anadolu Lisesi',
  'TRABZON - YOMRA - Özdil İlkokulu',
  'TRABZON - YOMRA - Özdil İmam Hatip Ortaokulu',
  'TRABZON - YOMRA - Sevim-Nerim Demircioğlu Anaokulu',
  'TRABZON - YOMRA - Temel ve Kebire Çalık İmam Hatip Ortaokulu',
  'TRABZON - YOMRA - Trabzon Yomra Fen Lisesi',
  'TRABZON - YOMRA - Vilayetler Birliği Özel Eğitim Uygulama Okulu I. Kademe',
  'TRABZON - YOMRA - Vilayetler Birliği Özel Eğitim Uygulama Okulu II. Kademe',
  'TRABZON - YOMRA - Vilayetler Birliği Özel Eğitim Uygulama Okulu III. Kademe',
  'TRABZON - YOMRA - Yavuz Selim İlkokulu',
  'TRABZON - YOMRA - Yomra Anadolu Lisesi',
  'TRABZON - YOMRA - Yomra Halk Eğitimi Merkezi',
  'TRABZON - YOMRA - Yomra Özel Eğitim Anaokulu',
  'TRABZON - MERKEZ - Özel Ana Sınav Temel Lisesi',
  'TRABZON - MERKEZ - Özel Bahçeşehir Koleji Trabzon Kampüsü',
  'TRABZON - MERKEZ - Özel Düşünür Koleji Trabzon Ortaokulu',
  'TRABZON - MERKEZ - Özel İlke Birey Okulları',
  'TRABZON - MERKEZ - Özel İpekyolu Ortaokulu',
  'TRABZON - MERKEZ - Özel Kuzey Okulları Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - MERKEZ - Özel Net Anadolu Lisesi',
  'TRABZON - MERKEZ - Özel Net Fen Lisesi',
  'TRABZON - MERKEZ - Özel TED Koleji Trabzon Kampüsü',
  'TRABZON - MERKEZ - Özel Trabzon Doğa Koleji',
  'TRABZON - MERKEZ - Özel Trabzon Mektebim Anadolu Lisesi',
  'TRABZON - MERKEZ - Özel Trabzon Mektebim Ortaokulu',
  'TRABZON - AKÇAABAT - Özel Akçaabat Sınav Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Özel Akçaabat Sınav Fen Lisesi',
  'TRABZON - AKÇAABAT - Özel Akçaabat Uğur Mesleki ve Teknik Anadolu Lisesi',
  'TRABZON - AKÇAABAT - Özel Trabzon Bil Temel Lisesi',
]

// Rize okulları
const rizeOkullari = [
  // ARDEŞEN
  'RİZE - ARDEŞEN - Alparslan Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Anadolu İmam Hatip Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Fırtına Vadisi İrfan Tufan Karaoğlu Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen İmam Hatip Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Lokman Hekim Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - ARDEŞEN NECİP FAZIL KISAKÜREK İMAM HATİP ORTAOKULU',
  'RİZE - ARDEŞEN - Ardeşen Piri Reis Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ARDEŞEN - Ardeşen Şehit Ömer Halisdemir Fen Lisesi',
  'RİZE - ARDEŞEN - Işıklı 60 Yıl Ortaokulu',
  'RİZE - ARDEŞEN - Köprüköy Ortaokulu',
  'RİZE - ARDEŞEN - RABİA HATUN KIZ ANADOLU İMAM HATİP LİSESİ',
  'RİZE - ARDEŞEN - Seslıkaya Ziya Okutan Ortaokulu',
  'RİZE - ARDEŞEN - Türk Telekom Kanuni Anadolu Lisesi',
  'RİZE - ARDEŞEN - Yavuz Selim Ortaokulu',
  'RİZE - ARDEŞEN - Ardeşen Cumhuriyet İlkokulu',
  'RİZE - ARDEŞEN - Ardeşen Merkez Fatih İlkokulu',
  'RİZE - ARDEŞEN - Seslıkaya Ziya Okutan İlkokulu',
  'RİZE - ARDEŞEN - Fikri Keçeli İlkokulu',
  'RİZE - ARDEŞEN - Ardeşen Fatih İlkokulu',
  'RİZE - ARDEŞEN - Atatürk Anaokulu',
  'RİZE - ARDEŞEN - Borsa İstanbul İlkokulu',
  'RİZE - ARDEŞEN - Cumhuriyet İlkokulu',
  'RİZE - ARDEŞEN - Gazi Mustafa Kemal İlkokulu',
  'RİZE - ARDEŞEN - Işıklı 60 Yıl İlkokulu',
  'RİZE - ARDEŞEN - Köprüköy İlkokulu',
  'RİZE - ARDEŞEN - Mesut Karaoğlu İlkokulu',
  // ÇAMLIHEMŞİN
  'RİZE - ÇAMLIHEMŞİN - Atatürk Ortaokulu',
  'RİZE - ÇAMLIHEMŞİN - Çamlıhemşin Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAMLIHEMŞİN - Çamlıhemşin Çok Programlı Anadolu Lisesi',
  'RİZE - ÇAMLIHEMŞİN - DİKKAYA ORTAOKULU',
  'RİZE - ÇAMLIHEMŞİN - İstanbul Ticaret Odası Şehit Binbaşı Ömer Aktuğ Ortaokulu',
  'RİZE - ÇAMLIHEMŞİN - ATATÜRK İLKOKULU',
  'RİZE - ÇAMLIHEMŞİN - DİKKAYA İLKOKULU',
  'RİZE - ÇAMLIHEMŞİN - Düzmahalle İlkokulu',
  'RİZE - ÇAMLIHEMŞİN - İstanbul Ticaret Odası Şehit Binbaşı Ömer Aktuğ İlkokulu',
  // ÇAYELİ
  'RİZE - ÇAYELİ - Ahmet Hamdi-Nurzan İshakoğlu Anadolu Lisesi',
  'RİZE - ÇAYELİ - Beyazsu Ortaokulu',
  'RİZE - ÇAYELİ - Büyükköy Ortaokulu',
  'RİZE - ÇAYELİ - Çayeli Ahmet Hamdi İshakoğlu Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAYELİ - Çayeli Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Barbaros Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Fen Lisesi',
  'RİZE - ÇAYELİ - Çayeli Hacı Ahmet Hamdi İshakoğlu Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Çayeli Halk Eğitimi Merkezi',
  'RİZE - ÇAYELİ - Çayeli Kız Anadolu İmam Hatip Lisesi',
  'RİZE - ÇAYELİ - Çayeli Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - ÇAYELİ - Hüseyin Rüştü Altunbaş Ortaokulu',
  'RİZE - ÇAYELİ - Kaptanpaşa İzzet Akcal Yatılı Bölge Ortaokulu',
  'RİZE - ÇAYELİ - Madenli Ortaokulu',
  'RİZE - ÇAYELİ - Merkez Atatürk Ortaokulu',
  'RİZE - ÇAYELİ - Şehit Muhammet Ambar İmam Hatip Ortaokulu',
  'RİZE - ÇAYELİ - Yamantürk Ortaokulu',
  'RİZE - ÇAYELİ - Çayeli Yamaç İlkokulu',
  'RİZE - ÇAYELİ - Hasan Yılmaz İlkokulu',
  'RİZE - ÇAYELİ - Çayeli Beyazsu İlkokulu',
  'RİZE - ÇAYELİ - 9 Mart İlkokulu',
  'RİZE - ÇAYELİ - Tunca Şehit Cumalı Ayçiçek İlkokulu',
  'RİZE - ÇAYELİ - Fikri Keçeli İlkokulu',
  'RİZE - ÇAYELİ - Beyazsu İlkokulu',
  'RİZE - ÇAYELİ - Büyükköy İlkokulu',
  'RİZE - ÇAYELİ - İshakoğlu İlkokulu',
  'RİZE - ÇAYELİ - Kaptanoğlu İlkokulu',
  'RİZE - ÇAYELİ - Kaptanpaşa İzzet Akçal İlkokulu',
  'RİZE - ÇAYELİ - Madenli ilkokulu',
  // DEREPAZARI
  'RİZE - DEREPAZARI - Adem Özdemir Anadolu Lisesi',
  'RİZE - DEREPAZARI - Ali Rıza Yılmaz Ortaokulu',
  'RİZE - DEREPAZARI - DEREPAZARI İMAM HATİP ORTAOKULU',
  'RİZE - DEREPAZARI - Derepazarı Merkez İlkokulu',
  'RİZE - DEREPAZARI - Fıçıcılar İlkokulu',
  // FINDIKLI
  'RİZE - FINDIKLI - Aksu Atatürk Ortaokulu',
  'RİZE - FINDIKLI - Arılı Ortaokulu',
  'RİZE - FINDIKLI - Çağlayan Osman Hacıalioğlu Ortaokulu',
  'RİZE - FINDIKLI - Fındıklı 15 Temmuz Şehitleri Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - FINDIKLI - Fındıklı TOBB Anadolu İmam Hatip Lisesi',
  'RİZE - FINDIKLI - İbn-i Sina Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - FINDIKLI - Muammer Çiçekoğlu Ortaokulu',
  'RİZE - FINDIKLI - 11 Mart İlkokulu',
  'RİZE - FINDIKLI - Aksu Atatürk İlkokulu',
  'RİZE - FINDIKLI - Arılı İlkokulu',
  'RİZE - FINDIKLI - Çağlayan Osman Hacıalioğlu İlkokulu',
  'RİZE - FINDIKLI - FINDIKLI İLKOKULU',
  'RİZE - FINDIKLI - Sümer İlkokulu',
  // GÜNEYSU
  'RİZE - GÜNEYSU - Osman Erkan Kız Anadolu İmam Hatip Lisesi',
  'RİZE - GÜNEYSU - Borsa İstanbul Ortaokulu',
  'RİZE - GÜNEYSU - Güneysu Şehit Kemal Mutlu Fen Lisesi',
  'RİZE - GÜNEYSU - Güneysu Spor Lisesi',
  'RİZE - GÜNEYSU - Kaptan Ahmet Erdoğan Anadolu İmam Hatip Lisesi',
  'RİZE - GÜNEYSU - Güneysu İmam Hatip Ortaokulu',
  'RİZE - GÜNEYSU - Güneysu Anadolu Lisesi',
  'RİZE - GÜNEYSU - Adacami İlkokulu',
  'RİZE - GÜNEYSU - ÖZEL BİLGE İLKOKULU',
  'RİZE - GÜNEYSU - ÖZEL GÜNEYSU OKULLARI İLKOKULU',
  'RİZE - GÜNEYSU - ÖZEL GÜNEYSU OKULLARI ORTAOKULU',
  'RİZE - GÜNEYSU - Güneysu İlkokulu',
  'RİZE - GÜNEYSU - Kıbledağı Şehit Metin Çetin İlkokulu',
  'RİZE - GÜNEYSU - Ulucami İlkokulu',
  // HEMŞİN
  'RİZE - HEMŞİN - MERKEZ ORTAOKULU',
  'RİZE - HEMŞİN - Hemşin Çok Programlı Anadolu Lisesi',
  'RİZE - HEMŞİN - MERKEZ İLKOKULU',
  // İKİZDERE
  'RİZE - İKİZDERE - İkizdere Anadolu İmam Hatip Lisesi',
  'RİZE - İKİZDERE - ATATÜRK ORTAOKULU',
  'RİZE - İKİZDERE - Fazliye Hüseyin Turanlı Çok Programlı Anadolu Lisesi',
  'RİZE - İKİZDERE - ATATÜRK İLKOKULU',
  // İYİDERE
  'RİZE - İYİDERE - Merkez Ortaokulu',
  'RİZE - İYİDERE - Çiftlik Ortaokulu',
  'RİZE - İYİDERE - Hazar Çaysan Ortaokulu',
  'RİZE - İYİDERE - İyidere Anadolu Lisesi',
  'RİZE - İYİDERE - İyidere İmam Hatip Ortaokulu',
  'RİZE - İYİDERE - İYİDERE MESLEKİ VE TEKNİK ANADOLU LİSESİ',
  'RİZE - İYİDERE - Büyükçiftlik İlkokulu',
  'RİZE - İYİDERE - Hazar Çaysan İlkokulu',
  'RİZE - İYİDERE - Merkez İlkokulu',
  // KALKANDERE
  'RİZE - KALKANDERE - Kalkandere Anadolu İmam Hatip Lisesi',
  'RİZE - KALKANDERE - Şehit Fikret Metin Öztürk Çok Programlı Anadolu Lisesi',
  'RİZE - KALKANDERE - ORMANLI ORTAOKULU',
  'RİZE - KALKANDERE - YOLBAŞI ORTAOKULU',
  'RİZE - KALKANDERE - ÇAYIRLI ORTAOKULU',
  'RİZE - KALKANDERE - ATATÜRK ORTAOKULU',
  'RİZE - KALKANDERE - DAĞDİBİ ORTAOKULU',
  'RİZE - KALKANDERE - ATATÜRK İLKOKULU',
  'RİZE - KALKANDERE - ÇAYIRLI İLKOKULU',
  'RİZE - KALKANDERE - DAĞDİBİ İLKOKULU',
  'RİZE - KALKANDERE - ORMANLI İLKOKULU',
  'RİZE - KALKANDERE - YOLBAŞI İLKOKULU',
  // MERKEZ
  'RİZE - MERKEZ - Ambarlık Ortaokulu',
  'RİZE - MERKEZ - Gülbahar Hatun Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Ekrem Orhon Turizm Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Elmalı Ortaokulu',
  'RİZE - MERKEZ - Kendirli Şehit Azim ÖZDEMİR Ortaokulu',
  'RİZE - MERKEZ - Merkez Atatürk Ortaokulu',
  'RİZE - MERKEZ - Rize Türkiye Odalar ve Borsalar Birliği Fen Lisesi',
  'RİZE - MERKEZ - Rize Sosyal Bilimler Lisesi',
  'RİZE - MERKEZ - Tevfik İleri Anadolu Lisesi',
  'RİZE - MERKEZ - Tevfik İleri Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Merkez Ticaret Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Anadolu Lisesi',
  'RİZE - MERKEZ - Rize Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Taşlıdere Gazi Ortaokulu',
  'RİZE - MERKEZ - Ömer Halaç İşitme Engelliler Ortaokulu',
  'RİZE - MERKEZ - Veliköy Uzun Mustafa Kopuz Ortaokulu',
  'RİZE - MERKEZ - Kasarcılar Ortaokulu',
  'RİZE - MERKEZ - Hasan Kemal Yardımcı Denizcilik Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Kömürcüler Ortaokulu',
  'RİZE - MERKEZ - Çaykur Ortaokulu',
  'RİZE - MERKEZ - Reşadiye Zihni Derin Ortaokulu',
  'RİZE - MERKEZ - Şehit Nedim ÇALIK Ortaokulu',
  'RİZE - MERKEZ - Fatih Anadolu Lisesi',
  'RİZE - MERKEZ - Mehmet Akif Ersoy Ortaokulu',
  'RİZE - MERKEZ - Ali Metin Kazancı Rize Lisesi',
  'RİZE - MERKEZ - Şehit Murat Çalışkaner İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Karasu Ortaokulu',
  'RİZE - MERKEZ - Çay Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - 100. Yıl Cumhuriyet Ortaokulu',
  'RİZE - MERKEZ - Rize İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Kendirli Şehit Soner Fazlıoğlu Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Ortapazar Ortaokulu',
  'RİZE - MERKEZ - Hüseyin Yardımcı Ortaokulu',
  'RİZE - MERKEZ - Rize Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - MERKEZ - Dörtyol Şehit Halil Sadıkoğlu Ortaokulu',
  'RİZE - MERKEZ - Pazarköy Hafız Ali Usta Ortaokulu',
  'RİZE - MERKEZ - Mahmut Celalettin ÖKTEN İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Hasan Sağır İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - Şehit Onur Kılıç Kız Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - Şehit Erhan Dural Kız Anadolu İmam Hatip Lisesi',
  'RİZE - MERKEZ - FATİH ORTAOKULU',
  'RİZE - MERKEZ - BOĞAZ ORTAOKULU',
  'RİZE - MERKEZ - Küçükçayır Ortaokulu',
  'RİZE - MERKEZ - Gündoğdu 29 Ekim Ortaokulu',
  'RİZE - MERKEZ - Ömer Halaç Özel Eğitim Meslek Lisesi',
  'RİZE - MERKEZ - Nuri Pakdil İmam Hatip Ortaokulu',
  'RİZE - MERKEZ - AMBARLIK İLKOKULU',
  'RİZE - MERKEZ - ZİYA GÖKALP İLKOKULU',
  'RİZE - MERKEZ - METİN BOSTANCIOGLU İLKOKULU',
  'RİZE - MERKEZ - PETROL OFİSİ İLKOKULU',
  'RİZE - MERKEZ - MEHMETÇİK İLKOKULU',
  'RİZE - MERKEZ - VAKIFBANK İLKOKULU',
  'RİZE - MERKEZ - Kurtuluş İlkokulu',
  'RİZE - MERKEZ - Türkiye Odalar ve Borsalar Birliği İlkokulu',
  'RİZE - MERKEZ - Doğuşçay İlkokulu',
  'RİZE - MERKEZ - Çay İlkokulu',
  'RİZE - MERKEZ - ÖZEL RİZE ANADOLU İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ANADOLU ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ FEN LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE BAHÇEŞEHİR KOLEJİ ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM İLKOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE ÇÖZÜM ORTAOKULU',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ ANADOLU LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ FEN LİSESİ',
  'RİZE - MERKEZ - ÖZEL RİZE POYRAZ ORTAOKULU',
  'RİZE - MERKEZ - Çiftekavak Polis Amca İlkokulu',
  'RİZE - MERKEZ - Denizciler İlkokulu',
  'RİZE - MERKEZ - Dörtyol Şehit Halil Sadıkoğlu İlkokulu',
  'RİZE - MERKEZ - Elmalı İlkokulu',
  'RİZE - MERKEZ - Gündoğdu 29 Ekim İlkokulu',
  'RİZE - MERKEZ - Hüseyin Yardımcı İlkokulu',
  'RİZE - MERKEZ - İstiklal İlkokulu',
  'RİZE - MERKEZ - Karasu İlkokulu',
  'RİZE - MERKEZ - Kasarcılar İlkokulu',
  'RİZE - MERKEZ - Kendirli Şehit Azim ÖZDEMİR İlkokulu',
  'RİZE - MERKEZ - Küçükçayır İlkokulu',
  'RİZE - MERKEZ - Muradiye İlkokulu',
  'RİZE - MERKEZ - Ömer Halaç İşitme Engelliler İlkokulu',
  'RİZE - MERKEZ - Pazarköy Hafız Ali Usta İlkokulu',
  'RİZE - MERKEZ - Pehlivantaşı İlkokulu',
  'RİZE - MERKEZ - Şehit Nedim ÇALIK İlkokulu',
  'RİZE - MERKEZ - Şevket Yardımcı İlkokulu',
  'RİZE - MERKEZ - Taşköprü Atatürk İlkokulu',
  'RİZE - MERKEZ - Taşlıdere Gazi İlkokulu',
  'RİZE - MERKEZ - Vakıflar İlkokulu',
  'RİZE - MERKEZ - Veliköy Uzun Mustafa Kopuz İlkokulu',
  // PAZAR
  'RİZE - PAZAR - FUAT ERGENÇ ORTAOKULU',
  'RİZE - PAZAR - Pazar Anadolu İmam Hatip Lisesi',
  'RİZE - PAZAR - Pazar Kız Kulesi Kız Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Necat Sağbaş Anadolu Lisesi',
  'RİZE - PAZAR - Pazar Fen Lisesi',
  'RİZE - PAZAR - Pazar 10 Mart Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Pazar Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Ahmet Tahtakılıç Ortaokulu',
  'RİZE - PAZAR - HAMİDİYE ORTAOKULU',
  'RİZE - PAZAR - VALİ ERDAL ATA ORTAOKULU',
  'RİZE - PAZAR - TOPLU KONUT İDARESİ BAŞKANLIĞI ORTAOKULU',
  'RİZE - PAZAR - Haberal Vakfı Yaşar ve MedineHaberal Ortaokulu',
  'RİZE - PAZAR - AKTEPE ORTAOKULU',
  'RİZE - PAZAR - ATATÜRK ANADOLU LİSESİ',
  'RİZE - PAZAR - Pazar Şehit Murat Naiboğlu Sivil Havacılık Mesleki ve Teknik Anadolu Lisesi',
  'RİZE - PAZAR - Ahmet Mesut Yılmaz İlkokulu',
  'RİZE - PAZAR - AKTEPE İLKOKULU',
  'RİZE - PAZAR - ÖZEL RİZE PAZAR MEKTEBİM İLKOKULU',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM FEN LİSESİ',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM İLKOKULU',
  'RİZE - PAZAR - ÖZEL ÇÖZÜM ORTAOKULU',
  'RİZE - PAZAR - ÖZEL PAZAR AÇI ANADOLU LİSESİ',
  'RİZE - PAZAR - FUAT ERGENÇ İLKOKULU',
  'RİZE - PAZAR - HAMİDİYE İLKOKULU',
  'RİZE - PAZAR - HÜSEYİN SARIOĞLU İLKOKULU',
  'RİZE - PAZAR - TOPLU KONUT İDARESİ BAŞKANLIĞI İLKOKULU',
  'RİZE - PAZAR - VALİ ERDAL ATA İLKOKULU',
  'RİZE - PAZAR - Veysel Vardal İlkokulu',
]

const trabzonSiniflar = [
  '4. Sınıf',
  '5. Sınıf',
  '6. Sınıf',
  '7. Sınıf',
  '8. Sınıf',
  '9. Sınıf',
  '10. Sınıf',
  '11. Sınıf',
]

const rizeSiniflar = [
  '4. Sınıf',
  '5. Sınıf',
  '6. Sınıf',
  '7. Sınıf',
  '8. Sınıf',
  '9. Sınıf',
  '10. Sınıf',
  '11. Sınıf',
  '12. Sınıf',
]

const meslekler = [
  'Acil Tıp Teknisyeni',
  'Anaokulu Öğretmeni',
  'Anestezi Teknikeri',
  'Araştırmacı',
  'Asker',
  'Aşçı',
  'Avukat',
  'Bankacı',
  'Beden Eğitimi Öğretmeni',
  'Bilgisayar Mühendisi',
  'Biyomedikal Mühendisi',
  'Bütçe Uzmanı',
  'Çevre Mühendisliği',
  'Çiftçi',
  'Diş Hekimi',
  'Diş Teknisyeni',
  'Diyetisyen',
  'Doktor',
  'Ebe',
  'Eczacı',
  'Eğitmen',
  'Emekli',
  'Ekspresyonist',
  'Elektrik Elektronik Mühendisi',
  'Elektrik Teknisyeni',
  'Emlakçı',
  'Endüstri Mühendisi',
  'Endüstriyel Tasarımcı',
  'Ev Hanımı',
  'Felsefe Öğretmeni',
  'Finans Danışmanı',
  'Fizyoterapist',
  'Fotoğrafçı',
  'Garson',
  'Gazeteci',
  'Gıda Mühendisi',
  'Grafik Tasarımcı',
  'Gümrük Müşaviri',
  'Güvenlik Danışmanı',
  'Güvenlik Görevlisi',
  'Hakim',
  'Harita Mühendisi',
  'Havacılık ve Uzay Mühendisliği',
  'Hemşire',
  'Hostes',
  'Hukukçu (Genel)',
  'İç Mimar',
  'İhracat Uzmanı',
  'İletişim Tasarımcısı',
  'İnsan Kaynakları Uzmanı',
  'İnşaat Mühendisi',
  'İnşaat Teknikeri',
  'İşçi',
  'Jeoloji Mühendisi',
  'Kaptan',
  'Kimya Mühendisi',
  'Kuaför/Berber',
  'Lojistik Uzmanı',
  'Maden Mühendisi',
  'Makine Mühendisi',
  'Makine Teknikeri',
  'Mali Müşavir',
  'Matematik Öğretmeni',
  'Metalurji ve Malzeme Mühendisi',
  'Mimar',
  'Mobilya Ustası',
  'Muhasebeci',
  'Muhasebe Uzmanı',
  'Müfettiş',
  'Müteahhit',
  'Müzisyen',
  'Noter',
  'Öğretmen',
  'Pazarlama Uzmanı',
  'Pilot',
  'Polis',
  'Psikiyatrist',
  'Psikolog',
  'Radyoloji Teknikeri',
  'Reklamcı',
  'Sanat Tarihçisi',
  'Sanat Yönetmeni',
  'Sanatçı',
  'Sekreter/Yönetici Asistanı',
  'Serbest Meslek',
  'Serbest Meslek Altın ve Kuyumculuk',
  'Serbest Meslek Çay İmalatı',
  'Serbest Meslek Elektrikli Ev Aletleri',
  'Serbest Meslek İnşaat',
  'Serbest Meslek Konfeksiyon ve Giyim',
  'Serbest Meslek Mobilya İmalatı ve Satış',
  'Serbest Meslek Otomotiv',
  'Serbest Meslek Sigorta Hizmetleri',
  'Serbest Meslek Tesisatçı',
  'Sistem Analisti',
  'Sınıf Öğretmeni',
  'Sosyal Medya Uzmanı',
  'Sosyolog',
  'Spor Antrenörü',
  'Sporcu',
  'Şef (Restoran)',
  'Şoför',
  'Tarih Öğretmeni',
  'Teknisyen',
  'Tercüman',
  'Terzi',
  'Tiyatro Oyuncusu',
  'Turizm Rehberi',
  'Türk Dili ve Edebiyatı Öğretmeni',
  'Uçak Mühendisi',
  'Veri Bilimcisi',
  'Veteriner',
  'Veteriner Hekimi',
  'Web Geliştiricisi',
  'Yazılımcı',
  'Yazılım Mühendisi',
  'Yönetici',
  'Ziraat Mühendisi',
]

export default function HomePage() {
  const [selectedSube, setSelectedSube] = useState<'Rize' | 'Trabzon' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<{ message: string; details?: Array<{ path: string[]; message: string }> } | null>(null)
  const [babaMeslekSearch, setBabaMeslekSearch] = useState('')
  const [anneMeslekSearch, setAnneMeslekSearch] = useState('')
  const [kvkkOnay, setKvkkOnay] = useState(false)
  const [okulSearch, setOkulSearch] = useState('')
  const [selectedSinav, setSelectedSinav] = useState<string>('')

  // Seçilen şubeye göre okul listesi
  const okullar = selectedSube === 'Trabzon' ? trabzonOkullari : rizeOkullari
  
  // Seçilen şubeye göre sınıf listesi (dinamik - Rize için sınav seçimine göre)
  const siniflar = useMemo(() => {
    if (selectedSube === 'Trabzon') {
      return trabzonSiniflar
    }
    
    // Rize için sınav seçimine göre sınıf listesi
    if (selectedSube === 'Rize' && selectedSinav) {
      const burslulukSinavi = "7 Şubat 4,5,6,7,8,9,10,11. sınıflar bursluluk sınavı (ücretsiz)"
      
      if (selectedSinav === burslulukSinavi) {
        // Bursluluk sınavı için 4-11. sınıflar (12. sınıf hariç)
        return rizeSiniflar.filter(sinif => sinif !== '12. Sınıf')
      } else {
        // Diğer sınavlar için sadece 12. sınıf ve mezun
        return ['12. Sınıf', 'Mezun']
      }
    }
    
    // Varsayılan olarak tüm Rize sınıfları
    return rizeSiniflar
  }, [selectedSube, selectedSinav])
  
  // Filtrelenmiş okul listesi (arama ile)
  const filteredOkullar = useMemo(() => {
    if (!okulSearch) return okullar
    return okullar.filter(okul =>
      okul.toLowerCase().includes(okulSearch.toLowerCase())
    )
  }, [okulSearch, okullar])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BasvuruFormData>({
    resolver: zodResolver(basvuruSchema),
  })

  const selectedBabaMeslek = watch('babaMeslek')
  const selectedAnneMeslek = watch('anneMeslek')
  const watchedSinavSecimi = watch('sinavSecimi')
  
  // Sınav seçimi değiştiğinde state'i güncelle
  useEffect(() => {
    if (watchedSinavSecimi !== selectedSinav) {
      setSelectedSinav(watchedSinavSecimi || '')
      // Sınav değiştiğinde sınıf seçimini sıfırla
      if (watchedSinavSecimi) {
        setValue('ogrenciSinifi', '')
      }
    }
  }, [watchedSinavSecimi, selectedSinav, setValue])

  // Filtrelenmiş baba meslek listesi
  const filteredBabaMeslekler = useMemo(() => {
    if (!babaMeslekSearch) return meslekler
    return meslekler.filter(meslek =>
      meslek.toLowerCase().includes(babaMeslekSearch.toLowerCase())
    )
  }, [babaMeslekSearch])

  // Filtrelenmiş anne meslek listesi
  const filteredAnneMeslekler = useMemo(() => {
    if (!anneMeslekSearch) return meslekler
    return meslekler.filter(meslek =>
      meslek.toLowerCase().includes(anneMeslekSearch.toLowerCase())
    )
  }, [anneMeslekSearch])

  const onSubmit = async (data: BasvuruFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Seçilen şubeyi kullan
      const dataWithSube = { ...data, kurumSube: selectedSube! }

      const response = await fetch('/api/basvuru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithSube),
      })

      const result = await response.json()

      if (!response.ok) {
        // API'den gelen hata mesajı ve detayları
        throw {
          message: result.error || 'Başvuru gönderilemedi',
          details: result.details || null
        }
      }

      setSubmitSuccess(true)
      reset()
      setBabaMeslekSearch('')
      setAnneMeslekSearch('')
      setOkulSearch('')
      setKvkkOnay(false)
      setSelectedSinav('')
      // Sayfanın en üstüne scroll yap
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Şube seçimini sıfırlama - kullanıcı butona tıklayınca sıfırlanacak
    } catch (error) {
      // Hata objesi veya Error instance'ı kontrolü
      if (error && typeof error === 'object' && 'message' in error) {
        setSubmitError({
          message: error.message as string,
          details: 'details' in error ? (error.details as Array<{ path: string[]; message: string }>) : undefined
        })
      } else {
        setSubmitError({
          message: error instanceof Error ? error.message : 'Bir hata oluştu'
        })
      }
      
      // 5 saniye sonra hata mesajını kaldır
      setTimeout(() => {
        setSubmitError(null)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Şube seçim ekranı
  if (!selectedSube) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-center">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
                  <Image 
                    src="/logo.png" 
                    alt="Karbon Kurs Plus Logo" 
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700">
                    Karbon Kurs Plus
                  </h2>
                </div>
              </div>
              
              {/* Başvuru Başlığı */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Bursluluk Sınavı Başvuru Sistemi
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Şube Seçim Ekranı */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-lg text-gray-600">
              Lütfen başvuru yapmak istediğiniz şubeyi seçiniz
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Rize Şubesi */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedSube('Rize')}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 sm:border-4 border-transparent hover:border-green-500">
                <div className="text-center">
                  <div className="mx-auto mb-2 sm:mb-4 md:mb-6 h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Karbon Kurs Plus Logo" 
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3 group-hover:text-green-600 transition-colors">
                    Karbon Kurs Plus
                  </h3>
                  <h4 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-green-600 mb-2 sm:mb-3 md:mb-4">
                    RİZE
                  </h4>
                  <p className="text-[10px] sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4 md:mb-6 hidden sm:block">
                    Rize şubemize bursluluk sınavı başvurusu yapmak için tıklayın
                  </p>
                  <div className="inline-flex items-center text-green-600 font-semibold text-xs sm:text-sm md:text-base group-hover:gap-3 gap-1 sm:gap-2 transition-all">
                    <span>Başvuru</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trabzon Şubesi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedSube('Trabzon')}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 sm:border-4 border-transparent hover:border-blue-500">
                <div className="text-center">
                  <div className="mx-auto mb-2 sm:mb-4 md:mb-6 h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Karbon Kurs Plus Logo" 
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                    Karbon Kurs Plus
                  </h3>
                  <h4 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-600 mb-2 sm:mb-3 md:mb-4">
                    TRABZON
                  </h4>
                  <p className="text-[10px] sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4 md:mb-6 hidden sm:block">
                    Trabzon şubemize bursluluk sınavı başvurusu yapmak için tıklayın
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold text-xs sm:text-sm md:text-base group-hover:gap-3 gap-1 sm:gap-2 transition-all">
                    <span>Başvuru</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bilgilendirme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Önemli Bilgilendirme</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Başvurunuzu yapmak istediğiniz şubeyi dikkatle seçiniz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Her şube için ayrı başvuru yapmanız gerekmektedir</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
                      <span>Başvuru formunu eksiksiz doldurunuz</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm py-8">
          <p>© 2025 Karbon Kurs Plus Başvuru Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    )
  }

  // Başvuru Formu (Şube seçildikten sonra)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Geri Butonu */}
              <button
                onClick={() => setSelectedSube(null)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Şube Seçimi</span>
              </button>
            </div>
            
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Karbon Kurs Plus Logo" 
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                    Karbon Kurs Plus
                </h2>
                  <p className={`text-lg font-semibold ${selectedSube === 'Rize' ? 'text-green-600' : 'text-blue-600'}`}>
                    {selectedSube} Şubesi
                  </p>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block h-16 w-px bg-gray-300"></div>
            
            {/* Başvuru Başlığı */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Bursluluk Sınavı Başvuru Formu
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                  2026 - 2027 Yılı Bursluluk Sınavı
              </p>
            </div>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Success Modal */}
        {submitSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Başvurunuz Başarıyla Alındı!</h3>
              <p className="text-gray-600 mb-4">
                Başvurunuz sisteme kaydedilmiştir. En kısa sürede sizinle iletişime geçilecektir.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Başvuru numaranız kayıt altına alınmıştır.
                </p>
                <p className="text-sm text-green-700 mt-2">
                  E-posta adresinize bilgilendirme mesajı gönderilecektir.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitSuccess(false)
                  setSelectedSube(null) // Şube seçimine dön
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Yeni Başvuru Yap
              </button>
            </motion.div>
        </div>
        )}

        {/* Error Modal */}
        {submitError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Başarısız!</h3>
                <p className="text-red-600 font-semibold mb-4">
                  {submitError.message}
                </p>
              </div>
              
              {/* Hata Detayları */}
              {submitError.details && submitError.details.length > 0 && (
                <div className="mb-6 text-left">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Hata Detayları:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <ul className="space-y-2">
                      {submitError.details.map((detail, index) => {
                        const fieldName = detail.path.join('.')
                        // Türkçe alan isimleri
                        const fieldNames: { [key: string]: string } = {
                          'ogrenciAdSoyad': 'Öğrenci Ad Soyad',
                          'ogrenciTc': 'TC Kimlik No',
                          'okul': 'Okul',
                          'ogrenciSinifi': 'Sınıf',
                          'ogrenciSube': 'Sınıf Şubesi',
                          'sinavGunu': 'Sınav Günü',
                          'babaAdSoyad': 'Baba Ad Soyad',
                          'babaMeslek': 'Baba Meslek',
                          'babaIsAdresi': 'Baba İş Adresi',
                          'babaCepTel': 'Baba Cep Telefonu',
                          'anneAdSoyad': 'Anne Ad Soyad',
                          'anneMeslek': 'Anne Meslek',
                          'anneIsAdresi': 'Anne İş Adresi',
                          'anneCepTel': 'Anne Cep Telefonu',
                          'email': 'E-posta',
                        }
                        const displayName = fieldNames[fieldName] || fieldName
                        return (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-sm text-gray-700">
                              <span className="font-semibold">{displayName}:</span> {detail.message}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setSubmitError(null)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition duration-200"
              >
                Tamam
              </button>
            </motion.div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Öğrenci Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Öğrenci Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğrenci Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ogrenciAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('ogrenciAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                  {errors.ogrenciAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TC Kimlik No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ogrenciTc')}
                    maxLength={11}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="12345678901"
                  />
                  {errors.ogrenciTc && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciTc.message}</p>
                  )}
                </div>

                {/* Rize için Sınav Seçimi */}
                {selectedSube === 'Rize' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Katılmak İstediğiniz Sınav <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('sinavSecimi')}
                      onChange={(e) => {
                        setValue('sinavSecimi', e.target.value)
                        setSelectedSinav(e.target.value)
                        // Sınav değiştiğinde sınıf seçimini sıfırla
                        setValue('ogrenciSinifi', '')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Önce sınav seçiniz</option>
                      {rizeSinavSecenekleri.map((sinav) => (
                        <option key={sinav} value={sinav}>
                          {sinav}
                        </option>
                      ))}
                    </select>
                    {errors.sinavSecimi && (
                      <p className="mt-1 text-sm text-red-600">{errors.sinavSecimi.message}</p>
                    )}
                    {selectedSinav && (
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedSinav === "7 Şubat 4,5,6,7,8,9,10,11. sınıflar bursluluk sınavı (ücretsiz)" 
                          ? "✓ Bu sınav için 4-11. sınıflar arasından seçim yapabilirsiniz."
                          : "✓ Bu sınav için sadece 12. sınıf veya mezun seçebilirsiniz."}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sınıf <span className="text-red-500">*</span>
                    {selectedSube === 'Rize' && !selectedSinav && (
                      <span className="ml-2 text-xs text-orange-600">(Önce sınav seçiniz)</span>
                    )}
                  </label>
                  <select
                    {...register('ogrenciSinifi')}
                    disabled={selectedSube === 'Rize' && !selectedSinav}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                      selectedSube === 'Rize' && !selectedSinav ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {selectedSube === 'Rize' && !selectedSinav 
                        ? 'Önce sınav seçiniz' 
                        : 'Seçiniz'}
                    </option>
                    {siniflar.map((sinif) => (
                      <option key={sinif} value={sinif}>
                        {sinif}
                      </option>
                    ))}
                  </select>
                  {errors.ogrenciSinifi && (
                    <p className="mt-1 text-sm text-red-600">{errors.ogrenciSinifi.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Okul <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {/* Okul Arama Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={okulSearch}
                        onChange={(e) => setOkulSearch(e.target.value)}
                        placeholder="Okul adı yazarak arayın..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {okulSearch && (
                        <button
                          type="button"
                          onClick={() => setOkulSearch('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                  )}
                </div>

                    {/* Okul Seçim Dropdown */}
                  <div className="relative">
                    <select
                      {...register('okul')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    >
                        <option value="">
                          {filteredOkullar.length === 0 && okulSearch 
                            ? 'Arama sonucu bulunamadı...' 
                            : 'Seçiniz'}
                        </option>
                        {filteredOkullar.map((okul) => (
                        <option key={okul} value={okul}>
                          {okul}
                        </option>
                      ))}
                    </select>
                      {okulSearch && filteredOkullar.length > 0 && (
                        <p className="mt-1 text-sm text-green-600">
                          ✓ {filteredOkullar.length} okul bulundu
                        </p>
                      )}
                    </div>
                  </div>
                  {errors.okul && (
                    <p className="mt-1 text-sm text-red-600">{errors.okul.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Baba Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Baba Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baba Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('babaAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('babaAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Mehmet Yılmaz"
                  />
                  {errors.babaAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meslek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Meslek adı yazarak arayın..."
                      value={babaMeslekSearch}
                      onChange={(e) => setBabaMeslekSearch(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 mb-2"
                    />
                    <select
                      {...register('babaMeslek')}
                      value={selectedBabaMeslek || ''}
                      onChange={(e) => {
                        setValue('babaMeslek', e.target.value)
                        setBabaMeslekSearch('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      size={babaMeslekSearch ? Math.min(filteredBabaMeslekler.length + 1, 8) : 1}
                    >
                      <option value="">Seçiniz</option>
                      {filteredBabaMeslekler.map((meslek) => (
                        <option key={`baba-${meslek}`} value={meslek}>
                          {meslek}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedBabaMeslek && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✓ Seçilen: {selectedBabaMeslek}
                    </p>
                  )}
                  {errors.babaMeslek && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaMeslek.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cep Telefonu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('babaCepTel')}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => {
                      // Sadece rakamları al
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('babaCepTel', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="5XXXXXXXXX (10 hane)"
                  />
                  {errors.babaCepTel && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaCepTel.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Adresi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('babaIsAdresi')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="İş adresi bilgisi"
                  />
                  {errors.babaIsAdresi && (
                    <p className="mt-1 text-sm text-red-600">{errors.babaIsAdresi.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Anne Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                Anne Bilgileri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anne Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('anneAdSoyad')}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      setValue('anneAdSoyad', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Örn: Ayşe Yılmaz"
                  />
                  {errors.anneAdSoyad && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneAdSoyad.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meslek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Meslek adı yazarak arayın..."
                      value={anneMeslekSearch}
                      onChange={(e) => setAnneMeslekSearch(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 mb-2"
                    />
                    <select
                      {...register('anneMeslek')}
                      value={selectedAnneMeslek || ''}
                      onChange={(e) => {
                        setValue('anneMeslek', e.target.value)
                        setAnneMeslekSearch('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      size={anneMeslekSearch ? Math.min(filteredAnneMeslekler.length + 1, 8) : 1}
                    >
                      <option value="">Seçiniz</option>
                      {filteredAnneMeslekler.map((meslek) => (
                        <option key={`anne-${meslek}`} value={meslek}>
                          {meslek}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedAnneMeslek && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✓ Seçilen: {selectedAnneMeslek}
                    </p>
                  )}
                  {errors.anneMeslek && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneMeslek.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cep Telefonu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('anneCepTel')}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => {
                      // Sadece rakamları al
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setValue('anneCepTel', value)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="5XXXXXXXXX (10 hane)"
                  />
                  {errors.anneCepTel && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneCepTel.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İş Adresi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('anneIsAdresi')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="İş adresi bilgisi"
                  />
                  {errors.anneIsAdresi && (
                    <p className="mt-1 text-sm text-red-600">{errors.anneIsAdresi.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* İletişim Bilgileri */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-500">
                İletişim Bilgileri
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* KVKK Onay */}
            <div className="pt-6 pb-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="kvkkOnay"
                  checked={kvkkOnay}
                  onChange={(e) => setKvkkOnay(e.target.checked)}
                  className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="kvkkOnay" className="flex-1 text-sm text-gray-700 cursor-pointer">
                  <span className="text-red-500 font-semibold">*</span>{' '}
                  <Link 
                    href="/kvkk" 
                    target="_blank"
                    className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                  >
                    Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
                  </Link>
                  {' '}ni okudum, anladım ve kişisel verilerimin işlenmesine onay veriyorum.
                </label>
              </div>
              {!kvkkOnay && (
                <p className="mt-2 text-sm text-red-600">
                  Başvuruyu göndermek için KVKK aydınlatma metnini okumanız ve onaylamanız gerekmektedir.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !kvkkOnay}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Başvurunuz Gönderiliyor...
                  </span>
                ) : (
                  'Başvuruyu Gönder'
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              <span className="text-red-500">*</span> ile işaretli alanlar zorunludur.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 Karbon Kurs Plus Başvuru Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </main>
    </div>
  )
}
