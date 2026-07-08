# Tonic — Marka Ses Tonu Asistanı

Tonic, girdiğiniz bir markanın örnek bir cümlesinden yola çıkarak o markanın **ses tonu profilini** çıkaran ve ardından herhangi bir ham metni bu tona uygun şekilde yeniden yazan tek sayfalık bir üretken yapay zeka aracıdır.

Bu proje, Samsung Innovaiton Campus kapsamında "Marka sesi asistanı" temasıyla geliştirilmiştir.

>  Bu araçla üretilen içerik yapay zeka tarafından oluşturulmuştur; yayınlamadan önce mutlaka gözden geçirilmelidir.

---

##  Canlı Demo

AI Studio üzerinden canlı olarak deneyebilirsiniz:
[Tonic — AI Studio](https://aistudio.google.com/apps/c021ee17-9498-4890-ae05-fe40fed2aa56?showAssistant=true&showCode=true&project=spring-2023-2024-7d161)

## Ekran Görüntüsü

<!-- Ekran görüntünü çektikten sonra aşağıdaki satırı güncelle:
örn. ![Tonic arayüzü](./screenshot.png)
-->
_(Ekran görüntüsü eklenecek)_

---

## Nasıl Çalışır?

Uygulama iki panelden oluşur:

**1. Markanızın Sesini Tanımlayın**
Marka adı ve o markaya ait örnek bir cümle girilir. Bu girdi, arka planda bir yapay zeka çağrısını tetikler ve markanın "ses tonu profilini" (duygu tonu, dil zenginliği, cümle yapısı, ikna stratejisi, hedef kitle yaklaşımı) çıkarır.

**2. Metni Dönüştür**
Herhangi bir ham metin yapıştırılır, "Dönüştür" butonuna basılır. Sistem bu metni, çıkarılan marka ses tonu profiline uygun şekilde yeniden yazar ve kendi çıktısını otomatik olarak denetler.

### Arka Planda Çalışan Prompt Zinciri

| Adım | Amaç | Kullanılan Teknik |
|---|---|---|
| **1. Analiz** | Örnek cümleden marka ses tonu profili çıkarır | **Few-shot prompting** — modele önce Apple markası için hazır bir örnek analiz gösterilir, aynı formatta yeni markayı analiz etmesi istenir |
| **2. Dönüştürme** | Ham metni marka tonuna uygun şekilde yeniden yazar | **Chain-of-thought (adım adım düşündürme)** — model; mesajı belirleme, tona aktarma, kelime seçimi, cümle yapısı ve tutarlılık kontrolü olmak üzere 5 adımda akıl yürütür |
| **3. Self-check** | Üretilen metnin marka profiline gerçekten uyup uymadığını denetler | **Self-critique / refinement** — model kendi ürettiği metni 5 boyutta puanlar, 3/5 altındaysa metni otomatik olarak düzeltir |

Kullanıcı yalnızca son, denetlenmiş metni görür; ara adımlar arka planda kalır.

---

## Kurulum ve Çalıştırma

**Gereksinimler:** Node.js

```bash
# 1. Repoyu klonla
git clone https://github.com/GizemmOzcan/tonic-ai-assistant.git
cd tonic-ai-assistant

# 2. Bağımlılıkları kur
npm install

# 3. .env.local dosyası oluştur ve Gemini API key'ini ekle
echo "GEMINI_API_KEY=senin_api_key_in" > .env.local

# 4. Sunucuyu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

> **Not:** `GEMINI_API_KEY` tanımlı değilse uygulama çökmez, otomatik olarak **simülasyon moduna** düşer ve önceden hazırlanmış örnek çıktılar gösterir. Aracı gerçek yapay zeka çıktılarıyla değerlendirmek için `.env.local` dosyasına geçerli bir Gemini API key eklenmesi gerekir. Key, [Google AI Studio](https://aistudio.google.com) üzerinden ücretsiz alınabilir.

---

##  Kullanılan Teknolojiler

- **Frontend:** React + TypeScript, Tailwind CSS, Vite
- **Backend:** Express (Node.js), TypeScript
- **Yapay Zeka Modeli:** Google Gemini (`gemini-3.5-flash`), `@google/genai` SDK üzerinden

---

## Etik Değerlendirme

**Tespit edilen riskler:**
- Model, dönüştürme sırasında orijinal metinde olmayan iddia, istatistik veya abartılı ifade ("kanıtlanmış", "en iyi", "garantili" vb.) uydurabilir.
- Marka ses tonu analizi, verilen tek bir örnek cümleye dayandığı için markayı eksik veya klişe biçimde temsil edebilir.
- Üretken modeller zaman zaman tutarsız veya markanın gerçek kimliğiyle örtüşmeyen çıktılar verebilir.

**Alınan önlemler:**
- Dönüştürme promptuna açık bir **etik kısıt** eklendi: "Orijinal metinde olmayan hiçbir iddia, istatistik ya da abartılı ifade EKLEME."
- Üçüncü bir **self-check promptu**, üretilen metni marka profiliyle 5 boyutta karşılaştırıp uyumsuzsa otomatik düzeltiyor.
- Kullanıcıya çıktının altında "İçerik AI ile üretilmiştir, yayın öncesi gözden geçiriniz." uyarısı gösteriliyor; araç, insan onayı yerine geçmeyecek şekilde tasarlandı.


##  Lisans

Bu proje eğitim/hackathon amaçlı geliştirilmiştir.



<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c021ee17-9498-4890-ae05-fe40fed2aa56

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
