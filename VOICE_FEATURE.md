# Fitur Percakapan Suara 2 Arah

## Overview
Voice JKN Agent sekarang mendukung percakapan suara dua arah yang natural - Anda bisa berbicara DAN mendengarkan jawaban AI dengan suara!

## Fitur Utama

### 1. **Voice Input**
- Tekan tombol mikrofon untuk mulai berbicara
- AI mendengarkan dan mentranskrip ucapan Anda secara real-time
- Support bahasa Indonesia dan Inggris

### 2. **Voice Output (Text-to-Speech)**
- AI menjawab dengan suara, bukan hanya teks
- Aktivasi/nonaktifkan dengan toggle button di header (ikon speaker)
- Indikator visual ketika AI sedang berbicara
- Suara natural dalam bahasa Indonesia

### 3. **Kontrol Percakapan**
- **Toggle Voice Response**: Icon Volume2/VolumeX di header untuk mengaktifkan/menonaktifkan suara AI
- **Auto-Speak**: Ketika aktif, setiap jawaban AI otomatis dibacakan dengan suara
- **Speaking Indicator**: Muncul di bawah layar saat AI sedang berbicara

## Cara Menggunakan

### Setup Awal
1. Pastikan browser mendukung Web Speech API (Chrome, Edge recommended)
2. Izinkan akses mikrofon saat diminta browser
3. Buka halaman chat

### Aktifkan Suara AI
1. Di halaman chat, lihat header bagian kanan
2. Klik icon **speaker** (VolumeX/Volume2)
3. Ketika aktif (biru): AI akan menjawab dengan suara
4. Ketika nonaktif (abu-abu): AI hanya menjawab dengan teks

### Percakapan Suara
1. **Tekan tombol mikrofon** (besar di tengah bawah)
2. **Mulai berbicara** - Anda akan melihat transkrip real-time
3. **Tekan lagi** untuk berhenti dan kirim pesan
4. **AI akan menjawab dengan teks DAN suara** (jika toggle aktif)
5. **Tunggu AI selesai berbicara** - Anda akan melihat "AI sedang berbicara..."
6. **Ulangi** untuk pertanyaan berikutnya

## Teknologi

### Web Speech API
- **SpeechRecognition**: Untuk mendengarkan dan mentranskrip suara pengguna
- **SpeechSynthesis**: Untuk mengubah teks AI menjadi suara

### Implementation
- `app/hooks/useSpeech.ts` - Hook untuk text-to-speech
- `app/lib/speechRecognition.ts` - Utility functions untuk speech API
- `app/components/voice/SpeakingIndicator.tsx` - Visual indicator saat AI berbicara
- `app/lib/store.ts` - State management untuk autoSpeak setting

## Browser Support

✅ **Fully Supported:**
- Chrome 33+
- Microsoft Edge 79+
- Safari 14.1+

⚠️ **Partial Support:**
- Firefox (Speech Recognition tidak stabil)
- Opera

❌ **Not Supported:**
- IE 11 dan browser lama

## Tips Penggunaan

1. **Gunakan di lingkungan tenang** untuk hasil speech recognition terbaik
2. **Bicara dengan jelas** dan tidak terlalu cepat
3. **Aktifkan autoSpeak** untuk pengalaman percakapan yang lebih natural
4. **Gunakan headphone** jika perlu untuk menghindari feedback
5. **Tunggu AI selesai berbicara** sebelum berbicara lagi

## Troubleshooting

### Suara AI tidak keluar
- Pastikan toggle suara (Volume2) aktif (berwarna biru)
- Cek volume device Anda tidak mute
- Coba refresh halaman

### Mikrofon tidak berfungsi
- Pastikan browser memiliki permission untuk akses mikrofon
- Cek setting mikrofon di sistem operasi
- Coba browser lain (Chrome/Edge recommended)

### Transkrip tidak akurat
- Bicara lebih jelas dan pelan
- Pindah ke lingkungan yang lebih tenang
- Gunakan mikrofon external untuk kualitas lebih baik

## Future Improvements

- [ ] Pilihan suara AI (male/female, pitch, rate)
- [ ] Language auto-detection untuk multi-bahasa dalam satu percakapan
- [ ] Voice activity detection (berhenti otomatis saat selesai bicara)
- [ ] Interrupt capability (stop AI speaking untuk berbicara lagi)
- [ ] Offline support dengan voice models lokal
- [ ] Voice analytics dan insights

## Credits

Powered by:
- **Google Vertex AI** - AI Response Generation
- **Web Speech API** - Voice Input/Output
- **Next.js 14** - Framework
- **React** - UI Components
