import { Link } from 'react-router'
import { METIN } from '../sabitler.js'
import { useSayfaBasligi } from '../lib/useSayfaBasligi.js'

export default function BulunamadiSayfasi() {
  useSayfaBasligi(METIN.bulunamadi.baslik)
  return (
    <div className="metin-sayfasi">
      <h1>{METIN.bulunamadi.baslik}</h1>
      <p>
        <Link to="/">{METIN.bulunamadi.geri}</Link>
      </p>
    </div>
  )
}
