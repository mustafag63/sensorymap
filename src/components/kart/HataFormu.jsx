import { useEffect, useId, useRef, useState } from 'react'
import { hataBildir } from '../../lib/veri.js'
import { METIN } from '../../sabitler.js'

export default function HataFormu({ mekan, kapat }) {
  const kimlik = useId()
  const ilkAlan = useRef(null)

  // Form açılınca ilk alana odaklanılır (görünür alana da kaydırır).
  useEffect(() => {
    ilkAlan.current?.focus()
  }, [])
  const [aciklama, setAciklama] = useState('')
  const [hata, setHata] = useState(null)
  const [gonderiliyor, setGonderiliyor] = useState(false)

  const gonder = async (e) => {
    e.preventDefault()
    setGonderiliyor(true)
    try {
      await hataBildir({ nesne_turu: 'mekan', nesne_id: mekan.id, aciklama })
      kapat(METIN.hata.gonderildi)
    } catch (err) {
      setHata(`${METIN.islemHatasi}: ${err.message}`)
      setGonderiliyor(false)
    }
  }

  return (
    <form className="katki-formu" onSubmit={gonder} aria-labelledby={`${kimlik}-baslik`}>
      <h4 id={`${kimlik}-baslik`}>{METIN.hata.baslik}</h4>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-aciklama`}>{METIN.hata.aciklama}</label>
        <textarea
          id={`${kimlik}-aciklama`} ref={ilkAlan}
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          maxLength={1000}
          required
          aria-describedby={`${kimlik}-ipucu`}
        />
        <p id={`${kimlik}-ipucu`} className="ipucu">
          {METIN.hata.ipucu}
        </p>
      </div>
      {hata && (
        <p className="hata-mesaji" role="alert">
          {hata}
        </p>
      )}
      <div className="form-dugmeleri">
        <button type="submit" className="dugme" disabled={gonderiliyor}>
          {METIN.hata.gonder}
        </button>
        <button type="button" className="dugme dugme-ikincil" onClick={() => kapat(null)}>
          {METIN.hata.vazgec}
        </button>
      </div>
    </form>
  )
}
