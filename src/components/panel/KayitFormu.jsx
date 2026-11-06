import { useId, useState } from 'react'
import { MEKAN_TURLERI, gecerliDeger, nesneKriterleri } from '../../data/kriterler.js'
import { alanKaydet, kayitKaydet } from '../../lib/veri.js'
import { useVeri } from '../../lib/veriBaglami.js'
import { METIN } from '../../sabitler.js'
import KonumSecici from './KonumSecici.jsx'
import KriterDuzenleyici from './KriterDuzenleyici.jsx'

const NESNE = { girisler: 'giris', mekanlar: 'mekan' }

// ISO ↔ <input type="datetime-local"> (yerel saat)
function yerelSaat(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
const isoSaat = (yerel) => (yerel ? new Date(yerel).toISOString() : null)

function baslangicKriterleri(nesne, mevcut, dizin) {
  if (!nesne) return {}
  return Object.fromEntries(
    nesneKriterleri(nesne).map((k) => {
      const a = mevcut ? dizin.alan(nesne, mevcut.id, k.anahtar) : null
      return [
        k.anahtar,
        { deger: a?.deger ?? '', yerinde: a?.durum === 'dogrulanmis', olcum_zamani: yerelSaat(a?.olcum_zamani), olcum_cihazi: a?.olcum_cihazi ?? '' },
      ]
    }),
  )
}

/** Bina, giriş ya da mekân ekleme/düzenleme. `mevcut` yoksa yeni kayıt. */
export default function KayitFormu({ tablo, mevcut, kaydedildi }) {
  const { dizin, yenile } = useVeri()
  const kimlik = useId()
  const nesne = NESNE[tablo]
  const [kayit, setKayit] = useState(() => ({
    ad: mevcut?.ad ?? '',
    bina_id: mevcut?.bina_id ?? '',
    tur: mevcut?.tur ?? MEKAN_TURLERI[0].deger,
    kat: mevcut?.kat ?? 0,
    notlar: mevcut?.notlar ?? '',
    foto_url: mevcut?.foto_url ?? '',
    enlem: mevcut?.enlem ?? null,
    boylam: mevcut?.boylam ?? null,
  }))
  const [baslangic] = useState(() => baslangicKriterleri(nesne, mevcut, dizin))
  const [kriterler, setKriterler] = useState(baslangic)
  const [hata, setHata] = useState(null)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const alan = (ad) => (e) => setKayit({ ...kayit, [ad]: e.target.value })

  const kaydet = async (e) => {
    e.preventDefault()
    if (!kayit.ad.trim()) return setHata(METIN.panel.adGerekli)
    if (kayit.enlem == null || kayit.boylam == null) return setHata(METIN.panel.konumGerekli)
    if (nesne && !kayit.bina_id) return setHata(METIN.panel.binaGerekli)

    const degisenler = nesne
      ? nesneKriterleri(nesne).filter((k) => JSON.stringify(kriterler[k.anahtar]) !== JSON.stringify(baslangic[k.anahtar]))
      : []
    const gecersiz = degisenler.find((k) => {
      const d = kriterler[k.anahtar].deger.trim()
      return d !== '' && !gecerliDeger(nesne, k.anahtar, d)
    })
    if (gecersiz) return setHata(`${METIN.hatalar.gecersizDeger} (${gecersiz.etiket})`)

    const ortak = { ad: kayit.ad.trim(), enlem: kayit.enlem, boylam: kayit.boylam, ...(mevcut ? { id: mevcut.id } : {}) }
    const veri = {
      binalar: { ...ortak, notlar: kayit.notlar.trim() || null },
      girisler: { ...ortak, bina_id: Number(kayit.bina_id) },
      mekanlar: {
        ...ortak,
        bina_id: Number(kayit.bina_id),
        tur: kayit.tur,
        kat: Number(kayit.kat),
        foto_url: kayit.foto_url.trim() || null,
      },
    }[tablo]

    setKaydediliyor(true)
    setHata(null)
    try {
      const kaydedilen = await kayitKaydet(tablo, veri)
      for (const k of degisenler) {
        const s = kriterler[k.anahtar]
        await alanKaydet({
          nesne_turu: nesne,
          nesne_id: kaydedilen.id,
          alan_adi: k.anahtar,
          deger: s.deger.trim(),
          yerinde: s.yerinde,
          olcum_zamani: k.olcum ? isoSaat(s.olcum_zamani) : null,
          olcum_cihazi: k.olcum ? s.olcum_cihazi || null : null,
        })
      }
      await yenile()
      kaydedildi(tablo, kaydedilen.id)
    } catch (err) {
      setHata(`${METIN.islemHatasi}: ${err.message}`)
      setKaydediliyor(false)
    }
  }

  return (
    <form className="kayit-formu" onSubmit={kaydet} noValidate>
      <div className="form-alani">
        <label htmlFor={`${kimlik}-ad`}>{METIN.panel.ad}</label>
        <input id={`${kimlik}-ad`} type="text" maxLength={120} value={kayit.ad} onChange={alan('ad')} required />
      </div>

      {nesne && (
        <div className="form-alani">
          <label htmlFor={`${kimlik}-bina`}>{METIN.panel.bina}</label>
          <select id={`${kimlik}-bina`} value={kayit.bina_id} onChange={alan('bina_id')} required>
            <option value="">{METIN.bildirim.secin}</option>
            {dizin.binalar.map((b) => (
              <option key={b.id} value={b.id}>
                {b.ad}
              </option>
            ))}
          </select>
        </div>
      )}

      {tablo === 'mekanlar' && (
        <>
          <div className="form-alani">
            <label htmlFor={`${kimlik}-tur`}>{METIN.panel.tur}</label>
            <select id={`${kimlik}-tur`} value={kayit.tur} onChange={alan('tur')}>
              {MEKAN_TURLERI.map((t) => (
                <option key={t.deger} value={t.deger}>
                  {t.etiket}
                </option>
              ))}
            </select>
          </div>
          <div className="form-alani">
            <label htmlFor={`${kimlik}-kat`}>{METIN.panel.kat}</label>
            <input id={`${kimlik}-kat`} type="number" min="-5" max="50" step="1" value={kayit.kat} onChange={alan('kat')} />
          </div>
          <div className="form-alani">
            <label htmlFor={`${kimlik}-foto`}>{METIN.panel.fotoUrl}</label>
            <input id={`${kimlik}-foto`} type="url" placeholder="https://" value={kayit.foto_url} onChange={alan('foto_url')} />
          </div>
        </>
      )}

      {tablo === 'binalar' && (
        <div className="form-alani">
          <label htmlFor={`${kimlik}-notlar`}>{METIN.panel.notlar}</label>
          <textarea id={`${kimlik}-notlar`} maxLength={1000} value={kayit.notlar} onChange={alan('notlar')} />
        </div>
      )}

      <KonumSecici enlem={kayit.enlem} boylam={kayit.boylam} sec={(enlem, boylam) => setKayit((k) => ({ ...k, enlem, boylam }))} />

      {nesne && (
        <fieldset className="kriter-alanlari">
          <legend>{METIN.panel.kriterler}</legend>
          {nesneKriterleri(nesne).map((k) => (
            <KriterDuzenleyici
              key={k.anahtar}
              kriter={k}
              satir={kriterler[k.anahtar]}
              degistir={(s) => setKriterler((onceki) => ({ ...onceki, [k.anahtar]: s }))}
            />
          ))}
        </fieldset>
      )}

      {hata && (
        <p className="hata-mesaji" role="alert">
          {hata}
        </p>
      )}
      <button type="submit" className="dugme" disabled={kaydediliyor}>
        {METIN.panel.kaydet}
      </button>
    </form>
  )
}
