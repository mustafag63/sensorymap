import { degerMetni, olcumCihaziEtiketi, sinirDisi } from '../../data/kriterler.js'
import { durumu } from '../../lib/dizin.js'
import { METIN, tarihMetni } from '../../sabitler.js'
import DurumRozeti from '../DurumRozeti.jsx'

/** Bir kriterin etiketi, değeri, durum rozeti ve (varsa) uyarı/ölçüm zamanı. children: teyit/itiraz alanı. */
export default function KriterSatiri({ kriter, alan, children }) {
  const metin = degerMetni(kriter.anahtar, alan?.deger)
  const sinir = sinirDisi(kriter, alan?.deger)
  const cihaz = olcumCihaziEtiketi(alan?.olcum_cihazi)

  return (
    <li className="kriter-satiri">
      <div className={`kriter-ust${kriter.tip === 'metin' ? ' uzun-deger' : ''}`}>
        <span className="kriter-etiket">{kriter.etiket}</span>
        <span className="kriter-deger">{metin ?? '—'}</span>
        <DurumRozeti durum={durumu(alan)} />
      </div>
      {sinir && (
        <p className="kriter-uyari">
          ⚠{' '}
          {sinir.enAz != null
            ? METIN.kart.sinirAz(degerMetni(kriter.anahtar, String(sinir.enAz)))
            : METIN.kart.sinirFazla(degerMetni(kriter.anahtar, String(sinir.enFazla)))}
        </p>
      )}
      {kriter.olcum && alan?.olcum_zamani && (
        <p className="kriter-not">
          {METIN.kart.olcum}: <time dateTime={alan.olcum_zamani}>{tarihMetni(alan.olcum_zamani)}</time>
          {cihaz && ` · ${METIN.kart.olcumCihazi}: ${cihaz}`}
        </p>
      )}
      {children}
    </li>
  )
}
