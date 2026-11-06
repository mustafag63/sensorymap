// Durum etiketleri ve arayüz metinleri (SPEC §3, §7). Etiket adları hocanın
// cevabına göre değişebilir; yalnızca bu dosya güncellenir.
// Kriter, seçenek ve filtre etiketleri src/data/kriterler.js içindedir.

export const DURUMLAR = {
  veri_yok: { anahtar: 'veri_yok', baslik: 'Veri Bulunmuyor', etiket: 'Veri yok', ikon: '–' },
  teyitsiz: { anahtar: 'teyitsiz', baslik: 'Teyit Edilmemiş', etiket: 'Teyit edilmedi', ikon: '?' },
  dogrulanmis: { anahtar: 'dogrulanmis', baslik: 'Doğrulanmış', etiket: 'Doğrulandı', ikon: '✓' },
}

export const SONUC_GRUPLARI = {
  uygun: { anahtar: 'uygun', baslik: 'Uygun Eşleşme', kisa: 'Uygun eşleşme' },
  eksik: { anahtar: 'eksik', baslik: 'Bilgi eksik', kisa: 'Bilgi eksik' },
  uygun_degil: { anahtar: 'uygun_degil', baslik: 'Uygun değil', kisa: 'Uygun değil' },
}

// Haritada bina işaretçisinden mekân/giriş işaretçilerine geçilen zoom (SPEC §5.1).
export const DETAY_ZOOM = 18

