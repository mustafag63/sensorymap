# Veritabanı Şeması — İlk Taslak (1. hafta)

> **Durum:** Taslak. Henüz Supabase'de çalıştırılmadı.
> SQL karşılığı: [`supabase/schema.sql`](../supabase/schema.sql)

> ⚠️ **Nergis'in kesin kriter listesi gelince güncellenecek.** Aşağıdaki alan adları ve değer seçenekleri geçicidir.

## Gizlilik ilkesi

**Hiçbir tabloda isim, e-posta, yaş, tanı ya da sağlık bilgisi alanı yoktur ve eklenmeyecektir.**
Kullanıcı katkıları yalnızca cihazda rastgele üretilen bir `anonim_id` (UUID) ile ilişkilendirilir; bu kimlik bir kişiyle eşleştirilmez. Ayrıntılı gizlilik ve eşik kuralları Sena Nur tarafından belirlenecek.

Arayüzde ve veride tanı bazlı ifade kullanılmaz; mekânlar ortam özellikleriyle tanımlanır (ör. "sessiz ortam", "doğal ışık").

## Tablolar

### `mekanlar`
| Sütun | Tür | Not |
|---|---|---|
| id | bigint, PK | otomatik |
| ad | text | zorunlu |
| tur | text | `kutuphane` / `yemekhane` / `calisma_salonu` / `kafe` |
| enlem | double precision | -90..90 |
| boylam | double precision | -180..180 |
| foto_url | text | isteğe bağlı |
| olusturma_tarihi | timestamptz | varsayılan `now()` |

### `alanlar`
Bir mekânın her kriteri için güncel durum.

| Sütun | Tür | Not |
|---|---|---|
| id | bigint, PK | |
| mekan_id | bigint, FK → mekanlar.id | |
| alan_adi | text | aşağıdaki listeden |
| deger | text | `durum = veri_yok` ise boş olabilir |
| durum | text | `veri_yok` / `teyitsiz` / `dogrulanmis` |
| olcum_zamani | timestamptz | Gürültü günün saatine göre değiştiği için ölçüm anı ayrıca tutulur |
| guncelleme_tarihi | timestamptz | |

### `bildirimler`
| Sütun | Tür | Not |
|---|---|---|
| id | bigint, PK | |
| mekan_id | bigint, FK → mekanlar.id | |
| alan_adi | text | |
| deger | text | alan_adi ile uyumlu olmalı |
| anonim_id | uuid | kişisel veri değil |
| tarih | timestamptz | |

### `teyitler`
| Sütun | Tür | Not |
|---|---|---|
| id | bigint, PK | |
| bildirim_id | bigint, FK → bildirimler.id | |
| anonim_id | uuid | |
| tarih | timestamptz | |

- `UNIQUE (bildirim_id, anonim_id)`: aynı kişi aynı bildirimi iki kez teyit edemez.
- **Not:** Kişi kendi bildirimini teyit edemez (`teyitler.anonim_id ≠ bildirimler.anonim_id`). Bu mantık **3. haftada** trigger veya RLS politikasıyla uygulanacak.

### `hata_bildirimleri`
| Sütun | Tür | Not |
|---|---|---|
| id | bigint, PK | |
| mekan_id | bigint, FK → mekanlar.id | |
| aciklama | text | en fazla 1000 karakter |
| tarih | timestamptz | |
| cozuldu | boolean | varsayılan `false` |

## Alan adları ve değer seçenekleri (geçici)

Şimdilik `CHECK` kısıtlarıyla uygulanıyor (`gecerli_alan_degeri()` fonksiyonu, hem `alanlar` hem `bildirimler` için).

| alan_adi | İzin verilen değerler |
|---|---|
| rampa | `var`, `yok` |
| asansor | `var_calisiyor`, `var_calismiyor`, `yok`, `gerek_yok` |
| basamaksiz_giris | `var`, `yok` |
| gurultu | `sessiz`, `orta`, `gurultulu` |
| isik | `dogal`, `floresan`, `led`, `los` |
| oturma_yogunlugu | `seyrek`, `orta`, `sik` |

## Row Level Security

Supabase'de **tüm tablolarda RLS açılacak** (`schema.sql` sonunda `enable row level security` satırları var). Politikalar henüz yazılmadı; politika olmadan anon anahtarla erişim kapalıdır. Okuma/yazma politikaları ilerleyen haftalarda eklenecek.

## Açık konular
- [ ] Nergis'in kesin kriter listesi → alan adları/değerler güncellenecek
- [ ] Kendi bildirimini teyit engeli (3. hafta)
- [ ] RLS politikaları
- [ ] `durum` alanının `teyitsiz → dogrulanmis` geçiş eşiği (Sena Nur)
