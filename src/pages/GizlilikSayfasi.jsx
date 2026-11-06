import { METIN } from '../sabitler.js'
import { useSayfaBasligi } from '../lib/useSayfaBasligi.js'

// TODO(Sena Nur): Gizlilik metni gelince METIN.gizlilik altına eklenecek; bu sayfa şimdilik yer tutucudur.
export default function GizlilikSayfasi() {
  useSayfaBasligi(METIN.gizlilik.baslik)
  return (
    <div className="metin-sayfasi">
      <h1>{METIN.gizlilik.baslik}</h1>
      <p className="uyari-kutusu">{METIN.gizlilik.yerTutucu}</p>
    </div>
  )
}
