// Leaflet divIcon üreticileri. İşaretçiler her zaman metin içerir; sonuç
// renk dışında kenar biçimi/opaklık ve gizli metinle de belirtilir (SPEC §5.1).
import L from 'leaflet'
import { METIN, SONUC_GRUPLARI } from '../../sabitler.js'

const kac = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const KAPI_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 2h11a1 1 0 0 1 1 1v17h2v2H4v-2h1V3a1 1 0 0 1 1-1Zm1 2v16h9V4H7Zm6 7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>'
const BASAMAKSIZ_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2 20h20v2H2v-2Zm2-2L20 8v10H4Zm12-4.4L10.6 17H16v-3.4Z"/></svg>'

function sonucParcalari(sonuc) {
  if (!sonuc) return { sinif: '', metin: '' }
  return { sinif: ` sonuc-${sonuc}`, metin: `<span class="visually-hidden">, ${kac(SONUC_GRUPLARI[sonuc].kisa)}</span>` }
}

function ikon(html) {
  return L.divIcon({ className: 'isaret-kok', iconSize: null, html })
}

export function binaIkonu(bina, mekanSayisi, sonuc) {
  const s = sonucParcalari(sonuc)
  return ikon(
    `<span class="isaret isaret-bina${s.sinif}"><span class="isaret-ad">${kac(bina.ad)}</span>` +
      `<span class="isaret-rozet">${kac(METIN.harita.mekanSayisi(mekanSayisi))}</span>${s.metin}</span>`,
  )
}

export function mekanIkonu(mekan, sonuc) {
  const s = sonucParcalari(sonuc)
  return ikon(`<span class="isaret isaret-mekan${s.sinif}"><span class="isaret-ad">${kac(mekan.ad)}</span>${s.metin}</span>`)
}

export function girisIkonu(giris, basamaksiz) {
  const etiket = basamaksiz ? `<span class="isaret-ad">${kac(METIN.harita.basamaksiz)}</span>` : ''
  return ikon(
    `<span class="isaret isaret-giris${basamaksiz ? ' basamaksiz' : ''}">${basamaksiz ? BASAMAKSIZ_SVG : KAPI_SVG}${etiket}` +
      `<span class="visually-hidden">${kac(METIN.harita.giris)}: ${kac(giris.ad)}</span></span>`,
  )
}
