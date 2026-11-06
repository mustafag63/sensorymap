import { METIN } from '../../sabitler.js'

// TODO(Ali Buğrahan): 4. haftada ses modülü buraya bağlanacak (mikrofon için HTTPS gerekir).
// Sonuç sayı olarak değil sessiz / orta / gürültülü aralığı olarak bildirilmeli (SPEC §2.3, §7).
export default function SesOlcumu() {
  return (
    <div className="ses-olcumu">
      <button type="button" className="dugme dugme-ikincil" aria-disabled="true" aria-describedby="ses-olcum-aciklama">
        {METIN.kart.sesOlc}
      </button>
      <p id="ses-olcum-aciklama" className="ipucu">
        {METIN.kart.sesOlcAciklama}
      </p>
    </div>
  )
}
