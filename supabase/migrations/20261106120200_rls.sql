-- Row Level Security (SPEC §6.1).
-- Not: Supabase anonymous sign-in oturumları "authenticated" rolündedir;
-- ekip yetkisi ekip_mi() ile ayrılır.

alter table public.binalar           enable row level security;
alter table public.girisler          enable row level security;
alter table public.mekanlar          enable row level security;
alter table public.alanlar           enable row level security;
alter table public.bildirimler       enable row level security;
alter table public.teyitler          enable row level security;
alter table public.hata_bildirimleri enable row level security;
alter table public.ekip_uyeleri      enable row level security;  -- politika yok: yalnızca ekip_mi() okur

-- Herkes okur: bina, giriş, mekân, kriter değerleri
create policy "herkes okur" on public.binalar  for select to anon, authenticated using (true);
create policy "herkes okur" on public.girisler for select to anon, authenticated using (true);
create policy "herkes okur" on public.mekanlar for select to anon, authenticated using (true);
create policy "herkes okur" on public.alanlar  for select to anon, authenticated using (true);

-- Ekip yazar (panel). alanlar tablosuna başka hiçbir istemci yazamaz.
create policy "ekip ekler" on public.binalar for insert to authenticated with check (public.ekip_mi());
create policy "ekip günceller" on public.binalar for update to authenticated using (public.ekip_mi()) with check (public.ekip_mi());
create policy "ekip siler" on public.binalar for delete to authenticated using (public.ekip_mi());

create policy "ekip ekler" on public.girisler for insert to authenticated with check (public.ekip_mi());
create policy "ekip günceller" on public.girisler for update to authenticated using (public.ekip_mi()) with check (public.ekip_mi());
create policy "ekip siler" on public.girisler for delete to authenticated using (public.ekip_mi());

create policy "ekip ekler" on public.mekanlar for insert to authenticated with check (public.ekip_mi());
create policy "ekip günceller" on public.mekanlar for update to authenticated using (public.ekip_mi()) with check (public.ekip_mi());
create policy "ekip siler" on public.mekanlar for delete to authenticated using (public.ekip_mi());

create policy "ekip ekler" on public.alanlar for insert to authenticated with check (public.ekip_mi());
create policy "ekip günceller" on public.alanlar for update to authenticated using (public.ekip_mi()) with check (public.ekip_mi());
create policy "ekip siler" on public.alanlar for delete to authenticated using (public.ekip_mi());

-- Bildirim: herkes kendi anonim kimliğiyle ekler, başkası adına ekleyemez.
-- Okuma yalnızca ekip; diğerleri bekleyen_bildirimler() ile anonim_id'siz görür.
create policy "kendi adına ekler" on public.bildirimler for insert to authenticated
  with check (anonim_id = auth.uid());
create policy "ekip okur" on public.bildirimler for select to authenticated using (public.ekip_mi());

-- Teyit: kendi anonim kimliğiyle. "Kendi bildirimini teyit edemez" kuralı
-- teyit_hazirla() trigger'ında veritabanında denetlenir.
create policy "kendi adına ekler" on public.teyitler for insert to authenticated
  with check (anonim_id = auth.uid());
create policy "ekip okur" on public.teyitler for select to authenticated using (public.ekip_mi());

-- Hata bildirimi: herkes ekler (çözüldü olarak ekleyemez); ekip okur ve çözer.
create policy "herkes ekler" on public.hata_bildirimleri for insert to anon, authenticated
  with check (cozuldu = false);
create policy "ekip okur" on public.hata_bildirimleri for select to authenticated using (public.ekip_mi());
create policy "ekip çözer" on public.hata_bildirimleri for update to authenticated
  using (public.ekip_mi()) with check (public.ekip_mi());
