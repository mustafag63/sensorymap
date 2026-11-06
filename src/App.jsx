import { BrowserRouter, Route, Routes } from 'react-router'
import VeriSaglayici from './components/VeriSaglayici.jsx'
import Duzen from './components/Duzen.jsx'
import HaritaSayfasi from './pages/HaritaSayfasi.jsx'
import BulunamadiSayfasi from './pages/BulunamadiSayfasi.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <VeriSaglayici>
        <Routes>
          <Route element={<Duzen />}>
            <Route path="/" element={<HaritaSayfasi />} />
            <Route path="*" element={<BulunamadiSayfasi />} />
          </Route>
        </Routes>
      </VeriSaglayici>
    </BrowserRouter>
  )
}
