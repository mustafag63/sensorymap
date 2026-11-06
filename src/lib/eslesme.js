// Filtre motoru (SPEC §4). Saf fonksiyonlar: aynı girdi → aynı çıktı, yan etki yok.
// Kural: yalnızca DOĞRULANMIŞ değerler bir filtreyi sağlar ya da sağlamaz;
// teyitsiz veya eksik değer her zaman "eksik" sayılır ve asla "Uygun Eşleşme" vermez.
import { FILTRELER, filtreBul } from '../data/kriterler.js'

/**
 * Tek bir nesnenin (giriş ya da mekân) koşullarını VEYA ile değerlendirir.
 * @returns {{ sonuc: 'saglar'|'saglamaz'|'eksik', durum?: 'teyitsiz'|'veri_yok' }}
 */
function nesneSonucu(kosullar, oku) {
  let hepsiSaglamaz = true
  let teyitsizVar = false
  for (const { alan, degerler } of kosullar) {
    const a = oku(alan)
    const durum = a?.durum ?? 'veri_yok'
    if (durum === 'dogrulanmis') {
      if (degerler.includes(a.deger)) return { sonuc: 'saglar' }
    } else {
      hepsiSaglamaz = false
      if (durum === 'teyitsiz') teyitsizVar = true
    }
  }
  return hepsiSaglamaz ? { sonuc: 'saglamaz' } : { sonuc: 'eksik', durum: teyitsizVar ? 'teyitsiz' : 'veri_yok' }
}

// 'kat' mekanlar tablosunun sütunudur; ekip girdiği için doğrulanmış sayılır.
function mekanOkuyucu(mekan, dizin) {
  return (alan) => (alan === 'kat' ? { deger: mekan.kat, durum: 'dogrulanmis' } : dizin.alan('mekan', mekan.id, alan))
}

/** Bir filtrenin bir mekân için sonucu. Giriş filtreleri binanın girişlerinden en az birini arar. */
export function filtreSonucu(filtre, mekan, dizin) {
  if (filtre.seviye === 'mekan') return nesneSonucu(filtre.kosullar, mekanOkuyucu(mekan, dizin))

  const girisler = dizin.girisleri(mekan.bina_id)
  if (girisler.length === 0) return { sonuc: 'eksik', durum: 'veri_yok' }
  const sonuclar = girisler.map((g) => nesneSonucu(filtre.kosullar, (alan) => dizin.alan('giris', g.id, alan)))
  if (sonuclar.some((s) => s.sonuc === 'saglar')) return { sonuc: 'saglar' }
  if (sonuclar.every((s) => s.sonuc === 'saglamaz')) return { sonuc: 'saglamaz' }
  return { sonuc: 'eksik', durum: sonuclar.some((s) => s.durum === 'teyitsiz') ? 'teyitsiz' : 'veri_yok' }
}

/**
 * Seçilen filtreler VE ile birleşir.
 * @returns {{ sonuc: 'uygun'|'eksik'|'uygun_degil'|null, detay: Array<{filtre, sonuc, durum?}> }}
 * Filtre seçilmemişse sonuc null'dır.
 */
export function mekanEslesmesi(mekan, filtreAnahtarlari, dizin) {
  const detay = filtreAnahtarlari
    .map(filtreBul)
    .filter(Boolean)
    .map((filtre) => ({ filtre, ...filtreSonucu(filtre, mekan, dizin) }))
  if (detay.length === 0) return { sonuc: null, detay }
  if (detay.some((d) => d.sonuc === 'saglamaz')) return { sonuc: 'uygun_degil', detay }
  if (detay.some((d) => d.sonuc === 'eksik')) return { sonuc: 'eksik', detay }
  return { sonuc: 'uygun', detay }
}

export function sonuclariGrupla(mekanlar, filtreAnahtarlari, dizin) {
  const gruplar = { uygun: [], eksik: [], uygun_degil: [] }
  for (const mekan of mekanlar) {
    const e = mekanEslesmesi(mekan, filtreAnahtarlari, dizin)
    if (e.sonuc) gruplar[e.sonuc].push({ mekan, ...e })
  }
  return gruplar
}

/** URL'deki `f` parametresini geçerli, tekrarsız filtre anahtarlarına çevirir (FILTRELER sırasıyla). */
export function filtreleriCoz(param) {
  const secilen = new Set((param ?? '').split(','))
  return FILTRELER.map((f) => f.anahtar).filter((a) => secilen.has(a))
}
