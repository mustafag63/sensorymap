import { DURUMLAR } from '../sabitler.js'

// Durum her zaman renk + ikon + metinle gösterilir (SPEC §3, §8).
export default function DurumRozeti({ durum = 'veri_yok' }) {
  const d = DURUMLAR[durum] ?? DURUMLAR.veri_yok
  return (
    <span className={`rozet rozet-${d.anahtar}`}>
      <span className="rozet-ikon" aria-hidden="true">{d.ikon}</span>
      {d.etiket}
    </span>
  )
}
