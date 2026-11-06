import { Link } from 'react-router'
import { ornekVeriModu } from '../lib/veri.js'
import { METIN } from '../sabitler.js'

export default function Altbilgi() {
  return (
    <footer className="app-footer">
      {ornekVeriModu && (
        <p className="ornek-mod">
          <strong>{METIN.ornekVeriModu}</strong>
        </p>
      )}
      <Link to="/panel">{METIN.menu.panel}</Link>
    </footer>
  )
}
