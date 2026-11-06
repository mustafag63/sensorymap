\set ON_ERROR_STOP 0
\set VERBOSITY terse
-- Yardımcı: koşul doğruysa OK, değilse HATA yazdırır.
create or replace function pg_temp.kontrol(ad text, kosul boolean) returns void language plpgsql as
$$ begin raise notice '% %', case when kosul then 'OK  ' else 'HATA' end, ad; end $$;

\echo '--- 1. Seed sonrası sayılar'
select pg_temp.kontrol('2 bina, 4 giriş, 5 mekân',
  (select count(*) from binalar) = 2 and (select count(*) from girisler) = 4 and (select count(*) from mekanlar) = 5);
select pg_temp.kontrol('üç durum da var',
  (select count(distinct durum) from alanlar) = 3);
select pg_temp.kontrol('seed sonrası yeni id çakışmıyor (sequence)', nextval(pg_get_serial_sequence('public.binalar','id')) = 3);

\echo '--- 2. Anonim rol (giriş yapmamış): okur, bildirim ekleyemez'
set role anon;
select pg_temp.kontrol('anon binaları okur', (select count(*) from binalar) = 2);
\echo '  beklenen hata ↓'
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 5, 'oturma', 'seyrek');
insert into hata_bildirimleri (nesne_turu, nesne_id, aciklama) values ('mekan', 1, 'test');
select pg_temp.kontrol('anon hata bildirimlerini okuyamaz', (select count(*) from hata_bildirimleri) = 0);
reset role;
select pg_temp.kontrol('anon hata bildirimi ekledi', (select count(*) from hata_bildirimleri) = 2);

\echo '--- 3. Kullanıcı U1 bildirim yapar → teyitsiz'
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 5, 'oturma', 'seyrek');
\echo '  beklenen hata (başkası adına) ↓'
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger, anonim_id)
  values ('mekan', 5, 'isik', 'los', '22222222-2222-4222-8222-222222222222');
