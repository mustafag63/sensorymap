import { FILTRELER } from '../data/kriterler.js'
import { METIN } from '../sabitler.js'

export default function FiltreCubugu({ secili, degistir, temizle, liste, gorunumSec }) {
  return (
    <div className="filtre-cubugu">
      <div className="filtre-satiri" role="group" aria-label={METIN.filtre.bolgeEtiketi}>
        <ul className="chipler">
          {FILTRELER.map((f) => {
            const acik = secili.includes(f.anahtar)
            return (
              <li key={f.anahtar}>
                <button type="button" className="chip" aria-pressed={acik} onClick={() => degistir(f.anahtar)}>
                  <span className="chip-isaret" aria-hidden="true">{acik ? '✓' : '+'}</span>
                  {f.etiket}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="filtre-alt">
        <span className="filtre-sayi">{METIN.filtre.secili(secili.length)}</span>
        <button type="button" className="dugme dugme-ikincil dugme-kucuk" onClick={temizle} disabled={secili.length === 0}>
          {METIN.filtre.temizle}
        </button>
        <div className="gorunum-secici" role="group" aria-label={METIN.filtre.gorunum}>
          <button type="button" className="dugme dugme-kucuk" aria-pressed={!liste} onClick={() => gorunumSec(false)}>
            {METIN.filtre.haritaGorunumu}
          </button>
          <button type="button" className="dugme dugme-kucuk" aria-pressed={liste} onClick={() => gorunumSec(true)}>
            {METIN.filtre.listeGorunumu}
          </button>
        </div>
      </div>
    </div>
  )
}
