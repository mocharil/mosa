# Markdown Rendering Test

## Format yang Didukung

### Bold Text
Input: `**bold text**`
Output: **bold text**

### Italic Text
Input: `*italic text*` atau `_italic text_`
Output: *italic text*

### Bullet Points
Input:
```
* Item 1
* Item 2
* Item 3
```
Output:
* Item 1
* Item 2
* Item 3

### Bold dalam Bullet Points
Input:
```
* **Kota mana yang Anda maksud?**
* **Pasar mana di kota tersebut yang ingin Anda tuju?**
```
Output:
* **Kota mana yang Anda maksud?**
* **Pasar mana di kota tersebut yang ingin Anda tuju?**

### Links
Input: `[Google](https://google.com)`
Output: [Google](https://google.com)

### Mixed Formatting
Input:
```
Untuk mendaftar JKN, Anda perlu:

* **KTP asli dan fotokopi**
* **Kartu Keluarga**
* Pas foto **3x4** sebanyak *2 lembar*

Silakan kunjungi [BPJS Kesehatan](https://bpjs-kesehatan.go.id) untuk info lebih lanjut.
```

## Implementation

File yang dimodifikasi:
- `app/lib/markdown.tsx` - Parser markdown sederhana
- `app/components/chat/ChatBubble.tsx` - Menggunakan parseMarkdown untuk pesan AI

## Features

✅ Bold text dengan `**text**`
✅ Italic text dengan `*text*` atau `_text_`
✅ Bullet points dengan `*`, `-`, atau `•`
✅ Links dengan `[text](url)`
✅ Mixed formatting (bold + italic dalam bullet points)
✅ Proper spacing dan styling
✅ Only applies to AI messages (user messages tetap plain text)
