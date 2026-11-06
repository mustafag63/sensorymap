// Kriter tanımlarının TEK kaynağı (SPEC §2, §4). Nergis Zeynep'in kesin listesine göre.
// Arayüz, filtre motoru ve formlar buradan okur. Bir kriter değişirse bu dosya
// ve supabase/migrations içindeki gecerli_kriter() fonksiyonu birlikte güncellenir
// (src/lib/kriterler.test.js ikisinin uyumunu denetler).
// TODO(Sena Nur): Eşikler onaylanınca `uygun` sınırları güncellenecek.

const s = (deger, etiket) => ({ deger, etiket })

export const MEKAN_TURLERI = [
  s('kutuphane', 'Kütüphane'),
  s('yemekhane', 'Yemekhane'),
  s('calisma_salonu', 'Çalışma salonu'),
  s('kafe', 'Kafe'),
  s('diger', 'Diğer'),
]

// Gürültü değerinin hangi cihazla ölçüldüğü (alanlar.olcum_cihazi).
export const OLCUM_CIHAZLARI = [s('ses_modulu', 'Telefon (ses modülü)'), s('spl_metre', 'SPL metre')]

const GURULTU = [s('sessiz', 'Sessiz'), s('orta', 'Orta'), s('gurultulu', 'Gürültülü')]
const VAR_YOK = [s('var', 'Var'), s('yok', 'Yok')]
const RAMPA_VARSA = { alan: 'rampa_var', degerler: ['var'] }
const ASANSOR_VARSA = { alan: 'asansor_var', degerler: ['var'] }

