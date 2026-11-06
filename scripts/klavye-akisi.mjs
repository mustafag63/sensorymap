// Yalnızca klavyeyle tam akış: filtre seç → sonuç listesi → kart → teyit et → Esc.
// Her adımda odaklanan öğenin görünür bir odak göstergesi olduğu da denetlenir.
// Önce dev sunucusunu başlatın (npm run dev), sonra: npm run klavye
import { chromium } from 'playwright-core'

const URL_KOK = process.env.SM_URL ?? 'http://127.0.0.1:5199'
const tarayici = await chromium.launch({ channel: 'chrome' })
const p = await tarayici.newPage({ viewport: { width: 1280, height: 800 } })
const hatalar = []
p.on('pageerror', (e) => hatalar.push(e.message))

const odak = () =>
  p.evaluate(() => {
    const el = document.activeElement
    const s = getComputedStyle(el)
    return {
      etiket: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      rol: el.getAttribute('role') || el.tagName.toLowerCase(),
      basili: el.getAttribute('aria-pressed'),
      gorunur: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
    }
  })

let adim = 0
async function kaydet(aciklama, beklenen) {
  const o = await odak()
  adim += 1
  const tamam = (!beklenen || beklenen.test(o.etiket)) && o.gorunur
  const yol = new URL(p.url())
  console.log(`${tamam ? '✓' : '✗'} ${adim}. ${aciklama} → [${o.rol}] "${o.etiket}"${o.basili ? ` aria-pressed=${o.basili}` : ''}${o.gorunur ? '' : ' (ODAK GÖSTERGESİ YOK)'}  ${yol.pathname}${yol.search}`)
  if (!tamam) hatalar.push(`Adım ${adim}: ${aciklama}`)
  return o
}

// Hedef öğeye gelene kadar Tab'a basar (en fazla `sinir` kez).
async function tabIle(hedef, sinir = 60) {
  for (let i = 0; i < sinir; i++) {
    await p.keyboard.press('Tab')
    if (hedef.test((await odak()).etiket)) return i + 1
  }
  throw new Error(`Tab ile bulunamadı: ${hedef}`)
}

await p.goto(`${URL_KOK}/`)
await p.waitForLoadState('networkidle')

await p.keyboard.press('Tab')
await kaydet('İlk Tab: atlama bağlantısı', /İçeriğe geç/)

let n = await tabIle(/Asansörle ulaşılabilir/)
await kaydet(`Filtre chip'ine ulaşıldı (${n} Tab)`, /Asansörle ulaşılabilir/)
await p.keyboard.press('Space')
await p.waitForTimeout(100)
const chip = await kaydet('Space ile filtre seçildi', /Asansörle ulaşılabilir/)
if (chip.basili !== 'true') hatalar.push('Filtre aria-pressed=true olmadı')

n = await tabIle(/^Liste$/)
await p.keyboard.press('Enter')
await kaydet(`Liste görünümüne geçildi (${n} Tab + Enter)`, /^Liste$/)

n = await tabIle(/ÖRNEK – Çalışma Salonu/)
await kaydet(`Sonuç listesindeki mekân linki (${n} Tab)`, /ÖRNEK – Çalışma Salonu/)
await p.keyboard.press('Enter')
await p.waitForTimeout(200)
await kaydet('Enter ile kart açıldı, odak kart başlığında', /^ÖRNEK – Çalışma Salonu$/)

n = await tabIle(/Bu bilgiyi teyit et/)
await kaydet(`"Teyit et" düğmesi (${n} Tab)`, /Bu bilgiyi teyit et/)
const satirOnce = await p.locator('.kriter-satiri', { hasText: 'Asansör' }).locator('.rozet').textContent()
await p.keyboard.press('Enter')
await p.waitForTimeout(300)
await kaydet('Enter ile teyit edildi, odak sonuç mesajında', /Teyidiniz kaydedildi/)
const satirSonra = await p.locator('.kriter-satiri', { hasText: 'Asansör' }).locator('.rozet').textContent()
console.log(`   Asansör durumu: "${satirOnce}" → "${satirSonra}"`)
if (!/Doğrulandı/.test(satirSonra)) hatalar.push('Teyit sonrası asansör doğrulanmadı')

await p.keyboard.press('Escape')
await p.waitForTimeout(200)
await kaydet('Esc ile kart kapandı, odak listedeki linke döndü', /ÖRNEK – Çalışma Salonu/)
if (!new URL(p.url()).searchParams.get('f')) hatalar.push('Kart kapanınca filtre URL’den düştü')

await tarayici.close()
if (hatalar.length) {
  console.log('\nHATALAR:\n' + hatalar.join('\n'))
  process.exit(1)
}
console.log('\nKlavye akışı tamam.')
