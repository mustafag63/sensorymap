import { Link, useLocation } from 'react-router'
import { mekanTuruEtiketi } from '../data/kriterler.js'
import { METIN, SONUC_GRUPLARI } from '../sabitler.js'
import DurumRozeti from './DurumRozeti.jsx'

function MekanOgesi({ oge, dizin }) {
  const { search } = useLocation()
  const { mekan, sonuc, detay = [] } = oge
  const bina = dizin.bina(mekan.bina_id)
  const eksikler = detay.filter((d) => d.sonuc === 'eksik')
  const saglanmayanlar = detay.filter((d) => d.sonuc === 'saglamaz')

  return (
    <li className={`sonuc-ogesi${sonuc ? ` sonuc-${sonuc}` : ''}`}>
      <Link to={`/mekan/${mekan.id}${search}`} className="sonuc-link">
        {mekan.ad}
      </Link>
      <p className="sonuc-alt">
        {mekanTuruEtiketi(mekan.tur)} · {bina?.ad} · {METIN.harita.kat(mekan.kat)}
      </p>
      {eksikler.length > 0 && (
        <div className="eksik-bilgiler">
          <span className="visually-hidden">{METIN.liste.eksikAlanlar}:</span>
          <ul>
            {eksikler.map((d) => (
              <li key={d.filtre.anahtar}>
                {d.filtre.etiket} <DurumRozeti durum={d.durum} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {saglanmayanlar.length > 0 && (
        <p className="sonuc-alt">
          <span aria-hidden="true">✕ </span>
          {saglanmayanlar.map((d) => d.filtre.etiket).join(', ')}
        </p>
      )}
    </li>
  )
}

function Grup({ anahtar, ogeler, dizin, baslik }) {
  return (
    <section className={`sonuc-grubu grup-${anahtar}`} aria-labelledby={`grup-${anahtar}`}>
      <h2 id={`grup-${anahtar}`}>
        {baslik} <span className="grup-sayi">({ogeler.length})</span>
      </h2>
      {ogeler.length === 0 ? (
        <p className="ikincil">{METIN.liste.bos}</p>
      ) : (
        <ul className="sonuc-ogeleri">
          {ogeler.map((o) => (
            <MekanOgesi key={o.mekan.id} oge={o} dizin={dizin} />
          ))}
        </ul>
      )}
    </section>
  )
}

// Harita ekran okuyucuyla kullanılamadığı için zorunlu liste alternatifi (SPEC §5.1).
export default function SonucListesi({ dizin, filtreVar, gruplar, hepsi, hepsiSec }) {
  if (!filtreVar) {
    return (
      <div className="sonuc-listesi">
        <Grup anahtar="tum" baslik={METIN.liste.tumMekanlar} dizin={dizin} ogeler={dizin.mekanlar.map((mekan) => ({ mekan }))} />
      </div>
    )
  }
  return (
    <div className="sonuc-listesi">
      <Grup anahtar="uygun" baslik={SONUC_GRUPLARI.uygun.baslik} ogeler={gruplar.uygun} dizin={dizin} />
      <Grup anahtar="eksik" baslik={SONUC_GRUPLARI.eksik.baslik} ogeler={gruplar.eksik} dizin={dizin} />
      <label className="onay-kutusu">
        <input type="checkbox" checked={hepsi} onChange={(e) => hepsiSec(e.target.checked)} />
        {METIN.liste.uygunOlmayanlariGoster} ({gruplar.uygun_degil.length})
      </label>
      {hepsi && <Grup anahtar="uygun_degil" baslik={SONUC_GRUPLARI.uygun_degil.baslik} ogeler={gruplar.uygun_degil} dizin={dizin} />}
    </div>
  )
}
