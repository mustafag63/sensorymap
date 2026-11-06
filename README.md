# SensoryMap

**GLB 300 – Grup 3** · Abdullah Gül Üniversitesi

SensoryMap, AGÜ Sümer Kampüsü'ndeki kütüphane, yemekhane, çalışma salonu ve kafe gibi mekânların fiziksel (rampa, asansör, basamaksız giriş) ve duyusal (gürültü, ışık, oturma yoğunluğu) erişilebilirliğini harita üzerinde gösteren bir web uygulamasıdır. Amaç, öğrencilerin kendilerine uygun ortamı gitmeden önce görebilmesi ve verinin topluluk katkısı ile güncel tutulmasıdır.

Şartname: [`docs/SPEC.md`](docs/SPEC.md) · Kararlar: [`docs/KARARLAR.md`](docs/KARARLAR.md) · Veritabanı: [`docs/schema.md`](docs/schema.md) · Ekran görüntüleri: [`docs/ekran/`](docs/ekran/)

## Teknoloji yığını

Bütçe 0 TL olduğu için yalnızca ücretsiz araçlar kullanılır.

| Araç | Ne için | Neden |
|---|---|---|
| **React + Vite** (JavaScript) | Arayüz | Ücretsiz ve açık kaynak; hızlı geliştirme sunucusu, küçük üretim çıktısı. |
| **react-router** | Sayfalar (`/`, `/mekan/:id`, `/panel`…) | Paylaşılabilir mekân linkleri ve filtre URL'leri. |
| **Leaflet + react-leaflet** | Harita | Açık kaynak, hafif; **API anahtarı gerektirmez**. |
| **OpenStreetMap** tile'ları | Harita altlığı | Ücretsiz, **API anahtarı yok**; [tile kullanım politikasına](https://operations.osmfoundation.org/policies/tiles/) uygun attribution var. |
| **Supabase** (ücretsiz katman) | PostgreSQL + Auth | Row Level Security, anonymous sign-in ve trigger'larla durum hesabı veritabanında. |
| **Vercel** | Yayın | Ücretsiz Hobby planı; **HTTPS otomatik**. Ses modülünde mikrofon erişimi için HTTPS şart. |
| **Vitest**, **playwright-core** | Test | Birim testleri; ekran görüntüsü ve klavye akışı sistemdeki Chrome ile (tarayıcı indirmez). |

## Yerelde çalıştırma

Gereksinim: Node.js 20+

```bash
npm install
npm run dev          # http://localhost:5173 (Supabase yoksa örnek veriyle çalışır)
npm run build        # üretim derlemesi (dist/)
npm run lint         # oxlint
npm test             # Vitest birim testleri
npm run seed         # src/data/ornekVeri.js → supabase/seed.sql
npm run ekran        # dev sunucusu açıkken: docs/ekran/ ekran görüntüleri
npm run klavye       # dev sunucusu açıkken: yalnızca klavyeyle tam akış testi
```

`ekran` ve `klavye` betikleri varsayılan olarak `http://127.0.0.1:5199` adresine bağlanır; başka port için `SM_URL=http://127.0.0.1:5173 npm run ekran`.

**Örnek veri modu:** `.env` içinde `VITE_SUPABASE_URL` yoksa uygulama `src/data/ornekVeri.js` ile çalışır; bildirim ve teyitler bellekte tutulur, sayfanın altında "Örnek veri modu" yazar. Ekip paneli bu modda girişsiz açılır.

## Supabase'i bağlama

