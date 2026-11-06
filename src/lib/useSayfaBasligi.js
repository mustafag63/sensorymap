import { useEffect } from 'react'
import { METIN } from '../sabitler.js'

// Her sayfanın anlamlı bir <title>'ı olur (WCAG 2.4.2).
export function useSayfaBasligi(baslik) {
  useEffect(() => {
    document.title = baslik ? `${baslik} – ${METIN.uygulamaAdi}` : METIN.sayfaBasligi
    return () => {
      document.title = METIN.sayfaBasligi
    }
  }, [baslik])
}
