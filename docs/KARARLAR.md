# Kararlar

SPEC.md'de yazmayan konularda verilen kararlar (en basit çözüm).

- `kat`, `alanlar`'da bir kriter değil `mekanlar.kat` sütunudur; ekip girdiği için eşleşmede doğrulanmış sayılır.
- Çok biçimli `nesne_id` için yabancı anahtar yok; nesne varlığı bildirim trigger'ında denetlenir, silmede trigger temizler.
- Anonim oturumlar da `authenticated` rolünde olduğu için ekip yetkisi `ekip_uyeleri` tablosu ve `ekip_mi()` ile ayrılır.
- Bekleyen bildirimler herkese `bekleyen_bildirimler()` RPC'siyle, `anonim_id` gizlenerek gösterilir (kartta "Teyit et" ve itiraz notu için gerekli).
- Teyitsiz bir alana yeni bildirim gelirse alan son bildirimin değerini gösterir; eski bildirim yine 2 teyit alırsa doğrulanır.
- Doğrulanmış değerle aynı değeri bildiren bildirim hemen `dogrulandi` olur; teyit beklemez.
- Ekipten "Yerinde doğrulandı" işaretsiz girilen değer `teyitsiz` olur; bunun bir bildirimi olmadığı için kullanıcılar ancak aynı değeri bildirerek teyit sürecini başlatabilir.
- `bildirimler.durum` iki değerlidir: `bekliyor`, `dogrulandi`.
- Sayısal kriterler `alanlar.deger` içinde metin olarak tutulur: en fazla 3 basamak ve 2 ondalık, nokta ile (ör. `1.3`); kartta Türkçe biçimde ("1,3 cm", "%9,5") gösterilir.
- `foto_url` yalnızca `https://` ile başlayabilir.
- `supabase/seed.sql` elle yazılmaz; `npm run seed` ile `src/data/ornekVeri.js`'ten üretilir ve trigger'ları seed süresince kapatır.
- Supabase'de anonim kimlik yalnızca ilk yazma işleminde (bildirim/teyit) açılır; salt gezinti hesap oluşturmaz.
- Hata bildirimi oturum açmadan da gönderilebilir (anonim kimlik gerekmez).
- Yönlendirme için `react-router` (BrowserRouter) kullanılır; Vercel'de doğrudan link açılabilsin diye `vercel.json` tüm yolları `index.html`'e yönlendirir.
- Haritada "Basamaksız" ikonu yalnızca `basamaksiz = var` **doğrulanmış** girişlerde gösterilir; teyitsiz değer popup'ta rozetle görünür.
- Bina işaretçisinin filtre vurgusu, binadaki mekânların en iyi sonucudur (biri uygunsa bina "uygun" görünür).
- Giriş işaretçisine tıklanınca girişin kriterlerini rozetleriyle gösteren bir popup açılır (SPEC'te giriş tıklaması tanımlı değil).
- Bina popup'ına "Yakınlaştır" düğmesi eklendi: tek adımda zoom 18'e geçip mekânları gösterir.
- Örnek koordinatlar işaretçiler zoom 18'de çakışmasın diye 40–100 m aralıklarla yayıldı.
- Kart, veri olmayan kriterleri de "– Veri yok" rozetiyle listeler; neyin eksik olduğu görünür olsun diye.
- ~~"Önerilen giriş" puanı~~ → Nergis'in listesiyle değişti, aşağıya bakın.
- Kart, yan panel/bottom sheet olarak harita üzerinde açılır ve modal değildir (odak kapanı yok); Esc ve "Kapat" haritaya döner, odak kartı açan öğeye geri verilir.
- Mobil kırılım noktası 700 px'tir.
- "Harita / Liste" geçişi ikisinden birini gösterir (yan yana değil); seçim URL'de `g=liste`, "Uygun olmayanları da göster" `hepsi=1` olarak saklanır. Filtreler `?f=` içinde virgülle, kodlanmadan yazılır.
- "Uygun değil" mekânlar listede varsayılan gizli, haritada ise soluk (gri, ince kenar) gösterilir; metin kontrastı yine AA'yı sağlar.
- Teyitsiz ama filtreye UYMAYAN değer (ör. teyitsiz "gürültülü") de "Bilgi eksik" sayılır; yalnızca doğrulanmış değer "Uygun değil" yapar.
- Giriş filtrelerinde bina girişi hiç yoksa sonuç "Bilgi eksik"tir; tüm girişler doğrulanmış şekilde sağlamıyorsa "Uygun değil".
- Liste görünümüne geçince harita kaldırılır; haritaya dönünce zoom varsayılana döner.
- `src/lib/kriterler.test.js`, kriterler.js'deki seçeneklerin migration'daki `gecerli_kriter()` ile aynı olduğunu denetler.
- Bildirim formu kartın içinde açılır; hedef olarak mekânın kendisi veya binanın girişlerinden biri seçilir. Kriter ve seçenekler kriterler.js'den gelir.
- "Hatalı bilgi bildir" serbest metindir ve kartın mekânına bağlanır (`nesne_turu = 'mekan'`).
- "Teyit et" düğmesi, teyitsiz değerle aynı değere sahip bekleyen bir bildirim varsa çıkar; ekipten gelen teyitsiz değerde düğme yoktur.
- Kullanıcı kendi bildiriminde düğme yerine "Bu bildirimi siz yaptınız" notunu, daha önce teyit ettiği bildirimde "Teyit ettiniz" notunu görür.
- Teyit ya da bildirim sonrası sonuç metni satırda/canlı bölgede gösterilir ve odak oraya taşınır (değer doğrulanınca düğme kalkar, odak kaybolmasın diye).
- Bildirim sonrası mesaj, gönderim anındaki alan durumuna göre seçilir (yeni / zaten doğrulanmış / itiraz).
- Panelde silme yok (SPEC yalnızca ekle/düzenle diyor); silme gerekirse Supabase tablo editöründen yapılır, bağlı kayıtları trigger temizler.
- Panel bölümleri (kayıtlar / hatalar / bekleyen) `aria-pressed` düğmelerle seçilir; ok tuşlu sekme (tablist) davranışı yerine basit düğme grubu.
- Konum seçicide sürüklemeye alternatif olarak enlem/boylam sayı alanları var (WCAG 2.5.7); koordinatlar 6 ondalığa yuvarlanır.
- Panelde yalnızca değiştirilen kriterler kaydedilir; değer boşaltılırsa alan `veri_yok` olur. "Yerinde doğrulandı" değer seçilmeden işaretlenemez.
- Ölçüm zamanı tarayıcının yerel saatiyle girilir ve ISO (UTC) olarak saklanır.
- Supabase'de giriş yapan hesap `ekip_uyeleri`'nde değilse panel "ekip üyesi değil" uyarısı ve çıkış düğmesi gösterir.
- "Ortam sesini ölç" düğmesi `disabled` yerine `aria-disabled` ile devre dışıdır; klavye ve ekran okuyucu "4. haftada eklenecek" açıklamasına ulaşabilsin diye.
- Kart masaüstünde filtre çubuğunun altında, yalnızca harita/liste alanında açılır; mobilde alttan açılan panel alt bilgiyi örter.
- Kart kapanınca açan öğe artık yoksa (ör. teyitten sonra mekân başka sonuç grubuna geçti) odak aynı mekânın linkine döner.
- Filtre/görünüm düğmeleri URL'yi çağrı anındaki `window.location`'dan okur; hızlı ardışık tıklamalarda seçim kaybolmaz.
- Ekran görüntüleri ve klavye testi `playwright-core` + sistemdeki Chrome ile alınır; ayrı tarayıcı indirilmez.
- Her sayfa kendi `<title>`'ını ayarlar (açık kartta mekân adı).

## Nergis Zeynep'in kesin kriter listesi (2026-11-06)

Güncelleme listenin özetine ve eşleştirme kararlarına dayanarak yapıldı. `docs/kriterler-nergis.md` sonradan eklendi; kriterler.js ile karşılaştırmada çıkan farklar ekibin kararını bekliyor (henüz koda yansıtılmadı).

**Değişen kriterler**
- Giriş: `giris_turu` → ana / yan / erisilebilir_alternatif (acil_cikis kalktı).
- Kapı: tek alan bölündü → `kapi_tipi` (otomatik / elle) + `kapi_acilma` (kolay / agir) + `esik_cm` (sayı, ≤ 1,3 uygun). Döner kapı seçeneği kalktı.
- Rampa: tek `rampa` alanı → `rampa_var` (var / yok / gerek_yok) + `rampa_durumu` (uygun / cok_dik / onu_kapali) + `rampa_genislik_cm` (≥ 100 uygun) + `rampa_egim_yuzde`.
- Asansör: tek `asansor` alanı → `asansor_var` + `asansor_calisiyor` + `asansor_tekerlekli` + `asansor_kabin` (metin, ör. "110x140") + `asansor_kapi_cm`.
- Işık: tek `isik` alanı → `gun_isigi` + `yapay_isik` (led / floresan / diger) + `acik_floresan` + `dogal_aydinlik_alan`. "Loş" seçeneği kalktı.
- Müzik: yok / dusuk / yuksek → var / yok.
- Oturma: `mobilya_duzeni` (acik / sik_dizilmis) ve `alternatif_oturma` (var / yok) eklendi; filtreye girmez, kartta bilgi olarak gösterilir.
- Gürültü: `alanlar.olcum_cihazi` sütunu eklendi.

**Filtreler**
- "Rampa var": (rampa_var = var VE rampa_durumu = uygun) VEYA basamaksiz = var olan doğrulanmış giriş.
- "Asansörle ulaşılabilir": kat = 0 VEYA (asansor_var = var VE asansor_calisiyor = evet VE asansor_tekerlekli = uygun).
- "Doğal ışık" artık `gun_isigi = var`a bakar; `dogal_aydinlik_alan` filtreye girmez.
- Yeni filtre: "Açıkta floresan yok" (`acik_floresan = yok`).
- Filtre koşulları artık "alternatifler (VEYA) içinde koşullar (VE)" yapısında. VE grubunda doğrulanmış tek bir "hayır" (ör. rampa önü kapalı, asansör çalışmıyor) o alternatifi kesin olarak düşürür; doğrulanmamış bir koşul varsa sonuç "Bilgi eksik"tir.

**Uygulama kararları**
- Migration'lar henüz hiçbir veritabanına uygulanmadığı için yeni migration yazılmadı, mevcut dosyalar yerinde güncellendi. Supabase'e uygulandıktan sonraki değişiklikler yeni migration dosyalarıyla yapılacak.
- Önerilen giriş sırası: doğrulanmış basamaksız → doğrulanmış (rampa_var = var ve rampa_durumu = uygun) → diğerleri; grup içinde kayıt sırası korunur. En üstteki giriş yalnızca doğrulanmış basamaksız ya da doğrulanmış uygun rampalıysa "Önerilen giriş" olarak işaretlenir; yoksa etiket verilmez ve girişlerin üstünde "Bu bina için doğrulanmış erişilebilir giriş bilgisi yok" yazar (2026-11-06, Mustafa'nın kararı).
- Bağlı alanlar: rampa ayrıntıları `rampa_var = var`, asansör ayrıntıları `asansor_var = var` değilse kartta ve giriş popup'ında gizlenir. Üst alan bilinmiyorsa ya da bağlı alanın kendi verisi varsa gösterilir.
- Sınır dışı sayılar kartta uyarıyla gösterilir: eşik > 1,3 cm, kapı / asansör kapısı / mekân kapısı < 90 cm, rampa genişliği < 100 cm.
- `olcum_cihazi` seçenekleri `ses_modulu` (telefon) ve `spl_metre` olarak varsayıldı (SPEC'teki "ses modülü veya SPL metre" ifadesinden); Nergis'in listesinde seçenekler belirtilmemişti. Kullanıcı bildirimlerinde boş kalır, ekip panelden girer.
- Nergis'in listesinde karar kuralı belirtilmeyen alanlar için SPEC §2'de "Belirlenecek" yazıldı (kapi_tipi, kapi_acilma, gun_isigi, acik_floresan, dogal_aydinlik_alan, mobilya_duzeni, alternatif_oturma). Eski SPEC'teki kurallar karşılığı olan alanlara taşındı (eşik, rampa eğimi, TS EN 81-70 asansör ölçüleri).
- Örnek veri: Güney kapısının rampası var ama önü kapalı; Çalışma Salonu'nun asansörü çalışıyor ama tekerlekli sandalyeye uygun değil, açıkta floresan bilgisi teyitsiz (bekleyen bildirimi ve 1 teyidi var). Kafe'de gün ışığına itiraz var.
- Klavye testi artık "Açıkta floresan yok" filtresi → Çalışma Salonu → açıkta floresan bilgisini teyit et akışını dener.

**Açık sorular (Nergis'e soruldu, yanıt bekleniyor)**
- **Açık soru:** Rampa girişe mi bağlı, mekâna mı? Şimdilik girişin özelliği olarak tutuluyor.
- **Açık soru:** "Clear interior door width" (`ic_kapi_cm`) binanın giriş kapısını mı, mekânın kendi kapısını mı kastediyor? Şimdilik mekânın kapısı; giriş kapısı ayrıca `kapi_genisligi_cm`.
- **Açık soru:** `gun_isigi` ile `dogal_aydinlik_alan` arasındaki fark ne? Şimdilik: `gun_isigi` = mekânda gün ışığı var; `dogal_aydinlik_alan` = gün ışığı alan ayrı bir bölüm var. İkisi de tutuluyor, filtre yalnızca `gun_isigi`na bakıyor.
- Ayrıca sorulacak: Görev listesindeki Google Forms formu bu listeye dönüşecek mi, ne zaman hazır olur?
