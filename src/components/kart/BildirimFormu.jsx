import { useEffect, useId, useRef, useState } from 'react'
import { gecerliDeger, kriterBul, nesneKriterleri } from '../../data/kriterler.js'
import { bildirimGonder } from '../../lib/veri.js'
import { useVeri } from '../../lib/veriBaglami.js'
import { METIN } from '../../sabitler.js'

// Seçenekler ve doğrulama yalnızca kriterler.js'den gelir.
function DegerGirisi({ id, kriter, deger, setDeger }) {
  if (kriter.tip === 'secim') {
    return (
      <select id={id} value={deger} onChange={(e) => setDeger(e.target.value)} required>
        <option value="">{METIN.bildirim.secin}</option>
        {kriter.secenekler.map((s) => (
          <option key={s.deger} value={s.deger}>
            {s.etiket}
          </option>
        ))}
      </select>
    )
  }
  if (kriter.tip === 'sayi') {
    return (
      <input id={id} type="number" inputMode="numeric" min="0" max="999" step="1" value={deger} onChange={(e) => setDeger(e.target.value)} required />
    )
  }
  return <input id={id} type="text" maxLength={200} value={deger} onChange={(e) => setDeger(e.target.value)} required />
}

export default function BildirimFormu({ mekan, girisler, kapat }) {
  const { dizin, yenile } = useVeri()
  const kimlik = useId()
  const ilkAlan = useRef(null)

  // Form açılınca ilk alana odaklanılır (görünür alana da kaydırır).
  useEffect(() => {
    ilkAlan.current?.focus()
  }, [])
  const hedefler = [
    { anahtar: `mekan:${mekan.id}`, nesne_turu: 'mekan', nesne_id: mekan.id, ad: mekan.ad },
    ...girisler.map((g) => ({ anahtar: `giris:${g.id}`, nesne_turu: 'giris', nesne_id: g.id, ad: g.ad })),
  ]
  const [hedefAnahtari, setHedefAnahtari] = useState(hedefler[0].anahtar)
  const hedef = hedefler.find((h) => h.anahtar === hedefAnahtari)
  const kriterler = nesneKriterleri(hedef.nesne_turu)
  const [kriterAnahtari, setKriterAnahtari] = useState(kriterler[0].anahtar)
  const kriter = kriterBul(kriterAnahtari)
  const [deger, setDeger] = useState('')
  const [hata, setHata] = useState(null)
  const [gonderiliyor, setGonderiliyor] = useState(false)

  const hedefSec = (anahtar) => {
    setHedefAnahtari(anahtar)
    setKriterAnahtari(nesneKriterleri(hedefler.find((h) => h.anahtar === anahtar).nesne_turu)[0].anahtar)
    setDeger('')
  }

  const gonder = async (e) => {
    e.preventDefault()
    const temiz = kriter.tip === 'metin' ? deger.trim() : deger
    if (!gecerliDeger(hedef.nesne_turu, kriter.anahtar, temiz)) {
      setHata(METIN.hatalar.gecersizDeger)
      return
    }
    const mevcut = dizin.alan(hedef.nesne_turu, hedef.nesne_id, kriter.anahtar)
    const sonucMetni =
      mevcut?.durum === 'dogrulanmis'
        ? mevcut.deger === temiz
          ? METIN.bildirim.zatenDogru
          : METIN.bildirim.itirazOldu
        : METIN.bildirim.gonderildi
    setGonderiliyor(true)
    try {
      await bildirimGonder({ nesne_turu: hedef.nesne_turu, nesne_id: hedef.nesne_id, alan_adi: kriter.anahtar, deger: temiz })
      await yenile()
      kapat(sonucMetni)
    } catch (err) {
      setHata(`${METIN.islemHatasi}: ${err.message}`)
      setGonderiliyor(false)
    }
  }

  return (
    <form className="katki-formu" onSubmit={gonder} aria-labelledby={`${kimlik}-baslik`}>
      <h4 id={`${kimlik}-baslik`}>{METIN.bildirim.baslik}</h4>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-hedef`}>{METIN.bildirim.neIcin}</label>
        <select id={`${kimlik}-hedef`} ref={ilkAlan} value={hedefAnahtari} onChange={(e) => hedefSec(e.target.value)}>
          {hedefler.map((h) => (
            <option key={h.anahtar} value={h.anahtar}>
              {h.ad}
            </option>
          ))}
        </select>
      </div>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-kriter`}>{METIN.bildirim.kriter}</label>
        <select
          id={`${kimlik}-kriter`}
          value={kriterAnahtari}
          onChange={(e) => {
            setKriterAnahtari(e.target.value)
            setDeger('')
          }}
        >
          {kriterler.map((k) => (
            <option key={k.anahtar} value={k.anahtar}>
              {k.etiket}
            </option>
          ))}
        </select>
        {kriter.kararKurali && <p className="ipucu">{kriter.kararKurali}</p>}
      </div>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-deger`}>
          {METIN.bildirim.deger}
          {kriter.birim ? ` (${kriter.birim})` : ''}
        </label>
        <DegerGirisi id={`${kimlik}-deger`} kriter={kriter} deger={deger} setDeger={setDeger} />
      </div>
      {hata && (
        <p className="hata-mesaji" role="alert">
          {hata}
        </p>
      )}
      <p className="ipucu">{METIN.bildirim.anonimNot}</p>
      <div className="form-dugmeleri">
        <button type="submit" className="dugme" disabled={gonderiliyor}>
          {METIN.bildirim.gonder}
        </button>
        <button type="button" className="dugme dugme-ikincil" onClick={() => kapat(null)}>
          {METIN.bildirim.vazgec}
        </button>
      </div>
    </form>
  )
}
