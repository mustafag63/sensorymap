// Supabase kaynağı. Durum hesabı veritabanındaki trigger'larda yapılır;
// burada yalnızca okuma/ekleme ve hata metni çevirisi var.
import { createClient } from '@supabase/supabase-js'
import { METIN } from '../../sabitler.js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

function cevir(error) {
  const m = error?.message ?? ''
  const h = METIN.hatalar
  if (m.includes('Kendi bildiriminizi')) return new Error(h.kendiTeyit)
  if (m.includes('zaten sonuçlandı')) return new Error(h.sonuclanmis)
  if (m.includes('bulunamadı')) return new Error(h.kayitYok)
  if (m.includes('teyitler_bildirim_id_anonim_id_key')) return new Error(h.ikinciTeyit)
  if (m.includes('row-level security') || error?.code === '42501') return new Error(h.yetki)
  if (m.includes('check constraint')) return new Error(h.gecersizDeger)
  return new Error(m || h.bilinmeyen)
}

async function sonuc(sorgu) {
  const { data, error } = await sorgu
  if (error) throw cevir(error)
  return data
}

// Anonim kimlik yalnızca yazma işlemlerinden önce açılır; salt gezinti hesap oluşturmaz.
async function anonimOturum() {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session.user.id
  const { data: giris, error } = await supabase.auth.signInAnonymously()
  if (error) throw new Error(METIN.hatalar.kimlik)
  return giris.user.id
}

export async function verileriGetir() {
  const [binalar, girisler, mekanlar, alanlar, bekleyenBildirimler] = await Promise.all([
    sonuc(supabase.from('binalar').select('*').order('id')),
    sonuc(supabase.from('girisler').select('*').order('id')),
    sonuc(supabase.from('mekanlar').select('*').order('id')),
    sonuc(supabase.from('alanlar').select('*')),
    sonuc(supabase.rpc('bekleyen_bildirimler')),
  ])
  return { binalar, girisler, mekanlar, alanlar, bekleyenBildirimler }
}

export async function bildirimGonder({ nesne_turu, nesne_id, alan_adi, deger }) {
  const anonim_id = await anonimOturum()
  await sonuc(supabase.from('bildirimler').insert({ nesne_turu, nesne_id, alan_adi, deger, anonim_id }))
}

export async function teyitEt(bildirimId) {
  const anonim_id = await anonimOturum()
  await sonuc(supabase.from('teyitler').insert({ bildirim_id: bildirimId, anonim_id }))
}

export async function hataBildir({ nesne_turu, nesne_id, aciklama }) {
  await sonuc(supabase.from('hata_bildirimleri').insert({ nesne_turu, nesne_id, aciklama: aciklama.trim() }))
}

// ---- Ekip paneli ----

export async function ekipOturumu() {
  const { data } = await supabase.auth.getSession()
  const kullanici = data.session?.user
  if (!kullanici || kullanici.is_anonymous) return { girisYapildi: false, ekip: false, eposta: null }
  const ekip = await sonuc(supabase.rpc('ekip_mi'))
  return { girisYapildi: true, ekip: !!ekip, eposta: kullanici.email }
}

export async function ekipGirisi(eposta, sifre) {
  const { error } = await supabase.auth.signInWithPassword({ email: eposta, password: sifre })
  if (error) throw new Error(METIN.panel.girisHatasi)
}

export async function ekipCikisi() {
  await supabase.auth.signOut()
}

export async function kayitKaydet(tablo, kayit) {
  const { id, ...alanlar } = kayit
  const sorgu = id
    ? supabase.from(tablo).update(alanlar).eq('id', id)
    : supabase.from(tablo).insert(alanlar)
  return sonuc(sorgu.select().single())
}

export async function alanKaydet({ nesne_turu, nesne_id, alan_adi, deger, yerinde, olcum_zamani, olcum_cihazi }) {
  const bos = deger == null || deger === ''
  await sonuc(
    supabase.from('alanlar').upsert(
      {
        nesne_turu,
        nesne_id,
        alan_adi,
        deger: bos ? null : deger,
        durum: bos ? 'veri_yok' : yerinde ? 'dogrulanmis' : 'teyitsiz',
        kaynak: bos ? null : 'ekip',
        olcum_zamani: bos ? null : (olcum_zamani ?? null),
        olcum_cihazi: bos ? null : (olcum_cihazi ?? null),
        guncelleme: new Date().toISOString(),
      },
      { onConflict: 'nesne_turu,nesne_id,alan_adi' },
    ),
  )
}

export async function hataBildirimleriGetir() {
  return sonuc(supabase.from('hata_bildirimleri').select('*').order('tarih', { ascending: false }))
}

export async function hataCozuldu(id) {
  await sonuc(supabase.from('hata_bildirimleri').update({ cozuldu: true }).eq('id', id))
}
