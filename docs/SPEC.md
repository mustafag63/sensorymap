# SensoryMap — Site Şartnamesi (v0.1, taslak)

> Bu belge sitenin neyi, nasıl yapacağını tanımlar. Claude Code ve ekip bu belgeyi referans alır.
> **Kriter listesi Nergis Zeynep'in kesin listesine göre güncellendi** (§2, §4). Eşikleri Sena Nur onaylayacak; değişirse önce bu belge güncellenir, sonra kod.
> Etiket isimleri (Veri Bulunmuyor / Teyit Edilmemiş / Doğrulanmış) hocanın cevabına göre değişebilir; kodda tek bir sabitler dosyasından okunmalı.

---

## 1. Temel fikir: Bina → Giriş → Mekân

Erişilebilirlik bilgisi iki ayrı yerde yaşar:

| Seviye | Neyi anlatır | Örnek |
| --- | --- | --- |
| **Bina** | Konteyner; harita üzerinde gruplama | Ana Bina |
| **Giriş** | Binaya *nasıl girilir* — sadece fiziksel | Kuzey kapısı: basamaksız, otomatik kapı |
| **Mekân** | Binanın içinde *ne beklenir* — fiziksel + duyusal | Kütüphane, kat 1: asansör var, sessiz, doğal ışık |

Kampüs dışındaki tek katlı bir kafe = 1 bina + 1 giriş + 1 mekân (model aynı kalır).

Mekân türleri: `kutuphane`, `yemekhane`, `calisma_salonu`, `kafe`, `diger`.

---

## 2. Kriter listesi (Nergis Zeynep'in kesin listesi)

Her kriterin bir **anahtarı**, **seçenekleri**, **karar kuralı** (sahada nasıl karar verilir) ve bir **durumu** vardır (bkz. §3).
Kaynak: Nergis Zeynep'in kesin kriter listesi; TS 9111 (bina erişilebilirliği), TS EN 81-70 (asansör), proposal'daki eşikler.
"Belirlenecek" yazan karar kuralları Nergis'in listesinde tanımlı değildir. Açık sorular `docs/KARARLAR.md` içindedir.

### 2.1 Giriş kriterleri (fiziksel, her giriş için ayrı)

| Anahtar | Etiket | Seçenekler | Karar kuralı | Filtre mi? |
| --- | --- | --- | --- | --- |
| `giris_turu` | Giriş türü | ana / yan / erisilebilir_alternatif | Binanın kullanım şekline göre | Hayır (bilgi) |
| `basamaksiz` | Basamaksız giriş | var / yok | Kapıya kadar basamak yok ve eşik ≤ 1,3 cm | **Evet** |
| `esik_cm` | Eşik yüksekliği | sayı (cm, ondalıklı) | ≤ 1,3 cm uygun | Hayır (bilgi, > 1,3 ise uyarı) |
| `kapi_genisligi_cm` | Kapı net genişliği | sayı (cm) | ≥ 90 cm uygun | Hayır (bilgi, < 90 ise uyarı) |
| `kapi_tipi` | Kapı tipi | otomatik / elle | Belirlenecek | Hayır (bilgi) |
| `kapi_acilma` | Kapının açılması | kolay / agir | Belirlenecek | Hayır (bilgi) |
| `acik_saatler` | Açık olduğu saatler | metin | Örn. "Hafta içi 08:00–22:00" | Hayır (bilgi) |
| `rampa_var` | Rampa | var / yok / gerek_yok | Gerek yok: giriş zaten basamaksız | **Evet** (bkz. §4) |
| `rampa_durumu` | Rampanın durumu | uygun / cok_dik / onu_kapali | Uygun: eğim sınırın altında, genişlik ≥ 100 cm ve önü açık | **Evet** (bkz. §4) |
| `rampa_genislik_cm` | Rampa genişliği | sayı (cm) | ≥ 100 cm uygun (kampüs için) | Hayır (bilgi, < 100 ise uyarı) |
| `rampa_egim_yuzde` | Rampa eğimi | sayı (%) | Yükseklik ≤ 15 cm için %8; daha yüksekte %7–%5 | Hayır (bilgi) |

