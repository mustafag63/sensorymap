import { Link } from 'react-router'
import { METIN } from '../sabitler.js'

export default function BulunamadiSayfasi() {
  return (
    <div className="metin-sayfasi">
      <h1>{METIN.bulunamadi.baslik}</h1>
      <p>
        <Link to="/">{METIN.bulunamadi.geri}</Link>
      </p>
    </div>
  )
}
