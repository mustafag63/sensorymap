import { useEffect, useId, useState } from 'react'
import { ekipCikisi, ekipGirisi, ekipOturumu, ornekVeriModu } from '../lib/veri.js'
import { useVeri } from '../lib/veriBaglami.js'
import { METIN } from '../sabitler.js'
import KayitFormu from '../components/panel/KayitFormu.jsx'
import { BekleyenListesi, HataListesi } from '../components/panel/PanelListeleri.jsx'

// Hesaplar Supabase'de elle açılır; kayıt formu yoktur (SPEC §5.4).
function GirisFormu({ girdi }) {
  const kimlik = useId()
  const [eposta, setEposta] = useState('')
  const [sifre, setSifre] = useState('')
  const [hata, setHata] = useState(null)

  const gonder = async (e) => {
    e.preventDefault()
    try {
      await ekipGirisi(eposta, sifre)
      girdi()
    } catch (err) {
      setHata(err.message)
    }
  }

  return (
    <form className="giris-formu" onSubmit={gonder}>
      <h2>{METIN.panel.girisBaslik}</h2>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-eposta`}>{METIN.panel.eposta}</label>
        <input id={`${kimlik}-eposta`} type="email" autoComplete="username" value={eposta} onChange={(e) => setEposta(e.target.value)} required />
      </div>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-sifre`}>{METIN.panel.sifre}</label>
        <input id={`${kimlik}-sifre`} type="password" autoComplete="current-password" value={sifre} onChange={(e) => setSifre(e.target.value)} required />
      </div>
      {hata && (
        <p className="hata-mesaji" role="alert">
          {hata}
        </p>
      )}
      <button type="submit" className="dugme">
        {METIN.panel.girisYap}
      </button>
    </form>
  )
}

function KayitDuzenleyici() {
  const { dizin } = useVeri()
  const kimlik = useId()
  const [secim, setSecim] = useState('yeni:binalar')
  const [mesaj, setMesaj] = useState('')
  const [tablo, idMetni] = secim.split(':')
  const yeni = tablo === 'yeni'
  const gercekTablo = yeni ? idMetni : tablo
  const mevcut = yeni ? null : dizin[gercekTablo].find((x) => x.id === Number(idMetni))

  return (
    <>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-secim`}>{METIN.panel.kayitSec}</label>
        <select
          id={`${kimlik}-secim`}
          value={secim}
          onChange={(e) => {
            setSecim(e.target.value)
            setMesaj('')
          }}
        >
          <optgroup label={METIN.panel.yeniKayit}>
            <option value="yeni:binalar">{METIN.panel.yeniBina}</option>
            <option value="yeni:girisler">{METIN.panel.yeniGiris}</option>
            <option value="yeni:mekanlar">{METIN.panel.yeniMekan}</option>
          </optgroup>
          {['binalar', 'girisler', 'mekanlar'].map((t) => (
            <optgroup key={t} label={METIN.panel[t]}>
              {dizin[t].map((x) => (
                <option key={x.id} value={`${t}:${x.id}`}>
                  {x.ad}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <p className="basari-mesaji" role="status">
        {mesaj}
      </p>
      <KayitFormu
        key={secim}
        tablo={gercekTablo}
        mevcut={mevcut}
        kaydedildi={(t, id) => {
          setSecim(`${t}:${id}`)
          setMesaj(METIN.kaydedildi)
        }}
      />
    </>
  )
}

const BOLUMLER = ['kayitlar', 'hatalar', 'bekleyen']

export default function PanelSayfasi() {
  const { dizin } = useVeri()
  const [oturum, setOturum] = useState(null)
  const [bolum, setBolum] = useState('kayitlar')

  const oturumuYukle = () => ekipOturumu().then(setOturum)
  useEffect(() => {
    let iptal = false
    ekipOturumu().then((o) => !iptal && setOturum(o))
    return () => {
      iptal = true
    }
  }, [])

  const cikis = async () => {
    await ekipCikisi()
    await oturumuYukle()
  }

  return (
    <div className="metin-sayfasi panel-sayfasi">
      <h1>{METIN.panel.baslik}</h1>
      {ornekVeriModu && (
        <p className="uyari-kutusu" role="note">
          <strong>{METIN.panel.ornekUyari}</strong>
        </p>
      )}
      {!oturum || !dizin ? (
        <p>{METIN.yukleniyor}</p>
      ) : !oturum.girisYapildi ? (
        <GirisFormu girdi={oturumuYukle} />
      ) : !oturum.ekip ? (
        <>
          <p className="hata-mesaji" role="alert">
            {METIN.panel.ekipDegil}
          </p>
          <button type="button" className="dugme dugme-ikincil" onClick={cikis}>
            {METIN.panel.cikis}
          </button>
        </>
      ) : (
        <>
          {!ornekVeriModu && (
            <p className="panel-oturum">
              {oturum.eposta}{' '}
              <button type="button" className="dugme dugme-ikincil dugme-kucuk" onClick={cikis}>
                {METIN.panel.cikis}
              </button>
            </p>
          )}
          <div className="bolum-secici" role="group" aria-label={METIN.panel.bolumler}>
            {BOLUMLER.map((b) => (
              <button key={b} type="button" className="dugme dugme-kucuk" aria-pressed={bolum === b} onClick={() => setBolum(b)}>
                {METIN.panel.sekmeler[b]}
              </button>
            ))}
          </div>
          <section aria-labelledby="panel-bolum-baslik">
            <h2 id="panel-bolum-baslik">{METIN.panel.sekmeler[bolum]}</h2>
            {bolum === 'kayitlar' && <KayitDuzenleyici />}
            {bolum === 'hatalar' && <HataListesi />}
            {bolum === 'bekleyen' && <BekleyenListesi />}
          </section>
        </>
      )}
    </div>
  )
}
