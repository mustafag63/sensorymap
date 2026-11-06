// Kriter tanımlarının TEK kaynağı (SPEC §2, §4).
// Arayüz, filtre motoru ve formlar buradan okur. Bir kriter değişirse bu dosya
// ve supabase/migrations içindeki gecerli_kriter() fonksiyonu birlikte güncellenir
// (src/lib/kriterler.test.js ikisinin uyumunu denetler).
// TODO(Nergis Zeynep, Sena Nur): Liste temsilidir; kesin kriterler ve eşikler onaylanınca güncellenecek.

const s = (deger, etiket) => ({ deger, etiket })

export const MEKAN_TURLERI = [
  s('kutuphane', 'Kütüphane'),
  s('yemekhane', 'Yemekhane'),
  s('calisma_salonu', 'Çalışma salonu'),
  s('kafe', 'Kafe'),
  s('diger', 'Diğer'),
]

const GURULTU = [s('sessiz', 'Sessiz'), s('orta', 'Orta'), s('gurultulu', 'Gürültülü')]
const VAR_YOK = [s('var', 'Var'), s('yok', 'Yok')]

// nesne: 'giris' | 'mekan'; grup: 'fiziksel' | 'duyusal'; tip: 'secim' | 'sayi' | 'metin'
export const KRITERLER = [
  // §2.1 Giriş kriterleri (fiziksel)
  {
    anahtar: 'giris_turu', nesne: 'giris', grup: 'fiziksel', etiket: 'Giriş türü', tip: 'secim',
    secenekler: [s('ana', 'Ana giriş'), s('yan', 'Yan giriş'), s('acil_cikis', 'Acil çıkış')],
  },
  {
    anahtar: 'basamaksiz', nesne: 'giris', grup: 'fiziksel', etiket: 'Basamaksız giriş', tip: 'secim',
    secenekler: VAR_YOK,
    kararKurali: 'Eşik yok veya en fazla 1,3 cm ve kapıya kadar basamak yok.',
  },
  {
    anahtar: 'rampa', nesne: 'giris', grup: 'fiziksel', etiket: 'Rampa', tip: 'secim',
    secenekler: [s('uygun', 'Uygun'), s('var_ama_dik', 'Var ama dik'), s('yok', 'Yok'), s('gerek_yok', 'Gerek yok')],
    kararKurali: 'Uygun: eğim sınırın altında (15 cm’e kadar %8; daha yüksekte %7–%5) ve net genişlik en az 100 cm.',
  },
  {
    anahtar: 'kapi_genisligi_cm', nesne: 'giris', grup: 'fiziksel', etiket: 'Kapı net genişliği', tip: 'sayi',
    birim: 'cm', uyariAlti: 90,
  },
  {
    anahtar: 'kapi_tipi', nesne: 'giris', grup: 'fiziksel', etiket: 'Kapı tipi', tip: 'secim',
    secenekler: [s('otomatik', 'Otomatik'), s('el_ile_hafif', 'El ile, hafif'), s('el_ile_agir', 'El ile, ağır'), s('doner', 'Döner kapı')],
  },
  { anahtar: 'acik_saatler', nesne: 'giris', grup: 'fiziksel', etiket: 'Açık olduğu saatler', tip: 'metin' },

  // §2.2 Mekân kriterleri, fiziksel (kat, mekanlar tablosunda ayrı sütundur)
  {
    anahtar: 'asansor', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör', tip: 'secim',
    secenekler: [s('var_calisiyor', 'Var, çalışıyor'), s('var_calismiyor', 'Var, çalışmıyor'), s('yok', 'Yok'), s('gerek_yok', 'Gerek yok (giriş katı)')],
  },
  { anahtar: 'ic_kapi_cm', nesne: 'mekan', grup: 'fiziksel', etiket: 'Mekân kapısı net genişliği', tip: 'sayi', birim: 'cm', uyariAlti: 90 },
  { anahtar: 'erisilebilir_wc', nesne: 'mekan', grup: 'fiziksel', etiket: 'Erişilebilir tuvalet (aynı katta)', tip: 'secim', secenekler: VAR_YOK },

  // §2.3 Mekân kriterleri, duyusal
  { anahtar: 'gurultu_yogun', nesne: 'mekan', grup: 'duyusal', etiket: 'Gürültü (yoğun saat)', tip: 'secim', secenekler: GURULTU, olcumZamani: true },
  { anahtar: 'gurultu_sakin', nesne: 'mekan', grup: 'duyusal', etiket: 'Gürültü (sakin saat)', tip: 'secim', secenekler: GURULTU, olcumZamani: true },
  {
    anahtar: 'isik', nesne: 'mekan', grup: 'duyusal', etiket: 'Işık türü', tip: 'secim',
    secenekler: [s('dogal', 'Doğal'), s('led', 'LED'), s('floresan', 'Floresan'), s('los', 'Loş')],
  },
  {
    anahtar: 'oturma', nesne: 'mekan', grup: 'duyusal', etiket: 'Oturma yoğunluğu', tip: 'secim',
    secenekler: [s('seyrek', 'Seyrek'), s('orta', 'Orta'), s('sik', 'Sık')],
  },
  { anahtar: 'sessiz_alan', nesne: 'mekan', grup: 'duyusal', etiket: 'Ayrı sessiz köşe/oda', tip: 'secim', secenekler: VAR_YOK },
  {
    anahtar: 'muzik', nesne: 'mekan', grup: 'duyusal', etiket: 'Arka plan müziği', tip: 'secim',
    secenekler: [s('yok', 'Yok'), s('dusuk', 'Düşük'), s('yuksek', 'Yüksek')],
  },
]

