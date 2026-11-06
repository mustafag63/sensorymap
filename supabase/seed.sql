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
  (2, 'ÖRNEK – Kafe Binası', 38.7366, 35.4718, 'Örnek veri; gerçek bina değildir.', '2026-11-02T10:00:00+03:00');

insert into public.girisler (id, bina_id, ad, enlem, boylam, olusturma) overriding system value values
  (1, 1, 'ÖRNEK – Kuzey kapısı', 38.7387, 35.4738, '2026-11-02T10:00:00+03:00'),
  (2, 1, 'ÖRNEK – Güney kapısı', 38.7373, 35.4739, '2026-11-02T10:00:00+03:00'),
  (3, 2, 'ÖRNEK – Ön kapı', 38.737, 35.4723, '2026-11-02T10:00:00+03:00'),
  (4, 2, 'ÖRNEK – Yan kapı', 38.736, 35.4712, '2026-11-02T10:00:00+03:00');

insert into public.mekanlar (id, bina_id, ad, tur, kat, enlem, boylam, foto_url, olusturma) overriding system value values
  (1, 1, 'ÖRNEK – Kütüphane', 'kutuphane', 1, 38.7384, 35.4729, null, '2026-11-02T10:00:00+03:00'),
  (2, 1, 'ÖRNEK – Çalışma Salonu', 'calisma_salonu', 2, 38.738, 35.4744, null, '2026-11-02T10:00:00+03:00'),
  (3, 1, 'ÖRNEK – Yemekhane', 'yemekhane', 0, 38.73755, 35.473, null, '2026-11-02T10:00:00+03:00'),
  (4, 2, 'ÖRNEK – Kafe', 'kafe', 0, 38.7368, 35.4712, null, '2026-11-02T10:00:00+03:00'),
  (5, 2, 'ÖRNEK – Toplantı Odası', 'diger', 1, 38.7362, 35.4724, null, '2026-11-02T10:00:00+03:00');

