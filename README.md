# SensoryMap

**GLB 300 – Grup 3** · Abdullah Gül Üniversitesi

SensoryMap, AGÜ Sümer Kampüsü'ndeki kütüphane, yemekhane, çalışma salonu ve kafe gibi mekânların fiziksel (rampa, asansör, basamaksız giriş) ve duyusal (gürültü, ışık, oturma yoğunluğu) erişilebilirliğini harita üzerinde gösteren bir web uygulamasıdır. Amaç, öğrencilerin kendilerine uygun ortamı gitmeden önce görebilmesi ve verinin topluluk katkısı ile güncel tutulmasıdır.

## Teknoloji yığını

Bütçe 0 TL olduğu için yalnızca ücretsiz araçlar kullanılır.

| Araç | Ne için | Neden |
|---|---|---|
| **React + Vite** (JavaScript) | Arayüz | Ücretsiz ve açık kaynak; Vite hızlı geliştirme sunucusu ve küçük üretim çıktısı verir. |
| **Leaflet + react-leaflet** | Harita | Açık kaynak, hafif; **API anahtarı gerektirmez**. |
| **OpenStreetMap** tile'ları | Harita altlığı | Ücretsiz, **API anahtarı yok**; [tile kullanım politikasına](https://operations.osmfoundation.org/policies/tiles/) uygun attribution eklendi. |
| **Supabase** (ücretsiz katman) | Veritabanı (PostgreSQL) | Ücretsiz katman yeterli; Row Level Security ile anonim katkıları güvenli tutmak mümkün. |
| **Vercel** | Yayın | Ücretsiz Hobby planı; **HTTPS otomatik** gelir. İleride ses modülü için mikrofon erişimi gerekecek ve tarayıcılar mikrofonu yalnızca HTTPS'te açar. |

## Yerelde çalıştırma

Gereksinim: Node.js 20+

```bash
npm install          # bağımlılıkları kur
cp .env.example .env # Supabase bilgileri (şimdilik boş kalabilir)
npm run dev          # geliştirme sunucusu: http://localhost:5173
npm run build        # üretim derlemesi (dist/)
npm run preview      # derlemeyi yerelde önizle
npm run lint         # kod denetimi
```

## Klasör yapısı

```
.
├── docs/
│   └── schema.md          # veritabanı şeması açıklaması (taslak)
├── public/                # statik dosyalar (favicon)
├── src/
│   ├── components/        # yeniden kullanılabilir bileşenler (Header, CampusMap)
│   ├── pages/             # sayfa bileşenleri (HomePage)
│   ├── config.js          # sabitler (CAMPUS_CENTER, zoom, tile ayarları)
│   ├── index.css          # genel stiller
│   └── main.jsx           # giriş noktası
├── supabase/
│   └── schema.sql         # veritabanı şeması SQL taslağı (henüz çalıştırılmadı)
├── .env.example           # ortam değişkeni şablonu
└── index.html
```

## Erişilebilirlik

WCAG 2.2 temel alınır: `lang="tr"`, anlamlı sayfa başlığı, "Haritaya geç" atlama bağlantısı, görünür odak göstergesi, klavyeyle kullanılabilen harita (odaklanınca ok tuşları ile kaydırma, `+`/`-` ile yakınlaştırma) ve yeterli boyutta dokunma hedefleri.

Arayüzde tanı bazlı ifadeler kullanılmaz; mekânlar ortam özellikleriyle tanımlanır (ör. "sessiz ortam").

## Gizlilik

Hiçbir tabloda isim, e-posta, yaş, tanı ya da sağlık bilgisi tutulmaz. Ayrıntılar: [docs/schema.md](docs/schema.md).

## Ekip ve roller

| Kişi | Rol |
|---|---|
| Mustafa | Web ve harita |
| Ali Buğrahan | Ses modülü |
| Nergis Zeynep | Mekân kriterleri |
| Sena Nur | Eşikler ve gizlilik |
| Furkan | Test ve koordinasyon |
