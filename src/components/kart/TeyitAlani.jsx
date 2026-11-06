import { useEffect, useRef, useState } from 'react'
import { degerMetni } from '../../data/kriterler.js'
import { teyitEt } from '../../lib/veri.js'
import { useVeri } from '../../lib/veriBaglami.js'
import { METIN } from '../../sabitler.js'

// Teyit sonrası mesaj TeyitAlani'nda tutulur: değer doğrulanınca düğme kalkar ama mesaj ve odak kalır.
function TeyitDugmesi({ bildirim, onSonuc }) {
  const { yenile } = useVeri()
  const [bekliyor, setBekliyor] = useState(false)

  if (bildirim.kendi) return <p className="kriter-not">{METIN.kart.kendiBildirimin}</p>
  if (bildirim.teyit_ettim) return <p className="kriter-not">{METIN.kart.teyitEttin}</p>

  const tikla = async () => {
    setBekliyor(true)
    try {
      await teyitEt(bildirim.id)
      onSonuc({ metin: METIN.kart.teyitAlindi })
      await yenile()
    } catch (e) {
      onSonuc({ metin: `${METIN.islemHatasi}: ${e.message}`, hata: true })
      setBekliyor(false)
    }
  }

  return (
    <div className="teyit-alani">
      <button type="button" className="dugme dugme-ikincil dugme-kucuk" onClick={tikla} disabled={bekliyor}>
        {METIN.kart.teyitEt}
      </button>
      <span className="kriter-not">{METIN.kart.teyitSayisi(bildirim.teyit_sayisi)}</span>
    </div>
  )
}

/**
 * Teyitsiz değerin yanında "Teyit et"; doğrulanmış değerle çelişen bekleyen
 * bildirim varsa "Bu bilgiye itiraz var" notu (SPEC §3, §5.3).
 */
export default function TeyitAlani({ nesne_turu, nesne_id, alan }) {
  const { dizin } = useVeri()
  const [mesaj, setMesaj] = useState(null)
  const mesajRef = useRef(null)

  useEffect(() => {
    if (mesaj) mesajRef.current?.focus()
  }, [mesaj])

  if (mesaj) {
    return (
      <p ref={mesajRef} tabIndex={-1} className={mesaj.hata ? 'hata-mesaji' : 'basari-mesaji'} role={mesaj.hata ? 'alert' : 'status'}>
        {mesaj.metin}
      </p>
    )
  }
  if (!alan || alan.durum === 'veri_yok') return null
  const bekleyenler = dizin.bekleyenler(nesne_turu, nesne_id, alan.alan_adi)

  if (alan.durum === 'teyitsiz') {
    const bildirim = bekleyenler.find((b) => b.deger === alan.deger)
    return bildirim ? <TeyitDugmesi bildirim={bildirim} onSonuc={setMesaj} /> : null
  }

  const itirazlar = bekleyenler.filter((b) => b.deger !== alan.deger)
  if (itirazlar.length === 0) return null
  return (
    <div className="itiraz">
      <p className="itiraz-baslik">
        <span aria-hidden="true">⚑ </span>
        {METIN.kart.itiraz}
      </p>
      {itirazlar.map((b) => (
        <div key={b.id}>
          <p className="kriter-not">{METIN.kart.itirazDetay(degerMetni(alan.alan_adi, b.deger))}</p>
          <TeyitDugmesi bildirim={b} onSonuc={setMesaj} />
        </div>
      ))}
    </div>
  )
}
