// Masaüstü (1280 px) ve mobil (390 px) ekran görüntülerini docs/ekran/ altına kaydeder.
// Önce dev sunucusunu başlatın (npm run dev), sonra: npm run ekran
// Adres: SM_URL ortam değişkeni (varsayılan http://127.0.0.1:5199). Sistemdeki Chrome kullanılır.
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const URL_KOK = process.env.SM_URL ?? 'http://127.0.0.1:5199'
const KLASOR = new URL('../docs/ekran/', import.meta.url)
mkdirSync(KLASOR, { recursive: true })

const BOYUTLAR = [
  { ad: 'masaustu', width: 1280, height: 800 },
  { ad: 'mobil', width: 390, height: 844 },
]

const hatalar = []
const karoDurumlari = new Map()

// Harita karoları yüklenip görünür olana kadar bekler (soluk/gri görüntü olmasın).
async function karolariBekle(p) {
  await p.waitForLoadState('networkidle')
  await p.waitForFunction(() => {
    const karolar = [...document.querySelectorAll('.leaflet-tile')]
    return karolar.length === 0 || karolar.every((k) => k.classList.contains('leaflet-tile-loaded') && getComputedStyle(k).opacity === '1')
  }, null, { timeout: 15000 }).catch(() => hatalar.push(`${p.url()}: karolar 15 sn içinde yüklenmedi`))
  await p.waitForTimeout(300)
}

async function cek(p, boyut, ad) {
  await karolariBekle(p)
  await p.screenshot({ path: new URL(`${ad}-${boyut.ad}.png`, KLASOR).pathname })
  console.log(`  ${ad}-${boyut.ad}.png`)
}

async function binaPopupunuAc(p) {
  await p.getByRole('button', { name: /ÖRNEK – Ana Bina/ }).click()
  await p.waitForTimeout(400)
}

const tarayici = await chromium.launch({ channel: 'chrome' })
for (const boyut of BOYUTLAR) {
  console.log(`${boyut.ad} (${boyut.width} px)`)
  const p = await tarayici.newPage({ viewport: { width: boyut.width, height: boyut.height } })
  p.on('pageerror', (e) => hatalar.push(`${p.url()}: ${e.message}`))
  p.on('console', (m) => m.type() === 'error' && hatalar.push(`${p.url()}: ${m.text()}`))
  p.on('response', (r) => {
    if (r.url().includes('tile.openstreetmap.org')) karoDurumlari.set(r.status(), (karoDurumlari.get(r.status()) ?? 0) + 1)
  })

  await p.goto(`${URL_KOK}/`)
  await cek(p, boyut, '01-harita')

  await binaPopupunuAc(p)
  await cek(p, boyut, '02-bina-popup')

  await p.locator('.leaflet-popup').getByRole('button', { name: 'Yakınlaştır' }).click()
  await p.waitForTimeout(600)
  await cek(p, boyut, '03-harita-detay')

  await p.goto(`${URL_KOK}/?f=basamaksiz,sessiz`)
  await binaPopupunuAc(p)
  await p.locator('.leaflet-popup').getByRole('button', { name: 'Yakınlaştır' }).click()
  await p.keyboard.press('Escape')
  await p.waitForTimeout(600)
  await cek(p, boyut, '04-filtre-harita')

  await p.goto(`${URL_KOK}/?f=basamaksiz,sessiz&g=liste&hepsi=1`)
  await cek(p, boyut, '05-filtre-liste')

  await p.goto(`${URL_KOK}/mekan/2`)
  await cek(p, boyut, '06-kart')

  await p.goto(`${URL_KOK}/mekan/4`)
  await p.locator('.itiraz').scrollIntoViewIfNeeded()
  await cek(p, boyut, '07-kart-itiraz')

  await p.locator('.mekan-karti').getByRole('button', { name: 'Bilgi ekle / düzelt' }).click()
  await p.waitForTimeout(200)
  await cek(p, boyut, '08-kart-bildirim-formu')

  await p.goto(`${URL_KOK}/panel`)
  await cek(p, boyut, '09-panel')

  await p.goto(`${URL_KOK}/hakkinda`)
  await cek(p, boyut, '10-hakkinda')

  await p.goto(`${URL_KOK}/gizlilik`)
  await cek(p, boyut, '11-gizlilik')
  await p.close()
}
await tarayici.close()

console.log('Karo yanıtları (HTTP durum → adet):', Object.fromEntries(karoDurumlari))
if (hatalar.length) {
  console.log('HATALAR:\n' + hatalar.join('\n'))
  process.exit(1)
}
console.log('Konsol/sayfa hatası yok.')
