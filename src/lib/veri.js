// Veri katmanı: arayüz yalnızca bu dosyayı kullanır, kaynağı bilmez.
// VITE_SUPABASE_URL tanımlıysa Supabase, değilse bellekteki örnek veri kullanılır.

export const ornekVeriModu = !import.meta.env.VITE_SUPABASE_URL

let kaynakSozu
function kaynak() {
  kaynakSozu ??= ornekVeriModu ? import('./kaynak/ornek.js') : import('./kaynak/supabase.js')
  return kaynakSozu
}

const ilet = (ad) => async (...args) => (await kaynak())[ad](...args)

// Herkese açık
/** @returns {Promise<{binalar, girisler, mekanlar, alanlar, bekleyenBildirimler}>} */
export const verileriGetir = ilet('verileriGetir')
export const bildirimGonder = ilet('bildirimGonder') // ({ nesne_turu, nesne_id, alan_adi, deger })
export const teyitEt = ilet('teyitEt') // (bildirimId)
export const hataBildir = ilet('hataBildir') // ({ nesne_turu, nesne_id, aciklama })

// Ekip paneli
export const ekipOturumu = ilet('ekipOturumu') // → { girisYapildi, ekip, eposta }
export const ekipGirisi = ilet('ekipGirisi') // (eposta, sifre)
export const ekipCikisi = ilet('ekipCikisi')
export const kayitKaydet = ilet('kayitKaydet') // (tablo: 'binalar'|'girisler'|'mekanlar', kayit) → kayıt
export const alanKaydet = ilet('alanKaydet') // ({ nesne_turu, nesne_id, alan_adi, deger, yerinde, olcum_zamani, olcum_cihazi })
export const hataBildirimleriGetir = ilet('hataBildirimleriGetir')
export const hataCozuldu = ilet('hataCozuldu') // (id)
