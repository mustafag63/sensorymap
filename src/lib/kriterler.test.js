// src/data/kriterler.js ile SQL'deki gecerli_kriter() aynı listeyi kullanmalı.
import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { KRITERLER, FILTRELER, MEKAN_TURLERI, OLCUM_CIHAZLARI, gecerliDeger, kriterBul, kriterGorunur, sinirDisi, degerMetni } from '../data/kriterler.js'

const klasor = new URL('../../supabase/migrations/', import.meta.url)
const sql = readdirSync(klasor)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => readFileSync(new URL(f, klasor), 'utf8'))
  .join('\n')

function sqlSatiri(anahtar) {
  return sql.split('\n').find((s) => s.trim().startsWith(`when '${anahtar}'`))
}

describe('kriterler.js ↔ gecerli_kriter() uyumu', () => {
  for (const k of KRITERLER) {
    it(`${k.nesne}.${k.anahtar}`, () => {
      const satir = sqlSatiri(k.anahtar)
      expect(satir, `SQL'de ${k.anahtar} yok`).toBeDefined()
      if (k.tip === 'secim') {
        const sqlDegerleri = [...satir.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).slice(1)
        expect(sqlDegerleri.sort()).toEqual(k.secenekler.map((s) => s.deger).sort())
      }
    })
  }

  it('mekân türleri', () => {
    for (const t of MEKAN_TURLERI) expect(sql).toContain(`'${t.deger}'`)
  })

  it('filtreler yalnızca tanımlı kriterlere ve seçeneklere başvurur', () => {
    for (const f of FILTRELER) {
      for (const { alan, degerler } of f.kosullar.flat()) {
        if (alan === 'kat') continue
        const k = kriterBul(alan)
        expect(k, alan).toBeDefined()
        for (const d of degerler) expect(gecerliDeger(k.nesne, alan, d), `${alan}=${d}`).toBe(true)
      }
    }
  })

  it('gecerliDeger sayı ve metin sınırları', () => {
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '90')).toBe(true)
    expect(gecerliDeger('giris', 'esik_cm', '1.3')).toBe(true)
    expect(gecerliDeger('giris', 'rampa_egim_yuzde', '8.25')).toBe(true)
    expect(gecerliDeger('giris', 'esik_cm', '1,3')).toBe(false) // virgül değil nokta
    expect(gecerliDeger('giris', 'esik_cm', '1.333')).toBe(false)
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '1000')).toBe(false)
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '9a')).toBe(false)
    expect(gecerliDeger('giris', 'acik_saatler', '   ')).toBe(false)
    expect(gecerliDeger('mekan', 'basamaksiz', 'var')).toBe(false) // yanlış nesne
  })

  it('sayısal kriterler SQL\'de aynı ondalık desenini kullanır', () => {
    for (const k of KRITERLER.filter((x) => x.tip === 'sayi')) {
      expect(sqlSatiri(k.anahtar), k.anahtar).toContain("~ '^[0-9]{1,3}(\\.[0-9]{1,2})?$'")
    }
  })

  it('gecerli_kriter_anahtari() tüm anahtarları listeler', () => {
    const fonk = sql.slice(sql.indexOf('gecerli_kriter_anahtari'), sql.indexOf('-- Bina → Giriş → Mekân'))
    for (const k of KRITERLER) expect(fonk, k.anahtar).toContain(`'${k.anahtar}'`)
  })

  it('ölçüm cihazı seçenekleri SQL ile aynı', () => {
    for (const c of OLCUM_CIHAZLARI) expect(sql).toContain(`'${c.deger}'`)
  })
})

describe('kriter yardımcıları', () => {
  it('sınır dışı değerler: eşik en fazla 1,3; kapı en az 90', () => {
    expect(sinirDisi(kriterBul('esik_cm'), '1.3')).toBeNull()
    expect(sinirDisi(kriterBul('esik_cm'), '2')).toEqual({ enFazla: 1.3 })
    expect(sinirDisi(kriterBul('kapi_genisligi_cm'), '85')).toEqual({ enAz: 90 })
    expect(sinirDisi(kriterBul('rampa_genislik_cm'), '100')).toBeNull()
  })

  it('sayılar Türkçe biçimde yazılır', () => {
    expect(degerMetni('esik_cm', '1.3')).toBe('1,3 cm')
    expect(degerMetni('rampa_egim_yuzde', '9.5')).toBe('%9,5')
  })

  it('bağlı kriterler: rampa yoksa rampa ayrıntıları gizlenir, bilgi yoksa ya da kendi verisi varsa gösterilir', () => {
    const durum = kriterBul('rampa_durumu')
    const oku = (alanlar) => (ad) => alanlar[ad] ?? null
    expect(kriterGorunur(durum, oku({ rampa_var: { deger: 'yok', durum: 'dogrulanmis' } }))).toBe(false)
    expect(kriterGorunur(durum, oku({ rampa_var: { deger: 'var', durum: 'teyitsiz' } }))).toBe(true)
    expect(kriterGorunur(durum, oku({}))).toBe(true)
    expect(
      kriterGorunur(durum, oku({ rampa_var: { deger: 'yok', durum: 'teyitsiz' }, rampa_durumu: { deger: 'uygun', durum: 'teyitsiz' } })),
    ).toBe(true)
  })
})
