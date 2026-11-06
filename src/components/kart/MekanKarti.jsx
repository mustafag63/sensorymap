import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useVeri } from '../../lib/veriBaglami.js'
import { girisleriSirala } from '../../lib/girisSirasi.js'
import { mekanTuruEtiketi, nesneKriterleri } from '../../data/kriterler.js'
import { METIN, tarihMetni } from '../../sabitler.js'
import KriterSatiri from './KriterSatiri.jsx'

function sonGuncelleme(mekan, dizin) {
  const tarihler = nesneKriterleri('mekan')
    .map((k) => dizin.alan('mekan', mekan.id, k.anahtar)?.guncelleme)
    .filter(Boolean)
  return tarihler.sort().at(-1) ?? mekan.olusturma
}

// Mobilde alttan açılan panel, masaüstünde sağ yan panel (SPEC §5.3).
// Açılınca odak başlığa taşınır; Esc ya da Kapat ile kapanır ve odak açan öğeye döner.
export default function MekanKarti() {
  const { id } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()
  const { dizin } = useVeri()
  const baslikRef = useRef(null)
  const [acan] = useState(() => document.activeElement)

  const kapat = () => navigate({ pathname: '/', search })
  const hazir = dizin != null

  // Doğrudan linkle açılışta başlık ancak veri gelince çizilir.
  useEffect(() => {
    baslikRef.current?.focus()
  }, [id, hazir])

  useEffect(() => {
    const tus = (e) => {
      if (e.key === 'Escape') navigate({ pathname: '/', search })
    }
    document.addEventListener('keydown', tus)
    return () => document.removeEventListener('keydown', tus)
  }, [navigate, search])

  useEffect(
    () => () => {
      if (acan?.isConnected && acan !== document.body) acan.focus()
      else document.getElementById('icerik')?.focus()
    },
    [acan],
  )

  if (!dizin) return null
  const mekan = dizin.mekan(Number(id))
  const bina = mekan && dizin.bina(mekan.bina_id)
  const girisler = mekan ? girisleriSirala(dizin.girisleri(mekan.bina_id), dizin) : []

  return (
    <aside className="mekan-karti" aria-labelledby="kart-baslik">
      <div className="kart-ust">
        <h2 id="kart-baslik" ref={baslikRef} tabIndex={-1}>
          {mekan ? mekan.ad : METIN.kart.bulunamadi}
        </h2>
        <button type="button" className="dugme dugme-ikincil kapat-dugmesi" onClick={kapat}>
          <span aria-hidden="true">✕</span> {METIN.kart.kapat}
        </button>
      </div>

      {mekan && (
        <div className="kart-govde">
          <dl className="kart-bilgi">
            <div><dt>{METIN.kart.tur}</dt><dd>{mekanTuruEtiketi(mekan.tur)}</dd></div>
            <div><dt>{METIN.kart.bina}</dt><dd>{bina?.ad ?? '—'}</dd></div>
            <div><dt>{METIN.kart.kat}</dt><dd>{METIN.harita.kat(mekan.kat)}</dd></div>
            <div>
              <dt>{METIN.kart.sonGuncelleme}</dt>
              <dd><time dateTime={sonGuncelleme(mekan, dizin)}>{tarihMetni(sonGuncelleme(mekan, dizin))}</time></dd>
            </div>
          </dl>

          <section aria-labelledby="kart-giris">
            <h3 id="kart-giris">{METIN.kart.nasilGirilir}</h3>
            {girisler.length === 0 && <p>{METIN.kart.girisYok}</p>}
            {girisler.map(({ giris, puan }, i) => (
              <article key={giris.id} className="giris-blogu" aria-labelledby={`giris-${giris.id}`}>
                <h4 id={`giris-${giris.id}`}>
                  {giris.ad}
                  {i === 0 && puan > 0 && <span className="onerilen"> — {METIN.kart.onerilenGiris}</span>}
                </h4>
                <ul className="kriter-listesi">
                  {nesneKriterleri('giris').map((k) => (
                    <KriterSatiri key={k.anahtar} kriter={k} alan={dizin.alan('giris', giris.id, k.anahtar)} />
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section aria-labelledby="kart-fiziksel">
            <h3 id="kart-fiziksel">{METIN.kart.fiziksel}</h3>
            <ul className="kriter-listesi">
              {nesneKriterleri('mekan', 'fiziksel').map((k) => (
                <KriterSatiri key={k.anahtar} kriter={k} alan={dizin.alan('mekan', mekan.id, k.anahtar)} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="kart-duyusal">
            <h3 id="kart-duyusal">{METIN.kart.duyusal}</h3>
            <ul className="kriter-listesi">
              {nesneKriterleri('mekan', 'duyusal').map((k) => (
                <KriterSatiri key={k.anahtar} kriter={k} alan={dizin.alan('mekan', mekan.id, k.anahtar)} />
              ))}
            </ul>
            <p className="ipucu">{METIN.kart.gurultuNotu}</p>
          </section>
        </div>
      )}
    </aside>
  )
}
