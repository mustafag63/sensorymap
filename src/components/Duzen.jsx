import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Altbilgi from './Altbilgi.jsx'
import { METIN } from '../sabitler.js'

export default function Duzen() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#icerik">
        {METIN.icerigeGec}
      </a>
      <Header />
      <main id="icerik" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Altbilgi />
    </div>
  )
}
