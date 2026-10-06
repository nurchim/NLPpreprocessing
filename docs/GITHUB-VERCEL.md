# GitHub + Vercel untuk Perkuliahan

## 1. Buat repositori GitHub

```bash
git init
git add .
git commit -m "feat: initial NLP preprocessing lab"
git branch -M main
git remote add origin https://github.com/USERNAME/nlp-preprocessing-lab.git
git push -u origin main
```

Aktifkan **Issues** dan **Discussions** pada pengaturan repositori.

## 2. Konfigurasi tautan GitHub di aplikasi

Salin:

```bash
cp .env.example .env.local
```

Ubah nilainya:

```env
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/USERNAME/nlp-preprocessing-lab
```

## 3. Hubungkan ke Vercel

1. Masuk ke Vercel.
2. Pilih **Add New → Project**.
3. Impor repositori GitHub.
4. Framework akan terdeteksi sebagai **Next.js**.
5. Tambahkan Environment Variable `NEXT_PUBLIC_GITHUB_REPO_URL`.
6. Jalankan deployment.

Setiap Pull Request dapat memperoleh versi pratinjau Vercel sehingga dosen dapat membandingkan hasil antarbranch sebelum digabungkan ke `main`.

## 4. Pola kerja mahasiswa

```text
main
 ├─ team-sentiment
 ├─ team-ner
 └─ team-topic
```

Setiap kelompok:

1. membuat branch;
2. mengubah pipeline atau komponen;
3. menjalankan `npm test`;
4. membuat Pull Request;
5. mengisi bagian Klaim → Bukti → Contoh → Keputusan;
6. membuka versi pratinjau Vercel Vercel;
7. meminta kelompok lain memberi review.

## 5. Perintah lokal

```bash
npm install
npm run dev
npm test
npm run build
```

Aplikasi lokal tersedia pada `http://localhost:3000`.
