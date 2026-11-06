import { Link, NavLink } from 'react-router'
import { METIN } from '../sabitler.js'

export default function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-title">
        {METIN.uygulamaAdi}
      </Link>
      <nav aria-label={METIN.menu.anaMenu}>
        <ul className="ana-menu">
          <li><NavLink to="/" end>{METIN.menu.harita}</NavLink></li>
          <li><NavLink to="/hakkinda">{METIN.menu.hakkinda}</NavLink></li>
          <li><NavLink to="/gizlilik">{METIN.menu.gizlilik}</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
