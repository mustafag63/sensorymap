import { useMemo } from 'react'
import { Link, useLocation } from 'react-router'
import { Marker, Popup, useMap } from 'react-leaflet'
import { DETAY_ZOOM, METIN } from '../../sabitler.js'
import { mekanTuruEtiketi } from '../../data/kriterler.js'
import { binaIkonu } from './ikonlar.js'
import OdakBaslik from './OdakBaslik.jsx'

// Binanın vurgusu, mekânları arasındaki en iyi sonuca göre belirlenir.
function binaSonucu(mekanlar, sonuclar) {
  const s = mekanlar.map((m) => sonuclar.get(m.id))
  return ['uygun', 'eksik', 'uygun_degil'].find((x) => s.includes(x))
}

export default function BinaIsaretcisi({ bina, dizin, sonuclar }) {
  const map = useMap()
  const { search } = useLocation()
  const mekanlar = dizin.mekanlari(bina.id)
  const sonuc = binaSonucu(mekanlar, sonuclar)
  const ikon = useMemo(() => binaIkonu(bina, mekanlar.length, sonuc), [bina, mekanlar.length, sonuc])

  const katlar = [...new Set(mekanlar.map((m) => m.kat))].sort((a, b) => a - b)

  return (
    <Marker
      position={[bina.enlem, bina.boylam]}
      icon={ikon}
      eventHandlers={{
        keydown: (e) => {
          if (e.originalEvent.key === ' ') {
            e.originalEvent.preventDefault()
            e.target.openPopup()
          }
        },
      }}
    >
      <Popup>
        <div className="bina-popup">
          <OdakBaslik>{bina.ad}</OdakBaslik>
          <p className="bina-popup-sayi">{METIN.harita.mekanSayisi(mekanlar.length)}</p>
          <h4 className="visually-hidden">{METIN.harita.katListesi}</h4>
          {katlar.map((kat) => (
            <section key={kat} className="kat-grubu">
              <h5>{METIN.harita.kat(kat)}</h5>
              <ul>
                {mekanlar
                  .filter((m) => m.kat === kat)
                  .map((m) => (
                    <li key={m.id}>
                      <Link to={`/mekan/${m.id}${search}`}>{m.ad}</Link>{' '}
                      <span className="ikincil">({mekanTuruEtiketi(m.tur)})</span>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
          <button type="button" className="dugme dugme-ikincil" onClick={() => map.setView([bina.enlem, bina.boylam], DETAY_ZOOM)}>
            {METIN.harita.yakinlastir}
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
