// Kartta "Binaya nasıl girilir" sırası (saf fonksiyon):
// 1. doğrulanmış basamaksız, 2. doğrulanmış uygun rampalı, 3. diğerleri. Grup içinde sıra korunur.

const dogrulanmis = (dizin, giris, alan, deger) => {
  const a = dizin.alan('giris', giris.id, alan)
  return a?.durum === 'dogrulanmis' && a.deger === deger
}

export function girisSirasi(giris, dizin) {
  if (dogrulanmis(dizin, giris, 'basamaksiz', 'var')) return 0
  if (dogrulanmis(dizin, giris, 'rampa_var', 'var') && dogrulanmis(dizin, giris, 'rampa_durumu', 'uygun')) return 1
  return 2
}

/** @returns {Array<{ giris, sira: 0|1|2, onerilen: boolean }>} En üstteki "Önerilen giriş"tir. */
export function girisleriSirala(girisler, dizin) {
  return girisler
    .map((giris) => ({ giris, sira: girisSirasi(giris, dizin) }))
    .sort((a, b) => a.sira - b.sira)
    .map((x, i) => ({ ...x, onerilen: i === 0 }))
}