1. **Proje oluştur:** [supabase.com](https://supabase.com) → New project (Free). Bölge olarak Avrupa (ör. Frankfurt) seçin; veritabanı şifresini saklayın.
2. **Migration'ları çalıştır:** SQL Editor'de sırayla şu dosyaların içeriğini çalıştırın:
   1. `supabase/migrations/20261106120000_sema.sql`
   2. `supabase/migrations/20261106120100_durum_fonksiyonlari.sql`
   3. `supabase/migrations/20261106120200_rls.sql`
   4. (İsteğe bağlı) `supabase/seed.sql`: "ÖRNEK" etiketli test verisi. **Gerçek veri girildikten sonra çalıştırmayın**, tabloları siler.
3. **Anonymous sign-in'i aç:** Authentication → Sign In / Providers → *Allow anonymous sign-ins* açık. Kötüye kullanıma karşı Supabase'in önerdiği CAPTCHA korumasını da açmak iyi olur.
4. **Herkese açık kaydı kapat:** Aynı ekranda *Allow new users to sign up* kapalı olsun (ekip hesapları elle açılır; kayıt formu yok).
5. **Ekip kullanıcılarını ekle:** Authentication → Users → *Add user → Create new user* (e-posta + şifre, *Auto Confirm User* işaretli). Sonra SQL Editor'de:
   ```sql
   insert into public.ekip_uyeleri (kullanici_id)
   select id from auth.users where email in ('ornek1@agu.edu.tr', 'ornek2@agu.edu.tr');
   ```
6. **.env değerleri:** Project Settings → API'den *Project URL* ve *anon / publishable* anahtarını alın:
   ```bash
   cp .env.example .env
   # VITE_SUPABASE_URL=https://<proje>.supabase.co
   # VITE_SUPABASE_ANON_KEY=<anon anahtarı>
   ```
   Aynı iki değişkeni Vercel'de Project Settings → Environment Variables'a ekleyip yeniden yayınlayın. Anon anahtar tarayıcıya gider ve bu tasarım gereğidir (RLS korur). `service_role` anahtarını **asla** bu dosyalara koymayın.

Kuralları Supabase dışında, yerel bir Postgres 15'te denemek için `supabase/tests/` klasörüne bakın ([docs/schema.md](docs/schema.md#test)).

## Klasör yapısı

```
.
├── docs/
│   ├── SPEC.md            # site şartnamesi
│   ├── KARARLAR.md        # şartnamede olmayan konularda verilen kararlar
│   ├── schema.md          # veritabanı şeması, durum kuralları, RLS
│   └── ekran/             # masaüstü ve mobil ekran görüntüleri
├── scripts/               # seed üretici, ekran görüntüsü ve klavye testi
├── src/
│   ├── data/
│   │   ├── kriterler.js   # kriter ve filtre tanımlarının TEK kaynağı
│   │   └── ornekVeri.js   # örnek veri (seed.sql bundan üretilir)
│   ├── lib/
│   │   ├── veri.js        # veri katmanı: Supabase ya da örnek veri
│   │   ├── kaynak/        # iki kaynağın uygulaması
│   │   ├── eslesme.js     # filtre motoru (saf fonksiyonlar) + testleri
│   │   └── dizin.js       # veriden arama yapısı
│   ├── components/        # harita, kart, panel, filtre, liste bileşenleri
│   ├── pages/             # sayfa bileşenleri
│   ├── sabitler.js        # durum etiketleri ve tüm arayüz metinleri
│   ├── config.js          # CAMPUS_CENTER, zoom, tile ayarları
│   └── index.css
├── supabase/
│   ├── migrations/        # şema, durum trigger'ları, RLS
│   ├── seed.sql           # örnek veri (otomatik üretilir)
│   └── tests/             # SQL senaryo testleri
├── vercel.json            # SPA yönlendirmesi
└── .env.example
```

## Erişilebilirlik

WCAG 2.2 AA temel alınır:
- Durumlar renk + ikon + metinle gösterilir; metin kontrastı ≥ 4.5:1.
- Tüm kontroller klavyeyle kullanılabilir; odak her zaman görünür; dokunma hedefleri ≥ 44 px.
- Harita için liste alternatifi var; kart açılınca odak karta taşınır, Esc ile kapanır.
- `prefers-reduced-motion` desteklenir; her sayfanın anlamlı bir başlığı vardır.

Arayüzde tanı bazlı ve klinik ifadeler kullanılmaz; mekânlar ortam özellikleriyle tanımlanır (ör. "sessiz ortam").

## Gizlilik

Hiçbir tabloda isim, e-posta, yaş, tanı, sağlık bilgisi ya da konum geçmişi tutulmaz. Katkılar anonim bir kimlikle kaydedilir. Ayrıntılar: [docs/schema.md](docs/schema.md). Gizlilik metni Sena Nur'dan gelecek (`/gizlilik` şimdilik yer tutucu).

## Ekip ve roller

| Kişi | Rol |
|---|---|
| Mustafa | Web ve harita |
| Ali Buğrahan | Ses modülü |
| Nergis Zeynep | Mekân kriterleri |
| Sena Nur | Eşikler ve gizlilik |
| Furkan | Test ve koordinasyon |
