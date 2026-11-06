import { useId } from 'react'
import { METIN } from '../../sabitler.js'

/** Bir kriter için değer + "Yerinde doğrulandı" (+ gürültüde ölçüm zamanı). */
export default function KriterDuzenleyici({ kriter, satir, degistir }) {
  const kimlik = useId()
  const guncelle = (ek) => degistir({ ...satir, ...ek })

  let girdi
  if (kriter.tip === 'secim') {
    girdi = (
      <select id={kimlik} value={satir.deger} onChange={(e) => guncelle({ deger: e.target.value })}>
        <option value="">{METIN.panel.veriYokSecenek}</option>
        {kriter.secenekler.map((s) => (
          <option key={s.deger} value={s.deger}>
            {s.etiket}
          </option>
        ))}
      </select>
    )
  } else if (kriter.tip === 'sayi') {
    girdi = (
      <input id={kimlik} type="number" min="0" max="999" step="1" value={satir.deger} onChange={(e) => guncelle({ deger: e.target.value })} />
    )
  } else {
    girdi = <input id={kimlik} type="text" maxLength={200} value={satir.deger} onChange={(e) => guncelle({ deger: e.target.value })} />
  }

  return (
    <div className="kriter-duzenleyici">
      <label htmlFor={kimlik} className="kriter-etiket">
        {kriter.etiket}
        {kriter.birim ? ` (${kriter.birim})` : ''}
      </label>
      {girdi}
      <label className="onay-kutusu">
        <input
          type="checkbox"
          checked={satir.yerinde}
          disabled={satir.deger === ''}
          onChange={(e) => guncelle({ yerinde: e.target.checked })}
        />
        {METIN.panel.yerinde}
      </label>
      {kriter.olcumZamani && (
        <div className="form-alani">
          <label htmlFor={`${kimlik}-olcum`}>{METIN.panel.olcumZamani}</label>
          <input
            id={`${kimlik}-olcum`}
            type="datetime-local"
            value={satir.olcum_zamani}
            disabled={satir.deger === ''}
            onChange={(e) => guncelle({ olcum_zamani: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}
