-- SensoryMap — Veritabanı şeması İLK TASLAK (1. hafta)
-- HENÜZ ÇALIŞTIRILMADI. Ayrıntılar ve notlar için: docs/schema.md
-- Kişisel veri YOK: hiçbir tabloda isim, e-posta, yaş, tanı veya sağlık bilgisi tutulmaz.
-- Değer seçenekleri geçicidir; Nergis'in kesin kriter listesi gelince güncellenecek.

-- ---------------------------------------------------------------
-- mekanlar
-- ---------------------------------------------------------------
create table mekanlar (
  id               bigint generated always as identity primary key,
  ad               text not null,
  tur              text not null
                   check (tur in ('kutuphane', 'yemekhane', 'calisma_salonu', 'kafe')),
  enlem            double precision not null check (enlem between -90 and 90),
  boylam           double precision not null check (boylam between -180 and 180),
  foto_url         text,
  olusturma_tarihi timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Alan adı + değer kombinasyonlarının ortak kontrolü.
-- alanlar ve bildirimler tablolarında aynı kural kullanılır.
-- ---------------------------------------------------------------
create or replace function gecerli_alan_degeri(alan text, deger text)
returns boolean
language sql
immutable
as $$
  select case alan
    when 'rampa'             then deger in ('var', 'yok')
    when 'asansor'           then deger in ('var_calisiyor', 'var_calismiyor', 'yok', 'gerek_yok')
    when 'basamaksiz_giris'  then deger in ('var', 'yok')
    when 'gurultu'           then deger in ('sessiz', 'orta', 'gurultulu')
    when 'isik'              then deger in ('dogal', 'floresan', 'led', 'los')
    when 'oturma_yogunlugu'  then deger in ('seyrek', 'orta', 'sik')
    else false
  end;
$$;

-- ---------------------------------------------------------------
-- alanlar: bir mekânın her kriteri için güncel durum
-- ---------------------------------------------------------------
create table alanlar (
  id                bigint generated always as identity primary key,
  mekan_id          bigint not null references mekanlar(id) on delete cascade,
  alan_adi          text not null
                    check (alan_adi in ('rampa', 'asansor', 'basamaksiz_giris',
                                        'gurultu', 'isik', 'oturma_yogunlugu')),
  deger             text,  -- durum = 'veri_yok' iken boş olabilir
  durum             text not null default 'veri_yok'
                    check (durum in ('veri_yok', 'teyitsiz', 'dogrulanmis')),
  olcum_zamani      timestamptz,  -- gürültü günün saatine göre değiştiği için ölçüm anı
  guncelleme_tarihi timestamptz not null default now(),
  check (deger is null or gecerli_alan_degeri(alan_adi, deger)),
  check (durum = 'veri_yok' or deger is not null)
);

create index alanlar_mekan_idx on alanlar (mekan_id);

-- ---------------------------------------------------------------
-- bildirimler: kullanıcıların anonim katkıları
-- ---------------------------------------------------------------
create table bildirimler (
  id        bigint generated always as identity primary key,
  mekan_id  bigint not null references mekanlar(id) on delete cascade,
  alan_adi  text not null
            check (alan_adi in ('rampa', 'asansor', 'basamaksiz_giris',
                                'gurultu', 'isik', 'oturma_yogunlugu')),
  deger     text not null,
  anonim_id uuid not null,  -- cihazda üretilen rastgele kimlik, kişiyle ilişkilendirilmez
  tarih     timestamptz not null default now(),
  check (gecerli_alan_degeri(alan_adi, deger))
);

create index bildirimler_mekan_idx on bildirimler (mekan_id);

-- ---------------------------------------------------------------
-- teyitler: bir bildirimi başka kullanıcıların onaylaması
-- ---------------------------------------------------------------
create table teyitler (
  id          bigint generated always as identity primary key,
  bildirim_id bigint not null references bildirimler(id) on delete cascade,
  anonim_id   uuid not null,
  tarih       timestamptz not null default now(),
  -- Aynı anonim_id aynı bildirimi iki kez teyit edemez:
  unique (bildirim_id, anonim_id)
);
-- NOT: Kişi kendi bildirimini teyit edemez (teyitler.anonim_id <> bildirimler.anonim_id).
-- Bu kural 3. haftada trigger veya RLS politikası olarak uygulanacak.

-- ---------------------------------------------------------------
-- hata_bildirimleri: mekân bilgisi yanlışsa kullanıcı geri bildirimi
-- ---------------------------------------------------------------
create table hata_bildirimleri (
  id       bigint generated always as identity primary key,
  mekan_id bigint not null references mekanlar(id) on delete cascade,
  aciklama text not null check (char_length(aciklama) <= 1000),
  tarih    timestamptz not null default now(),
  cozuldu  boolean not null default false
);

-- ---------------------------------------------------------------
-- Row Level Security (RLS)
-- Tüm tablolarda RLS açılacak. Politikalar (kim okur / kim yazar)
-- sonraki haftalarda tanımlanacak; politika yokken anon erişim kapalıdır.
-- ---------------------------------------------------------------
alter table mekanlar          enable row level security;
alter table alanlar           enable row level security;
alter table bildirimler       enable row level security;
alter table teyitler          enable row level security;
alter table hata_bildirimleri enable row level security;
