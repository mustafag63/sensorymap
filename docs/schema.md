# Veritabanı Şeması

> Kaynak: [`docs/SPEC.md`](SPEC.md) §6. SQL: [`supabase/migrations/`](../supabase/migrations/), örnek veri: [`supabase/seed.sql`](../supabase/seed.sql).
>
> ⚠️ **Kriter listesi temsilidir.** Nergis'in kesin kriter listesi ve Sena Nur'un eşikleri gelince güncellenecek. Bir kriter değişirse şu üç yer birlikte güncellenir: `src/data/kriterler.js`, `gecerli_kriter()` / `gecerli_kriter_anahtari()` (migration), bu belge. `src/lib/kriterler.test.js`, JS ile SQL listelerinin uyumunu denetler.

## Gizlilik ilkesi

**Hiçbir tabloda isim, e-posta, yaş, tanı, sağlık bilgisi veya konum geçmişi yoktur ve eklenmeyecektir.**
Kullanıcı katkıları yalnızca Supabase anonymous sign-in ile üretilen `anonim_id = auth.uid()` ile ilişkilendirilir. Bu kimlik dışarıya verilmez: bekleyen bildirimler herkese `bekleyen_bildirimler()` fonksiyonuyla `anonim_id` olmadan gösterilir.
`ekip_uyeleri` yalnızca ekip hesaplarının Supabase Auth kimliğini tutar (e-posta Supabase Auth'ta durur, bu tablolarda değil).

## Model: Bina → Giriş → Mekân

```
binalar  (id, ad, enlem, boylam, notlar, olusturma)
girisler (id, bina_id → binalar, ad, enlem, boylam, olusturma)
mekanlar (id, bina_id → binalar, ad, tur, kat, enlem, boylam, foto_url, olusturma)

alanlar  (id, nesne_turu ['giris'|'mekan'], nesne_id, alan_adi, deger,
          durum ['veri_yok'|'teyitsiz'|'dogrulanmis'], kaynak ['ekip'|'kullanici'],
          olcum_zamani, guncelleme)                 UNIQUE(nesne_turu, nesne_id, alan_adi)

bildirimler       (id, nesne_turu, nesne_id, alan_adi, deger, anonim_id, tarih, durum ['bekliyor'|'dogrulandi'])
teyitler          (id, bildirim_id → bildirimler, anonim_id, tarih)   UNIQUE(bildirim_id, anonim_id)
hata_bildirimleri (id, nesne_turu, nesne_id, aciklama, tarih, cozuldu)
ekip_uyeleri      (kullanici_id → auth.users, eklenme)
```

- `mekanlar.tur`: `kutuphane`, `yemekhane`, `calisma_salonu`, `kafe`, `diger`.
- `mekanlar.kat`: 0 giriş katıdır. Kat ekip tarafından girilir ve eşleşmede doğrulanmış sayılır.
- `alanlar` içinde satırın olmaması `veri_yok` ile aynı anlama gelir.
- `durum = veri_yok` ⇔ `deger is null` (CHECK).
- `olcum_zamani` gürültü kriterleri için tutulur: aynı yer sabah sessiz, öğlen gürültülü olabilir.
- `nesne_id` çok biçimli olduğu için yabancı anahtar yok. Varlığı, bildirim eklenirken trigger denetler; giriş/mekân silinince bağlı kayıtlar trigger ile silinir.

## Kriterler ve geçerli değerler

| nesne | alan_adi | Değerler |
|---|---|---|
| giris | giris_turu | ana, yan, acil_cikis |
| giris | basamaksiz | var, yok |
| giris | rampa | uygun, var_ama_dik, yok, gerek_yok |
| giris | kapi_genisligi_cm | 0–999 tam sayı (metin olarak) |
| giris | kapi_tipi | otomatik, el_ile_hafif, el_ile_agir, doner |
| giris | acik_saatler | 1–200 karakter metin |
| mekan | asansor | var_calisiyor, var_calismiyor, yok, gerek_yok |
| mekan | ic_kapi_cm | 0–999 tam sayı |
| mekan | erisilebilir_wc | var, yok |
| mekan | gurultu_yogun, gurultu_sakin | sessiz, orta, gurultulu |
| mekan | isik | dogal, led, floresan, los |
| mekan | oturma | seyrek, orta, sik |
| mekan | sessiz_alan | var, yok |
| mekan | muzik | yok, dusuk, yuksek |

## Durum hesabı (veritabanında)

| Olay | Sonuç |
|---|---|
| Ekip panelden değer girer, "Yerinde doğrulandı" işaretli | `dogrulanmis`, kaynak `ekip` |
| Ekip panelden değer girer, işaretsiz | `teyitsiz`, kaynak `ekip` |
| Kullanıcı bildirimi, alan yok / `veri_yok` / `teyitsiz` | alan yeni değerle `teyitsiz` olur (son bildirim görünür) |
| Kullanıcı bildirimi, alan `dogrulanmis` ve aynı değer | bildirim hemen `dogrulandi` olur, alan değişmez |
| Kullanıcı bildirimi, alan `dogrulanmis` ve farklı değer | alan değişmez; kartta "Bu bilgiye itiraz var" |
| Bildirim, sahibi dışında 2 farklı kişiden teyit alır | alan bildirimin değeriyle `dogrulanmis` olur (itiraz da böyle yer değiştirir) |

Trigger'lar (`security definer`, `search_path = ''`):
- `bildirim_hazirla`: tarih/durum istemciden alınmaz, nesne var olmalı.
- `bildirim_sonrasi`: yukarıdaki tablo.
- `teyit_hazirla`: **kişi kendi bildirimini teyit edemez**, sonuçlanmış bildirim teyit edilemez. Aynı kişinin ikinci teyidini UNIQUE kısıtı engeller.
- `teyit_sonrasi`: 2 teyit, değeri doğrulanmış yapar.
- `nesne_temizle`: silinen giriş/mekânın kayıtlarını temizler.

Fonksiyonlar: `ekip_mi()`, `bekleyen_bildirimler()` (her ikisi de RPC ile çağrılabilir).

## Row Level Security

Tüm tablolarda RLS açık. Supabase'de anonymous sign-in oturumları da `authenticated` rolündedir; ekip yetkisi `ekip_mi()` ile ayrılır.

| Tablo | Okuma | Yazma |
|---|---|---|
| binalar, girisler, mekanlar | herkes | ekip |
| alanlar | herkes | yalnızca ekip ve trigger'lar |
| bildirimler | ekip (diğerleri `bekleyen_bildirimler()` ile, anonim_id'siz) | oturum açmış herkes, yalnızca `anonim_id = auth.uid()` ile |
| teyitler | ekip | oturum açmış herkes, yalnızca `anonim_id = auth.uid()` ile |
| hata_bildirimleri | ekip | herkes ekler (`cozuldu = false`); ekip günceller |
| ekip_uyeleri | yalnızca `ekip_mi()` üzerinden | yalnızca SQL editöründen |

## Test

`supabase/tests/senaryolar.sql`, kuralları gerçek Postgres'te dener: RLS, kendi bildirimini teyit, çift teyit, 2 teyitle doğrulama, itiraz, ekip yetkisi, silme. Supabase dışında çalıştırmak için önce `supabase/tests/supabase-iskelet.sql` (rolleri ve `auth.uid()`'yi taklit eder), sonra migration'lar ve `seed.sql` uygulanır.

## Sınırlılık

Tarayıcı verisi silinince yeni bir anonim kimlik oluşur. Bu nedenle teyit sistemi kötüye kullanıma karşı tamamen korunaklı değildir (SPEC §6.2).
