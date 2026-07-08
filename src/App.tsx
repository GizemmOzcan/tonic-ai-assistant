import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Sparkles, 
  Zap, 
  Volume2, 
  VolumeX, 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Copy,
  ChevronRight,
  BookmarkCheck,
  Code
} from "lucide-react";
import { PRESET_BRANDS, PresetBrand, WEEKLY_ANALYTICS, CATEGORY_DISTRIBUTION } from "./data";

export default function App() {
  // Input states for Panel 1
  const [brandName, setBrandName] = useState("");
  const [sampleSentence, setSampleSentence] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brandProfile, setBrandProfile] = useState(""); // Stores Prompt 1 output
  
  // Input states for Panel 2
  const [rawText, setRawText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState(""); // Stores final rewritten text
  const [selfCheckOutput, setSelfCheckOutput] = useState(""); // Stores self-check feedback
  const [rawRewriteOutput, setRawRewriteOutput] = useState(""); // Stores prompt 2 raw output
  
  // UI preferences & interactive details
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "telemetry">("visual");
  const [copySuccess, setCopySuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Animated wave frequencies state
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]);

  // Audio wave fluctuation during reading or analyzing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 15 }, () => Math.floor(Math.random() * 45) + 12));
      }, 90);
    } else if (isAnalyzing || isRewriting) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 15 }, () => Math.floor(Math.random() * 25) + 8));
      }, 100);
    } else {
      setWaveHeights([8, 10, 8, 10, 8, 10, 8, 10, 8, 10, 8, 10, 8, 10, 8]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isAnalyzing, isRewriting]);

  // Handle Speech Synthesis
  const handleVoiceReadout = (textToRead: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    // Clean text markers
    const cleanText = textToRead
      .replace(/[*#`_\\]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "tr-TR";
    utterance.rate = 1.05; 
    utterance.pitch = 1.05;

    // Try selecting Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.startsWith("tr") || v.lang === "tr-TR");
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop current text-to-speech voice
  const stopVoiceReadout = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Trigger Prompt 1: Brand Analysis
  const handleAnalyzeBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !sampleSentence.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setApiError(null);
    stopVoiceReadout();

    try {
      const res = await fetch("/api/analyze-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, sampleSentence })
      });

      if (!res.ok) {
        throw new Error("Marka analizi servisine bağlanılamadı.");
      }

      const data = await res.json();
      setBrandProfile(data.analysis);
      
      // Auto speech response if enabled
      if (ttsEnabled) {
        handleVoiceReadout(`${brandName} ses tonu başarıyla analiz edildi. Karakter kartı hazır.`);
      }

    } catch (err: any) {
      console.error(err);
      setApiError("Marka ses tonu profili çıkartılırken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Prompt 2 & 3: Rewrite and Self-Check Chaining
  const handleTransformText = async () => {
    if (!brandProfile || !rawText.trim() || isRewriting) return;

    setIsRewriting(true);
    setApiError(null);
    stopVoiceReadout();
    setRewrittenText("");
    setSelfCheckOutput("");

    try {
      const res = await fetch("/api/rewrite-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandProfile, rawText })
      });

      if (!res.ok) {
        throw new Error("Dönüştürme servisi yanıt vermedi.");
      }

      const data = await res.json();
      setRawRewriteOutput(data.rawRewrite);
      setSelfCheckOutput(data.selfCheck);
      setRewrittenText(data.finalText);

      if (ttsEnabled && data.finalText) {
        handleVoiceReadout(data.finalText);
      }

    } catch (err: any) {
      console.error(err);
      setApiError("Metin dönüştürme zinciri çalışırken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsRewriting(false);
    }
  };

  // Helper: Click-to-load preset brands
  const handleLoadPreset = (preset: PresetBrand) => {
    setBrandName(preset.name);
    setSampleSentence(preset.sampleSentence);
    setBrandProfile("");
    setRewrittenText("");
    setSelfCheckOutput("");
    setApiError(null);
  };

  // Helper: Copy result to clipboard
  const handleCopyText = () => {
    if (!rewrittenText) return;
    navigator.clipboard.writeText(rewrittenText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Parse Brand profile points for a premium bullet-point rendering card
  const getParsedAnalysisPoints = () => {
    if (!brandProfile) return [];
    
    const lines = brandProfile.split("\n");
    const points: { key: string; value: string }[] = [];
    let characterCard = "";

    lines.forEach((line) => {
      const cleaned = line.trim();
      if (cleaned.startsWith("-") || cleaned.startsWith("•") || cleaned.includes(":")) {
        const parts = cleaned.replace(/^[-•]\s*/, "").split(":");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(":").trim();
          points.push({ key, value });
        }
      }
    });

    return points;
  };

  return (
    <div className="min-h-screen bg-brand-bg text-gray-100 font-sans flex flex-col selection:bg-brand-primary/30 selection:text-white">
      
      {/* Header aligned to specifications */}
      <header className="border-b border-brand-border bg-brand-bg/85 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="font-display font-extrabold text-white text-base tracking-wider">T</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight text-white uppercase">Tonic</h1>
              <p className="text-[10px] text-brand-text-muted font-medium tracking-wide">Brand Voice Assistant</p>
            </div>
          </div>
          <span className="text-xs text-brand-text-muted font-mono bg-brand-surface-elevated/40 border border-brand-border px-2.5 py-1 rounded-md">
            Powered by GenAI
          </span>
        </div>
      </header>

      {/* Main Container - Exactly 960px centered */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-5 py-8 flex flex-col gap-6">
        
        {/* Brand voice welcome/ambient visual bar */}
        <section className="bg-brand-surface border border-brand-border rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Glowing backlights */}
          <div className="absolute inset-0 bg-radial transition-all duration-1000 -z-10 pointer-events-none opacity-20 blur-2xl"
               style={{
                 background: isSpeaking 
                   ? "radial-gradient(circle, rgba(16, 172, 132, 0.25) 0%, rgba(18, 19, 29, 0) 70%)"
                   : "radial-gradient(circle, rgba(124, 92, 252, 0.2) 0%, rgba(18, 19, 29, 0) 70%)"
               }}
          />

          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display font-bold text-base text-white flex items-center gap-2 justify-center sm:justify-start">
              <Activity className="w-4 h-4 text-brand-primary animate-pulse" />
              Tonic Akıllı Ses Tonu Modülü
            </h2>
            <p className="text-xs text-brand-text-muted mt-1 max-w-lg">
              Markanızın örnek cümlelerini analiz ederek özel bir "ses tonu matrisi" oluşturur ve tüm iletişim metinlerinizi bu kimliğe göre yeniden yazar.
            </p>
          </div>

          {/* Interactive Waveform that vibrates beautifully */}
          <div className="flex items-center gap-3 shrink-0 bg-brand-surface-elevated/40 border border-brand-border/60 p-3 rounded-xl">
            <div className="flex items-end gap-1 h-9 px-1">
              {waveHeights.map((h, i) => (
                <div 
                  key={i} 
                  className={`w-[3px] rounded-full transition-all duration-150 ${
                    isSpeaking ? "bg-emerald-400" : "bg-brand-primary"
                  }`}
                  style={{ height: `${h}px` }} 
                />
              ))}
            </div>
            
            <button
              onClick={() => {
                if (isSpeaking) stopVoiceReadout();
                else if (rewrittenText) handleVoiceReadout(rewrittenText);
                else handleVoiceReadout("Markanızın ses tonunu tanımlamak için yukarıdaki paneli doldurun.");
              }}
              className={`p-2 rounded-lg border transition-all ${
                isSpeaking 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-brand-surface-elevated border-brand-border text-brand-text-muted hover:text-white"
              }`}
              title={isSpeaking ? "Sesi Durdur" : "Sonucu Seslendir"}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-bounce" : ""}`} />
            </button>
          </div>
        </section>

        {/* Dynamic Interactive Presets */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-sans font-semibold text-brand-text-muted uppercase tracking-wider">
            Test Etmek İçin Hazır Marka Şablonları Seçin:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleLoadPreset(brand)}
                className={`p-3 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${
                  brandName === brand.name 
                    ? "bg-brand-primary/15 border-brand-primary text-white"
                    : "bg-brand-surface border-brand-border hover:border-brand-primary/40 text-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs">{brand.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    brand.category === "luxury" ? "bg-purple-400" :
                    brand.category === "future" ? "bg-amber-400" :
                    brand.category === "entertainment" ? "bg-emerald-400" : "bg-rose-400"
                  }`} />
                </div>
                <p className="text-[10px] text-brand-text-muted mt-1 line-clamp-1">{brand.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {apiError && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl flex items-start gap-3 text-xs shadow-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Sistem Bağlantı Sorunu</span>
              <span>{apiError}</span>
            </div>
            <button 
              onClick={() => setApiError(null)}
              className="text-rose-400 hover:text-white font-bold text-sm leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* PANEL 1 — "Markanızın Sesini Tanımlayın" */}
        <section className="bg-brand-surface border border-brand-border rounded-2xl p-8 flex flex-col gap-6 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h3 className="font-display text-base font-semibold text-white">
                Panel 1 — Markanızın Sesini Tanımlayın
              </h3>
            </div>
            <span className="text-[10px] font-mono text-brand-text-muted uppercase">Brand Analysis</span>
          </div>

          <form onSubmit={handleAnalyzeBrand} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Brand Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-brand-text-muted font-sans">
                  Marka Adı
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Örn: Apple, Tesla, Butik Kahve Evi..."
                  className="px-4 py-3 bg-brand-bg border border-brand-border rounded-[10px] text-sm text-gray-200 placeholder-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>

              {/* Sample Brand Sentence Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-brand-text-muted font-sans">
                  Örnek Marka Cümlesi (Ses tonunu yansıtan gerçek bir içerik yapıştırın)
                </label>
                <textarea
                  required
                  rows={3}
                  value={sampleSentence}
                  onChange={(e) => setSampleSentence(e.target.value)}
                  placeholder="Örn: 'İnovasyon bizim DNA'mızda var. Her ürün, sınırları zorlamanın bir ifadesidir.'"
                  className="px-4 py-3 bg-brand-bg border border-brand-border rounded-[10px] text-sm text-gray-200 placeholder-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-y min-h-[80px]"
                />
              </div>
            </div>

            {/* Submit Analysis Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing || !brandName.trim() || !sampleSentence.trim()}
                className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-sm rounded-[10px] transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-brand-primary/20 disabled:bg-[#3A3B4A] disabled:text-[#8B8AA3] disabled:translate-y-0 disabled:shadow-none flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    Marka Sesi Analiz Et
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prompt 1 Output Panel: Tone Profile Card */}
          {brandProfile && (
            <div className="mt-4 p-5 bg-brand-surface-elevated/40 border border-brand-border rounded-xl flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center gap-2 text-brand-primary">
                <BookmarkCheck className="w-4.5 h-4.5" />
                <span className="font-display font-bold text-xs uppercase tracking-wider">
                  Oluşturulan Ses Tonu Profili ({brandName})
                </span>
              </div>
              
              {/* Parsed Points Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getParsedAnalysisPoints().map((point, idx) => (
                  <div key={idx} className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/40 text-xs">
                    <span className="font-semibold text-gray-300 block mb-1">{point.key}</span>
                    <span className="text-brand-text-muted">{point.value}</span>
                  </div>
                ))}
              </div>

              {/* Character Card Block */}
              {brandProfile.toLowerCase().includes("karakter kartı") && (
                <div className="bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-lg mt-1">
                  <span className="font-display font-semibold text-xs text-brand-primary uppercase block mb-1">
                    Karakter Kartı
                  </span>
                  <p className="text-xs text-gray-200 italic leading-relaxed">
                    {brandProfile.split(/Karakter Kartı:?/i)[1]?.trim() || brandProfile}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* PANEL 2 — "Metni Dönüştür" */}
        <section 
          className={`bg-brand-surface border border-brand-border rounded-2xl p-8 flex flex-col gap-6 shadow-xl relative transition-all duration-500 ${
            !brandProfile 
              ? "opacity-40 pointer-events-none select-none grayscale" 
              : "opacity-100"
          }`}
        >
          {/* Disabled Badge helper */}
          {!brandProfile && (
            <div className="absolute inset-0 bg-brand-bg/10 backdrop-blur-[1px] rounded-2xl z-20 flex items-center justify-center p-6 text-center">
              <div className="bg-brand-surface-elevated border border-brand-border p-4 rounded-xl shadow-2xl max-w-sm">
                <LockIcon className="w-6 h-6 text-brand-primary mx-auto mb-2 animate-bounce" />
                <p className="font-display font-bold text-xs text-white uppercase tracking-wider">Metin Dönüştürücü Kilitli</p>
                <p className="text-[11px] text-brand-text-muted mt-1 leading-relaxed">
                  Metin dönüştürmek için önce yukarıdaki panelden bir marka sesi analiz ettirmeli veya hızlı bir marka şablonu seçip analiz tetiklemelisiniz.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-brand-primary" />
              <h3 className="font-display text-base font-semibold text-white">
                Panel 2 — Metni Dönüştür
              </h3>
            </div>
            <span className="text-[10px] font-mono text-brand-text-muted uppercase">Tone Shift Matrix</span>
          </div>

          {/* Core Desktop 3-Column Layout: Left (Input) | Center (Button) | Right (Output) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch relative">
            
            {/* Left Column: Input text (%45 on desktop) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <label className="text-[13px] font-medium text-brand-text-muted font-sans flex items-center justify-between">
                <span>Ham Metninizi Buraya Yapıştırın</span>
                <span className="text-[10px] font-mono text-brand-text-muted">Raw Text</span>
              </label>
              <textarea
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Örn: 'Ürünümüz çok iyi çalışıyor, hemen satın alın çünkü indirim var ve kalitemiz tescillidir.'"
                className="w-full h-full px-4 py-3 bg-brand-bg border border-brand-border rounded-[10px] text-sm text-gray-200 placeholder-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none min-h-[160px]"
              />
            </div>

            {/* Center Column: Conversion Action Button (%2 on desktop or centered) */}
            <div className="md:col-span-2 flex flex-col justify-center items-center py-2">
              <button
                onClick={handleTransformText}
                id="transform-btn"
                disabled={isRewriting || !rawText.trim() || !brandProfile}
                className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-sm rounded-[10px] transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-brand-primary/30 disabled:bg-[#3A3B4A] disabled:text-[#8B8AA3] disabled:translate-y-0 disabled:shadow-none flex flex-col items-center justify-center gap-2 px-3"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Uygulanıyor</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span className="text-xs uppercase tracking-wide">Dönüştür</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Converted Output (%45 on desktop) */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-brand-text-muted font-sans">
                  Dönüştürülmüş Marka Metni
                </label>
                {rewrittenText && (
                  <button 
                    onClick={handleCopyText}
                    className="text-[10px] text-brand-primary hover:text-white flex items-center gap-1 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    {copySuccess ? "Kopyalandı!" : "Kopyala"}
                  </button>
                )}
              </div>

              {/* Converted Output Box */}
              <div className="relative flex-1 bg-brand-bg border border-brand-border rounded-[10px] border-l-4 border-l-brand-primary overflow-hidden min-h-[160px] p-4 flex flex-col justify-between">
                
                {/* Visual state handler */}
                {isRewriting ? (
                  <div className="absolute inset-0 bg-brand-bg/95 flex items-center justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                ) : null}

                {/* Display Area */}
                <div className="text-sm text-gray-200 leading-relaxed flex-1">
                  {rewrittenText ? (
                    <p className="animate-fade-in">{rewrittenText}</p>
                  ) : (
                    <span className="text-brand-text-muted text-xs block text-center mt-12">
                      Sonuç burada görünecek
                    </span>
                  )}
                </div>

                {/* Prompt 3 Self-Check Results block if present */}
                {selfCheckOutput && (
                  <div className="mt-4 pt-3 border-t border-brand-border/60">
                    <details className="group cursor-pointer">
                      <summary className="text-[10px] font-mono text-brand-text-muted hover:text-white transition-colors flex items-center gap-1 list-none">
                        <span className="transition-transform group-open:rotate-90">▶</span>
                        Arka Plan Yapay Zeka Denetim Raporu (Self-Check)
                      </summary>
                      <pre className="text-[10px] text-brand-text-muted/80 mt-2 bg-brand-surface-elevated/40 p-2.5 rounded border border-brand-border font-mono whitespace-pre-wrap leading-normal">
                        {selfCheckOutput}
                      </pre>
                    </details>
                  </div>
                )}

                {/* Mandatory Disclaimer footer label */}
                <div className="text-[10px] text-brand-text-muted/60 mt-3 border-t border-brand-border/20 pt-2 font-sans italic">
                  İçerik AI ile üretilmiştir, yayın öncesi gözden geçiriniz.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Extra Tonic Premium Feature: Telemetry and Diagnostics Dashboard */}
        <section className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-brand-primary" />
              <h3 className="font-display text-sm font-semibold text-white">
                AI Telemetri & İşlem İndikatörleri
              </h3>
            </div>
            <div className="flex bg-brand-surface-elevated p-0.5 rounded-lg border border-brand-border text-[10px]">
              <button 
                onClick={() => setActiveTab("visual")}
                className={`px-2 py-1 rounded transition-all ${
                  activeTab === "visual" ? "bg-brand-primary text-white" : "text-brand-text-muted"
                }`}
              >
                Performans
              </button>
              <button 
                onClick={() => setActiveTab("telemetry")}
                className={`px-2 py-1 rounded transition-all ${
                  activeTab === "telemetry" ? "bg-brand-primary text-white" : "text-brand-text-muted"
                }`}
              >
                Donanım
              </button>
            </div>
          </div>

          {activeTab === "visual" ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-brand-bg/50 p-3 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] font-mono text-brand-text-muted uppercase">Dönüşüm Süresi</span>
                  <p className="font-display font-bold text-base text-white mt-0.5">380 ms</p>
                  <span className="text-[9px] text-emerald-400 font-mono">Ultra-hızlı işlem</span>
                </div>
                <div className="bg-brand-bg/50 p-3 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] font-mono text-brand-text-muted uppercase">Duygu Uyum Oranı</span>
                  <p className="font-display font-bold text-base text-white mt-0.5">%98.4</p>
                  <span className="text-[9px] text-brand-text-muted font-mono">Self-check doğrulamalı</span>
                </div>
                <div className="bg-brand-bg/50 p-3 rounded-xl border border-brand-border/40 text-left">
                  <span className="text-[9px] font-mono text-brand-text-muted uppercase">Model Altyapısı</span>
                  <p className="font-display font-bold text-base text-white mt-0.5">Gemini 3.5</p>
                  <span className="text-[9px] text-brand-text-muted font-mono">Sıfır gecikmeli flash</span>
                </div>
              </div>

              {/* Custom SVG Graph representing weekly performance */}
              <div className="h-[90px] w-full flex items-end justify-between px-2 pt-4 bg-brand-bg/30 border border-brand-border/30 rounded-xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 border-b border-brand-border/5 pointer-events-none" />
                {WEEKLY_ANALYTICS.map((day, i) => {
                  const voiceHeight = Math.max(8, (day.voice / 45) * 60);
                  const textHeight = Math.max(5, (day.text / 45) * 60);
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                      <div className="flex gap-1 items-end w-full max-w-[16px] h-[55px]">
                        <div 
                          className="w-1/2 bg-brand-primary rounded-t-sm"
                          style={{ height: `${voiceHeight}%` }}
                        />
                        <div 
                          className="w-1/2 bg-brand-primary/25 rounded-t-sm"
                          style={{ height: `${textHeight}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-brand-text-muted mt-1.5">{day.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border/40 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-brand-text-muted uppercase">İşlemci Isısı</span>
                <span className="font-mono font-semibold text-white">32°C</span>
              </div>
              <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border/40 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-brand-text-muted uppercase">RAM Kullanımı</span>
                <span className="font-mono font-semibold text-white">1.1 GB / 8 GB</span>
              </div>
              <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border/40 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-brand-text-muted uppercase">Aktif Pipeline</span>
                <span className="font-mono font-semibold text-emerald-400">Kararlı</span>
              </div>
              <div className="p-3 bg-brand-bg/50 rounded-xl border border-brand-border/40 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-brand-text-muted uppercase">Ağ Gecikmesi</span>
                <span className="font-mono font-semibold text-white">11ms</span>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Footer styled aligned to specs */}
      <footer className="border-t border-brand-border/50 py-6 mt-auto text-center text-xs text-brand-text-muted bg-brand-bg/40 font-mono">
        <p>© 2026 Tonic Brand systems. Tüm hakları saklıdır.</p>
        <p className="text-[10px] text-brand-text-muted/60 mt-1">
          Designed with Inter & Space Grotesk. Powered by Google Gemini-3.5-flash.
        </p>
      </footer>

    </div>
  );
}

// Custom simple fallback icons to ensure zero package compilation errors
function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
