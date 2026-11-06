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
- Sayısal kriterler (`kapi_genisligi_cm`, `ic_kapi_cm`) `alanlar.deger` içinde metin olarak (0–999) tutulur.
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
- "Önerilen giriş" puanı: basamaksız (4) + uygun rampa (2) + otomatik kapı (1) − acil çıkış (1); teyitsiz bilgi yarım puan alır, puanı 0 olan giriş "önerilen" diye etiketlenmez.
- Kart, yan panel/bottom sheet olarak harita üzerinde açılır ve modal değildir (odak kapanı yok); Esc ve "Kapat" haritaya döner, odak kartı açan öğeye geri verilir.
- Mobil kırılım noktası 700 px'tir.
