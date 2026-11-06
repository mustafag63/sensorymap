import { useRef, useState } from 'react'
import { METIN } from '../../sabitler.js'
import BildirimFormu from './BildirimFormu.jsx'
import HataFormu from './HataFormu.jsx'
import SesOlcumu from './SesOlcumu.jsx'

export default function KartEylemleri({ mekan, girisler }) {
  const [acik, setAcik] = useState(null) // 'bildirim' | 'hata' | null
  const [mesaj, setMesaj] = useState('')
  const bildirimDugmesi = useRef(null)
  const hataDugmesi = useRef(null)

  const ac = (hangisi) => {
    setMesaj('')
    setAcik(acik === hangisi ? null : hangisi)
  }
  // Form kapanınca odak onu açan düğmeye döner; sonuç canlı bölgede duyurulur.
  const kapat = (sonuc) => {
    const onceki = acik
    setAcik(null)
    setMesaj(sonuc ?? '')
    const dugme = onceki === 'hata' ? hataDugmesi : bildirimDugmesi
    requestAnimationFrame(() => dugme.current?.focus())
  }

  return (
    <section aria-labelledby="kart-eylemler">
      <h3 id="kart-eylemler">{METIN.kart.eylemler}</h3>
      <div className="eylem-dugmeleri">
        <button
          ref={bildirimDugmesi}
          type="button"
          className="dugme"
          aria-expanded={acik === 'bildirim'}
          aria-controls="bildirim-formu"
          onClick={() => ac('bildirim')}
        >
          {METIN.kart.bilgiEkle}
        </button>
        <button
          ref={hataDugmesi}
          type="button"
          className="dugme dugme-ikincil"
          aria-expanded={acik === 'hata'}
          aria-controls="hata-formu"
          onClick={() => ac('hata')}
        >
          {METIN.kart.hataBildir}
        </button>
      </div>
      <SesOlcumu />
      <p className="basari-mesaji" role="status">
        {mesaj}
      </p>
      <div id="bildirim-formu">{acik === 'bildirim' && <BildirimFormu mekan={mekan} girisler={girisler} kapat={kapat} />}</div>
      <div id="hata-formu">{acik === 'hata' && <HataFormu mekan={mekan} kapat={kapat} />}</div>
    </section>
  )
}
