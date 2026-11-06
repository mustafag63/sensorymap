// Örnek veri kaynağı: Supabase bağlanana kadar her şey bellekte tutulur.
// Kurallar supabase/migrations/*_durum_fonksiyonlari.sql ile aynıdır.
import { ornekVeri } from '../../data/ornekVeri.js'
import { gecerliDeger } from '../../data/kriterler.js'
import { METIN } from '../../sabitler.js'

const db = structuredClone(ornekVeri)
const sonId = Object.fromEntries(Object.entries(db).map(([t, satirlar]) => [t, Math.max(0, ...satirlar.map((s) => s.id))]))
const yeniId = (tablo) => ++sonId[tablo]
const simdi = () => new Date().toISOString()
const kopya = (x) => structuredClone(x)
const hata = (anahtar) => new Error(METIN.hatalar[anahtar])

const KIMLIK_ANAHTARI = 'sensorymap.anonimKimlik'
let bellekteKimlik = null

function uuid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// Tarayıcıya özel anonim kimlik; depolama kapalıysa (gizli pencere vb.) yalnızca bellekte.
function anonimKimlik() {
  try {
    let id = localStorage.getItem(KIMLIK_ANAHTARI)
    if (!id) {
      id = uuid()
      localStorage.setItem(KIMLIK_ANAHTARI, id)
    }
    return id
  } catch {
    bellekteKimlik ??= uuid()
    return bellekteKimlik
  }
}

function nesneVar(nesne_turu, nesne_id) {
  const tablo = nesne_turu === 'giris' ? db.girisler : nesne_turu === 'mekan' ? db.mekanlar : null
  return !!tablo?.some((x) => x.id === nesne_id)
}

function alanBul(nesne_turu, nesne_id, alan_adi) {
  return db.alanlar.find((a) => a.nesne_turu === nesne_turu && a.nesne_id === nesne_id && a.alan_adi === alan_adi)
}

function alanYaz(nesne_turu, nesne_id, alan_adi, degisiklik) {
  let alan = alanBul(nesne_turu, nesne_id, alan_adi)
  if (!alan) {
    alan = { id: yeniId('alanlar'), nesne_turu, nesne_id, alan_adi, deger: null, durum: 'veri_yok', kaynak: null, olcum_zamani: null }
    db.alanlar.push(alan)
  }
  Object.assign(alan, degisiklik, { guncelleme: simdi() })
}

const gurultuMu = (alan_adi) => alan_adi.startsWith('gurultu_')

export async function verileriGetir() {
  const benim = anonimKimlik()
  const bekleyenBildirimler = db.bildirimler
    .filter((b) => b.durum === 'bekliyor')
    .sort((x, y) => y.tarih.localeCompare(x.tarih))
    .map(({ anonim_id, ...b }) => {
      const teyitler = db.teyitler.filter((t) => t.bildirim_id === b.id)
      return {
        ...b,
        teyit_sayisi: teyitler.length,
        kendi: anonim_id === benim,
        teyit_ettim: teyitler.some((t) => t.anonim_id === benim),
      }
    })
  return {
    binalar: kopya(db.binalar),
    girisler: kopya(db.girisler),
    mekanlar: kopya(db.mekanlar),
    alanlar: kopya(db.alanlar),
    bekleyenBildirimler: kopya(bekleyenBildirimler),
  }
}

