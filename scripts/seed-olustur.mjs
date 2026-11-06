// supabase/seed.sql dosyasını src/data/ornekVeri.js'ten üretir (ikisi hep aynı kalsın diye).
// Kullanım: npm run seed
import { writeFileSync } from 'node:fs'
import { ornekVeri } from '../src/data/ornekVeri.js'

const deger = (v) => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return `'${String(v).replaceAll("'", "''")}'`
}

function ekle(tablo, satirlar) {
  if (satirlar.length === 0) return ''
  const sutunlar = Object.keys(satirlar[0])
  const degerler = satirlar.map((s) => `  (${sutunlar.map((c) => deger(s[c])).join(', ')})`).join(',\n')
  return `insert into public.${tablo} (${sutunlar.join(', ')}) overriding system value values\n${degerler};\n\n`
}

const TABLOLAR = ['binalar', 'girisler', 'mekanlar', 'alanlar', 'bildirimler', 'teyitler', 'hata_bildirimleri']
// Bildirim/teyit trigger'ları tarih ve durumu yeniden hesaplamasın diye seed sırasında kapatılır.
const TRIGGERLI = ['bildirimler', 'teyitler', 'girisler', 'mekanlar']

let sql = `-- OTOMATİK ÜRETİLDİ: elle düzenlemeyin. Kaynak: src/data/ornekVeri.js → npm run seed
-- SPEC §9 örnek verisi ("ÖRNEK –" etiketli; gerçek konum iddiası taşımaz).
-- Gerçek veri girildikten sonra ÇALIŞTIRMAYIN: tablolardaki tüm kayıtları siler.

begin;

${TRIGGERLI.map((t) => `alter table public.${t} disable trigger user;`).join('\n')}

delete from public.${[...TABLOLAR].reverse().join(';\ndelete from public.')};

`
for (const t of TABLOLAR) sql += ekle(t, ornekVeri[t])

sql += TRIGGERLI.map((t) => `alter table public.${t} enable trigger user;`).join('\n') + '\n\n'
sql += TABLOLAR.map(
  (t) => `select setval(pg_get_serial_sequence('public.${t}', 'id'), coalesce((select max(id) from public.${t}), 0) + 1, false);`,
).join('\n')
sql += '\n\ncommit;\n'

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log('supabase/seed.sql üretildi.')