Rampa ayrıntıları (`rampa_durumu`, `rampa_genislik_cm`, `rampa_egim_yuzde`) yalnızca `rampa_var = var` iken anlamlıdır; kartta rampa yoksa gizlenir.

### 2.2 Mekân kriterleri, fiziksel

| Anahtar | Etiket | Seçenekler | Karar kuralı | Filtre mi? |
| --- | --- | --- | --- | --- |
| `kat` | Kat | sayı (0 = giriş katı) | Binanın ana giriş seviyesine göre (`mekanlar.kat` sütunu) | Hayır (hesapta kullanılır) |
| `asansor_var` | Asansör | var / yok / gerek_yok | Gerek yok: mekân giriş katında | **Evet** (bkz. §4) |
| `asansor_calisiyor` | Asansör çalışıyor mu | evet / hayir | Ziyaret sırasında gözlem | **Evet** (bkz. §4) |
| `asansor_tekerlekli` | Asansör tekerlekli sandalyeye | uygun / uygun_degil | Uygun: kabin ≥ 110 × 140 cm, kapı ≥ 90 cm (TS EN 81-70) | **Evet** (bkz. §4) |
| `asansor_kabin` | Asansör kabin ölçüsü | metin (ör. "110x140", cm) | Şerit metreyle | Hayır (bilgi) |
| `asansor_kapi_cm` | Asansör kapı genişliği | sayı (cm) | ≥ 90 cm uygun | Hayır (bilgi, < 90 ise uyarı) |
| `ic_kapi_cm` | Mekân kapısı net genişliği | sayı (cm) | ≥ 90 cm uygun | Hayır (bilgi, < 90 ise uyarı) |
| `erisilebilir_wc` | Erişilebilir tuvalet (aynı katta) | var / yok | İşaretli ve tekerlekli sandalyeyle dönülebilir | Hayır (bilgi) |

Asansör ayrıntıları yalnızca `asansor_var = var` iken anlamlıdır; kartta asansör yoksa gizlenir.

### 2.3 Mekân kriterleri, duyusal

| Anahtar | Etiket | Seçenekler | Karar kuralı | Filtre mi? |
| --- | --- | --- | --- | --- |
| `gurultu_yogun` | Gürültü (yoğun saat) | sessiz / orta / gurultulu | Ses modülü veya SPL metre: Sessiz < 50 dB, Orta 50–70 dB, Gürültülü > 70 dB. **Sayı gösterilmez, sadece aralık** | **Evet** |
| `gurultu_sakin` | Gürültü (sakin saat) | sessiz / orta / gurultulu | Aynı aralıklar | Hayır (kartta gösterilir) |
| `muzik` | Arka plan müziği | var / yok | Ziyaret sırasında gözlem | Hayır (bilgi) |
| `gun_isigi` | Gün ışığı | var / yok | Belirlenecek | **Evet** ("Doğal ışık") |
| `yapay_isik` | Yapay ışık türü | led / floresan / diger | Ağırlıklı kaynağa bakılır | Hayır (bilgi) |
| `acik_floresan` | Açıkta floresan tüp | var / yok | Belirlenecek | **Evet** ("Açıkta floresan yok") |
| `dogal_aydinlik_alan` | Gün ışığı alan bölüm | var / yok | Belirlenecek (açık soru) | Hayır (bilgi) |
| `oturma` | Oturma yoğunluğu | seyrek / orta / sik | Seyrek: masalar arası rahatça geçilebiliyor; Sık: geçmek için sandalye çektirmek gerekiyor | **Evet** ("Seyrek oturma") |
| `mobilya_duzeni` | Mobilya düzeni | acik / sik_dizilmis | Belirlenecek | Hayır (bilgi) |
| `sessiz_alan` | Ayrı sessiz köşe/oda | var / yok | Mekân içinde daha sakin, ayrılmış bir bölüm | Hayır (bilgi) |
| `alternatif_oturma` | Alternatif oturma alanı | var / yok | Belirlenecek | Hayır (bilgi) |

