import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types.ts';

// The API key is injected during the Vite build process.
// This aligns with the deployment instructions on the "Deploy Cloudflare" page.
// Fix: Use optional chaining to safely access VITE_API_KEY, preventing crashes if import.meta.env is undefined.
const API_KEY = (import.meta as any)?.env?.VITE_API_KEY;

// Inisialisasi klien AI hanya jika API key tersedia.
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  // Fix: Update warning message to refer to the correct environment variable for Vite/Cloudflare deployment.
  console.warn("VITE_API_KEY untuk Gemini tidak diatur. Pastikan variabel lingkungan VITE_API_KEY sudah diatur di platform hosting Anda (misal: Cloudflare Pages). Fitur AI akan dinaktifkan.");
}

export const getFinancialAdvice = async (
  prompt: string, 
  transactions: Transaction[]
): Promise<string> => {
  // Periksa apakah instance 'ai' berhasil diinisialisasi.
  if (!ai) {
    return "Maaf, fitur Penasihat AI tidak tersedia saat ini karena kunci API belum diatur.";
  }

  const model = 'gemini-2.5-flash';
  
  const fullPrompt = `
    Anda adalah seorang penasihat keuangan AI yang ramah dan membantu bernama EmaSaku AI.
    Tugas Anda adalah menganalisis data transaksi pengguna dan memberikan wawasan atau jawaban yang relevan dalam Bahasa Indonesia.
    Jawablah dengan format Markdown.
    
    Berikut adalah data transaksi relevan dalam format JSON:
    ${JSON.stringify(transactions.slice(0, 50), null, 2)}
    
    ---
    
    Pertanyaan Pengguna: "${prompt}"
    
    ---
    
    Jawaban Anda:
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.";
  }
};

export const getStainAdvice = async (
  imageBase64: string,
  mimeType: string
): Promise<string> => {
  if (!ai) {
    return "Maaf, fitur Panduan Noda AI tidak tersedia saat ini karena kunci API belum diatur.";
  }

  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Anda adalah seorang ahli laundry profesional. Analisis noda pada gambar ini.
    Berikan jawaban dalam Bahasa Indonesia dengan format Markdown.
    Jawaban harus berisi:
    1.  **Judul**: Identifikasi jenis noda (misal: "### Noda Kopi", "### Noda Tinta").
    2.  **Tips Pertolongan Pertama**: Berikan 2-3 langkah singkat dan mudah diikuti untuk menangani noda tersebut SEGERA, sebelum dicuci secara profesional. Fokus pada tindakan yang mencegah noda semakin menempel.
    
    Contoh Jawaban:
    ### Noda Kopi
    Berikut adalah tips pertolongan pertama untuk noda kopi:
    1.  **Serap Cairan**: Segera tepuk-tepuk area yang terkena noda dengan kain bersih atau tisu kering untuk menyerap sisa kopi sebanyak mungkin. Jangan digosok.
    2.  **Bilas dengan Air Dingin**: Balik kain dan alirkan air dingin dari bagian belakang noda. Ini akan membantu mendorong noda keluar dari serat kain.
    3.  **Jangan Gunakan Air Panas**: Hindari air panas karena dapat 'memasak' noda protein pada kopi dan membuatnya lebih sulit dihilangkan.
  `;

  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, { text: prompt }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for stain advice:", error);
    return "Maaf, terjadi kesalahan saat menganalisis gambar. Pastikan gambar jelas dan coba lagi.";
  }
};

export const generateDreamImage = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("Maaf, fitur Dream Weaver tidak tersedia saat ini karena kunci API belum diatur.");
  }

  const fullPrompt = `${prompt}, photorealistic, cinematic lighting, 8k, high detail`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("AI tidak dapat menghasilkan gambar dari deskripsi tersebut. Coba deskripsi lain.");
    }
  } catch (error) {
    console.error("Error calling Gemini Image Generation API:", error);
    throw new Error("Maaf, terjadi kesalahan saat mencoba membuat gambar. Silakan coba lagi nanti.");
  }
};