// nesne: 'giris' | 'mekan'; grup: 'fiziksel' | 'duyusal'; tip: 'secim' | 'sayi' | 'metin'
// uygun: { enAz } ya da { enFazla } → kartta sınır dışı değere uyarı.
// bagli: üst alan bu değerlerden biri değilse (ör. rampa yok) kartta gizlenir.
export const KRITERLER = [
  // §2.1 Giriş kriterleri (fiziksel)
  {
    anahtar: 'giris_turu', nesne: 'giris', grup: 'fiziksel', etiket: 'Giriş türü', tip: 'secim',
    secenekler: [s('ana', 'Ana giriş'), s('yan', 'Yan giriş'), s('erisilebilir_alternatif', 'Erişilebilir alternatif giriş')],
  },
  {
    anahtar: 'basamaksiz', nesne: 'giris', grup: 'fiziksel', etiket: 'Basamaksız giriş', tip: 'secim', secenekler: VAR_YOK,
    kararKurali: 'Kapıya kadar basamak yok ve eşik en fazla 1,3 cm.',
  },
  { anahtar: 'esik_cm', nesne: 'giris', grup: 'fiziksel', etiket: 'Eşik yüksekliği', tip: 'sayi', birim: 'cm', uygun: { enFazla: 1.3 } },
  { anahtar: 'kapi_genisligi_cm', nesne: 'giris', grup: 'fiziksel', etiket: 'Kapı net genişliği', tip: 'sayi', birim: 'cm', uygun: { enAz: 90 } },
  { anahtar: 'kapi_tipi', nesne: 'giris', grup: 'fiziksel', etiket: 'Kapı tipi', tip: 'secim', secenekler: [s('otomatik', 'Otomatik'), s('elle', 'Elle açılan')] },
  { anahtar: 'kapi_acilma', nesne: 'giris', grup: 'fiziksel', etiket: 'Kapının açılması', tip: 'secim', secenekler: [s('kolay', 'Kolay'), s('agir', 'Ağır')] },
  { anahtar: 'acik_saatler', nesne: 'giris', grup: 'fiziksel', etiket: 'Açık olduğu saatler', tip: 'metin' },
  {
    anahtar: 'rampa_var', nesne: 'giris', grup: 'fiziksel', etiket: 'Rampa', tip: 'secim',
    secenekler: [s('var', 'Var'), s('yok', 'Yok'), s('gerek_yok', 'Gerek yok (basamak yok)')],
  },
  {
    anahtar: 'rampa_durumu', nesne: 'giris', grup: 'fiziksel', etiket: 'Rampanın durumu', tip: 'secim', bagli: RAMPA_VARSA,
    secenekler: [s('uygun', 'Uygun'), s('cok_dik', 'Çok dik'), s('onu_kapali', 'Önü kapalı')],
    kararKurali: 'Uygun: eğim sınırın altında, genişlik en az 100 cm ve rampanın önü açık.',
  },
  {
    anahtar: 'rampa_genislik_cm', nesne: 'giris', grup: 'fiziksel', etiket: 'Rampa genişliği', tip: 'sayi', birim: 'cm',
    uygun: { enAz: 100 }, bagli: RAMPA_VARSA,
  },
  {
    anahtar: 'rampa_egim_yuzde', nesne: 'giris', grup: 'fiziksel', etiket: 'Rampa eğimi', tip: 'sayi', birim: '%', bagli: RAMPA_VARSA,
    kararKurali: 'Yükseklik 15 cm’e kadar en fazla %8; daha yüksekte %7–%5.',
  },

  // §2.2 Mekân kriterleri, fiziksel (kat, mekanlar tablosunda ayrı sütundur)
  {
    anahtar: 'asansor_var', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör', tip: 'secim',
    secenekler: [s('var', 'Var'), s('yok', 'Yok'), s('gerek_yok', 'Gerek yok (giriş katı)')],
  },
  {
    anahtar: 'asansor_calisiyor', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör çalışıyor mu', tip: 'secim', bagli: ASANSOR_VARSA,
    secenekler: [s('evet', 'Evet'), s('hayir', 'Hayır')],
  },
  {
    anahtar: 'asansor_tekerlekli', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör tekerlekli sandalyeye', tip: 'secim', bagli: ASANSOR_VARSA,
    secenekler: [s('uygun', 'Uygun'), s('uygun_degil', 'Uygun değil')],
    kararKurali: 'Uygun: kabin en az 110 × 140 cm, kapı en az 90 cm (TS EN 81-70).',
  },
  { anahtar: 'asansor_kabin', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör kabin ölçüsü (cm)', tip: 'metin', bagli: ASANSOR_VARSA },
  {
    anahtar: 'asansor_kapi_cm', nesne: 'mekan', grup: 'fiziksel', etiket: 'Asansör kapı genişliği', tip: 'sayi', birim: 'cm',
    uygun: { enAz: 90 }, bagli: ASANSOR_VARSA,
  },
  { anahtar: 'ic_kapi_cm', nesne: 'mekan', grup: 'fiziksel', etiket: 'Mekân kapısı net genişliği', tip: 'sayi', birim: 'cm', uygun: { enAz: 90 } },
  { anahtar: 'erisilebilir_wc', nesne: 'mekan', grup: 'fiziksel', etiket: 'Erişilebilir tuvalet (aynı katta)', tip: 'secim', secenekler: VAR_YOK },

  // §2.3 Mekân kriterleri, duyusal
  { anahtar: 'gurultu_yogun', nesne: 'mekan', grup: 'duyusal', etiket: 'Gürültü (yoğun saat)', tip: 'secim', secenekler: GURULTU, olcum: true },
  { anahtar: 'gurultu_sakin', nesne: 'mekan', grup: 'duyusal', etiket: 'Gürültü (sakin saat)', tip: 'secim', secenekler: GURULTU, olcum: true },
  { anahtar: 'muzik', nesne: 'mekan', grup: 'duyusal', etiket: 'Arka plan müziği', tip: 'secim', secenekler: VAR_YOK },
  { anahtar: 'gun_isigi', nesne: 'mekan', grup: 'duyusal', etiket: 'Gün ışığı', tip: 'secim', secenekler: VAR_YOK },
  {
    anahtar: 'yapay_isik', nesne: 'mekan', grup: 'duyusal', etiket: 'Yapay ışık türü', tip: 'secim',
    secenekler: [s('led', 'LED'), s('floresan', 'Floresan'), s('diger', 'Diğer')],
  },
  { anahtar: 'acik_floresan', nesne: 'mekan', grup: 'duyusal', etiket: 'Açıkta floresan tüp', tip: 'secim', secenekler: VAR_YOK },
  { anahtar: 'dogal_aydinlik_alan', nesne: 'mekan', grup: 'duyusal', etiket: 'Gün ışığı alan bölüm', tip: 'secim', secenekler: VAR_YOK },
  {
    anahtar: 'oturma', nesne: 'mekan', grup: 'duyusal', etiket: 'Oturma yoğunluğu', tip: 'secim',
    secenekler: [s('seyrek', 'Seyrek'), s('orta', 'Orta'), s('sik', 'Sık')],
    kararKurali: 'Seyrek: masalar arası rahatça geçilebiliyor; Sık: geçmek için sandalye çektirmek gerekiyor.',
  },
  {
    anahtar: 'mobilya_duzeni', nesne: 'mekan', grup: 'duyusal', etiket: 'Mobilya düzeni', tip: 'secim',
    secenekler: [s('acik', 'Açık'), s('sik_dizilmis', 'Sık dizilmiş')],
  },
  { anahtar: 'sessiz_alan', nesne: 'mekan', grup: 'duyusal', etiket: 'Ayrı sessiz köşe/oda', tip: 'secim', secenekler: VAR_YOK },
  { anahtar: 'alternatif_oturma', nesne: 'mekan', grup: 'duyusal', etiket: 'Alternatif oturma alanı', tip: 'secim', secenekler: VAR_YOK },
]

// §4 Filtreler. `kosullar` alternatiflerin listesidir (VEYA); her alternatif koşulların
// listesidir (VE). Seçilen filtreler kendi aralarında VE ile birleşir.
// seviye 'giris': mekânın binasındaki girişlerden en az biri sağlamalı.
// 'kat' koşulu mekanlar tablosundaki kat sütunundan okunur (ekip verisi, doğrulanmış sayılır).
const k = (alan, ...degerler) => ({ alan, degerler })
export const FILTRELER = [
  { anahtar: 'basamaksiz', etiket: 'Basamaksız giriş', seviye: 'giris', kosullar: [[k('basamaksiz', 'var')]] },
  {
    anahtar: 'rampa', etiket: 'Rampa var', seviye: 'giris',
    kosullar: [[k('rampa_var', 'var'), k('rampa_durumu', 'uygun')], [k('basamaksiz', 'var')]],
  },
  {
    anahtar: 'asansor', etiket: 'Asansörle ulaşılabilir', seviye: 'mekan',
    kosullar: [[k('kat', 0)], [k('asansor_var', 'var'), k('asansor_calisiyor', 'evet'), k('asansor_tekerlekli', 'uygun')]],
  },
  { anahtar: 'sessiz', etiket: 'Sessiz', seviye: 'mekan', kosullar: [[k('gurultu_yogun', 'sessiz')]] },
  { anahtar: 'orta_gurultu', etiket: 'Orta gürültü', seviye: 'mekan', kosullar: [[k('gurultu_yogun', 'sessiz', 'orta')]] },
  { anahtar: 'dogal_isik', etiket: 'Doğal ışık', seviye: 'mekan', kosullar: [[k('gun_isigi', 'var')]] },
  { anahtar: 'floresan_yok', etiket: 'Açıkta floresan yok', seviye: 'mekan', kosullar: [[k('acik_floresan', 'yok')]] },
  { anahtar: 'seyrek_oturma', etiket: 'Seyrek oturma', seviye: 'mekan', kosullar: [[k('oturma', 'seyrek')]] },
]

export function kriterBul(anahtar) {
  return KRITERLER.find((x) => x.anahtar === anahtar)
}

export function nesneKriterleri(nesne, grup) {
  return KRITERLER.filter((x) => x.nesne === nesne && (!grup || x.grup === grup))
}

export function filtreBul(anahtar) {
  return FILTRELER.find((f) => f.anahtar === anahtar)
}

export function mekanTuruEtiketi(tur) {
  return MEKAN_TURLERI.find((t) => t.deger === tur)?.etiket ?? tur
}

export function olcumCihaziEtiketi(cihaz) {
  return OLCUM_CIHAZLARI.find((c) => c.deger === cihaz)?.etiket ?? null
}

const sayiMetni = (n) => Number(n).toLocaleString('tr-TR')

// Değerin okunabilir metni: seçenek etiketi, birimli sayı ya da serbest metin.
export function degerMetni(anahtar, deger) {
  if (deger == null || deger === '') return null
  const kriter = kriterBul(anahtar)
  if (!kriter) return String(deger)
  if (kriter.tip === 'secim') return kriter.secenekler.find((x) => x.deger === deger)?.etiket ?? String(deger)
  if (kriter.tip === 'sayi') return kriter.birim === '%' ? `%${sayiMetni(deger)}` : `${sayiMetni(deger)} ${kriter.birim ?? ''}`.trim()
  return String(deger)
}

/** Sayısal değer önerilen sınırın dışındaysa { enAz } ya da { enFazla } döner, değilse null. */
export function sinirDisi(kriter, deger) {
  if (!kriter.uygun || deger == null || deger === '') return null
  const n = Number(deger)
  if (kriter.uygun.enAz != null && n < kriter.uygun.enAz) return { enAz: kriter.uygun.enAz }
  if (kriter.uygun.enFazla != null && n > kriter.uygun.enFazla) return { enFazla: kriter.uygun.enFazla }
  return null
}

/**
 * Bağlı kriter (ör. rampa durumu) kartta gösterilsin mi? Üst alan bilinen ve
 * eşleşmeyen bir değerse (rampa yok) gizlenir; kendi verisi varsa her zaman gösterilir.
 * oku(alanAdi) → alan satırı ya da null.
 */
export function kriterGorunur(kriter, oku) {
  if (!kriter.bagli) return true
  const kendi = oku(kriter.anahtar)
  if (kendi && kendi.durum !== 'veri_yok') return true
  const ust = oku(kriter.bagli.alan)
  if (!ust || ust.durum === 'veri_yok') return true
  return kriter.bagli.degerler.includes(ust.deger)
}

// supabase/migrations içindeki gecerli_kriter() ile aynı kurallar.
// Sayılar en fazla 3 basamak ve 2 ondalık, nokta ile (ör. "1.3").
export function gecerliDeger(nesne, anahtar, deger) {
  const kriter = kriterBul(anahtar)
  if (!kriter || kriter.nesne !== nesne || typeof deger !== 'string') return false
  if (kriter.tip === 'secim') return kriter.secenekler.some((x) => x.deger === deger)
  if (kriter.tip === 'sayi') return /^[0-9]{1,3}(\.[0-9]{1,2})?$/.test(deger)
  return deger.trim().length >= 1 && deger.length <= 200
}