Her gürültü değeri **ölçüm zamanı** ve **ölçüm cihazıyla** (`ses_modulu` / `spl_metre`) saklanır; aynı yer sabah sessiz, öğlen gürültülü olabilir.

Filtrede kullanılmayan alanlar kartta bilgi olarak, her biri durum rozetiyle gösterilir.

---

## 3. Bilgi durumu ve doğrulama

Her kriter değeri şu üç durumdan birindedir:

| Durum | Anahtar | Gösterim (renk + ikon + metin; **asla sadece renk**) |
| --- | --- | --- |
| Veri Bulunmuyor | `veri_yok` | Gri, "–" ikonu, "Veri yok" |
| Teyit Edilmemiş | `teyitsiz` | Sarı, "?" ikonu, "Teyit edilmedi" |
| Doğrulanmış | `dogrulanmis` | Yeşil, "✓" ikonu, "Doğrulandı" |

Doğrulama yolları:

1. **Ekip yerinde kontrolü:** Panelden girilen ve "yerinde doğrulandı" işaretlenen değer doğrudan `dogrulanmis` olur.
2. **Kullanıcı bildirimi + 2 bağımsız teyit:** Kullanıcı bildirimi `teyitsiz` başlar; *başka* iki anonim kullanıcı aynı değeri teyit edince `dogrulanmis` olur.

Kurallar:
- Kişi kendi bildirimini teyit edemez; aynı kişi aynı bildirimi iki kez teyit edemez.
- Doğrulanmış bir değerle **çelişen** yeni bildirim, mevcut değeri silmez; kartta "Bu bilgiye itiraz var" notu çıkar, yeni değer 2 teyit alırsa yer değiştirir.
- Durum hesabı **veritabanında** (Postgres fonksiyonu/trigger) yapılır; istemci durumu doğrudan yazamaz.

---

## 4. Eşleşme kuralı ve filtreler

Filtre çubuğu (çoklu seçim, **VE** mantığı). Yalnızca **doğrulanmış** değerler bir filtreyi sağlar ya da sağlamaz:

| Filtre | Mekân ne zaman sağlar? |
| --- | --- |
| Basamaksız giriş | Mekânın binasında `basamaksiz = var` olan **en az bir doğrulanmış giriş** var |
| Rampa var | Binada (`rampa_var = var` **ve** `rampa_durumu = uygun`) **veya** `basamaksiz = var` olan en az bir doğrulanmış giriş var |
| Asansörle ulaşılabilir | `kat = 0` (giriş katı) **veya** (`asansor_var = var` **ve** `asansor_calisiyor = evet` **ve** `asansor_tekerlekli = uygun`), doğrulanmış |
| Sessiz | `gurultu_yogun = sessiz`, doğrulanmış |
| Orta gürültü | `gurultu_yogun ∈ {sessiz, orta}`, doğrulanmış |
| Doğal ışık | `gun_isigi = var`, doğrulanmış |
| Açıkta floresan yok | `acik_floresan = yok`, doğrulanmış |
| Seyrek oturma | `oturma = seyrek`, doğrulanmış |

"Ve" ile bağlı koşullardan biri doğrulanmış şekilde sağlanmıyorsa o seçenek sağlanmaz (ör. rampa var ama önü kapalı); biri doğrulanmamışsa sonuç "Bilgi eksik"tir.

Sonuç etiketleri:
- **Uygun Eşleşme:** Seçilen kriterlerin **hepsi** doğrulanmış ve sağlanıyor.
- **Bilgi eksik:** Hiçbir kriter açıkça sağlanmıyor değil, ama en az biri `veri_yok` veya `teyitsiz`. Listede ayrı grupta, eksik alanlar sarı/gri gösterilir. **Asla "Uygun" denmez.**
- **Uygun değil:** En az bir kriter doğrulanmış şekilde sağlanmıyor. Varsayılan olarak gizli, "Uygun olmayanları da göster" ile açılır.

