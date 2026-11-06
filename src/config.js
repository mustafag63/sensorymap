// AGÜ Sümer Kampüsü (Kocasinan, Kayseri) için harita merkezi.
// DİKKAT: Bu koordinat YAKLAŞIKTIR. OpenStreetMap'ten doğrulanmalı:
// https://www.openstreetmap.org adresinde kampüsü bulup sağ tık > "Burada ne var?"
// ile enlem/boylamı alın ve aşağıdaki değeri güncelleyin.
export const CAMPUS_CENTER = [38.7375, 35.4730] // [enlem, boylam] — OSM'den doğrula

export const DEFAULT_ZOOM = 17

// OpenStreetMap tile sunucusu. Kullanım politikası:
// https://operations.osmfoundation.org/policies/tiles/
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları'
