-- OTOMATİK ÜRETİLDİ: elle düzenlemeyin. Kaynak: src/data/ornekVeri.js → npm run seed
-- SPEC §9 örnek verisi ("ÖRNEK –" etiketli; gerçek konum iddiası taşımaz).
-- Gerçek veri girildikten sonra ÇALIŞTIRMAYIN: tablolardaki tüm kayıtları siler.

begin;

alter table public.bildirimler disable trigger user;
alter table public.teyitler disable trigger user;
alter table public.girisler disable trigger user;
alter table public.mekanlar disable trigger user;

delete from public.hata_bildirimleri;
delete from public.teyitler;
delete from public.bildirimler;
delete from public.alanlar;
delete from public.mekanlar;
delete from public.girisler;
delete from public.binalar;

insert into public.binalar (id, ad, enlem, boylam, notlar, olusturma) overriding system value values
  (1, 'ÖRNEK – Ana Bina', 38.738, 35.4736, 'Örnek veri; gerçek bina değildir.', '2026-11-02T10:00:00+03:00'),
  (2, 'ÖRNEK – Kafe Binası', 38.7369, 35.4722, 'Örnek veri; gerçek bina değildir.', '2026-11-02T10:00:00+03:00');

insert into public.girisler (id, bina_id, ad, enlem, boylam, olusturma) overriding system value values
  (1, 1, 'ÖRNEK – Kuzey kapısı', 38.73815, 35.47355, '2026-11-02T10:00:00+03:00'),
  (2, 1, 'ÖRNEK – Güney kapısı', 38.73782, 35.4737, '2026-11-02T10:00:00+03:00'),
  (3, 2, 'ÖRNEK – Ön kapı', 38.73702, 35.47212, '2026-11-02T10:00:00+03:00'),
  (4, 2, 'ÖRNEK – Yan kapı', 38.73684, 35.47236, '2026-11-02T10:00:00+03:00');

insert into public.mekanlar (id, bina_id, ad, tur, kat, enlem, boylam, foto_url, olusturma) overriding system value values
  (1, 1, 'ÖRNEK – Kütüphane', 'kutuphane', 1, 38.73806, 35.47342, null, '2026-11-02T10:00:00+03:00'),
  (2, 1, 'ÖRNEK – Çalışma Salonu', 'calisma_salonu', 2, 38.73798, 35.47374, null, '2026-11-02T10:00:00+03:00'),
  (3, 1, 'ÖRNEK – Yemekhane', 'yemekhane', 0, 38.73789, 35.47348, null, '2026-11-02T10:00:00+03:00'),
  (4, 2, 'ÖRNEK – Kafe', 'kafe', 0, 38.73694, 35.47216, null, '2026-11-02T10:00:00+03:00'),
  (5, 2, 'ÖRNEK – Toplantı Odası', 'diger', 1, 38.73686, 35.47226, null, '2026-11-02T10:00:00+03:00');

