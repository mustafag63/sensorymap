import { describe, expect, it } from 'vitest'
import { dizinOlustur } from './dizin.js'
import { filtreSonucu, filtreleriCoz, mekanEslesmesi, sonuclariGrupla } from './eslesme.js'
import { FILTRELER, filtreBul } from '../data/kriterler.js'
import { ornekVeri } from '../data/ornekVeri.js'

const D = 'dogrulanmis'
const T = 'teyitsiz'
const V = 'veri_yok'

// Tek binalı küçük veri kurucu: mekân 1 (bina 1), istenen girişler ve alanlar.
function kur({ kat = 1, girisler = [{ id: 1 }], alanlar = [] } = {}) {
  const veri = {
    binalar: [{ id: 1, ad: 'B' }],
    girisler: girisler.map((g) => ({ bina_id: 1, ad: `G${g.id}`, ...g })),
    mekanlar: [{ id: 1, bina_id: 1, ad: 'M', tur: 'kafe', kat }],
    alanlar: alanlar.map(([nesne_turu, nesne_id, alan_adi, deger, durum]) => ({
      nesne_turu, nesne_id, alan_adi, deger: durum === V ? null : deger, durum,
    })),
  }
  const dizin = dizinOlustur(veri)
  return { dizin, mekan: dizin.mekan(1) }
}

const es = (filtreler, secenek) => {
  const { dizin, mekan } = kur(secenek)
  return mekanEslesmesi(mekan, filtreler, dizin)
}

// Asansörün üç doğrulanmış alanı; tek tek değiştirmek için.
const asansor = (calisiyor = ['evet', D], tekerlekli = ['uygun', D], varMi = ['var', D]) => [
  ['mekan', 1, 'asansor_var', ...varMi],
  ['mekan', 1, 'asansor_calisiyor', ...calisiyor],
  ['mekan', 1, 'asansor_tekerlekli', ...tekerlekli],
]

