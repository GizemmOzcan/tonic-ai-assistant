import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will run in demo/simulation mode.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiAvailable: !!ai,
    time: new Date().toISOString(),
  });
});

// Prompt 1: Brand Analysis
app.post("/api/analyze-brand", async (req, res) => {
  try {
    const { brandName, sampleSentence } = req.body;

    if (!brandName || !sampleSentence) {
      return res.status(400).json({ error: "Marka adı ve örnek cümle alanları zorunludur." });
    }

    if (!ai) {
      // Simulate high-quality Brand Analysis when Gemini API key is missing
      await new Promise(resolve => setTimeout(resolve, 1200));
      return res.json({
        analysis: `Analiz:
- Duygu Tonu: Dinamik, prestijli, gelecek odaklı (${brandName} tarzı)
- Dil Zenginliği: Akıcı, özgüvenli, teknik terimlerden arındırılmış
- Cümle Yapısı: Orta uzunlukta, merak uyandırıcı, akıcı
- İkna Stratejisi: Fayda odaklı, vizyoner ve samimi
- Hedef Kitle Yaklaşımı: Profesyonel, cana yakın ve çözümleyici
- Karakter Kartı: ${brandName} konuşurken klişelerden kaçınır; vizyonu ve çözüm odaklı yaklaşımı sade bir güven hissiyle birleştirir.`,
        simulated: true
      });
    }

    const prompt = `Sen bir marka ses tonu uzmanısın. Aşağıda örnek bir analiz var, sonra senden aynı formatta yeni bir marka analiz etmeni isteyeceğim.

[ÖRNEK]
Marka: Apple
Örnek cümle: 'İnovasyon bizim DNA'mızda var. Her ürün, sınırları zorlamanın bir ifadesi.'
Analiz:
- Duygu Tonu: İlham verici, minimalist
- Dil Zenginliği: Sade, seçkin, az kelime çok anlam
- Cümle Yapısı: Kısa, vurgulu, ritmik
- İkna Stratejisi: Deneyim odaklı, duygu yaratma
- Hedef Kitle Yaklaşımı: Güçlendirici, yaratıcılığa hitap eden
- Karakter Kartı: Apple konuşurken teknik özellik saymaz; deneyimi ve duyguyu öne çıkarır, kısa ve vurgulu cümleler kurar.

[ŞİMDİ SIRA SENDE]
Marka: ${brandName}
Örnek cümle: ${sampleSentence}

Yukarıdaki 5 boyutta bu markayı analiz et, aynı formatta bir Karakter Kartı oluştur. Sadece bu formatta yanıt ver, başka açıklama ekleme.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const analysisText = response.text || "Analiz oluşturulamadı. Lütfen bilgileri kontrol edin.";
    res.json({ analysis: analysisText });

  } catch (error: any) {
    console.error("Brand analysis error:", error);
    res.status(500).json({
      error: "Marka analizi gerçekleştirilirken bir hata oluştu.",
      details: error.message || error,
    });
  }
});

// Prompt 2 & 3: Rewrite and Self-Check Chain
app.post("/api/rewrite-text", async (req, res) => {
  try {
    const { brandProfile, rawText } = req.body;

    if (!brandProfile || !rawText) {
      return res.status(400).json({ error: "Marka profili ve ham metin zorunludur." });
    }

    if (!ai) {
      // Simulate rewritten text when Gemini API key is missing
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({
        rawRewrite: `Dönüştürülmüş Metin: Bu ham metin, tanımladığınız üstün marka kimliği kriterlerine göre baştan yaratılmıştır. Artık çok daha odaklı, akıcı ve etkilidir.`,
        finalText: `Her kelimesi özenle seçildi. Sizin için sadeleştirdik, değer kattık. Artık sadece konuşmuyor, marka ruhunuzu fısıldıyoruz. Gücü hissedin.`,
        selfCheck: `Duygu Tonu uyumlu mu? EVET\nDil Zenginliği uyumlu mu? EVET\nCümle Yapısı uyumlu mu? EVET\nİkna Stratejisi uyumlu mu? EVET\nHedef Kitle Yaklaşımı uyumlu mu? EVET\n\nToplam Uygunluk: 5/5`,
        simulated: true
      });
    }

    // Step 2: Rewrite Prompt
    const rewritePrompt = `Sen bir marka ses tonu uzmanısın. Aşağıdaki marka ses tonu profiline göre verilen metni yeniden yazacaksın.

MARKA SES TONU PROFİLİ:
${brandProfile}

ADIM ADIM DÜŞÜN:
1. Orijinal metnin ana mesajını ve amacını belirle
2. Bu mesajı markanın ses tonuna nasıl aktarabilirsin?
3. Hangi kelimeler değişmeli? (teknik/jenerik ifadeler → markanın diline uygun ifadeler)
4. Cümle yapısını profile uygun şekilde ayarla
5. Sonucu kontrol et: ton tutarlı mı?

KISIT (Etik): Orijinal metinde olmayan hiçbir iddia, istatistik ya da abartılı ifade ('kanıtlanmış', 'en iyi', 'garantili' vb.) EKLEME. Sadece tonu ve ifade biçimini değiştir, içeriği uydurma.

Girdi: ${rawText}

Sadece dönüştürülmüş metni ver, açıklama ekleme.`;

    const rewriteResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: rewritePrompt,
      config: {
        temperature: 0.7,
      },
    });

    const rawRewrite = rewriteResponse.text || "Dönüştürme işlemi başarısız oldu.";

    // Step 3: Self Check Prompt
    const selfCheckPrompt = `Aşağıdaki metnin, verilen marka ses tonu profiline uygun olup olmadığını değerlendir.

MARKA SES TONU PROFİLİ:
${brandProfile}

Metin: ${rawRewrite}

Her boyut için EVET/HAYIR ve 1 cümle açıklama ver:
- Duygu Tonu uyumlu mu?
- Dil Zenginliği uyumlu mu?
- Cümle Yapısı uyumlu mu?
- İkna Stratejisi uyumlu mu?
- Hedef Kitle Yaklaşımı uyumlu mu?

Toplam Uygunluk: X/5
Eğer 3/5'in altındaysa, metni profile daha uygun şekilde düzelt ve SADECE son/düzeltilmiş halini ayrı bir satırda 'SON HALİ:' etiketiyle ver. 3/5 veya üzerindeyse mevcut metni 'SON HALİ:' etiketiyle aynen tekrarla.`;

    const selfCheckResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: selfCheckPrompt,
      config: {
        temperature: 0.3,
      },
    });

    const selfCheckOutput = selfCheckResponse.text || "";
    
    // Extract "SON HALİ:" block
    let finalText = rawRewrite;
    const markerIndex = selfCheckOutput.toUpperCase().indexOf("SON HALİ:");
    if (markerIndex !== -1) {
      finalText = selfCheckOutput.substring(markerIndex + 9).trim();
      // Remove any leading colons, quotes or markers
      if (finalText.startsWith(":")) {
        finalText = finalText.substring(1).trim();
      }
    } else {
      // Fallback extraction if model didn't output exact tag but has a clean output
      finalText = rawRewrite;
    }

    res.json({
      rawRewrite,
      selfCheck: selfCheckOutput,
      finalText: finalText,
    });

  } catch (error: any) {
    console.error("Rewrite process error:", error);
    res.status(500).json({
      error: "Metin dönüştürme ve denetleme zinciri çalışırken bir hata oluştu.",
      details: error.message || error,
    });
  }
});

// Configure Vite or Static Asset Serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
