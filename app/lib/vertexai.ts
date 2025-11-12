import { VertexAI } from "@google-cloud/vertexai";
import * as fs from "fs";
import * as path from "path";

// Initialize Vertex AI with service account
let vertexAI: VertexAI;

try {
  // Load service account credentials
  const serviceAccountPath = path.join(process.cwd(), "skilled-compass.json");

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("Service account file not found: skilled-compass.json");
  }

  const credentials = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  // Initialize Vertex AI
  vertexAI = new VertexAI({
    project: credentials.project_id,
    location: "us-central1", // or your preferred location
    googleAuthOptions: {
      credentials: credentials,
    },
  });

  console.log("✅ Vertex AI initialized successfully with service account");
} catch (error) {
  console.error("❌ Error initializing Vertex AI:", error);
  throw error;
}

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
  image?: string; // Base64 encoded image
  imageUrl?: string; // Image URL for display
}

export interface UnifiedResponse {
  answer: string;
  riskLevel: "low" | "medium" | "high";
  showEmergencyContacts: boolean;
  topicType: "jkn" | "curhat" | "general";
}

// Unified Response Generator using Vertex AI
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

    // Get generative model
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

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

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const response = result.response;
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

// Generate conversation summary
// Analyze image with Vertex AI Vision
export async function analyzeImage(
  imageBase64: string,
  userQuery: string = "Apa yang ada di gambar ini?"
): Promise<UnifiedResponse> {
  try {
    // Get vision model
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // Supports vision
    });

    const prompt = `${SYSTEM_PROMPT}

Pengguna mengirim gambar dengan pertanyaan: ${userQuery}

Analisis gambar ini dan berikan respons yang sesuai:
1. Jelaskan apa yang terlihat di gambar
2. Jika terkait kesehatan/medis: berikan informasi yang akurat dan saran untuk konsultasi profesional
3. Jika terkait JKN: berikan informasi relevan tentang layanan/prosedur
4. Jika user terlihat sedih/membutuhkan dukungan: berikan respons empatik

PENTING: Jika gambar berisi informasi medis atau kesehatan yang serius, sarankan untuk konsultasi dengan tenaga medis profesional.`;

    // Prepare image part
    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            imagePart,
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const response = result.response;
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Basic risk detection from image analysis response
    const isHighRisk = /rujukan|emergency|segera|darurat|serius/i.test(responseText);

    return {
      answer: responseText,
      riskLevel: isHighRisk ? 'high' : 'low',
      showEmergencyContacts: isHighRisk,
      topicType: 'general',
    };
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw new Error('Maaf, terjadi kesalahan saat menganalisis gambar.');
  }
}

export async function generateSummary(messages: Message[]): Promise<string> {
  try {
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.5,
      },
    });

    return result.response.candidates?.[0]?.content?.parts?.[0]?.text || "Ringkasan tidak dapat dibuat saat ini.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Ringkasan tidak dapat dibuat saat ini.";
  }
}