// §4 Filtreler. Her filtrenin koşulları VEYA ile bağlanır; seçilen filtreler VE ile.
// seviye 'giris': mekânın binasındaki girişlerden en az biri sağlamalı.
// 'kat' koşulu mekanlar tablosundaki kat sütunundan okunur (ekip verisi, doğrulanmış sayılır).
export const FILTRELER = [
  { anahtar: 'basamaksiz', etiket: 'Basamaksız giriş', seviye: 'giris', kosullar: [{ alan: 'basamaksiz', degerler: ['var'] }] },
  {
    anahtar: 'rampa', etiket: 'Rampa var', seviye: 'giris',
    kosullar: [{ alan: 'rampa', degerler: ['uygun'] }, { alan: 'basamaksiz', degerler: ['var'] }],
  },
  {
    anahtar: 'asansor', etiket: 'Asansörle ulaşılabilir', seviye: 'mekan',
    kosullar: [{ alan: 'kat', degerler: [0] }, { alan: 'asansor', degerler: ['var_calisiyor'] }],
  },
  { anahtar: 'sessiz', etiket: 'Sessiz', seviye: 'mekan', kosullar: [{ alan: 'gurultu_yogun', degerler: ['sessiz'] }] },
  { anahtar: 'orta_gurultu', etiket: 'Orta gürültü', seviye: 'mekan', kosullar: [{ alan: 'gurultu_yogun', degerler: ['sessiz', 'orta'] }] },
  { anahtar: 'dogal_isik', etiket: 'Doğal ışık', seviye: 'mekan', kosullar: [{ alan: 'isik', degerler: ['dogal'] }] },
  { anahtar: 'seyrek_oturma', etiket: 'Seyrek oturma', seviye: 'mekan', kosullar: [{ alan: 'oturma', degerler: ['seyrek'] }] },
]

export function kriterBul(anahtar) {
  return KRITERLER.find((k) => k.anahtar === anahtar)
}

export function nesneKriterleri(nesne, grup) {
  return KRITERLER.filter((k) => k.nesne === nesne && (!grup || k.grup === grup))
}

export function filtreBul(anahtar) {
  return FILTRELER.find((f) => f.anahtar === anahtar)
}

export function mekanTuruEtiketi(tur) {
  return MEKAN_TURLERI.find((t) => t.deger === tur)?.etiket ?? tur
}

// Değerin okunabilir metni: seçenek etiketi, birimli sayı ya da serbest metin.
export function degerMetni(anahtar, deger) {
  if (deger == null || deger === '') return null
  const kriter = kriterBul(anahtar)
  if (!kriter) return String(deger)
  if (kriter.tip === 'secim') return kriter.secenekler.find((x) => x.deger === deger)?.etiket ?? String(deger)
  if (kriter.tip === 'sayi') return `${deger} ${kriter.birim ?? ''}`.trim()
  return String(deger)
}

// supabase/migrations içindeki gecerli_kriter() ile aynı kurallar.
export function gecerliDeger(nesne, anahtar, deger) {
  const kriter = kriterBul(anahtar)
  if (!kriter || kriter.nesne !== nesne || typeof deger !== 'string') return false
  if (kriter.tip === 'secim') return kriter.secenekler.some((x) => x.deger === deger)
  if (kriter.tip === 'sayi') return /^[0-9]{1,3}$/.test(deger)
  return deger.trim().length >= 1 && deger.length <= 200
}
