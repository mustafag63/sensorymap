// Bellekteki örnek kaynağın kuralları supabase/tests/senaryolar.sql ile aynı olmalı.
import { beforeEach, describe, expect, it, vi } from 'vitest'

let kimlik
vi.stubGlobal('localStorage', {
  getItem: () => kimlik,
  setItem: (_, v) => {
    kimlik = v
  },
})
const kullanici = (n) => {
  kimlik = `00000000-0000-4000-8000-1000000000${String(n).padStart(2, '0')}`
}

const kaynak = await import('./ornek.js')
const alan = async (nt, id, ad) => (await kaynak.verileriGetir()).alanlar.find((a) => a.nesne_turu === nt && a.nesne_id === id && a.alan_adi === ad)
const bekleyen = async (nt, id, ad) => (await kaynak.verileriGetir()).bekleyenBildirimler.find((b) => b.nesne_turu === nt && b.nesne_id === id && b.alan_adi === ad)

describe('örnek kaynak: bildirim ve teyit kuralları', () => {
  beforeEach(() => kullanici(1))

  it('veri olmayan alana bildirim → teyitsiz', async () => {
    await kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 5, alan_adi: 'oturma', deger: 'seyrek' })
    expect(await alan('mekan', 5, 'oturma')).toMatchObject({ deger: 'seyrek', durum: 'teyitsiz', kaynak: 'kullanici' })
    expect((await bekleyen('mekan', 5, 'oturma')).kendi).toBe(true)
  })

  it('kişi kendi bildirimini teyit edemez', async () => {
    const b = await bekleyen('mekan', 5, 'oturma')
    await expect(kaynak.teyitEt(b.id)).rejects.toThrow(/Kendi bildiriminizi/)
  })

  it('aynı kişi iki kez teyit edemez; 2 bağımsız teyit → doğrulanmış', async () => {
    const b = await bekleyen('mekan', 5, 'oturma')
    kullanici(2)
    await kaynak.teyitEt(b.id)
    await expect(kaynak.teyitEt(b.id)).rejects.toThrow(/zaten teyit/)
    expect((await alan('mekan', 5, 'oturma')).durum).toBe('teyitsiz')
    kullanici(3)
    await kaynak.teyitEt(b.id)
    expect((await alan('mekan', 5, 'oturma')).durum).toBe('dogrulanmis')
    expect(await bekleyen('mekan', 5, 'oturma')).toBeUndefined()
  })

  it('doğrulanmış değerle çelişen bildirim değeri silmez, 2 teyitle yer değiştirir', async () => {
    await kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 1, alan_adi: 'isik', deger: 'los' })
    expect(await alan('mekan', 1, 'isik')).toMatchObject({ deger: 'dogal', durum: 'dogrulanmis' })
    const b = await bekleyen('mekan', 1, 'isik')
    kullanici(4)
    await kaynak.teyitEt(b.id)
    kullanici(5)
    await kaynak.teyitEt(b.id)
    expect(await alan('mekan', 1, 'isik')).toMatchObject({ deger: 'los', durum: 'dogrulanmis' })
  })

  it('doğrulanmış değerle aynı bildirim hemen sonuçlanır', async () => {
    await kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 1, alan_adi: 'oturma', deger: 'seyrek' })
    expect(await bekleyen('mekan', 1, 'oturma')).toBeUndefined()
  })

  it('gürültü bildirimi ölçüm zamanını kaydeder', async () => {
    await kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 5, alan_adi: 'gurultu_yogun', deger: 'orta' })
    expect((await alan('mekan', 5, 'gurultu_yogun')).olcum_zamani).toBeTruthy()
  })

  it('geçersiz değer ve olmayan kayıt reddedilir', async () => {
    await expect(kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 5, alan_adi: 'oturma', deger: 'kalabalik' })).rejects.toThrow()
    await expect(kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 999, alan_adi: 'oturma', deger: 'seyrek' })).rejects.toThrow()
    await expect(kaynak.hataBildir({ nesne_turu: 'mekan', nesne_id: 1, aciklama: '   ' })).rejects.toThrow()
  })

  it('bekleyen bildirimler anonim_id içermez', async () => {
    const { bekleyenBildirimler } = await kaynak.verileriGetir()
    expect(bekleyenBildirimler.length).toBeGreaterThan(0)
    for (const b of bekleyenBildirimler) expect(b).not.toHaveProperty('anonim_id')
  })

  it('localStorage erişimi hata verirse bellekte kimlikle çalışmaya devam eder', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('SecurityError')
      },
    })
    await expect(kaynak.verileriGetir()).resolves.toBeTruthy()
    await expect(kaynak.bildirimGonder({ nesne_turu: 'mekan', nesne_id: 5, alan_adi: 'muzik', deger: 'yok' })).resolves.toBeUndefined()
  })
})
