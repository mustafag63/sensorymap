import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { CAMPUS_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../config.js'

export default function CampusMap() {
  return (
    <MapContainer
      center={CAMPUS_CENTER}
      zoom={DEFAULT_ZOOM}
      className="campus-map"
      keyboard={true}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
      <ZoomControl position="topleft" zoomInTitle="Yakınlaştır" zoomOutTitle="Uzaklaştır" />
    </MapContainer>
  )
}
