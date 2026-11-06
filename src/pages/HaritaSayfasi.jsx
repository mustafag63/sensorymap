import { Outlet } from 'react-router'
import { useVeri } from '../lib/veriBaglami.js'
import { METIN } from '../sabitler.js'
import Harita from '../components/harita/Harita.jsx'

const BOS_SONUC = new Map()

export default function HaritaSayfasi() {
  const { dizin, yukleniyor, hata } = useVeri()

  return (
    <div className="harita-sayfasi">
      <h1 className="visually-hidden">{METIN.sayfaBasligi}</h1>
      {yukleniyor && <p className="durum-mesaji">{METIN.yukleniyor}</p>}
      {hata && <p className="durum-mesaji hata-mesaji" role="alert">{METIN.veriHatasi}</p>}
      {dizin && (
        <div className="harita-alani">
          <Harita dizin={dizin} sonuclar={BOS_SONUC} />
        </div>
      )}
      <Outlet />
    </div>
  )
}
