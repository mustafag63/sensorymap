// SPEC §9 örnek verisi: 2 bina, 4 giriş, 5 mekân; üç durumun hepsi temsil edilir.
// Koordinatlar kampüs merkezine yakındır, gerçek konum iddiası taşımaz.
// supabase/seed.sql bu dosyadan üretilir: `npm run seed`
// TODO(Nergis Zeynep): Gerçek mekân verisi ekip panelinden girilecek.

const D = 'dogrulanmis'
const T = 'teyitsiz'
const V = 'veri_yok'

const EKIP_TARIHI = '2026-11-02T10:00:00+03:00'

let alanId = 0
function a(nesne_turu, nesne_id, alan_adi, deger, durum, ek = {}) {
  alanId += 1
  return {
    id: alanId,
    nesne_turu,
    nesne_id,
    alan_adi,
    deger: durum === V ? null : deger,
    durum,
    kaynak: durum === V ? null : (ek.kaynak ?? 'ekip'),
    olcum_zamani: ek.olcum_zamani ?? null,
    guncelleme: ek.guncelleme ?? EKIP_TARIHI,
  }
}

export const ornekVeri = {
  binalar: [
    { id: 1, ad: 'ÖRNEK – Ana Bina', enlem: 38.738, boylam: 35.4736, notlar: 'Örnek veri; gerçek bina değildir.', olusturma: EKIP_TARIHI },
    { id: 2, ad: 'ÖRNEK – Kafe Binası', enlem: 38.7369, boylam: 35.4722, notlar: 'Örnek veri; gerçek bina değildir.', olusturma: EKIP_TARIHI },
  ],

  girisler: [
    { id: 1, bina_id: 1, ad: 'ÖRNEK – Kuzey kapısı', enlem: 38.73815, boylam: 35.47355, olusturma: EKIP_TARIHI },
    { id: 2, bina_id: 1, ad: 'ÖRNEK – Güney kapısı', enlem: 38.73782, boylam: 35.4737, olusturma: EKIP_TARIHI },
    { id: 3, bina_id: 2, ad: 'ÖRNEK – Ön kapı', enlem: 38.73702, boylam: 35.47212, olusturma: EKIP_TARIHI },
    { id: 4, bina_id: 2, ad: 'ÖRNEK – Yan kapı', enlem: 38.73684, boylam: 35.47236, olusturma: EKIP_TARIHI },
  ],

  mekanlar: [
    { id: 1, bina_id: 1, ad: 'ÖRNEK – Kütüphane', tur: 'kutuphane', kat: 1, enlem: 38.73806, boylam: 35.47342, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 2, bina_id: 1, ad: 'ÖRNEK – Çalışma Salonu', tur: 'calisma_salonu', kat: 2, enlem: 38.73798, boylam: 35.47374, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 3, bina_id: 1, ad: 'ÖRNEK – Yemekhane', tur: 'yemekhane', kat: 0, enlem: 38.73789, boylam: 35.47348, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 4, bina_id: 2, ad: 'ÖRNEK – Kafe', tur: 'kafe', kat: 0, enlem: 38.73694, boylam: 35.47216, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 5, bina_id: 2, ad: 'ÖRNEK – Toplantı Odası', tur: 'diger', kat: 1, enlem: 38.73686, boylam: 35.47226, foto_url: null, olusturma: EKIP_TARIHI },
  ],

  alanlar: [
    // Giriş 1: tamamen doğrulanmış, basamaksız ana giriş
    a('giris', 1, 'giris_turu', 'ana', D),
    a('giris', 1, 'basamaksiz', 'var', D),
    a('giris', 1, 'rampa', 'gerek_yok', D),
    a('giris', 1, 'kapi_genisligi_cm', '120', D),
    a('giris', 1, 'kapi_tipi', 'otomatik', D),
    a('giris', 1, 'acik_saatler', 'Hafta içi 08:00–22:00', T, { kaynak: 'ekip' }),
    // Giriş 2: basamaklı yan giriş, dar ve ağır kapı
    a('giris', 2, 'giris_turu', 'yan', D),
    a('giris', 2, 'basamaksiz', 'yok', D),
    a('giris', 2, 'rampa', 'var_ama_dik', T, { kaynak: 'ekip' }),
    a('giris', 2, 'kapi_genisligi_cm', '80', D),
    a('giris', 2, 'kapi_tipi', 'el_ile_agir', D),
    // Giriş 3: yalnızca teyitsiz bilgiler (rampa için bekleyen bildirim var)
    a('giris', 3, 'giris_turu', 'ana', D),
    a('giris', 3, 'basamaksiz', 'yok', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T09:15:00+03:00' }),
    a('giris', 3, 'rampa', 'uygun', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T09:20:00+03:00' }),
    a('giris', 3, 'kapi_tipi', 'el_ile_hafif', D),
    // Giriş 4: veri yok
    a('giris', 4, 'basamaksiz', null, V),

    // Mekân 1: tüm filtrelerde doğrulanmış uygun eşleşme
    a('mekan', 1, 'asansor', 'var_calisiyor', D),
    a('mekan', 1, 'ic_kapi_cm', '100', D),
    a('mekan', 1, 'erisilebilir_wc', 'var', D),
    a('mekan', 1, 'gurultu_yogun', 'sessiz', D, { olcum_zamani: '2026-11-03T13:00:00+03:00' }),
    a('mekan', 1, 'gurultu_sakin', 'sessiz', D, { olcum_zamani: '2026-11-03T09:00:00+03:00' }),
    a('mekan', 1, 'isik', 'dogal', D),
    a('mekan', 1, 'oturma', 'seyrek', D),
    a('mekan', 1, 'sessiz_alan', 'var', D),
    a('mekan', 1, 'muzik', 'yok', D),
    // Mekân 2: asansör teyitsiz (1 teyitli bildirim), oturma veri yok
    a('mekan', 2, 'asansor', 'var_calisiyor', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T11:00:00+03:00' }),
    a('mekan', 2, 'gurultu_yogun', 'orta', D, { olcum_zamani: '2026-11-03T12:30:00+03:00' }),
    a('mekan', 2, 'isik', 'floresan', D),
    a('mekan', 2, 'oturma', null, V),
    // Mekân 3: giriş katında, gürültülü
    a('mekan', 3, 'asansor', 'gerek_yok', D),
    a('mekan', 3, 'erisilebilir_wc', 'var', D),
    a('mekan', 3, 'gurultu_yogun', 'gurultulu', D, { olcum_zamani: '2026-11-03T12:15:00+03:00' }),
    a('mekan', 3, 'gurultu_sakin', 'orta', T, { kaynak: 'kullanici', olcum_zamani: '2026-11-04T15:30:00+03:00', guncelleme: '2026-11-04T15:30:00+03:00' }),
    a('mekan', 3, 'isik', 'led', D),
    a('mekan', 3, 'oturma', 'sik', D),
    a('mekan', 3, 'muzik', 'dusuk', D),
    // Mekân 4: doğal ışık doğrulanmış ama itiraz var; gürültü teyitsiz
    a('mekan', 4, 'gurultu_yogun', 'orta', T, { kaynak: 'ekip', olcum_zamani: '2026-11-03T16:00:00+03:00' }),
    a('mekan', 4, 'isik', 'dogal', D),
    a('mekan', 4, 'oturma', 'orta', D),
    a('mekan', 4, 'muzik', 'dusuk', D),
    // Mekân 5: hiç veri yok (satır bulunmaması da "veri yok" demektir)
  ],

  // Kullanıcı bildirimleri; anonim_id değerleri örnek kimliklerdir.
  bildirimler: [
    { id: 1, nesne_turu: 'mekan', nesne_id: 2, alan_adi: 'asansor', deger: 'var_calisiyor', anonim_id: '00000000-0000-4000-8000-000000000001', tarih: '2026-11-04T11:00:00+03:00', durum: 'bekliyor' },
    { id: 2, nesne_turu: 'giris', nesne_id: 3, alan_adi: 'rampa', deger: 'uygun', anonim_id: '00000000-0000-4000-8000-000000000002', tarih: '2026-11-04T09:20:00+03:00', durum: 'bekliyor' },
    { id: 3, nesne_turu: 'mekan', nesne_id: 4, alan_adi: 'isik', deger: 'led', anonim_id: '00000000-0000-4000-8000-000000000003', tarih: '2026-11-05T10:00:00+03:00', durum: 'bekliyor' },
    { id: 4, nesne_turu: 'mekan', nesne_id: 3, alan_adi: 'gurultu_sakin', deger: 'orta', anonim_id: '00000000-0000-4000-8000-000000000001', tarih: '2026-11-04T15:30:00+03:00', durum: 'bekliyor' },
    { id: 5, nesne_turu: 'giris', nesne_id: 3, alan_adi: 'basamaksiz', deger: 'yok', anonim_id: '00000000-0000-4000-8000-000000000004', tarih: '2026-11-04T09:15:00+03:00', durum: 'bekliyor' },
  ],

  teyitler: [
    { id: 1, bildirim_id: 1, anonim_id: '00000000-0000-4000-8000-000000000002', tarih: '2026-11-04T12:00:00+03:00' },
  ],

  hata_bildirimleri: [
    { id: 1, nesne_turu: 'mekan', nesne_id: 3, aciklama: 'ÖRNEK: Yemekhane kapısının yeri değişmiş olabilir.', tarih: '2026-11-05T14:00:00+03:00', cozuldu: false },
  ],
}
