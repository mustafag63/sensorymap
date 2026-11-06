// Kartta "Binaya nasıl girilir" sırası: en erişilebilir giriş üstte (saf fonksiyon).
const PUAN = {
  basamaksiz: { var: 4 },
  rampa: { uygun: 2 },
  kapi_tipi: { otomatik: 1 },
  giris_turu: { acil_cikis: -1 },
}

export function girisPuani(giris, dizin) {
  let puan = 0
  for (const [alanAdi, degerler] of Object.entries(PUAN)) {
    const alan = dizin.alan('giris', giris.id, alanAdi)
    if (!alan || alan.durum === 'veri_yok' || !(alan.deger in degerler)) continue
    // Teyitsiz bilgi yarım puan alır; doğrulanmış giriş her zaman önde.
    puan += alan.durum === 'dogrulanmis' ? degerler[alan.deger] : degerler[alan.deger] / 2
  }
  return puan
}

export function girisleriSirala(girisler, dizin) {
  return girisler
    .map((g) => ({ giris: g, puan: girisPuani(g, dizin) }))
    .sort((a, b) => b.puan - a.puan)
}
