import { useState } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { CAMPUS_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../config.js'
import { DETAY_ZOOM, METIN } from '../../sabitler.js'
import BinaIsaretcisi from './BinaIsaretcisi.jsx'
import MekanIsaretcisi from './MekanIsaretcisi.jsx'
import GirisIsaretcisi from './GirisIsaretcisi.jsx'

// Popup kapanınca odak işaretçiye döner (açılınca OdakBaslik alır); kapatma düğmesi Türkçe.
function HaritaOlaylari({ onZoom }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
    popupopen: (e) => {
      e.popup.getElement()?.querySelector('.leaflet-popup-close-button')?.setAttribute('aria-label', METIN.kart.kapat)
    },
    popupclose: (e) => {
      const el = e.popup.getElement()
      if (el?.contains(document.activeElement)) e.popup._source?.getElement?.()?.focus()
    },
  })
  return null
}

/** sonuclar: Map<mekanId, 'uygun'|'eksik'|'uygun_degil'> (filtre yoksa boş) */
export default function Harita({ dizin, sonuclar }) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const detay = zoom >= DETAY_ZOOM

  return (
    <div className="harita-kapsayici" role="region" aria-label={METIN.harita.bolgeEtiketi}>
      <MapContainer center={CAMPUS_CENTER} zoom={DEFAULT_ZOOM} className="campus-map" keyboard zoomControl={false}>
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <ZoomControl position="topleft" zoomInTitle={METIN.harita.yakinlastir} zoomOutTitle={METIN.harita.uzaklastir} />
        <HaritaOlaylari onZoom={setZoom} />
        {!detay && dizin.binalar.map((b) => <BinaIsaretcisi key={b.id} bina={b} dizin={dizin} sonuclar={sonuclar} />)}
        {detay && dizin.mekanlar.map((m) => <MekanIsaretcisi key={m.id} mekan={m} sonuc={sonuclar.get(m.id)} />)}
        {detay && dizin.girisler.map((g) => <GirisIsaretcisi key={g.id} giris={g} dizin={dizin} />)}
      </MapContainer>
      {!detay && <p className="harita-ipucu">{METIN.harita.yakinlastirIpucu}</p>}
    </div>
  )
}
