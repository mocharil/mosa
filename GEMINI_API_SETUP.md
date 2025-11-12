# Setup Gemini API Key

## Masalah Saat Ini
Error: `API_KEY_INVALID` - API key yang ada di `.env.local` tidak valid.

## Solusi

### Opsi 1: Dapatkan API Key Baru dari Google AI Studio (RECOMMENDED)

1. **Buka Google AI Studio**
   - Kunjungi: https://makersuite.google.com/app/apikey
   - Atau: https://aistudio.google.com/app/apikey

2. **Login dengan Google Account**
   - Gunakan akun Google yang sama dengan service account project
   - Atau gunakan akun pribadi Anda

3. **Create API Key**
   - Klik tombol "Create API Key" atau "Get API Key"
   - Pilih project `paper-ds-production` (jika tersedia)
   - Atau buat project baru
   - Copy API key yang digenerate

4. **Update .env.local**
   ```bash
   # Edit file .env.local
   GEMINI_API_KEY=AIzaSy... # Paste API key baru di sini
   ```

5. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   # Start ulang
   npm run dev
   ```

### Opsi 2: Gunakan Google Cloud Console

1. **Buka Google Cloud Console**
   - https://console.cloud.google.com
   - Login dengan akun yang punya akses ke `paper-ds-production`

2. **Enable Generative Language API**
   - Navigation Menu → APIs & Services → Library
   - Cari "Generative Language API"
   - Klik "Enable"

3. **Create API Key**
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy API key
   - (Opsional) Restrict key untuk keamanan:
     - API restrictions → Select "Generative Language API"
     - Application restrictions → HTTP referrers (jika web app)

4. **Update .env.local**
   ```env
   GEMINI_API_KEY=your_new_api_key_here
   ```

### Opsi 3: Gunakan Vertex AI (Advanced)

Jika ingin menggunakan service account `skilled-compass.json`:

1. **Setup Vertex AI**
   - Enable Vertex AI API di Google Cloud Console
   - Grant permissions ke service account

2. **Update Code** (perlu modifikasi signifikan)
   - Gunakan `@google-cloud/vertexai` package
   - Authenticate dengan service account
   - Migrate dari Gemini API ke Vertex AI API

**NOTE**: Opsi 3 memerlukan perubahan kode yang cukup besar dan biaya lebih tinggi.

## Catatan Penting

### Tentang Service Account JSON
- File `skilled-compass.json` adalah service account untuk Google Cloud
- Gemini API (generative-language) **tidak support** service account authentication
- Gemini API hanya menerima **API Key** untuk authentication
- Service account ini bisa digunakan untuk **Vertex AI**, bukan Gemini API

### Perbedaan Gemini API vs Vertex AI
| Feature | Gemini API | Vertex AI |
|---------|-----------|-----------|
| Auth | API Key | Service Account / OAuth |
| Pricing | Free tier available | Pay per use |
| Rate Limits | 60 req/min (free) | Higher limits |
| Best for | Development, prototypes | Production, enterprise |

## Troubleshooting

### Error: "API key not valid"
✅ **Solution**: Get new API key dari Google AI Studio

### Error: "Quota exceeded"
✅ **Solution**:
- Wait 1 minute (rate limit)
- Atau upgrade ke paid tier
- Atau gunakan Vertex AI

### Error: "Permission denied"
✅ **Solution**:
- Check API key permissions
- Enable Generative Language API di Cloud Console

## Quick Fix (Recommended)

Cara tercepat:

```bash
# 1. Buka browser
https://makersuite.google.com/app/apikey

# 2. Login & Create API Key

# 3. Edit .env.local
code .env.local

# 4. Paste API key baru:
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX

# 5. Restart server
# Ctrl+C untuk stop
npm run dev
```

## Security Best Practices

1. **Never commit API keys to git**
   - `.env.local` sudah di `.gitignore` ✅
   - `skilled-compass.json` harus di `.gitignore` ⚠️

2. **Restrict API Key** (di Google Cloud Console)
   - Limit ke specific APIs
   - Add HTTP referrer restrictions
   - Add IP restrictions (production)

3. **Rotate Keys Regularly**
   - Generate new key setiap 90 hari
   - Delete old unused keys

4. **Monitor Usage**
   - Check quota usage di Cloud Console
   - Set up billing alerts

---

Need help? Error masih berlanjut?
- Check console.log di terminal
- Pastikan `.env.local` ter-load (restart server)
- Test API key di: https://aistudio.google.com/app/prompts/new_chat