describe('eksik veri asla "Uygun Eşleşme" olmaz', () => {
  it('1. sessiz değeri teyitsizse → eksik (teyitsiz)', () => {
    const e = es(['sessiz'], { alanlar: [['mekan', 1, 'gurultu_yogun', 'sessiz', T]] })
    expect(e.sonuc).toBe('eksik')
    expect(e.detay[0].durum).toBe('teyitsiz')
  })

  it('2. gürültü satırı hiç yoksa → eksik (veri_yok)', () => {
    const e = es(['sessiz'])
    expect(e.sonuc).toBe('eksik')
    expect(e.detay[0].durum).toBe('veri_yok')
  })

  it('3. satır var ama durum veri_yok → eksik', () => {
    expect(es(['dogal_isik'], { alanlar: [['mekan', 1, 'gun_isigi', null, V]] }).sonuc).toBe('eksik')
  })

  it('4. binanın hiç girişi yoksa basamaksız filtresi → eksik', () => {
    expect(es(['basamaksiz'], { girisler: [] }).sonuc).toBe('eksik')
  })

  it('5. tek giriş basamaksız ama teyitsiz → eksik', () => {
    expect(es(['basamaksiz'], { alanlar: [['giris', 1, 'basamaksiz', 'var', T]] }).sonuc).toBe('eksik')
  })

  it('6. bir giriş doğrulanmış "yok", diğerinde veri yok → eksik (diğeri basamaksız olabilir)', () => {
    const e = es(['basamaksiz'], { girisler: [{ id: 1 }, { id: 2 }], alanlar: [['giris', 1, 'basamaksiz', 'yok', D]] })
    expect(e.sonuc).toBe('eksik')
  })

  it('7. kat 2, asansör var ve çalışıyor ama tekerlekli uygunluğu teyitsiz → eksik', () => {
    expect(es(['asansor'], { kat: 2, alanlar: asansor(undefined, ['uygun', T]) }).sonuc).toBe('eksik')
  })

  it('8. rampa var (doğrulanmış) ama durumu teyitsiz "uygun", basamaksız doğrulanmış "yok" → eksik', () => {
    const e = es(['rampa'], {
      alanlar: [['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'uygun', T], ['giris', 1, 'basamaksiz', 'yok', D]],
    })
    expect(e.sonuc).toBe('eksik')
  })

  it('9. iki filtreden biri doğrulanmış uygun, diğeri teyitsiz → eksik', () => {
    const e = es(['sessiz', 'seyrek_oturma'], {
      alanlar: [['mekan', 1, 'gurultu_yogun', 'sessiz', D], ['mekan', 1, 'oturma', 'seyrek', T]],
    })
    expect(e.sonuc).toBe('eksik')
  })

  it('10. teyitsiz ama UYMAYAN değer de "uygun değil" değil, eksik sayılır', () => {
    expect(es(['sessiz'], { alanlar: [['mekan', 1, 'gurultu_yogun', 'gurultulu', T]] }).sonuc).toBe('eksik')
  })

  it('11. orta gürültü filtresinde değer teyitsiz "orta" → eksik', () => {
    expect(es(['orta_gurultu'], { alanlar: [['mekan', 1, 'gurultu_yogun', 'orta', T]] }).sonuc).toBe('eksik')
  })

  it('12. tüm filtreler seçili, hiç veri yok → eksik', () => {
    expect(es(FILTRELER.map((f) => f.anahtar), { kat: 1, girisler: [] }).sonuc).toBe('eksik')
  })

  it('13. açıkta floresan bilgisi teyitsiz → eksik (teyitsiz)', () => {
    const e = es(['floresan_yok'], { alanlar: [['mekan', 1, 'acik_floresan', 'yok', T]] })
    expect(e.sonuc).toBe('eksik')
    expect(e.detay[0].durum).toBe('teyitsiz')
  })

  it('14. asansör çalışıyor ama "çalışıyor" bilgisi teyitsiz, diğerleri doğrulanmış → eksik', () => {
    expect(es(['asansor'], { kat: 1, alanlar: asansor(['evet', T]) }).sonuc).toBe('eksik')
  })

  it('15. rampa durumu doğrulanmış "uygun" ama rampanın varlığı teyitsiz → eksik', () => {
    const e = es(['rampa'], { alanlar: [['giris', 1, 'rampa_var', 'var', T], ['giris', 1, 'rampa_durumu', 'uygun', D]] })
    expect(e.sonuc).toBe('eksik')
  })

  it('16. kapsamlı tarama: herhangi bir ilgili değer doğrulanmış değilse sonuç asla "uygun" olmaz', () => {
    const durumlar = [D, T, V]
    for (const d1 of durumlar) {
      for (const d2 of durumlar) {
        for (const d3 of durumlar) {
          for (const d4 of durumlar) {
            const e = es(['basamaksiz', 'sessiz', 'dogal_isik', 'floresan_yok'], {
              alanlar: [
                ['giris', 1, 'basamaksiz', 'var', d1],
                ['mekan', 1, 'gurultu_yogun', 'sessiz', d2],
                ['mekan', 1, 'gun_isigi', 'var', d3],
                ['mekan', 1, 'acik_floresan', 'yok', d4],
              ],
            })
            const hepsiDogrulanmis = [d1, d2, d3, d4].every((d) => d === D)
            expect(e.sonuc).toBe(hepsiDogrulanmis ? 'uygun' : 'eksik')
          }
        }
      }
    }
  })

  it('17. kapsamlı tarama (VE grubu): asansörün üç alanından biri doğrulanmamışsa asla "uygun" olmaz', () => {
    const durumlar = [D, T, V]
    for (const d1 of durumlar) {
      for (const d2 of durumlar) {
        for (const d3 of durumlar) {
          const e = es(['asansor'], { kat: 1, alanlar: asansor(['evet', d2], ['uygun', d3], ['var', d1]) })
          const hepsiDogrulanmis = d1 === D && d2 === D && d3 === D
          expect(e.sonuc).toBe(hepsiDogrulanmis ? 'uygun' : 'eksik')
        }
      }
    }
  })
})

describe('Nergis listesindeki yeni senaryolar', () => {
  it('rampası var ama önü kapalı, giriş basamaklı → "Rampa var" filtresinde uygun değil', () => {
    const e = es(['rampa'], {
      alanlar: [['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'onu_kapali', D], ['giris', 1, 'basamaksiz', 'yok', D]],
    })
    expect(e.sonuc).toBe('uygun_degil')
  })

  it('rampası var ama önü kapalı, basamaksız bilgisi yok → eksik (basamaksız olabilir)', () => {
    const e = es(['rampa'], { alanlar: [['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'onu_kapali', D]] })
    expect(e.sonuc).toBe('eksik')
  })

  it('rampa çok dik → uygun değil (basamaklı girişte)', () => {
    const e = es(['rampa'], {
      alanlar: [['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'cok_dik', D], ['giris', 1, 'basamaksiz', 'yok', D]],
    })
    expect(e.sonuc).toBe('uygun_degil')
  })

  it('asansör çalışıyor ama tekerlekli sandalyeye uygun değil → uygun değil', () => {
    expect(es(['asansor'], { kat: 2, alanlar: asansor(undefined, ['uygun_degil', D]) }).sonuc).toBe('uygun_degil')
  })

  it('asansör tekerlekli sandalyeye uygun ama çalışmıyor → uygun değil', () => {
    expect(es(['asansor'], { kat: 2, alanlar: asansor(['hayir', D]) }).sonuc).toBe('uygun_degil')
  })

  it('asansör çalışmıyor (doğrulanmış) diğer alanlar teyitsiz → yine uygun değil (VE grubunda kesin "hayır")', () => {
    expect(es(['asansor'], { kat: 2, alanlar: asansor(['hayir', D], ['uygun', T], ['var', T]) }).sonuc).toBe('uygun_degil')
  })

  it('açıkta floresan var (doğrulanmış) → "Açıkta floresan yok" filtresinde uygun değil', () => {
    expect(es(['floresan_yok'], { alanlar: [['mekan', 1, 'acik_floresan', 'var', D]] }).sonuc).toBe('uygun_degil')
  })

  it('doğal ışık filtresi gun_isigi alanına bakar; doğal aydınlık alan tek başına yetmez', () => {
    expect(es(['dogal_isik'], { alanlar: [['mekan', 1, 'gun_isigi', 'var', D]] }).sonuc).toBe('uygun')
    expect(es(['dogal_isik'], { alanlar: [['mekan', 1, 'dogal_aydinlik_alan', 'var', D]] }).sonuc).toBe('eksik')
  })
})

describe('uygun ve uygun değil', () => {
  it('tüm seçilen kriterler doğrulanmış ve sağlanıyorsa → uygun', () => {
    const e = es(['basamaksiz', 'sessiz'], {
      alanlar: [['giris', 1, 'basamaksiz', 'var', D], ['mekan', 1, 'gurultu_yogun', 'sessiz', D]],
    })
    expect(e.sonuc).toBe('uygun')
  })

  it('doğrulanmış uymayan değer → uygun değil', () => {
    expect(es(['sessiz'], { alanlar: [['mekan', 1, 'gurultu_yogun', 'orta', D]] }).sonuc).toBe('uygun_degil')
  })

  it('bir filtre eksik, diğeri doğrulanmış sağlanmıyor → uygun değil (VE mantığı)', () => {
    const e = es(['sessiz', 'dogal_isik'], {
      alanlar: [['mekan', 1, 'gurultu_yogun', 'sessiz', T], ['mekan', 1, 'gun_isigi', 'yok', D]],
    })
    expect(e.sonuc).toBe('uygun_degil')
  })

  it('giriş katındaki mekân asansör olmadan da "asansörle ulaşılabilir"', () => {
    expect(es(['asansor'], { kat: 0 }).sonuc).toBe('uygun')
  })

  it('asansörün üç alanı da doğrulanmış ve uygun → uygun', () => {
    expect(es(['asansor'], { kat: 3, alanlar: asansor() }).sonuc).toBe('uygun')
  })

  it('kat 1 ve asansör doğrulanmış "yok" → uygun değil', () => {
    expect(es(['asansor'], { kat: 1, alanlar: [['mekan', 1, 'asansor_var', 'yok', D]] }).sonuc).toBe('uygun_degil')
  })

  it('rampa filtresi doğrulanmış uygun rampayla sağlanır', () => {
    const e = es(['rampa'], { alanlar: [['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'uygun', D]] })
    expect(e.sonuc).toBe('uygun')
  })

  it('rampa filtresi doğrulanmış basamaksız girişle de sağlanır', () => {
    expect(es(['rampa'], { alanlar: [['giris', 1, 'basamaksiz', 'var', D]] }).sonuc).toBe('uygun')
  })

  it('bir girişin rampası önü kapalı, diğer giriş doğrulanmış basamaksız → uygun', () => {
    const e = es(['rampa'], {
      girisler: [{ id: 1 }, { id: 2 }],
      alanlar: [
        ['giris', 1, 'rampa_var', 'var', D], ['giris', 1, 'rampa_durumu', 'onu_kapali', D], ['giris', 1, 'basamaksiz', 'yok', D],
        ['giris', 2, 'basamaksiz', 'var', D],
      ],
    })
    expect(e.sonuc).toBe('uygun')
  })

  it('tüm girişler doğrulanmış "yok" → uygun değil', () => {
    const e = es(['basamaksiz'], {
      girisler: [{ id: 1 }, { id: 2 }],
      alanlar: [['giris', 1, 'basamaksiz', 'yok', D], ['giris', 2, 'basamaksiz', 'yok', D]],
    })
    expect(e.sonuc).toBe('uygun_degil')
  })

  it('orta gürültü filtresi doğrulanmış "sessiz"i de kabul eder', () => {
    expect(es(['orta_gurultu'], { alanlar: [['mekan', 1, 'gurultu_yogun', 'sessiz', D]] }).sonuc).toBe('uygun')
  })

  it('filtre seçilmemişse sonuç null', () => {
    expect(es([]).sonuc).toBeNull()
  })

  it('filtreSonucu veri olmayan mekânda çökmez', () => {
    const { dizin, mekan } = kur()
    expect(filtreSonucu(filtreBul('sessiz'), mekan, dizin).sonuc).toBe('eksik')
  })
})

describe('örnek veri', () => {
  const dizin = dizinOlustur(ornekVeri)
  const grupla = (f) => {
    const g = sonuclariGrupla(dizin.mekanlar, f, dizin)
    return Object.fromEntries(Object.entries(g).map(([k, v]) => [k, v.map((x) => x.mekan.id)]))
  }

  it('Kütüphane tüm filtrelerde uygun eşleşme', () => {
    expect(grupla(FILTRELER.map((f) => f.anahtar)).uygun).toEqual([1])
  })

  it('"Sessiz" filtresinde üç grup da temsil edilir', () => {
    const g = grupla(['sessiz'])
    expect(g.uygun).toEqual([1])
    expect(g.eksik).toEqual(expect.arrayContaining([4, 5]))
    expect(g.uygun_degil).toEqual(expect.arrayContaining([2, 3]))
  })

  it('Çalışma Salonu: asansör tekerlekli sandalyeye uygun değil → uygun değil; açıkta floresan teyitsiz → eksik', () => {
    expect(grupla(['asansor']).uygun_degil).toContain(2)
    expect(grupla(['floresan_yok']).eksik).toContain(2)
  })
})

describe('filtreleriCoz', () => {
  it('geçersizleri ve tekrarları atar, sabit sırayla döner', () => {
    expect(filtreleriCoz('sessiz,yok_boyle,basamaksiz,sessiz')).toEqual(['basamaksiz', 'sessiz'])
  })
  it('boş parametre', () => {
    expect(filtreleriCoz(null)).toEqual([])
    expect(filtreleriCoz('')).toEqual([])
  })
})
