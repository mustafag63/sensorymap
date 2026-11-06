import { useId, useMemo } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { CAMPUS_CENTER, TILE_ATTRIBUTION, TILE_URL } from '../../config.js'
import { DETAY_ZOOM, METIN } from '../../sabitler.js'

const yuvarla = (x) => Math.round(x * 1e6) / 1e6

function TiklaKoy({ sec }) {
  useMapEvents({ click: (e) => sec(yuvarla(e.latlng.lat), yuvarla(e.latlng.lng)) })
  return null
}

/**
 * Haritaya tıkla → işaretçi düşer → sürükleyerek ince ayar (SPEC §5.4).
 * Sürükleme yapamayanlar için enlem/boylam alanları da var (WCAG 2.5.7).
 */
export default function KonumSecici({ enlem, boylam, sec }) {
  const kimlik = useId()
  const var_ = enlem != null && boylam != null && !Number.isNaN(enlem) && !Number.isNaN(boylam)
  const ikon = useMemo(
    () => L.divIcon({ className: 'isaret-kok', iconSize: null, html: `<span class="isaret isaret-konum">${METIN.panel.konumIsaretci}</span>` }),
    [],
  )

  return (
    <fieldset className="konum-secici">
      <legend>{METIN.panel.konum}</legend>
      <p className="ipucu" id={`${kimlik}-ipucu`}>
        {METIN.panel.konumIpucu}
      </p>
      <div className="konum-haritasi">
        <MapContainer center={var_ ? [enlem, boylam] : CAMPUS_CENTER} zoom={DETAY_ZOOM} className="campus-map" keyboard>
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
          <TiklaKoy sec={sec} />
          {var_ && (
            <Marker
              position={[enlem, boylam]}
              icon={ikon}
              draggable
              keyboard={false}
              eventHandlers={{
                dragend: (e) => {
                  const p = e.target.getLatLng()
                  sec(yuvarla(p.lat), yuvarla(p.lng))
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="konum-alanlari">
        <div className="form-alani">
          <label htmlFor={`${kimlik}-enlem`}>{METIN.panel.enlem}</label>
          <input
            id={`${kimlik}-enlem`}
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            value={enlem ?? ''}
            onChange={(e) => sec(e.target.value === '' ? null : Number(e.target.value), boylam)}
            aria-describedby={`${kimlik}-ipucu`}
          />
        </div>
        <div className="form-alani">
          <label htmlFor={`${kimlik}-boylam`}>{METIN.panel.boylam}</label>
          <input
            id={`${kimlik}-boylam`}
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            value={boylam ?? ''}
            onChange={(e) => sec(enlem, e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
      </div>
    </fieldset>
  )
}
