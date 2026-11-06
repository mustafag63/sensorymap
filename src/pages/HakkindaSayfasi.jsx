import { METIN } from '../sabitler.js'
import { useSayfaBasligi } from '../lib/useSayfaBasligi.js'
import DurumRozeti from '../components/DurumRozeti.jsx'

export default function HakkindaSayfasi() {
  const h = METIN.hakkinda
  useSayfaBasligi(h.baslik)

  return (
    <div className="metin-sayfasi">
      <h1>{h.baslik}</h1>

      <h2>{h.amacBaslik}</h2>
      <p>{h.amac}</p>

      <h2>{h.durumBaslik}</h2>
      <ul className="durum-aciklamalari">
        {Object.entries(h.durumlar).map(([durum, aciklama]) => (
          <li key={durum}>
            <DurumRozeti durum={durum} /> {aciklama}
          </li>
        ))}
      </ul>
      <p>{h.eslesmeNotu}</p>

      <h2>{h.sinirlilikBaslik}</h2>
      <ul>
        {h.sinirliliklar.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h2>{h.ekipBaslik}</h2>
      <dl className="ekip-listesi">
        {h.ekip.map(([ad, rol]) => (
          <div key={ad}>
            <dt>{ad}</dt>
            <dd>{rol}</dd>
          </div>
        ))}
      </dl>

      <p className="ipucu">{h.haritaVerisi}</p>
    </div>
  )
}
