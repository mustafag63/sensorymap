import { degerMetni } from '../../data/kriterler.js'
import { durumu } from '../../lib/dizin.js'
import { METIN, tarihMetni } from '../../sabitler.js'
import DurumRozeti from '../DurumRozeti.jsx'

/** Bir kriterin etiketi, değeri, durum rozeti ve (varsa) uyarı/ölçüm zamanı. children: teyit/itiraz alanı. */
export default function KriterSatiri({ kriter, alan, children }) {
  const metin = degerMetni(kriter.anahtar, alan?.deger)
  const darKapi = kriter.uyariAlti && alan?.deger != null && Number(alan.deger) < kriter.uyariAlti

  return (
    <li className="kriter-satiri">
      <div className="kriter-ust">
        <span className="kriter-etiket">{kriter.etiket}</span>
        <span className="kriter-deger">{metin ?? '—'}</span>
        <DurumRozeti durum={durumu(alan)} />
      </div>
      {darKapi && <p className="kriter-uyari">⚠ {METIN.kart.darKapi(kriter.uyariAlti)}</p>}
      {kriter.olcumZamani && alan?.olcum_zamani && (
        <p className="kriter-not">
          {METIN.kart.olcum}: <time dateTime={alan.olcum_zamani}>{tarihMetni(alan.olcum_zamani)}</time>
        </p>
      )}
      {children}
    </li>
  )
}
