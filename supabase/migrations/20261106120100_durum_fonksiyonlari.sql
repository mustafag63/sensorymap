-- Durum hesabı veritabanında yapılır (SPEC §3, §6.1). Tüm fonksiyonlar
-- security definer'dır ve search_path boş tutulur.

-- ---------------------------------------------------------------
-- Ekip üyesi mi?
-- ---------------------------------------------------------------
create function public.ekip_mi()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.ekip_uyeleri where kullanici_id = auth.uid());
$$;

-- ---------------------------------------------------------------
-- Bildirim eklenmeden önce: tarih ve durum istemciden alınmaz,
-- bildirilen nesne var olmalı.
-- ---------------------------------------------------------------
create function public.bildirim_hazirla()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.tarih := now();
  new.durum := 'bekliyor';
  if (new.nesne_turu = 'giris' and not exists (select 1 from public.girisler where id = new.nesne_id))
     or (new.nesne_turu = 'mekan' and not exists (select 1 from public.mekanlar where id = new.nesne_id)) then
    raise exception 'Bildirilen kayıt bulunamadı';
  end if;
  return new;
end;
$$;

create trigger bildirim_hazirla
  before insert on public.bildirimler
  for each row execute function public.bildirim_hazirla();

-- ---------------------------------------------------------------
-- Bildirim eklendikten sonra alanı güncelle (kullanıcı bildiriminde ölçüm cihazı bilinmez):
--  - alan yok / veri_yok / teyitsiz  → yeni değer, teyitsiz
--  - doğrulanmış ve aynı değer        → bildirim hemen "dogrulandi"
--  - doğrulanmış ve farklı değer      → alan değişmez (itiraz; 2 teyit alırsa yer değiştirir)
-- ---------------------------------------------------------------
create function public.bildirim_sonrasi()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  mevcut public.alanlar%rowtype;
begin
  select * into mevcut from public.alanlar
   where nesne_turu = new.nesne_turu and nesne_id = new.nesne_id and alan_adi = new.alan_adi;

  if not found or mevcut.durum in ('veri_yok', 'teyitsiz') then
    insert into public.alanlar (nesne_turu, nesne_id, alan_adi, deger, durum, kaynak, olcum_zamani, olcum_cihazi, guncelleme)
    values (new.nesne_turu, new.nesne_id, new.alan_adi, new.deger, 'teyitsiz', 'kullanici',
            case when new.alan_adi like 'gurultu\_%' then new.tarih end, null, now())
    on conflict (nesne_turu, nesne_id, alan_adi) do update
      set deger = excluded.deger, durum = 'teyitsiz', kaynak = 'kullanici',
          olcum_zamani = excluded.olcum_zamani, olcum_cihazi = null, guncelleme = now();
  elsif mevcut.deger = new.deger then
    update public.bildirimler set durum = 'dogrulandi' where id = new.id;
  end if;
  return null;
end;
$$;

create trigger bildirim_sonrasi
  after insert on public.bildirimler
  for each row execute function public.bildirim_sonrasi();

-- ---------------------------------------------------------------
-- Teyit eklenmeden önce: kişi kendi bildirimini teyit edemez;
-- sonuçlanmış bildirim teyit edilemez.
-- (Aynı kişinin iki kez teyidi UNIQUE kısıtıyla engellenir.)
-- ---------------------------------------------------------------
create function public.teyit_hazirla()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.bildirimler%rowtype;
begin
  new.tarih := now();
  select * into b from public.bildirimler where id = new.bildirim_id;
  if not found then
    raise exception 'Bildirim bulunamadı';
  end if;
  if b.anonim_id = new.anonim_id then
    raise exception 'Kendi bildiriminizi teyit edemezsiniz';
  end if;
  if b.durum <> 'bekliyor' then
    raise exception 'Bu bildirim zaten sonuçlandı';
  end if;
  return new;
end;
$$;

create trigger teyit_hazirla
  before insert on public.teyitler
  for each row execute function public.teyit_hazirla();

-- ---------------------------------------------------------------
-- Teyit eklendikten sonra: 2 bağımsız teyit → değer doğrulanmış.
-- Doğrulanmış değerle çelişen bildirim de bu yolla yer değiştirir.
-- ---------------------------------------------------------------
create function public.teyit_sonrasi()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.bildirimler%rowtype;
  sayi integer;
begin
  select * into b from public.bildirimler where id = new.bildirim_id for update;
  select count(*) into sayi from public.teyitler where bildirim_id = new.bildirim_id;

  if sayi >= 2 and b.durum = 'bekliyor' then
    update public.bildirimler set durum = 'dogrulandi' where id = b.id;
    insert into public.alanlar (nesne_turu, nesne_id, alan_adi, deger, durum, kaynak, olcum_zamani, olcum_cihazi, guncelleme)
    values (b.nesne_turu, b.nesne_id, b.alan_adi, b.deger, 'dogrulanmis', 'kullanici',
            case when b.alan_adi like 'gurultu\_%' then b.tarih end, null, now())
    on conflict (nesne_turu, nesne_id, alan_adi) do update
      set deger = excluded.deger, durum = 'dogrulanmis', kaynak = 'kullanici',
          olcum_zamani = excluded.olcum_zamani, olcum_cihazi = null, guncelleme = now();
  end if;
  return null;
end;
$$;

create trigger teyit_sonrasi
  after insert on public.teyitler
  for each row execute function public.teyit_sonrasi();

-- ---------------------------------------------------------------
-- Giriş/mekân silinince ona bağlı kriter, bildirim ve hata kayıtları da silinir
-- (nesne_id çok biçimli olduğu için yabancı anahtar kullanılamıyor).
-- ---------------------------------------------------------------
create function public.nesne_temizle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  tur text := case tg_table_name when 'girisler' then 'giris' else 'mekan' end;
begin
  delete from public.alanlar where nesne_turu = tur and nesne_id = old.id;
  delete from public.bildirimler where nesne_turu = tur and nesne_id = old.id;
  delete from public.hata_bildirimleri where nesne_turu = tur and nesne_id = old.id;
  return old;
end;
$$;

create trigger giris_temizle after delete on public.girisler
  for each row execute function public.nesne_temizle();
create trigger mekan_temizle after delete on public.mekanlar
  for each row execute function public.nesne_temizle();

-- ---------------------------------------------------------------
-- Bekleyen bildirimler: herkes okuyabilir ama anonim_id dışarı verilmez.
-- "kendi" ve "teyit_ettim" çağıranın auth.uid()'sine göre hesaplanır.
-- ---------------------------------------------------------------
create function public.bekleyen_bildirimler()
returns table (
  id bigint,
  nesne_turu text,
  nesne_id bigint,
  alan_adi text,
  deger text,
  tarih timestamptz,
  teyit_sayisi integer,
  kendi boolean,
  teyit_ettim boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id, b.nesne_turu, b.nesne_id, b.alan_adi, b.deger, b.tarih,
         (select count(*)::integer from public.teyitler t where t.bildirim_id = b.id),
         coalesce(b.anonim_id = auth.uid(), false),
         exists (select 1 from public.teyitler t where t.bildirim_id = b.id and t.anonim_id = auth.uid())
    from public.bildirimler b
   where b.durum = 'bekliyor'
   order by b.tarih desc;
$$;

-- Trigger fonksiyonları RPC ile çağrılamaz; yalnızca bu ikisi açılır.
revoke execute on function public.ekip_mi() from public;
revoke execute on function public.bekleyen_bildirimler() from public;
grant execute on function public.ekip_mi() to anon, authenticated;
grant execute on function public.bekleyen_bildirimler() to anon, authenticated;
