import Header from '../components/Header.jsx'
import CampusMap from '../components/CampusMap.jsx'

export default function HomePage() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#harita">Haritaya geç</a>
      <Header />
      <main id="harita" className="app-main" tabIndex={-1}>
        <h2 className="visually-hidden">AGÜ Sümer Kampüsü haritası</h2>
        <CampusMap />
      </main>
    </div>
  )
}