insert into public.alanlar (id, nesne_turu, nesne_id, alan_adi, deger, durum, kaynak, olcum_zamani, olcum_cihazi, guncelleme) overriding system value values
  (1, 'giris', 1, 'giris_turu', 'ana', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (2, 'giris', 1, 'basamaksiz', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (3, 'giris', 1, 'esik_cm', '1', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (4, 'giris', 1, 'kapi_genisligi_cm', '120', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (5, 'giris', 1, 'kapi_tipi', 'otomatik', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (6, 'giris', 1, 'kapi_acilma', 'kolay', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (7, 'giris', 1, 'rampa_var', 'gerek_yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (8, 'giris', 1, 'acik_saatler', 'Hafta içi 08:00–22:00', 'teyitsiz', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (9, 'giris', 2, 'giris_turu', 'yan', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (10, 'giris', 2, 'basamaksiz', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (11, 'giris', 2, 'esik_cm', '3', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (12, 'giris', 2, 'kapi_genisligi_cm', '80', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (13, 'giris', 2, 'kapi_tipi', 'elle', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (14, 'giris', 2, 'kapi_acilma', 'agir', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (15, 'giris', 2, 'rampa_var', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (16, 'giris', 2, 'rampa_durumu', 'onu_kapali', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (17, 'giris', 2, 'rampa_genislik_cm', '110', 'teyitsiz', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (18, 'giris', 2, 'rampa_egim_yuzde', '9.5', 'teyitsiz', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (19, 'giris', 3, 'giris_turu', 'ana', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (20, 'giris', 3, 'basamaksiz', 'yok', 'teyitsiz', 'kullanici', null, null, '2026-11-04T09:15:00+03:00'),
  (21, 'giris', 3, 'rampa_var', 'var', 'teyitsiz', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (22, 'giris', 3, 'rampa_durumu', 'uygun', 'teyitsiz', 'kullanici', null, null, '2026-11-04T09:20:00+03:00'),
  (23, 'giris', 3, 'kapi_tipi', 'elle', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (24, 'giris', 3, 'kapi_acilma', 'kolay', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (25, 'giris', 4, 'giris_turu', 'erisilebilir_alternatif', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (26, 'giris', 4, 'basamaksiz', null, 'veri_yok', null, null, null, '2026-11-02T10:00:00+03:00'),
  (27, 'mekan', 1, 'asansor_var', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (28, 'mekan', 1, 'asansor_calisiyor', 'evet', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (29, 'mekan', 1, 'asansor_tekerlekli', 'uygun', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (30, 'mekan', 1, 'asansor_kabin', '110x140', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (31, 'mekan', 1, 'asansor_kapi_cm', '90', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (32, 'mekan', 1, 'ic_kapi_cm', '100', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (33, 'mekan', 1, 'erisilebilir_wc', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (34, 'mekan', 1, 'gurultu_yogun', 'sessiz', 'dogrulanmis', 'ekip', '2026-11-03T13:00:00+03:00', 'spl_metre', '2026-11-02T10:00:00+03:00'),
  (35, 'mekan', 1, 'gurultu_sakin', 'sessiz', 'dogrulanmis', 'ekip', '2026-11-03T09:00:00+03:00', 'spl_metre', '2026-11-02T10:00:00+03:00'),
  (36, 'mekan', 1, 'muzik', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (37, 'mekan', 1, 'gun_isigi', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (38, 'mekan', 1, 'yapay_isik', 'led', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (39, 'mekan', 1, 'acik_floresan', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (40, 'mekan', 1, 'dogal_aydinlik_alan', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (41, 'mekan', 1, 'oturma', 'seyrek', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (42, 'mekan', 1, 'mobilya_duzeni', 'acik', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (43, 'mekan', 1, 'sessiz_alan', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (44, 'mekan', 1, 'alternatif_oturma', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (45, 'mekan', 2, 'asansor_var', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (46, 'mekan', 2, 'asansor_calisiyor', 'evet', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (47, 'mekan', 2, 'asansor_tekerlekli', 'uygun_degil', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (48, 'mekan', 2, 'asansor_kabin', '100x120', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (49, 'mekan', 2, 'asansor_kapi_cm', '80', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (50, 'mekan', 2, 'gurultu_yogun', 'orta', 'dogrulanmis', 'ekip', '2026-11-03T12:30:00+03:00', 'ses_modulu', '2026-11-02T10:00:00+03:00'),
  (51, 'mekan', 2, 'gun_isigi', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (52, 'mekan', 2, 'yapay_isik', 'floresan', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (53, 'mekan', 2, 'acik_floresan', 'yok', 'teyitsiz', 'kullanici', null, null, '2026-11-04T11:00:00+03:00'),
  (54, 'mekan', 2, 'oturma', null, 'veri_yok', null, null, null, '2026-11-02T10:00:00+03:00'),
  (55, 'mekan', 3, 'asansor_var', 'gerek_yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (56, 'mekan', 3, 'erisilebilir_wc', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (57, 'mekan', 3, 'gurultu_yogun', 'gurultulu', 'dogrulanmis', 'ekip', '2026-11-03T12:15:00+03:00', 'spl_metre', '2026-11-02T10:00:00+03:00'),
  (58, 'mekan', 3, 'gurultu_sakin', 'orta', 'teyitsiz', 'kullanici', '2026-11-04T15:30:00+03:00', null, '2026-11-04T15:30:00+03:00'),
  (59, 'mekan', 3, 'muzik', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (60, 'mekan', 3, 'gun_isigi', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (61, 'mekan', 3, 'yapay_isik', 'led', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (62, 'mekan', 3, 'acik_floresan', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (63, 'mekan', 3, 'oturma', 'sik', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (64, 'mekan', 3, 'mobilya_duzeni', 'sik_dizilmis', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (65, 'mekan', 4, 'gurultu_yogun', 'orta', 'teyitsiz', 'ekip', '2026-11-03T16:00:00+03:00', 'ses_modulu', '2026-11-02T10:00:00+03:00'),
  (66, 'mekan', 4, 'muzik', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (67, 'mekan', 4, 'gun_isigi', 'var', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (68, 'mekan', 4, 'yapay_isik', 'diger', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (69, 'mekan', 4, 'oturma', 'orta', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00'),
  (70, 'mekan', 4, 'alternatif_oturma', 'yok', 'dogrulanmis', 'ekip', null, null, '2026-11-02T10:00:00+03:00');

insert into public.bildirimler (id, nesne_turu, nesne_id, alan_adi, deger, anonim_id, tarih, durum) overriding system value values
  (1, 'mekan', 2, 'acik_floresan', 'yok', '00000000-0000-4000-8000-000000000001', '2026-11-04T11:00:00+03:00', 'bekliyor'),
  (2, 'giris', 3, 'rampa_durumu', 'uygun', '00000000-0000-4000-8000-000000000002', '2026-11-04T09:20:00+03:00', 'bekliyor'),
  (3, 'mekan', 4, 'gun_isigi', 'yok', '00000000-0000-4000-8000-000000000003', '2026-11-05T10:00:00+03:00', 'bekliyor'),
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
