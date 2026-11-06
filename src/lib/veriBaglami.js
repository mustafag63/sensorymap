import { createContext, useContext } from 'react'

export const VeriBaglami = createContext(null)

/** { dizin, yukleniyor, hata, yenile } */
export function useVeri() {
  return useContext(VeriBaglami)
}
