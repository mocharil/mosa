# Setup Guide - Voice JKN Agent

Panduan lengkap untuk mengsetup dan mengembangkan aplikasi Voice JKN Agent.

## Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** 18.x atau lebih baru ([Download](https://nodejs.org/))
- **npm** atau **yarn** (sudah include dengan Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)
- **Browser**: Chrome atau Edge (untuk Web Speech API)

## Quick Start (5 Menit)

```bash
# 1. Clone atau download project
cd voice-jkn-agent

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dan isi GEMINI_API_KEY

# 4. Run development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

## Mendapatkan Gemini API Key

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Get API Key" atau "Create API Key"
4. Copy API key yang dibuat
5. Paste ke `.env.local`:
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note**: API key ini GRATIS dengan quota:
- 60 requests per minute
- 1,500 requests per day
- Cukup untuk development dan testing

## File Structure Explained

```
voice-jkn-agent/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── gemini/
│   │       └── route.ts          # Gemini API endpoint
│   │
│   ├── components/               # React Components
│   │   ├── chat/                 # Chat-related components
│   │   │   ├── ChatBubble.tsx    # Individual message bubble
│   │   │   └── ChatContainer.tsx # Chat list & scrolling
│   │   │
│   │   ├── voice/                # Voice input components
│   │   │   ├── VoiceButton.tsx   # Mic button dengan animasi
│   │   │   └── AudioVisualizer.tsx # Wave visualization
│   │   │
│   │   ├── ConversationSummary.tsx # Summary modal
│   │   └── EmergencyButton.tsx   # Emergency contacts button
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── gemini.ts             # Gemini AI functions
│   │   ├── speechRecognition.ts  # Speech utilities
│   │   ├── store.ts              # Zustand state management
│   │   └── utils.ts              # Helper functions
│   │
│   ├── styles/
│   │   └── globals.css           # Global CSS & Tailwind
│   │
│   ├── chat/
│   │   └── page.tsx              # Chat interface page
│   │
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing/home page
│
├── public/                       # Static assets
│   ├── audio/                    # Audio files (jika ada)
│   └── docs/
│       └── jkn-sources.json      # JKN reference data
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
└── README.md                     # Main documentation
```

## Key Technologies

### 1. Next.js 14 (App Router)
- **Server Components**: Untuk performa optimal
- **API Routes**: `/app/api/gemini/route.ts`
- **File-based Routing**: Auto-routing based on folder structure
- **Built-in optimization**: Image, font, script optimization

### 2. Google Gemini AI
- **Model**: `gemini-1.5-flash` (fast & cost-effective)
- **Features**:
  - Natural language understanding
  - Context-aware responses
  - Emotion detection for curhat mode
  - Source citation for JKN mode

### 3. Web Speech API
- **Speech Recognition**: Convert voice to text
- **Speech Synthesis**: Text-to-speech (opsional)
- **Language Detection**: Auto-detect Indonesia/English
- **Browser Support**: Chrome, Edge (best), Firefox (limited)

### 4. Zustand (State Management)
- **Lightweight**: ~1KB bundle size
- **Simple API**: Minimal boilerplate
- **TypeScript**: Full type safety
- **Stores**:
  - `useChatStore`: Chat messages, mode, language
  - `useSettingsStore`: User preferences

### 5. Tailwind CSS
- **Utility-first**: Rapid UI development
- **Custom colors**: JKN blue & Curhat green
- **Responsive**: Mobile-first design
- **Dark mode ready**: Easy to implement

## Development Workflow

### 1. Run Development Server
```bash
npm run dev
```
- Server: http://localhost:3000
- Auto-reload on file changes
- Error overlay untuk debugging

### 2. Code Structure Best Practices

**Components**:
```tsx
// Gunakan "use client" untuk interaktif components
"use client";

import { useState } from "react";

export default function MyComponent() {
  // Component logic
}
```

**API Routes**:
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Process request
  return NextResponse.json({ data: "response" });
}
```

### 3. Testing Locally

**Test Mode JKN**:
1. Pilih "Tanya JKN"
2. Tekan mikrofon
3. Tanya: "Bagaimana cara mendaftar JKN?"
4. Cek response dengan sitasi

**Test Mode Curhat**:
1. Pilih "Curhat Aman"
2. Tekan mikrofon
3. Katakan: "Saya merasa sedih hari ini"
4. Cek empati response

**Test Emotion Detection**:
1. Mode Curhat
2. Katakan kata risiko tinggi: "putus asa", "tidak ada harapan"
3. Harus muncul warning banner merah

### 4. Debugging

**Console Logs**:
```typescript
console.log("Debug:", variable);
console.error("Error:", error);
```

