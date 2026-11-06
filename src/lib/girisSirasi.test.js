import { describe, expect, it } from 'vitest'
import { dizinOlustur } from './dizin.js'
import { girisleriSirala } from './girisSirasi.js'
import { ornekVeri } from '../data/ornekVeri.js'

const D = 'dogrulanmis'
const T = 'teyitsiz'

function sirala(alanlar, girisSayisi = 3) {
  const girisler = Array.from({ length: girisSayisi }, (_, i) => ({ id: i + 1, bina_id: 1, ad: `G${i + 1}` }))
  const dizin = dizinOlustur({
    girisler,
    alanlar: alanlar.map(([nesne_id, alan_adi, deger, durum]) => ({ nesne_turu: 'giris', nesne_id, alan_adi, deger, durum })),
  })
  return girisleriSirala(girisler, dizin)
}

describe('önerilen giriş sırası', () => {
  it('doğrulanmış basamaksız → uygun rampalı → diğerleri', () => {
    const s = sirala([
      [1, 'rampa_var', 'var', D], [1, 'rampa_durumu', 'uygun', D],
      [3, 'basamaksiz', 'var', D],
    ])
    expect(s.map((x) => x.giris.id)).toEqual([3, 1, 2])
    expect(s.map((x) => x.onerilen)).toEqual([true, false, false])
  })

  it('teyitsiz basamaksız ya da önü kapalı rampa öne geçmez; grup içinde sıra korunur', () => {
    const s = sirala([
      [1, 'basamaksiz', 'var', T],
      [2, 'rampa_var', 'var', D], [2, 'rampa_durumu', 'onu_kapali', D],
    ])
    expect(s.map((x) => x.giris.id)).toEqual([1, 2, 3])
    expect(s.map((x) => x.sira)).toEqual([2, 2, 2])
  })

  it('doğrulanmış basamaksız ya da uygun rampalı giriş yoksa hiçbir giriş önerilmez', () => {
    const s = sirala([
      [1, 'basamaksiz', 'var', T],
      [2, 'rampa_var', 'var', D], [2, 'rampa_durumu', 'onu_kapali', D],
      [3, 'kapi_tipi', 'otomatik', D],
    ])
    expect(s.some((x) => x.onerilen)).toBe(false)
  })

  it('yalnızca uygun rampalı giriş varsa o önerilir', () => {
    const s = sirala([[2, 'rampa_var', 'var', D], [2, 'rampa_durumu', 'uygun', D]])
    expect(s.map((x) => [x.giris.id, x.onerilen])).toEqual([[2, true], [1, false], [3, false]])
  })

  it('hiç veri olmayan binada önerilen giriş yok', () => {
    expect(sirala([]).some((x) => x.onerilen)).toBe(false)
  })

  it('rampa uygun ama rampanın varlığı teyitsizse uygun rampalı sayılmaz', () => {
    const s = sirala([[2, 'rampa_var', 'var', T], [2, 'rampa_durumu', 'uygun', D]])
    expect(s.find((x) => x.giris.id === 2).sira).toBe(2)
  })

  it('örnek veride Ana Bina için Kuzey kapısı önerilir', () => {
    const dizin = dizinOlustur(ornekVeri)
    expect(girisleriSirala(dizin.girisleri(1), dizin)[0]).toMatchObject({ giris: { id: 1 }, onerilen: true })
  })

  it('örnek veride Kafe Binası için önerilen giriş yok (bilgiler teyitsiz)', () => {
    const dizin = dizinOlustur(ornekVeri)
    expect(girisleriSirala(dizin.girisleri(2), dizin).some((x) => x.onerilen)).toBe(false)
  })
})
