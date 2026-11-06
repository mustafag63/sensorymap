import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { nesneKriterleri, degerMetni, kriterGorunur } from '../../data/kriterler.js'
import { durumu } from '../../lib/dizin.js'
import DurumRozeti from '../DurumRozeti.jsx'
import { girisIkonu } from './ikonlar.js'
import OdakBaslik from './OdakBaslik.jsx'

export default function GirisIsaretcisi({ giris, dizin }) {
  const basamaksizAlan = dizin.alan('giris', giris.id, 'basamaksiz')
  // "Basamaksız" ikonu yalnızca doğrulanmış bilgi için gösterilir.
  const basamaksiz = basamaksizAlan?.deger === 'var' && basamaksizAlan.durum === 'dogrulanmis'
  const ikon = useMemo(() => girisIkonu(giris, basamaksiz), [giris, basamaksiz])

  return (
    <Marker
      position={[giris.enlem, giris.boylam]}
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
        <div className="giris-popup">
          <OdakBaslik>{giris.ad}</OdakBaslik>
          <ul className="kriter-listesi kompakt">
            {nesneKriterleri('giris')
              .filter((k) => kriterGorunur(k, (ad) => dizin.alan('giris', giris.id, ad)))
              .map((k) => {
              const alan = dizin.alan('giris', giris.id, k.anahtar)
              return (
                <li key={k.anahtar}>
                  <span className="kriter-etiket">{k.etiket}:</span>{' '}
                  <span className="kriter-deger">{degerMetni(k.anahtar, alan?.deger) ?? '—'}</span>{' '}
                  <DurumRozeti durum={durumu(alan)} />
                </li>
              )
            })}
          </ul>
        </div>
      </Popup>
    </Marker>
  )
}