export const METIN = {
  uygulamaAdi: 'SensoryMap',
  sayfaBasligi: 'SensoryMap – AGÜ Sümer Kampüsü Erişilebilirlik Haritası',
  icerigeGec: 'İçeriğe geç',
  menu: { harita: 'Harita', hakkinda: 'Hakkında', gizlilik: 'Gizlilik', panel: 'Ekip paneli', anaMenu: 'Ana menü' },
  ornekVeriModu: 'Örnek veri modu: gösterilen mekânlar gerçek değildir.',
  yukleniyor: 'Yükleniyor…',
  veriHatasi: 'Veriler yüklenemedi. Sayfayı yenileyip tekrar deneyin.',
  kaydedildi: 'Kaydedildi.',
  islemHatasi: 'İşlem tamamlanamadı',

  harita: {
    bolgeEtiketi: 'Kampüs haritası',
    yakinlastir: 'Yakınlaştır',
    uzaklastir: 'Uzaklaştır',
    mekanSayisi: (n) => `${n} mekân`,
    katListesi: 'Kat kat mekânlar',
    kat: (k) => (k === 0 ? 'Giriş katı' : k > 0 ? `${k}. kat` : `Bodrum ${-k}`),
    giris: 'Giriş',
    basamaksiz: 'Basamaksız',
    yakinlastirIpucu: 'Mekânları ve girişleri görmek için yakınlaştırın.',
  },

  filtre: {
    bolgeEtiketi: 'Filtreler',
    secili: (n) => (n === 0 ? 'Filtre seçilmedi' : `${n} filtre seçili`),
    temizle: 'Temizle',
    gorunum: 'Görünüm',
    haritaGorunumu: 'Harita',
    listeGorunumu: 'Liste',
  },

  liste: {
    baslik: 'Mekânlar',
    tumMekanlar: 'Tüm mekânlar',
    bos: 'Bu grupta mekân yok.',
    uygunOlmayanlariGoster: 'Uygun olmayanları da göster',
    eksikAlanlar: 'Eksik bilgiler',
    sonucOzeti: (u, e, d) => `${u} uygun eşleşme, ${e} bilgi eksik, ${d} uygun değil`,
  },

  kart: {
    kapat: 'Kapat',
    bulunamadi: 'Mekân bulunamadı.',
    bina: 'Bina',
    kat: 'Kat',
    tur: 'Tür',
    sonGuncelleme: 'Son güncelleme',
    nasilGirilir: 'Binaya nasıl girilir',
    onerilenGiris: 'Önerilen giriş',
    girisYok: 'Bu bina için giriş bilgisi yok.',
    fiziksel: 'Fiziksel',
    duyusal: 'Duyusal',
    olcum: 'Ölçüm',
    gurultuNotu: 'Gürültü sayı olarak değil aralık olarak gösterilir. Telefon ölçümü yaklaşıktır, desibelmetre değildir.',
    darKapi: (min) => `${min} cm’den dar`,
    itiraz: 'Bu bilgiye itiraz var',
    itirazDetay: (deger) => `Bir kullanıcı “${deger}” bildirdi; iki teyit alırsa değer değişir.`,
    teyitEt: 'Bu bilgiyi teyit et',
    teyitSayisi: (n) => `${n}/2 teyit`,
    kendiBildirimin: 'Bu bildirimi siz yaptınız; başkalarının teyidi bekleniyor.',
    teyitEttin: 'Teyit ettiniz.',
    teyitAlindi: 'Teyidiniz kaydedildi.',
    eylemler: 'Eylemler',
    bilgiEkle: 'Bilgi ekle / düzelt',
    hataBildir: 'Hatalı bilgi bildir',
    sesOlc: 'Ortam sesini ölç',
    sesOlcAciklama: 'Bu özellik 4. haftada eklenecek.',
  },

  bildirim: {
    baslik: 'Bilgi ekle / düzelt',
    neIcin: 'Bilgi neyle ilgili?',
    kriter: 'Kriter',
    deger: 'Değer',
    secin: 'Seçin',
    gonder: 'Gönder',
    vazgec: 'Vazgeç',
    gonderildi: 'Bildiriminiz kaydedildi. Başka iki kişi teyit edince doğrulanır.',
    zatenDogru: 'Bildiriminiz kaydedildi; bu değer zaten doğrulanmış.',
    itirazOldu: 'Bildiriminiz kaydedildi. Doğrulanmış değerden farklı olduğu için itiraz olarak gösterilecek.',
    anonimNot: 'Ad, e-posta veya sağlık bilgisi istenmez. Bildirim, bu tarayıcıya özel anonim bir kimlikle kaydedilir.',
  },

  hata: {
    baslik: 'Hatalı bilgi bildir',
    aciklama: 'Neyin hatalı olduğunu kısaca yazın',
    ipucu: 'Kişisel bilgi yazmayın. En fazla 1000 karakter.',
    gonder: 'Gönder',
    vazgec: 'Vazgeç',
    gonderildi: 'Teşekkürler, ekip inceleyecek.',
  },

  panel: {
    baslik: 'Ekip paneli',
    ornekUyari: 'Örnek veri modu: giriş gerekmiyor ve değişiklikler yalnızca bu sekmede, bellekte tutulur. Sayfa yenilenince kaybolur.',
    girisBaslik: 'Ekip girişi',
    eposta: 'E-posta',
    sifre: 'Şifre',
    girisYap: 'Giriş yap',
    cikis: 'Çıkış yap',
    girisHatasi: 'Giriş yapılamadı. Bilgileri kontrol edin.',
    ekipDegil: 'Bu hesap ekip üyesi olarak tanımlı değil.',
    sekmeler: { kayitlar: 'Bina, giriş ve mekânlar', hatalar: 'Hata bildirimleri', bekleyen: 'Bekleyen bildirimler' },
    kayitSec: 'Düzenlenecek kayıt',
    yeniBina: 'Yeni bina',
    yeniGiris: 'Yeni giriş',
    yeniMekan: 'Yeni mekân',
    ad: 'Ad',
    bina: 'Bina',
    tur: 'Tür',
    kat: 'Kat (0 = giriş katı)',
    notlar: 'Notlar',
    fotoUrl: 'Fotoğraf adresi (isteğe bağlı)',
    konum: 'Konum',
    konumIpucu: 'Haritaya tıklayın, işaretçi düşsün; sürükleyerek ince ayar yapın. Klavyeyle enlem ve boylamı aşağıdan girebilirsiniz.',
    enlem: 'Enlem',
    boylam: 'Boylam',
    kriterler: 'Kriterler',
    veriYokSecenek: 'Veri yok',
    yerinde: 'Yerinde doğrulandı',
    olcumZamani: 'Ölçüm zamanı',
    kaydet: 'Kaydet',
    konumGerekli: 'Konum seçin.',
    adGerekli: 'Ad girin.',
    binaGerekli: 'Bina seçin.',
    hataYok: 'Açık hata bildirimi yok.',
    cozuldu: 'Çözüldü olarak işaretle',
    cozulmusleriGoster: 'Çözülmüşleri de göster',
    cozulduEtiket: 'Çözüldü',
    bekleyenYok: 'Bekleyen bildirim yok.',
    teyit: (n) => `${n}/2 teyit`,
  },

  // Veri katmanının fırlattığı hatalar (iki kaynakta da aynı metin).
  hatalar: {
    yetki: 'Bu işlem için yetkiniz yok.',
    kendiTeyit: 'Kendi bildiriminizi teyit edemezsiniz.',
    ikinciTeyit: 'Bu bildirimi zaten teyit ettiniz.',
    sonuclanmis: 'Bu bildirim zaten sonuçlandı.',
    kayitYok: 'Kayıt bulunamadı.',
    gecersizDeger: 'Geçersiz değer.',
    aciklamaUzunlugu: 'Açıklama 1 ile 1000 karakter arasında olmalı.',
    kimlik: 'Anonim kimlik oluşturulamadı. Supabase’de anonymous sign-in açık mı?',
    bilinmeyen: 'Beklenmeyen bir hata oluştu.',
  },

  hakkinda: { baslik: 'Hakkında' },
  gizlilik: { baslik: 'Gizlilik' },
  bulunamadi: { baslik: 'Sayfa bulunamadı', geri: 'Haritaya dön' },
}

export function tarihMetni(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })
}