\echo '  beklenen hata (geçersiz değer) ↓'
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 5, 'oturma', 'kalabalik');
\echo '  beklenen hata (olmayan mekân) ↓'
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 999, 'oturma', 'seyrek');
\echo '  beklenen hata (istemci alanlar tablosuna yazamaz) ↓'
insert into alanlar (nesne_turu, nesne_id, alan_adi, deger, durum) values ('mekan', 5, 'isik', 'dogal', 'dogrulanmis');
update alanlar set durum = 'dogrulanmis' where nesne_turu = 'mekan' and nesne_id = 5;
select pg_temp.kontrol('U1 için kendi=true', (select kendi from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma'));
reset role;
select pg_temp.kontrol('mekan5.oturma = seyrek, teyitsiz, kullanici',
  exists (select 1 from alanlar where nesne_turu='mekan' and nesne_id=5 and alan_adi='oturma'
          and deger='seyrek' and durum='teyitsiz' and kaynak='kullanici'));

\echo '--- 4. Teyit kuralları'
set role authenticated;
\echo '  beklenen hata (kendi bildirimi) ↓'
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma';
set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma';
\echo '  beklenen hata (aynı kişi ikinci kez) ↓'
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma';
select pg_temp.kontrol('U2 teyit_ettim=true, sayı=1',
  (select teyit_ettim and teyit_sayisi = 1 from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma'));
reset role;
select pg_temp.kontrol('1 teyitte hâlâ teyitsiz',
  (select durum from alanlar where nesne_turu='mekan' and nesne_id=5 and alan_adi='oturma') = 'teyitsiz');
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-4333-8333-333333333333';
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma';
reset role;
select pg_temp.kontrol('2 bağımsız teyit → dogrulanmis',
  (select durum from alanlar where nesne_turu='mekan' and nesne_id=5 and alan_adi='oturma') = 'dogrulanmis');
select pg_temp.kontrol('bildirim artık bekleyenlerde değil',
  not exists (select 1 from bekleyen_bildirimler() where nesne_id = 5 and alan_adi = 'oturma'));

\echo '--- 5. Seed’deki bildirim 1 (1 teyitli) tek teyitle doğrulanır'
set role authenticated;
insert into teyitler (bildirim_id) values (1);
reset role;
select pg_temp.kontrol('mekan2.asansor dogrulanmis',
  (select durum from alanlar where nesne_turu='mekan' and nesne_id=2 and alan_adi='asansor') = 'dogrulanmis');

\echo '--- 6. Çelişen bildirim doğrulanmış değeri silmez, 2 teyitle yer değiştirir'
select pg_temp.kontrol('mekan4.isik başta dogal/dogrulanmis',
  (select deger || '/' || durum from alanlar where nesne_turu='mekan' and nesne_id=4 and alan_adi='isik') = 'dogal/dogrulanmis');
set role authenticated;
set request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 1, 'isik', 'los');
reset role;
select pg_temp.kontrol('çelişen bildirim mekan1.isik değerini değiştirmedi',
  (select deger || '/' || durum from alanlar where nesne_turu='mekan' and nesne_id=1 and alan_adi='isik') = 'dogal/dogrulanmis');
set role authenticated;
set request.jwt.claim.sub = '55555555-5555-4555-8555-555555555555';
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 1 and alan_adi = 'isik';
set request.jwt.claim.sub = '66666666-6666-4666-8666-666666666666';
insert into teyitler (bildirim_id) select id from bekleyen_bildirimler() where nesne_id = 1 and alan_adi = 'isik';
reset role;
select pg_temp.kontrol('2 teyitten sonra mekan1.isik = los/dogrulanmis',
  (select deger || '/' || durum from alanlar where nesne_turu='mekan' and nesne_id=1 and alan_adi='isik') = 'los/dogrulanmis');

\echo '--- 7. Doğrulanmış değerle aynı bildirim hemen sonuçlanır'
set role authenticated;
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 1, 'oturma', 'seyrek');
reset role;
select pg_temp.kontrol('aynı değer → bildirim dogrulandi',
  (select durum from bildirimler where nesne_id = 1 and alan_adi = 'oturma' order by id desc limit 1) = 'dogrulandi');

\echo '--- 8. Gürültü bildirimi ölçüm zamanını kaydeder'
set role authenticated;
insert into bildirimler (nesne_turu, nesne_id, alan_adi, deger) values ('mekan', 5, 'gurultu_yogun', 'orta');
reset role;
select pg_temp.kontrol('olcum_zamani dolu',
  (select olcum_zamani is not null from alanlar where nesne_turu='mekan' and nesne_id=5 and alan_adi='gurultu_yogun'));

\echo '--- 9. Ekip üyesi yazar, ekip olmayan yazamaz'
insert into auth.users values ('99999999-9999-4999-8999-999999999999');
insert into ekip_uyeleri (kullanici_id) values ('99999999-9999-4999-8999-999999999999');
set role authenticated;
\echo '  beklenen hata (ekip değil) ↓'
insert into binalar (ad, enlem, boylam) values ('Yetkisiz', 38.7, 35.4);
set request.jwt.claim.sub = '99999999-9999-4999-8999-999999999999';
select pg_temp.kontrol('ekip_mi() = true', ekip_mi());
insert into binalar (ad, enlem, boylam) values ('Ekip binası', 38.7, 35.4);
insert into alanlar (nesne_turu, nesne_id, alan_adi, deger, durum, kaynak) values ('mekan', 5, 'muzik', 'yok', 'dogrulanmis', 'ekip')
  on conflict (nesne_turu, nesne_id, alan_adi) do update set deger = excluded.deger, durum = excluded.durum;
select pg_temp.kontrol('ekip hata bildirimlerini okur', (select count(*) from hata_bildirimleri) = 2);
update hata_bildirimleri set cozuldu = true where id = 1;
\echo '  beklenen hata (veri_yok iken değer olamaz) ↓'
insert into alanlar (nesne_turu, nesne_id, alan_adi, deger, durum) values ('mekan', 5, 'sessiz_alan', 'var', 'veri_yok');
reset role;
select pg_temp.kontrol('ekip binası eklendi', exists (select 1 from binalar where ad = 'Ekip binası'));

\echo '--- 10. Mekân silinince bağlı kayıtlar temizlenir'
delete from mekanlar where id = 5;
select pg_temp.kontrol('mekan5 alan/bildirim kalmadı',
  not exists (select 1 from alanlar where nesne_turu='mekan' and nesne_id=5)
  and not exists (select 1 from bildirimler where nesne_turu='mekan' and nesne_id=5));
