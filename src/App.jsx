import { BrowserRouter, Route, Routes } from 'react-router'
import VeriSaglayici from './components/VeriSaglayici.jsx'
import Duzen from './components/Duzen.jsx'
import HaritaSayfasi from './pages/HaritaSayfasi.jsx'
import BulunamadiSayfasi from './pages/BulunamadiSayfasi.jsx'
import MekanKarti from './components/kart/MekanKarti.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <VeriSaglayici>
        <Routes>
          <Route element={<Duzen />}>
            <Route path="/" element={<HaritaSayfasi />}>
              <Route path="mekan/:id" element={<MekanKarti />} />
            </Route>
            <Route path="*" element={<BulunamadiSayfasi />} />
          </Route>
        </Routes>
      </VeriSaglayici>
    </BrowserRouter>
  )
}