Gürültü filtresi yoğun saat değerini kullanır (temkinli tercih). Sakin saat değeri kartta ayrıca gösterilir.

---

## 5. Sayfalar ve arayüz

| Yol | İçerik |
| --- | --- |
| `/` | Harita + filtre çubuğu + sonuç listesi |
| `/mekan/:id` | Mekân kartı (paylaşılabilir link; mobilde tam ekran) |
| `/gizlilik` | Gizlilik metni (Sena Nur'dan gelecek; şimdilik yer tutucu) |
| `/hakkinda` | Proje, sınırlılıklar ("tıbbi araç değildir", "telefon desibelmetre değildir") |
| `/panel` | Ekip paneli (giriş gerekli) |

### 5.1 Harita
- Zoom < 18: **bina işaretçisi** + rozet ("3 mekân"); tıklayınca kat kat mekân listesi.
- Zoom ≥ 18: mekân işaretçileri + **giriş ikonları** (kapı simgesi; basamaksız girişler farklı ikon *ve* "Basamaksız" yazısı).
- Filtre uygulanınca işaretçiler sonuca göre vurgulanır: Uygun = dolu işaretçi, Bilgi eksik = kesikli kenar, Uygun değil = soluk.
- Harita ekran okuyucuyla kullanılamayacağı için **liste görünümü zorunlu** (WCAG): aynı sonuçlar haritanın yanında/altında liste olarak; "Harita / Liste" geçişi.

### 5.2 Filtre çubuğu
- Yatay kaydırılabilir "chip" düğmeler; `aria-pressed` ile durum.
- Seçili filtre sayısı ve "Temizle".
- Seçim URL'de saklanır (`?f=basamaksiz,sessiz`), paylaşılabilir.

### 5.3 Mekân kartı
1. Üst: ad, tür, bina, kat, son güncelleme tarihi.
2. **Binaya nasıl girilir:** binanın girişleri, en erişilebilirden başlayarak: önce doğrulanmış basamaksız, sonra doğrulanmış uygun rampalı, sonra diğerleri. En üstteki "Önerilen giriş" olarak işaretlenir.
3. **Fiziksel:** asansör, iç kapı, erişilebilir WC — her biri durum rozetiyle.
4. **Duyusal:** gürültü (yoğun / sakin saat + ölçüm zamanı), ışık, oturma, sessiz alan, müzik — durum rozetiyle.
5. Eylemler: "Bilgi ekle / düzelt" (bildirim formu), "Bu bilgiyi teyit et" (her teyitsiz değerin yanında), "Hatalı bilgi bildir", "Ortam sesini ölç" (4. haftada Ali'nin modülü; şimdilik devre dışı düğme + açıklama).
6. Mobilde alttan açılan panel (bottom sheet), masaüstünde sağ yan panel.

### 5.4 Ekip paneli (`/panel`)
- Supabase Auth ile e-posta/şifre girişi; hesaplar elle açılır (ekip üyeleri). Kayıt formu yok.
- Bina / giriş / mekân ekle-düzenle. **Konum seçimi: haritaya tıkla → işaretçi düşer → sürükleyerek ince ayar.**
- Her kriter için değer gir + "Yerinde doğrulandı" kutusu.
- Hata bildirimleri listesi, "çözüldü" işaretleme.
- Bekleyen (teyitsiz) bildirimler listesi.

---

## 6. Veri modeli (Supabase / PostgreSQL)

```
binalar        (id, ad, enlem, boylam, notlar, olusturma)
girisler       (id, bina_id → binalar, ad, enlem, boylam, olusturma)
mekanlar       (id, bina_id → binalar, ad, tur, kat, enlem, boylam, foto_url, olusturma)

alanlar        (id, nesne_turu ['giris'|'mekan'], nesne_id, alan_adi, deger,
                durum ['veri_yok'|'teyitsiz'|'dogrulanmis'], kaynak ['ekip'|'kullanici'],
                olcum_zamani, olcum_cihazi, guncelleme)   -- UNIQUE(nesne_turu, nesne_id, alan_adi)

bildirimler    (id, nesne_turu, nesne_id, alan_adi, deger, anonim_id, tarih, durum)
teyitler       (id, bildirim_id → bildirimler, anonim_id, tarih)   -- UNIQUE(bildirim_id, anonim_id)
hata_bildirimleri (id, nesne_turu, nesne_id, aciklama, tarih, cozuldu)
```

- `alan_adi` ve `deger` geçerliliği §2'deki listeye göre kontrol edilir (tek bir `kriterler` tablosu veya CHECK).
- Kriter tanımları (anahtar, etiket, seçenekler, filtre mi) kodda **tek bir dosyada** (`src/data/kriterler.js`) durur; arayüz ve filtre motoru buradan okur. Kriter değişince sadece bu dosya ve şema güncellenir.

### 6.1 Güvenlik (RLS)
- Herkes (anon): binalar/girisler/mekanlar/alanlar **okuma**; bildirimler, teyitler, hata_bildirimleri **ekleme**.
- `alanlar` tablosuna istemci yazamaz; durum değişiklikleri sadece `security definer` fonksiyonlarla (teyit sayısı ≥ 2 → doğrulanmış) veya ekip rolüyle.
- Teyitte `anonim_id ≠ bildirimin anonim_id'si` veritabanında kontrol edilir.
- Panel yazma işlemleri sadece giriş yapmış ekip kullanıcılarına açık.

### 6.2 Anonim kimlik
- Supabase **anonymous sign-in** kullanılır; `anonim_id = auth.uid()`. RLS bu id'yi zorlar, istemci başka id taklit edemez.
- İsim, e-posta, yaş, tanı veya konum geçmişi **hiç sorulmaz ve saklanmaz**.
- Sınırlılık (rapora yazılacak): tarayıcı verisi silinince yeni anonim kimlik oluşur; bu, teyit sisteminin kötüye kullanılmasını tamamen engellemez.

---

## 7. İçerik ve dil kuralları
- Tanı bazlı ifade yok ("otizm için uygun" değil, "sessiz ortam").
- Klinik iddia yok ("anksiyeteyi azaltır" vb.).
- Gürültü için dB sayısı değil aralık; "Telefon ölçümü yaklaşıktır, desibelmetre değildir" notu.
- Arayüz dili Türkçe; metinler tek bir dosyada toplanır (ileride İngilizce eklenebilir).

## 8. Erişilebilirlik (WCAG 2.2 AA)
- Durumlar renk + ikon + metinle; kontrast ≥ 4.5:1.
- Tüm kontroller klavyeyle; görünür odak; dokunma hedefleri ≥ 44 px.
- Harita için liste alternatifi; bottom sheet açılınca odak panele taşınır, Esc ile kapanır.
- `prefers-reduced-motion` desteği.

## 9. Örnek veri
- Gerçek veriler girilene kadar `supabase/seed.sql` ile **açıkça "ÖRNEK" etiketli** veri: 2 bina, 4 giriş, 5 mekân; durumların üçü de temsil edilsin (filtre ve eksik veri testleri için).
- Örnek koordinatlar kampüs merkezine yakın, gerçek konum iddiası taşımaz.

## 10. Haftalara göre kapsam
| Hafta | Kapsam |
| --- | --- |
| 2 | Şema + RLS + seed, bina/giriş/mekân işaretçileri, mekân kartı + rozetler |
| 3 | Filtre motoru + eşleşme kuralı, anonim kimlik, bildirim/teyit/hata akışı, liste görünümü |
| 4 | Ekip paneli (haritaya tıkla-koy), ses modülü entegrasyonu, gizlilik sayfası, mobil kontrol |
| 5 | Sadece hata düzeltme; filtre ve eksik veri testleri |
