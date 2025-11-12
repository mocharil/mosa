import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Unified System Prompt
export const SYSTEM_PROMPT = `Anda adalah asisten kesehatan yang membantu dengan DUA fungsi utama:

**FUNGSI 1 - KONSULTASI JKN:**
Ketika pengguna bertanya tentang JKN, BPJS, prosedur kesehatan:
1. Jawab singkat dan jelas (maksimal 3 paragraf)
2. WAJIB sertakan sitasi sumber dalam format [Sumber: Nama Peraturan]
3. Jika tentang keluhan kesehatan: tanyakan gejala → rekomendasikan poli yang tepat
4. Berikan langkah-langkah konkret yang bisa diikuti
5. Jika tidak yakin, arahkan ke BPJS Kesehatan di 1500-400

Topik JKN: pendaftaran, kartu, prosedur rujukan, cakupan layanan, klaim, iuran, FKTP, FKTL

**FUNGSI 2 - DUKUNGAN EMOSIONAL (CURHAT):**
Ketika pengguna berbagi perasaan, keluhan mental/emosional:
1. Dengarkan dengan empati tanpa menghakimi
2. Validasi perasaan pengguna dengan tulus
3. DETEKSI kata kunci risiko tinggi: "bunuh diri", "mengakhiri hidup", "putus asa", "tidak ada harapan", "mau mati", "lelah hidup"
4. Jika risiko tinggi: segera sarankan bantuan profesional dan berikan nomor hotline
5. Berikan affirmasi positif dan langkah kecil yang bisa dilakukan
6. Akhiri dengan: "Apakah ada yang masih ingin dibicarakan?"

**PENTING:**
- Deteksi otomatis topik dari pertanyaan pengguna
- Bisa switch antar fungsi dalam satu percakapan
- Untuk JKN: fokus informasi praktis + sitasi
- Untuk curhat: fokus empati + safety
- Gunakan bahasa ramah, mudah dipahami, dan supportif

Nomor bantuan:
- Hotline Kesehatan Jiwa: 119 ext 8
- BPJS Kesehatan: 1500-400
- Halo Kemkes: 1500-567`;

// Types
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface UnifiedResponse {
  answer: string;
  riskLevel: "low" | "medium" | "high";
  showEmergencyContacts: boolean;
  topicType: "jkn" | "curhat" | "general";
}

// Unified Response Generator
export async function getUnifiedResponse(
  userQuery: string,
  conversationHistory: Message[]
): Promise<UnifiedResponse> {
  try {
    // Detect high-risk keywords for mental health
    const highRiskKeywords = [
      "bunuh diri",
      "mengakhiri hidup",
      "mau mati",
      "ingin mati",
      "tidak ada harapan",
      "lebih baik mati",
      "sudah tidak tahan",
    ];

    const mediumRiskKeywords = [
      "putus asa",
      "lelah hidup",
      "tidak berguna",
      "sendirian",
      "tidak ada yang peduli",
      "sangat sedih",
      "depresi",
    ];

    const lowerMessage = userQuery.toLowerCase();
    const isHighRisk = highRiskKeywords.some((kw) =>
      lowerMessage.includes(kw)
    );
    const isMediumRisk = mediumRiskKeywords.some((kw) =>
      lowerMessage.includes(kw)
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const historyText = conversationHistory
      .slice(-6)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const riskContext = isHighRisk
      ? "⚠️ RISIKO TINGGI TERDETEKSI - Prioritaskan keselamatan dan rujukan profesional"
      : isMediumRisk
      ? "⚠️ RISIKO SEDANG - Berikan dukungan dan sarankan konsultasi"
      : "";

    const prompt = `${SYSTEM_PROMPT}

${riskContext ? `${riskContext}\n` : ""}
Riwayat percakapan:
${historyText}

Pertanyaan/pesan pengguna: ${userQuery}

Berikan respons yang sesuai dengan konteks (JKN atau curhat atau keduanya).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Detect topic type from response or query
    const isJKNTopic =
      /jkn|bpjs|kartu|klaim|iuran|faskes|puskesmas|rumah sakit|rujukan|fktp|fktl/i.test(
        userQuery + " " + responseText
      );
    const isCurhatTopic =
      /sedih|stres|cemas|takut|khawatir|lelah|capek|sendirian|putus asa|depresi/i.test(
        userQuery + " " + responseText
      );

    const topicType: "jkn" | "curhat" | "general" = isJKNTopic && isCurhatTopic
      ? "general"
      : isJKNTopic
      ? "jkn"
      : isCurhatTopic
      ? "curhat"
      : "general";

    return {
      answer: responseText,
      riskLevel: isHighRisk ? "high" : isMediumRisk ? "medium" : "low",
      showEmergencyContacts: isHighRisk || isMediumRisk,
      topicType,
    };
  } catch (error) {
    console.error("Error in getUnifiedResponse:", error);
    throw new Error("Maaf, terjadi kesalahan saat memproses permintaan Anda.");
  }
}

// Helper function to extract sections from formatted response
function extractSection(text: string, sectionName: string): string | null {
  const regex = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// Generate conversation summary
export async function generateSummary(
  messages: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `Buatkan ringkasan singkat dari percakapan berikut:

${conversationText}

Ringkasan harus mencakup:
1. Topik utama yang dibahas (2-3 poin)
2. Jika ada pertanyaan JKN: rangkum jawaban dan rekomendasi
3. Jika ada curhat/emosi: rangkum dukungan yang diberikan
4. Tindak lanjut yang perlu dilakukan (jika ada)
5. Nomor hotline yang relevan (jika disebutkan)

Format dalam bullet points yang jelas dan ringkas.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Ringkasan tidak dapat dibuat saat ini.";
  }
}
