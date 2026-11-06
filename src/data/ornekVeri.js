// SPEC §9 örnek verisi: 2 bina, 4 giriş, 5 mekân; üç durumun hepsi temsil edilir.
// Koordinatlar kampüs merkezine yakındır, gerçek konum iddiası taşımaz.
// supabase/seed.sql bu dosyadan üretilir: `npm run seed`
// Alanlar Nergis Zeynep'in kesin kriter listesine göre.
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
    olcum_cihazi: ek.olcum_cihazi ?? null,
    guncelleme: ek.guncelleme ?? EKIP_TARIHI,
  }
}

export const ornekVeri = {
  binalar: [
    { id: 1, ad: 'ÖRNEK – Ana Bina', enlem: 38.738, boylam: 35.4736, notlar: 'Örnek veri; gerçek bina değildir.', olusturma: EKIP_TARIHI },
    { id: 2, ad: 'ÖRNEK – Kafe Binası', enlem: 38.7366, boylam: 35.4718, notlar: 'Örnek veri; gerçek bina değildir.', olusturma: EKIP_TARIHI },
  ],

  girisler: [
    { id: 1, bina_id: 1, ad: 'ÖRNEK – Kuzey kapısı', enlem: 38.7387, boylam: 35.4738, olusturma: EKIP_TARIHI },
    { id: 2, bina_id: 1, ad: 'ÖRNEK – Güney kapısı', enlem: 38.7373, boylam: 35.4739, olusturma: EKIP_TARIHI },
    { id: 3, bina_id: 2, ad: 'ÖRNEK – Ön kapı', enlem: 38.737, boylam: 35.4723, olusturma: EKIP_TARIHI },
    { id: 4, bina_id: 2, ad: 'ÖRNEK – Yan kapı', enlem: 38.736, boylam: 35.4712, olusturma: EKIP_TARIHI },
  ],

  mekanlar: [
    { id: 1, bina_id: 1, ad: 'ÖRNEK – Kütüphane', tur: 'kutuphane', kat: 1, enlem: 38.7384, boylam: 35.4729, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 2, bina_id: 1, ad: 'ÖRNEK – Çalışma Salonu', tur: 'calisma_salonu', kat: 2, enlem: 38.738, boylam: 35.4744, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 3, bina_id: 1, ad: 'ÖRNEK – Yemekhane', tur: 'yemekhane', kat: 0, enlem: 38.73755, boylam: 35.473, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 4, bina_id: 2, ad: 'ÖRNEK – Kafe', tur: 'kafe', kat: 0, enlem: 38.7368, boylam: 35.4712, foto_url: null, olusturma: EKIP_TARIHI },
    { id: 5, bina_id: 2, ad: 'ÖRNEK – Toplantı Odası', tur: 'diger', kat: 1, enlem: 38.7362, boylam: 35.4724, foto_url: null, olusturma: EKIP_TARIHI },
  ],

  alanlar: [
    // Giriş 1: tamamen doğrulanmış, basamaksız ana giriş (rampaya gerek yok)
    a('giris', 1, 'giris_turu', 'ana', D),
    a('giris', 1, 'basamaksiz', 'var', D),
    a('giris', 1, 'esik_cm', '1', D),
    a('giris', 1, 'kapi_genisligi_cm', '120', D),
    a('giris', 1, 'kapi_tipi', 'otomatik', D),
    a('giris', 1, 'kapi_acilma', 'kolay', D),
    a('giris', 1, 'rampa_var', 'gerek_yok', D),
    a('giris', 1, 'acik_saatler', 'Hafta içi 08:00–22:00', T, { kaynak: 'ekip' }),
    // Giriş 2: basamaklı yan giriş; rampası var ama önü kapalı, dar ve ağır kapı, yüksek eşik
    a('giris', 2, 'giris_turu', 'yan', D),
    a('giris', 2, 'basamaksiz', 'yok', D),
    a('giris', 2, 'esik_cm', '3', D),
    a('giris', 2, 'kapi_genisligi_cm', '80', D),
    a('giris', 2, 'kapi_tipi', 'elle', D),
    a('giris', 2, 'kapi_acilma', 'agir', D),
    a('giris', 2, 'rampa_var', 'var', D),
    a('giris', 2, 'rampa_durumu', 'onu_kapali', D),
    a('giris', 2, 'rampa_genislik_cm', '110', T, { kaynak: 'ekip' }),
    a('giris', 2, 'rampa_egim_yuzde', '9.5', T, { kaynak: 'ekip' }),
    // Giriş 3: yalnızca teyitsiz bilgiler (rampa durumu için bekleyen bildirim var)
    a('giris', 3, 'giris_turu', 'ana', D),
    a('giris', 3, 'basamaksiz', 'yok', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T09:15:00+03:00' }),
    a('giris', 3, 'rampa_var', 'var', T, { kaynak: 'ekip' }),
    a('giris', 3, 'rampa_durumu', 'uygun', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T09:20:00+03:00' }),
    a('giris', 3, 'kapi_tipi', 'elle', D),
    a('giris', 3, 'kapi_acilma', 'kolay', D),
    // Giriş 4: erişilebilir alternatif giriş olarak işaretli, başka veri yok
    a('giris', 4, 'giris_turu', 'erisilebilir_alternatif', D),
    a('giris', 4, 'basamaksiz', null, V),

    // Mekân 1: tüm filtrelerde doğrulanmış uygun eşleşme
    a('mekan', 1, 'asansor_var', 'var', D),
    a('mekan', 1, 'asansor_calisiyor', 'evet', D),
    a('mekan', 1, 'asansor_tekerlekli', 'uygun', D),
    a('mekan', 1, 'asansor_kabin', '110x140', D),
    a('mekan', 1, 'asansor_kapi_cm', '90', D),
    a('mekan', 1, 'ic_kapi_cm', '100', D),
    a('mekan', 1, 'erisilebilir_wc', 'var', D),
    a('mekan', 1, 'gurultu_yogun', 'sessiz', D, { olcum_zamani: '2026-11-03T13:00:00+03:00', olcum_cihazi: 'spl_metre' }),
    a('mekan', 1, 'gurultu_sakin', 'sessiz', D, { olcum_zamani: '2026-11-03T09:00:00+03:00', olcum_cihazi: 'spl_metre' }),
    a('mekan', 1, 'muzik', 'yok', D),
    a('mekan', 1, 'gun_isigi', 'var', D),
    a('mekan', 1, 'yapay_isik', 'led', D),
    a('mekan', 1, 'acik_floresan', 'yok', D),
    a('mekan', 1, 'dogal_aydinlik_alan', 'var', D),
    a('mekan', 1, 'oturma', 'seyrek', D),
    a('mekan', 1, 'mobilya_duzeni', 'acik', D),
    a('mekan', 1, 'sessiz_alan', 'var', D),
    a('mekan', 1, 'alternatif_oturma', 'var', D),
    // Mekân 2: asansör çalışıyor ama tekerlekli sandalyeye uygun değil; açıkta floresan bilgisi teyitsiz
    a('mekan', 2, 'asansor_var', 'var', D),
    a('mekan', 2, 'asansor_calisiyor', 'evet', D),
    a('mekan', 2, 'asansor_tekerlekli', 'uygun_degil', D),
    a('mekan', 2, 'asansor_kabin', '100x120', D),
    a('mekan', 2, 'asansor_kapi_cm', '80', D),
    a('mekan', 2, 'gurultu_yogun', 'orta', D, { olcum_zamani: '2026-11-03T12:30:00+03:00', olcum_cihazi: 'ses_modulu' }),
    a('mekan', 2, 'gun_isigi', 'yok', D),
    a('mekan', 2, 'yapay_isik', 'floresan', D),
    a('mekan', 2, 'acik_floresan', 'yok', T, { kaynak: 'kullanici', guncelleme: '2026-11-04T11:00:00+03:00' }),
    a('mekan', 2, 'oturma', null, V),
    // Mekân 3: giriş katında, gürültülü, sık oturma
    a('mekan', 3, 'asansor_var', 'gerek_yok', D),
    a('mekan', 3, 'erisilebilir_wc', 'var', D),
    a('mekan', 3, 'gurultu_yogun', 'gurultulu', D, { olcum_zamani: '2026-11-03T12:15:00+03:00', olcum_cihazi: 'spl_metre' }),
    a('mekan', 3, 'gurultu_sakin', 'orta', T, { kaynak: 'kullanici', olcum_zamani: '2026-11-04T15:30:00+03:00', guncelleme: '2026-11-04T15:30:00+03:00' }),
    a('mekan', 3, 'muzik', 'var', D),
    a('mekan', 3, 'gun_isigi', 'var', D),
    a('mekan', 3, 'yapay_isik', 'led', D),
    a('mekan', 3, 'acik_floresan', 'yok', D),
    a('mekan', 3, 'oturma', 'sik', D),
    a('mekan', 3, 'mobilya_duzeni', 'sik_dizilmis', D),
    // Mekân 4: gün ışığı doğrulanmış ama itiraz var; gürültü teyitsiz
    a('mekan', 4, 'gurultu_yogun', 'orta', T, { kaynak: 'ekip', olcum_zamani: '2026-11-03T16:00:00+03:00', olcum_cihazi: 'ses_modulu' }),
    a('mekan', 4, 'muzik', 'var', D),
    a('mekan', 4, 'gun_isigi', 'var', D),
    a('mekan', 4, 'yapay_isik', 'diger', D),
    a('mekan', 4, 'oturma', 'orta', D),
    a('mekan', 4, 'alternatif_oturma', 'yok', D),
    // Mekân 5: hiç veri yok (satır bulunmaması da "veri yok" demektir)
  ],

  // Kullanıcı bildirimleri; anonim_id değerleri örnek kimliklerdir.
  bildirimler: [
    { id: 1, nesne_turu: 'mekan', nesne_id: 2, alan_adi: 'acik_floresan', deger: 'yok', anonim_id: '00000000-0000-4000-8000-000000000001', tarih: '2026-11-04T11:00:00+03:00', durum: 'bekliyor' },
    { id: 2, nesne_turu: 'giris', nesne_id: 3, alan_adi: 'rampa_durumu', deger: 'uygun', anonim_id: '00000000-0000-4000-8000-000000000002', tarih: '2026-11-04T09:20:00+03:00', durum: 'bekliyor' },
    { id: 3, nesne_turu: 'mekan', nesne_id: 4, alan_adi: 'gun_isigi', deger: 'yok', anonim_id: '00000000-0000-4000-8000-000000000003', tarih: '2026-11-05T10:00:00+03:00', durum: 'bekliyor' },
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