export async function bildirimGonder({ nesne_turu, nesne_id, alan_adi, deger }) {
  if (!gecerliDeger(nesne_turu, alan_adi, deger)) throw hata('gecersizDeger')
  if (!nesneVar(nesne_turu, nesne_id)) throw hata('kayitYok')
  const bildirim = { id: yeniId('bildirimler'), nesne_turu, nesne_id, alan_adi, deger, anonim_id: anonimKimlik(), tarih: simdi(), durum: 'bekliyor' }
  db.bildirimler.push(bildirim)

  const mevcut = alanBul(nesne_turu, nesne_id, alan_adi)
  if (!mevcut || mevcut.durum !== 'dogrulanmis') {
    alanYaz(nesne_turu, nesne_id, alan_adi, {
      deger, durum: 'teyitsiz', kaynak: 'kullanici', olcum_zamani: gurultuMu(alan_adi) ? bildirim.tarih : null,
    })
  } else if (mevcut.deger === deger) {
    bildirim.durum = 'dogrulandi'
  }
  // Doğrulanmış ve farklı: alan değişmez (itiraz).
}

export async function teyitEt(bildirimId) {
  const benim = anonimKimlik()
  const b = db.bildirimler.find((x) => x.id === bildirimId)
  if (!b) throw hata('kayitYok')
  if (b.anonim_id === benim) throw hata('kendiTeyit')
  if (db.teyitler.some((t) => t.bildirim_id === b.id && t.anonim_id === benim)) throw hata('ikinciTeyit')
  if (b.durum !== 'bekliyor') throw hata('sonuclanmis')
  db.teyitler.push({ id: yeniId('teyitler'), bildirim_id: b.id, anonim_id: benim, tarih: simdi() })

  if (db.teyitler.filter((t) => t.bildirim_id === b.id).length >= 2) {
    b.durum = 'dogrulandi'
    alanYaz(b.nesne_turu, b.nesne_id, b.alan_adi, {
      deger: b.deger, durum: 'dogrulanmis', kaynak: 'kullanici', olcum_zamani: gurultuMu(b.alan_adi) ? b.tarih : null,
    })
  }
}

export async function hataBildir({ nesne_turu, nesne_id, aciklama }) {
  const metin = (aciklama ?? '').trim()
  if (metin.length < 1 || metin.length > 1000) throw hata('aciklamaUzunlugu')
  if (!nesneVar(nesne_turu, nesne_id)) throw hata('kayitYok')
  db.hata_bildirimleri.push({ id: yeniId('hata_bildirimleri'), nesne_turu, nesne_id, aciklama: metin, tarih: simdi(), cozuldu: false })
}

// ---- Ekip paneli: örnek modda giriş gerekmez ----

export async function ekipOturumu() {
  return { girisYapildi: true, ekip: true, eposta: null }
}

export async function ekipGirisi() {}
export async function ekipCikisi() {}

export async function kayitKaydet(tablo, kayit) {
  if (!['binalar', 'girisler', 'mekanlar'].includes(tablo)) throw hata('yetki')
  if (kayit.id) {
    const mevcut = db[tablo].find((x) => x.id === kayit.id)
    if (!mevcut) throw hata('kayitYok')
    Object.assign(mevcut, kayit)
    return kopya(mevcut)
  }
  const yeni = { ...kayit, id: yeniId(tablo), olusturma: simdi() }
  db[tablo].push(yeni)
  return kopya(yeni)
}

export async function alanKaydet({ nesne_turu, nesne_id, alan_adi, deger, yerinde, olcum_zamani }) {
  const bos = deger == null || deger === ''
  if (!bos && !gecerliDeger(nesne_turu, alan_adi, deger)) throw hata('gecersizDeger')
  alanYaz(nesne_turu, nesne_id, alan_adi, {
    deger: bos ? null : deger,
    durum: bos ? 'veri_yok' : yerinde ? 'dogrulanmis' : 'teyitsiz',
    kaynak: bos ? null : 'ekip',
    olcum_zamani: bos ? null : (olcum_zamani ?? null),
  })
}

export async function hataBildirimleriGetir() {
  return kopya([...db.hata_bildirimleri].sort((x, y) => y.tarih.localeCompare(x.tarih)))
}

export async function hataCozuldu(id) {
  const h = db.hata_bildirimleri.find((x) => x.id === id)
  if (!h) throw hata('kayitYok')
  h.cozuldu = true
}
