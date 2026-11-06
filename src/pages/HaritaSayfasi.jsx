import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useVeri } from '../lib/veriBaglami.js'
import { filtreleriCoz, sonuclariGrupla } from '../lib/eslesme.js'
import { METIN } from '../sabitler.js'
import Harita from '../components/harita/Harita.jsx'
import FiltreCubugu from '../components/FiltreCubugu.jsx'
import SonucListesi from '../components/SonucListesi.jsx'

// URL: ?f=basamaksiz,sessiz (filtreler) &g=liste (görünüm) &hepsi=1 (uygun olmayanlar)
export default function HaritaSayfasi() {
  const { dizin, yukleniyor, hata } = useVeri()
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const fParam = params.get('f')
  const filtreler = useMemo(() => filtreleriCoz(fParam), [fParam])
  const liste = params.get('g') === 'liste'
  const hepsi = params.get('hepsi') === '1'

  // Açık kart kapanmasın diye yol korunur; virgüller okunaklı kalsın diye kodlanmaz.
  // Parametreler çağrı anında okunur: hızlı ardışık tıklamada render'daki eski değer kullanılmasın.
  const guncelle = (degisiklik) => {
    const p = new URLSearchParams(window.location.search)
    for (const [k, v] of Object.entries(degisiklik)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    const search = p.toString().replaceAll('%2C', ',')
    navigate({ pathname, search: search ? `?${search}` : '' }, { replace: true })
  }

  const degistir = (anahtar) => {
    const simdiki = filtreleriCoz(new URLSearchParams(window.location.search).get('f'))
    const yeni = simdiki.includes(anahtar) ? simdiki.filter((x) => x !== anahtar) : [...simdiki, anahtar]
    guncelle({ f: filtreleriCoz(yeni.join(',')).join(',') })
  }

  const gruplar = useMemo(() => (dizin ? sonuclariGrupla(dizin.mekanlar, filtreler, dizin) : null), [dizin, filtreler])
  const sonuclar = useMemo(() => {
    const m = new Map()
    if (gruplar) for (const [sonuc, ogeler] of Object.entries(gruplar)) for (const o of ogeler) m.set(o.mekan.id, sonuc)
    return m
  }, [gruplar])

  return (
    <div className="harita-sayfasi">
      <h1 className="visually-hidden">{METIN.sayfaBasligi}</h1>
      <FiltreCubugu
        secili={filtreler}
        degistir={degistir}
        temizle={() => guncelle({ f: null })}
        liste={liste}
        gorunumSec={(l) => guncelle({ g: l ? 'liste' : null })}
      />
      <p className="visually-hidden" aria-live="polite">
        {filtreler.length > 0 && gruplar
          ? METIN.liste.sonucOzeti(gruplar.uygun.length, gruplar.eksik.length, gruplar.uygun_degil.length)
          : ''}
      </p>
      {yukleniyor && <p className="durum-mesaji">{METIN.yukleniyor}</p>}
      {hata && (
        <p className="durum-mesaji hata-mesaji" role="alert">
          {METIN.veriHatasi}
        </p>
      )}
      {dizin && (
        <div className="harita-alani">
          {liste ? (
            <SonucListesi
              dizin={dizin}
              filtreVar={filtreler.length > 0}
              gruplar={gruplar}
              hepsi={hepsi}
              hepsiSec={(h) => guncelle({ hepsi: h ? '1' : null })}
            />
          ) : (
            <Harita dizin={dizin} sonuclar={sonuclar} />
          )}
          {/* Kart, filtre çubuğunu örtmesin diye yalnızca harita/liste alanında açılır. */}
          <Outlet />
        </div>
      )}
    </div>
  )
}