**React DevTools**:
- Install extension: [React DevTools](https://react.dev/learn/react-developer-tools)
- Inspect component state & props

**Network Tab**:
- Buka DevTools → Network
- Monitor API calls ke `/api/gemini`
- Check request/response payload

**Speech API Debug**:
```typescript
// Di chat/page.tsx
console.log("Listening:", listening);
console.log("Transcript:", transcript);
console.log("Browser support:", browserSupportsSpeechRecognition);
```

## Customization Guide

### 1. Mengubah System Prompts

Edit `app/lib/gemini.ts`:
```typescript
export const SYSTEM_PROMPT_JKN = `
Anda adalah asisten JKN...
[Tambahkan instruksi custom Anda di sini]
`;
```

### 2. Menambah Keyword Risiko Tinggi

Edit fungsi `getCurhatResponse()` di `app/lib/gemini.ts`:
```typescript
const highRiskKeywords = [
  "bunuh diri",
  "mengakhiri hidup",
  // Tambahkan keyword baru
  "keyword baru",
];
```

### 3. Mengubah Warna Theme

Edit `tailwind.config.ts`:
```typescript
colors: {
  jkn: {
    primary: "#0066CC",    // Ubah warna primary
    secondary: "#0099FF",  // Ubah warna secondary
    light: "#E6F2FF",      // Ubah warna light
  },
}
```

### 4. Menambah Data Sumber JKN

Edit `public/docs/jkn-sources.json`:
```json
{
  "sources": [
    {
      "id": 7,
      "title": "Peraturan Baru",
      "description": "Deskripsi",
      "url": "https://link.com",
      "topics": ["topik1", "topik2"]
    }
  ]
}
```

### 5. Mengubah Bahasa Default

Edit `.env.local`:
```env
NEXT_PUBLIC_DEFAULT_LANGUAGE=en  # untuk Inggris
# atau
NEXT_PUBLIC_DEFAULT_LANGUAGE=id  # untuk Indonesia
```

## Common Issues & Solutions

### Issue 1: Speech Recognition Tidak Bekerja
**Gejala**: Mic button tidak respond, error console

**Solusi**:
1. Pastikan menggunakan Chrome/Edge
2. Pastikan HTTPS atau localhost
3. Izinkan akses mikrofon di browser
4. Cek browser compatibility:
```typescript
if (!browserSupportsSpeechRecognition) {
  alert("Browser tidak mendukung speech recognition");
}
```

### Issue 2: Gemini API Error
**Gejala**: Error 400/403/500 saat chat

**Solusi**:
1. Cek API key di `.env.local`
2. Verifikasi API key valid di [Google AI Studio](https://makersuite.google.com/)
3. Cek quota: 60 req/min, 1500 req/day
4. Cek network tab untuk error detail

### Issue 3: Build Error
**Gejala**: `npm run build` gagal

**Solusi**:
```bash
# Hapus cache
rm -rf .next node_modules

# Reinstall
npm install

# Build ulang
npm run build
```

### Issue 4: Regenerator Runtime Error
**Solusi**: Sudah handled dengan import di `app/chat/page.tsx`:
```typescript
import "regenerator-runtime/runtime";
```

### Issue 5: Module Not Found
**Solusi**:
```bash
npm install [missing-module]
```

## Performance Optimization

### 1. Code Splitting
Next.js otomatis melakukan code splitting. Untuk optimize lebih:
```typescript
// Dynamic import untuk heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

### 2. Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/image.png"
  width={500}
  height={300}
  alt="Description"
/>
```

### 3. Reduce Bundle Size
```bash
# Analyze bundle
npm run build
# Check output size di terminal

# Jika terlalu besar, consider:
# - Remove unused dependencies
# - Use dynamic imports
# - Optimize images
```

## Advanced Development

### 1. Menambah Database (Supabase)
```bash
npm install @supabase/supabase-js
```

Setup client:
```typescript
// app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 2. Menambah Authentication
```bash
npm install next-auth
```

### 3. Implementasi RAG (Retrieval-Augmented Generation)
Untuk sitasi yang lebih akurat:
```typescript
// app/lib/rag.ts
import { embed } from '@google/generative-ai';

// Implement vector search untuk dokumen JKN
```

### 4. Error Tracking dengan Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## VS Code Extensions Recommended

- **ESLint**: Linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind autocomplete
- **TypeScript**: Better TS support
- **React Developer Tools**: React debugging

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# Create Pull Request di GitHub
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

## Support

Untuk bantuan:
1. Cek README.md
2. Cek issues di GitHub
3. Buat issue baru dengan detail:
   - Environment (OS, Node version, Browser)
   - Error message
   - Steps to reproduce

---

Happy coding! 🚀
