import { useCallback, useEffect, useMemo, useState } from 'react'
import { verileriGetir } from '../lib/veri.js'
import { dizinOlustur } from '../lib/dizin.js'
import { VeriBaglami } from '../lib/veriBaglami.js'

export default function VeriSaglayici({ children }) {
  const [veri, setVeri] = useState(null)
  const [hata, setHata] = useState(null)

  const yenile = useCallback(async () => {
    try {
      setVeri(await verileriGetir())
      setHata(null)
    } catch (e) {
      setHata(e)
    }
  }, [])

  useEffect(() => {
    let iptal = false
    verileriGetir().then(
      (v) => !iptal && setVeri(v),
      (e) => !iptal && setHata(e),
    )
    return () => {
      iptal = true
    }
  }, [])

  const deger = useMemo(
    () => ({ dizin: veri ? dizinOlustur(veri) : null, yukleniyor: !veri && !hata, hata, yenile }),
    [veri, hata, yenile],
  )
  return <VeriBaglami.Provider value={deger}>{children}</VeriBaglami.Provider>
}
