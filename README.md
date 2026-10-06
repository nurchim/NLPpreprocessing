# Laboratorium Prapemrosesan Teks NLP

Starter project media pembelajaran sinkron untuk membahas preprocessing NLP secara eksperimen menggunakan **GitHub + Vercel**.

## Fitur utama

- **Playground preprocessing** dengan opsi pembersihan, normalisasi, tokenisasi, kata henti, dan stemming.
- **Jejak proses** sehingga mahasiswa dapat melihat perubahan pada setiap tahap.
- **Zona perhatian** untuk menandai potensi kehilangan informasi, misalnya negasi, emoji, dan kapitalisasi.
- **Perbandingan pipeline** untuk skenario minimal, sentimen, NER, dan pembersihan agresif.
- **Tantangan kelas** dengan pola argumentasi Klaim → Bukti → Contoh → Keputusan.
- **GitHub workflow** melalui Issue, Pull Request, dan GitHub Actions.
- **Siap Vercel** sebagai Next.js App Router.
- **SastrawiJs** untuk demonstrasi stemming bahasa Indonesia.

## Menjalankan secara lokal

Persyaratan yang disarankan: Node.js 22 LTS atau versi yang kompatibel dengan Next.js yang digunakan.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Pengujian

```bash
npm test
npm run build
```

## Struktur

```text
app/
  api/preprocess/route.ts   # API preprocessing
  globals.css               # sistem desain UI
  layout.tsx
  page.tsx
components/
  NlpLab.tsx                # seluruh pengalaman belajar interaktif
lib/
  preprocessing.ts          # mesin NLP dan preset pipeline
docs/
  TEACHING-GUIDE.md         # skenario perkuliahan sinkron
  GITHUB-VERCEL.md          # deployment dan workflow kelas
  ISTILAH-UI.md             # pedoman istilah formal
tests/
  preprocessing.test.ts
.github/
  workflows/ci.yml
  pull_request_template.md
```

## Catatan pedagogis

Aplikasi ini sengaja tidak menyatakan satu pipeline sebagai "yang terbaik". Mahasiswa diarahkan untuk menilai pipeline berdasarkan:

1. jenis tugas NLP;
2. karakteristik korpus;
3. informasi yang perlu dipertahankan;
4. hasil eksperimen.

## Catatan stemming dan lisensi

Project memanggil paket `sastrawijs` untuk stemming bahasa Indonesia. Paket tersebut menggunakan pendekatan Sastrawi dan kamus kata dasar terkait. Periksa lisensi paket dan sumber kamus sebelum pemanfaatan di luar konteks pembelajaran atau sebelum redistribusi produk komersial.

## Deployment

Petunjuk lengkap terdapat pada `docs/GITHUB-VERCEL.md`.
