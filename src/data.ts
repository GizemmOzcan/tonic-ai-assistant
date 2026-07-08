export interface PresetBrand {
  id: string;
  name: string;
  sampleSentence: string;
  category: "luxury" | "future" | "entertainment" | "motivational";
  description: string;
}

export const PRESET_BRANDS: PresetBrand[] = [
  {
    id: "brand-1",
    name: "Apple",
    category: "luxury",
    description: "Sade, seçkin, deneyim ve ilham odaklı lüks bir ton.",
    sampleSentence: "İnovasyon bizim DNA'mızda var. Her ürün, sınırları zorlamanın ve yeni bir başlangıç yaratmanın samimi bir ifadesidir."
  },
  {
    id: "brand-2",
    name: "Tesla",
    category: "future",
    description: "Vizyoner, cesur, mühendislik harikası ve sürdürülebilir gelecek.",
    sampleSentence: "Gelecek bugün inşa ediliyor. Gezegenimizin enerjisini dönüştürerek insanlığı yeni bir uygarlık seviyesine taşımak için buradayız."
  },
  {
    id: "brand-3",
    name: "Netflix",
    category: "entertainment",
    description: "Samimi, heyecan verici, eğlenceli ve arkadaş canlısı günlük bir ton.",
    sampleSentence: "Yeni favori dizini bulmaya hazır mısın? Mısırını patlat, arkana yaslan ve bu harika maceranın keyfini çıkarmaya hemen başla."
  },
  {
    id: "brand-4",
    name: "Nike",
    category: "motivational",
    description: "Motive edici, kararlı, enerjik ve sınırları aşan atletik bir ruh.",
    sampleSentence: "Eğer bir bedenin varsa, sen de bir sporcusun. Sadece harekete geç ve içindeki o durdurulamaz gücü dünyaya göster."
  }
];

export const WEEKLY_ANALYTICS = [
  { name: "Pzt", voice: 18, text: 9, responseTime: 420 },
  { name: "Sal", voice: 24, text: 12, responseTime: 380 },
  { name: "Çar", voice: 32, text: 15, responseTime: 350 },
  { name: "Per", voice: 28, text: 11, responseTime: 390 },
  { name: "Cum", voice: 40, text: 22, responseTime: 340 },
  { name: "Cmt", voice: 15, text: 8, responseTime: 410 },
  { name: "Paz", voice: 10, text: 5, responseTime: 450 },
];

export const CATEGORY_DISTRIBUTION = [
  { category: "Lüks & Minimalist", count: 86, percentage: 41, color: "#7C5CFC" },
  { category: "Gelecek & Vizyoner", count: 52, percentage: 25, color: "#FF9F43" },
  { category: "Eğlence & Samimi", count: 42, percentage: 20, color: "#10AC84" },
  { category: "Motive Edici & Güçlü", count: 30, percentage: 14, color: "#2E3044" },
];

