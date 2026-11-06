import { useEffect, useRef } from 'react'

// Popup içeriği yalnızca açıkken çizilir; başlık monte olunca odağı üstlenir.
export default function OdakBaslik({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <h3 ref={ref} tabIndex={-1}>
      {children}
    </h3>
  )
}