insert into public.alanlar (id, nesne_turu, nesne_id, alan_adi, deger, durum, kaynak, olcum_zamani, guncelleme) overriding system value values
  (1, 'giris', 1, 'giris_turu', 'ana', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (2, 'giris', 1, 'basamaksiz', 'var', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (3, 'giris', 1, 'rampa', 'gerek_yok', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (4, 'giris', 1, 'kapi_genisligi_cm', '120', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (5, 'giris', 1, 'kapi_tipi', 'otomatik', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (6, 'giris', 1, 'acik_saatler', 'Hafta içi 08:00–22:00', 'teyitsiz', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (7, 'giris', 2, 'giris_turu', 'yan', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (8, 'giris', 2, 'basamaksiz', 'yok', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (9, 'giris', 2, 'rampa', 'var_ama_dik', 'teyitsiz', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (10, 'giris', 2, 'kapi_genisligi_cm', '80', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (11, 'giris', 2, 'kapi_tipi', 'el_ile_agir', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (12, 'giris', 3, 'giris_turu', 'ana', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (13, 'giris', 3, 'basamaksiz', 'yok', 'teyitsiz', 'kullanici', null, '2026-11-04T09:15:00+03:00'),
  (14, 'giris', 3, 'rampa', 'uygun', 'teyitsiz', 'kullanici', null, '2026-11-04T09:20:00+03:00'),
  (15, 'giris', 3, 'kapi_tipi', 'el_ile_hafif', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (16, 'giris', 4, 'basamaksiz', null, 'veri_yok', null, null, '2026-11-02T10:00:00+03:00'),
  (17, 'mekan', 1, 'asansor', 'var_calisiyor', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (18, 'mekan', 1, 'ic_kapi_cm', '100', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (19, 'mekan', 1, 'erisilebilir_wc', 'var', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (20, 'mekan', 1, 'gurultu_yogun', 'sessiz', 'dogrulanmis', 'ekip', '2026-11-03T13:00:00+03:00', '2026-11-02T10:00:00+03:00'),
  (21, 'mekan', 1, 'gurultu_sakin', 'sessiz', 'dogrulanmis', 'ekip', '2026-11-03T09:00:00+03:00', '2026-11-02T10:00:00+03:00'),
  (22, 'mekan', 1, 'isik', 'dogal', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (23, 'mekan', 1, 'oturma', 'seyrek', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (24, 'mekan', 1, 'sessiz_alan', 'var', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (25, 'mekan', 1, 'muzik', 'yok', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (26, 'mekan', 2, 'asansor', 'var_calisiyor', 'teyitsiz', 'kullanici', null, '2026-11-04T11:00:00+03:00'),
  (27, 'mekan', 2, 'gurultu_yogun', 'orta', 'dogrulanmis', 'ekip', '2026-11-03T12:30:00+03:00', '2026-11-02T10:00:00+03:00'),
  (28, 'mekan', 2, 'isik', 'floresan', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (29, 'mekan', 2, 'oturma', null, 'veri_yok', null, null, '2026-11-02T10:00:00+03:00'),
  (30, 'mekan', 3, 'asansor', 'gerek_yok', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (31, 'mekan', 3, 'erisilebilir_wc', 'var', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (32, 'mekan', 3, 'gurultu_yogun', 'gurultulu', 'dogrulanmis', 'ekip', '2026-11-03T12:15:00+03:00', '2026-11-02T10:00:00+03:00'),
  (33, 'mekan', 3, 'gurultu_sakin', 'orta', 'teyitsiz', 'kullanici', '2026-11-04T15:30:00+03:00', '2026-11-04T15:30:00+03:00'),
  (34, 'mekan', 3, 'isik', 'led', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (35, 'mekan', 3, 'oturma', 'sik', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (36, 'mekan', 3, 'muzik', 'dusuk', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (37, 'mekan', 4, 'gurultu_yogun', 'orta', 'teyitsiz', 'ekip', '2026-11-03T16:00:00+03:00', '2026-11-02T10:00:00+03:00'),
  (38, 'mekan', 4, 'isik', 'dogal', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (39, 'mekan', 4, 'oturma', 'orta', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00'),
  (40, 'mekan', 4, 'muzik', 'dusuk', 'dogrulanmis', 'ekip', null, '2026-11-02T10:00:00+03:00');

insert into public.bildirimler (id, nesne_turu, nesne_id, alan_adi, deger, anonim_id, tarih, durum) overriding system value values
  (1, 'mekan', 2, 'asansor', 'var_calisiyor', '00000000-0000-4000-8000-000000000001', '2026-11-04T11:00:00+03:00', 'bekliyor'),
  (2, 'giris', 3, 'rampa', 'uygun', '00000000-0000-4000-8000-000000000002', '2026-11-04T09:20:00+03:00', 'bekliyor'),
  (3, 'mekan', 4, 'isik', 'led', '00000000-0000-4000-8000-000000000003', '2026-11-05T10:00:00+03:00', 'bekliyor'),
  (4, 'mekan', 3, 'gurultu_sakin', 'orta', '00000000-0000-4000-8000-000000000001', '2026-11-04T15:30:00+03:00', 'bekliyor'),
  (5, 'giris', 3, 'basamaksiz', 'yok', '00000000-0000-4000-8000-000000000004', '2026-11-04T09:15:00+03:00', 'bekliyor');

insert into public.teyitler (id, bildirim_id, anonim_id, tarih) overriding system value values
  (1, 1, '00000000-0000-4000-8000-000000000002', '2026-11-04T12:00:00+03:00');

insert into public.hata_bildirimleri (id, nesne_turu, nesne_id, aciklama, tarih, cozuldu) overriding system value values
  (1, 'mekan', 3, 'ÖRNEK: Yemekhane kapısının yeri değişmiş olabilir.', '2026-11-05T14:00:00+03:00', false);

alter table public.bildirimler enable trigger user;
alter table public.teyitler enable trigger user;
alter table public.girisler enable trigger user;
alter table public.mekanlar enable trigger user;

select setval(pg_get_serial_sequence('public.binalar', 'id'), coalesce((select max(id) from public.binalar), 0) + 1, false);
select setval(pg_get_serial_sequence('public.girisler', 'id'), coalesce((select max(id) from public.girisler), 0) + 1, false);
select setval(pg_get_serial_sequence('public.mekanlar', 'id'), coalesce((select max(id) from public.mekanlar), 0) + 1, false);
select setval(pg_get_serial_sequence('public.alanlar', 'id'), coalesce((select max(id) from public.alanlar), 0) + 1, false);
select setval(pg_get_serial_sequence('public.bildirimler', 'id'), coalesce((select max(id) from public.bildirimler), 0) + 1, false);
select setval(pg_get_serial_sequence('public.teyitler', 'id'), coalesce((select max(id) from public.teyitler), 0) + 1, false);
select setval(pg_get_serial_sequence('public.hata_bildirimleri', 'id'), coalesce((select max(id) from public.hata_bildirimleri), 0) + 1, false);

commit;
