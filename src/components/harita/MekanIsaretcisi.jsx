import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Marker } from 'react-leaflet'
import { mekanIkonu } from './ikonlar.js'

export default function MekanIsaretcisi({ mekan, sonuc }) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const ikon = useMemo(() => mekanIkonu(mekan, sonuc), [mekan, sonuc])
  const ac = () => navigate(`/mekan/${mekan.id}${search}`)

  return (
    <Marker
      position={[mekan.enlem, mekan.boylam]}
      icon={ikon}
      eventHandlers={{
        click: ac,
        // Leaflet işaretçiye role="button" verir ama Enter/Space'i işlemez.
        keydown: (e) => {
          if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
            e.originalEvent.preventDefault()
            ac()
          }
        },
      }}
    />
  )
}
