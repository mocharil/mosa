# Deployment Guide - Voice JKN Agent

## Persiapan Sebelum Deploy

### 1. Dapatkan Gemini API Key
- Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
- Login dengan akun Google
- Buat API key baru
- Simpan API key dengan aman

### 2. Test Lokal Terlebih Dahulu
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dan masukkan GEMINI_API_KEY

# Run development server
npm run dev

# Buka http://localhost:3000 dan test semua fitur
```

### 3. Build Production
```bash
npm run build
npm start
```

## Deploy ke Vercel (Recommended)

Vercel adalah platform deployment terbaik untuk Next.js dengan performa optimal.

### Step-by-Step:

1. **Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Voice JKN Agent"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import Project ke Vercel**
- Kunjungi [vercel.com](https://vercel.com)
- Klik "Import Project"
- Pilih repository GitHub Anda
- Klik "Import"

3. **Konfigurasi Environment Variables**
Di Vercel dashboard, tambahkan:
- `GEMINI_API_KEY` = your_actual_gemini_api_key

4. **Deploy**
- Klik "Deploy"
- Tunggu beberapa menit
- Aplikasi akan live di URL: `your-project.vercel.app`

### Custom Domain (Opsional)
1. Beli domain (misalnya di Niagahoster, Dewaweb, dll)
2. Di Vercel, buka Settings → Domains
3. Tambahkan custom domain
4. Update DNS records sesuai instruksi Vercel

## Deploy ke Netlify

### Step-by-Step:

1. **Build Configuration**
Buat file `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

3. **Set Environment Variables**
```bash
netlify env:set GEMINI_API_KEY your_api_key_here
```

## Deploy ke Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login & Deploy**
```bash
railway login
railway init
railway up
```

3. **Set Environment Variables**
Di Railway dashboard:
- Variables → Add Variable
- Key: `GEMINI_API_KEY`
- Value: your API key

## Deploy ke Cloud Provider

### Google Cloud Run

1. **Buat Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build & Deploy**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/voice-jkn-agent
gcloud run deploy voice-jkn-agent \
  --image gcr.io/PROJECT_ID/voice-jkn-agent \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_api_key
```

### AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize & Deploy**
```bash
eb init -p node.js voice-jkn-agent
eb create voice-jkn-agent-env
eb setenv GEMINI_API_KEY=your_api_key
eb deploy
```

## Post-Deployment Checklist

### ✅ Testing
- [ ] Test voice recognition di Chrome
- [ ] Test voice recognition di Edge
- [ ] Test Mode JKN - tanya pertanyaan umum
- [ ] Test Mode Curhat - coba berbagai skenario
- [ ] Test emergency button
- [ ] Test conversation summary & export
- [ ] Test di mobile device
- [ ] Test dengan koneksi lambat

### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] Time to First Byte < 200ms
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

### ✅ Security
- [ ] HTTPS enabled (otomatis di Vercel/Netlify)
- [ ] Environment variables tidak exposed
- [ ] CSP headers configured (opsional)
- [ ] Rate limiting untuk API (opsional)

### ✅ Monitoring
- [ ] Setup error tracking (Sentry recommended)
- [ ] Monitor API usage & costs
- [ ] Setup uptime monitoring (UptimeRobot)

## Troubleshooting

### Speech Recognition Tidak Bekerja di Production
**Solusi**: Pastikan HTTPS enabled. Web Speech API hanya bekerja di HTTPS atau localhost.

### Gemini API Rate Limit Error
**Solusi**:
- Cek quota di Google AI Studio
- Implementasi rate limiting di backend
- Upgrade ke paid tier jika perlu

### Build Failed di Vercel
**Solusi**:
1. Cek build logs
2. Pastikan semua dependencies di `package.json`
3. Test build lokal: `npm run build`
4. Cek Node.js version compatibility

### Mobile Performance Lambat
**Solusi**:
- Enable image optimization
- Lazy load components
- Reduce bundle size
- Use CDN untuk assets

## Monitoring & Analytics

### Setup Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Setup Google Analytics
Di `app/layout.tsx`, tambahkan:
```tsx
import Script from 'next/script';

// Di dalam component
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### Setup Vercel Analytics
```bash
npm install @vercel/analytics
```

Di `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

// Di return statement
<Analytics />
```

## Biaya Estimasi

### Free Tier (Development)
- **Vercel**: Free untuk personal projects
- **Gemini API**: 60 requests/minute gratis
- **Domain**: ~Rp 100.000/tahun

### Production (100 users/hari)
- **Vercel Pro**: $20/bulan
- **Gemini API**: ~$10-30/bulan (tergantung usage)
- **Total**: ~Rp 600.000/bulan

## Skalabilitas

Untuk traffic tinggi:
1. **Implement Caching**
   - Redis untuk session
   - CDN untuk static assets

2. **Database untuk Riwayat**
   - Supabase (gratis 500MB)
   - Firebase Firestore

3. **Load Balancing**
   - Otomatis di Vercel
   - Manual di cloud provider lain

4. **Rate Limiting**
   - Implementasi per-user rate limiting
   - Prevent abuse

## Backup & Recovery

1. **Backup Code**: Always di GitHub
2. **Backup Database**: Automatic di Supabase/Firebase
3. **Environment Variables**: Simpan di password manager
4. **Deployment Rollback**:
   - Vercel: One-click rollback
   - Railway: `railway rollback`

---

**Support**: Untuk bantuan deployment, buka issue di GitHub atau email: support@yourapp.com

**Security**: Report security issues ke: security@yourapp.com
