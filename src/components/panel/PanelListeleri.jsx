import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { degerMetni, kriterBul } from '../../data/kriterler.js'
import { hataBildirimleriGetir, hataCozuldu } from '../../lib/veri.js'
import { useVeri } from '../../lib/veriBaglami.js'
import { METIN, tarihMetni } from '../../sabitler.js'

function nesneAdi(dizin, nesne_turu, nesne_id) {
  const n = nesne_turu === 'giris' ? dizin.giris(nesne_id) : dizin.mekan(nesne_id)
  return n?.ad ?? `${nesne_turu} #${nesne_id}`
}

function NesneLinki({ dizin, nesne_turu, nesne_id }) {
  const ad = nesneAdi(dizin, nesne_turu, nesne_id)
  if (nesne_turu !== 'mekan' || !dizin.mekan(nesne_id)) return ad
  return <Link to={`/mekan/${nesne_id}`}>{ad}</Link>
}

export function HataListesi() {
  const { dizin } = useVeri()
  const [liste, setListe] = useState(null)
  const [hata, setHata] = useState(null)
  const [cozulmusler, setCozulmusler] = useState(false)

  const yukle = useCallback(() => hataBildirimleriGetir().then(setListe, (e) => setHata(e.message)), [])
  useEffect(() => {
    yukle()
  }, [yukle])

  const coz = async (id) => {
    try {
      await hataCozuldu(id)
      await yukle()
    } catch (e) {
      setHata(e.message)
    }
  }

  if (hata) return <p className="hata-mesaji" role="alert">{`${METIN.islemHatasi}: ${hata}`}</p>
  if (!liste) return <p>{METIN.yukleniyor}</p>
  const gorunen = liste.filter((h) => cozulmusler || !h.cozuldu)

  return (
    <>
      <label className="onay-kutusu">
        <input type="checkbox" checked={cozulmusler} onChange={(e) => setCozulmusler(e.target.checked)} />
        {METIN.panel.cozulmusleriGoster}
      </label>
      {gorunen.length === 0 ? (
        <p>{METIN.panel.hataYok}</p>
      ) : (
        <ul className="panel-listesi">
          {gorunen.map((h) => (
            <li key={h.id}>
              <p className="panel-liste-baslik">
                <NesneLinki dizin={dizin} nesne_turu={h.nesne_turu} nesne_id={h.nesne_id} />
                <span className="ikincil"> · {tarihMetni(h.tarih)}</span>
              </p>
              <p>{h.aciklama}</p>
              {h.cozuldu ? (
                <p className="basari-mesaji">✓ {METIN.panel.cozulduEtiket}</p>
              ) : (
                <button type="button" className="dugme dugme-ikincil dugme-kucuk" onClick={() => coz(h.id)}>
                  {METIN.panel.cozuldu}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export function BekleyenListesi() {
  const { dizin } = useVeri()
  const liste = dizin.bekleyenBildirimler
  if (liste.length === 0) return <p>{METIN.panel.bekleyenYok}</p>
  const s = METIN.panel.sutun
  return (
    <div className="tablo-kapsayici">
      <table className="panel-tablosu">
        <thead>
          <tr>
            <th scope="col">{s.kayit}</th>
            <th scope="col">{s.kriter}</th>
            <th scope="col">{s.deger}</th>
            <th scope="col">{s.tarih}</th>
            <th scope="col">{s.teyit}</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((b) => (
            <tr key={b.id}>
              <td>
                <NesneLinki dizin={dizin} nesne_turu={b.nesne_turu} nesne_id={b.nesne_id} />
              </td>
              <td>{kriterBul(b.alan_adi)?.etiket ?? b.alan_adi}</td>
              <td>{degerMetni(b.alan_adi, b.deger)}</td>
              <td>{tarihMetni(b.tarih)}</td>
              <td>{METIN.panel.teyit(b.teyit_sayisi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
