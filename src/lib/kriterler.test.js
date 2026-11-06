// src/data/kriterler.js ile SQL'deki gecerli_kriter() aynı listeyi kullanmalı.
import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { KRITERLER, FILTRELER, MEKAN_TURLERI, gecerliDeger, kriterBul } from '../data/kriterler.js'

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
      for (const { alan, degerler } of f.kosullar) {
        if (alan === 'kat') continue
        const k = kriterBul(alan)
        expect(k, alan).toBeDefined()
        for (const d of degerler) expect(gecerliDeger(k.nesne, alan, d), `${alan}=${d}`).toBe(true)
      }
    }
  })

  it('gecerliDeger sayı ve metin sınırları', () => {
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '90')).toBe(true)
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '1000')).toBe(false)
    expect(gecerliDeger('giris', 'kapi_genisligi_cm', '9a')).toBe(false)
    expect(gecerliDeger('giris', 'acik_saatler', '   ')).toBe(false)
    expect(gecerliDeger('mekan', 'basamaksiz', 'var')).toBe(false) // yanlış nesne
  })
})
