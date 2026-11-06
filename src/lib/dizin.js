// Ham veriden hızlı arama yapısı kurar (saf fonksiyon; arayüz ve eşleşme motoru kullanır).

function grupla(liste, anahtar) {
  const m = new Map()
  for (const x of liste) {
    if (!m.has(x[anahtar])) m.set(x[anahtar], [])
    m.get(x[anahtar]).push(x)
  }
  return m
}

export function dizinOlustur({ binalar = [], girisler = [], mekanlar = [], alanlar = [], bekleyenBildirimler = [] }) {
  const alanMap = new Map(alanlar.map((a) => [`${a.nesne_turu}:${a.nesne_id}:${a.alan_adi}`, a]))
  const binaMap = new Map(binalar.map((b) => [b.id, b]))
  const mekanMap = new Map(mekanlar.map((m) => [m.id, m]))
  const binaGirisleri = grupla(girisler, 'bina_id')
  const binaMekanlari = grupla(mekanlar, 'bina_id')

  return {
    binalar,
    girisler,
    mekanlar,
    bina: (id) => binaMap.get(id) ?? null,
    mekan: (id) => mekanMap.get(id) ?? null,
    /** Satır yoksa null döner; çağıran bunu "veri_yok" sayar. */
    alan: (nesne_turu, nesne_id, alan_adi) => alanMap.get(`${nesne_turu}:${nesne_id}:${alan_adi}`) ?? null,
    girisleri: (binaId) => binaGirisleri.get(binaId) ?? [],
    mekanlari: (binaId) => binaMekanlari.get(binaId) ?? [],
    bekleyenler: (nesne_turu, nesne_id, alan_adi) =>
      bekleyenBildirimler.filter((b) => b.nesne_turu === nesne_turu && b.nesne_id === nesne_id && b.alan_adi === alan_adi),
  }
}

export const durumu = (alan) => alan?.durum ?? 'veri_yok'
