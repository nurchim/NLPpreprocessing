# Panduan Perkuliahan Sinkron — Prapemrosesan Teks NLP

## Tujuan
Mahasiswa tidak hanya menghafal tahap preprocessing, tetapi mampu menjelaskan **mengapa** suatu tahap digunakan, **informasi apa** yang berpotensi hilang, dan **bagaimana** membuktikan keputusan melalui eksperimen.

## Pola aktivitas
**Prediksi → Proses → Amati → Jelaskan → Revisi**

## Skenario 100 menit

| Waktu | Aktivitas | Peran dosen | Peran mahasiswa |
|---|---|---|---|
| 00–10 | Pemantik | Menampilkan teks nyata | Mengidentifikasi masalah |
| 10–25 | Prediksi dan demo | Menjalankan laboratorium interaktif | Memprediksi hasil terlebih dahulu |
| 25–45 | Diskusi kelompok | Memoderasi | Mendesain pipeline berdasarkan tugas NLP |
| 45–70 | Eksperimen GitHub | Meninjau PR | Mengubah konfigurasi/kode dan memberi bukti |
| 70–90 | Perbandingan Vercel | Membuka versi pratinjau Vercel | Membandingkan hasil pada teks yang sama |
| 90–100 | Exit ticket | Memberi pertanyaan refleksi | Menulis kesimpulan individual |

## Pertanyaan pemantik
1. Apakah huruf kapital selalu boleh diubah menjadi huruf kecil?
2. Apakah kata "tidak" layak dimasukkan ke daftar kata henti?
3. Apakah emoji adalah derau pada analisis sentimen?
4. Apakah `3-0` sebaiknya dipecah menjadi `3`, `-`, `0`?
5. Apakah stemming selalu membantu NER?
6. Apakah tagar hanya simbol atau dapat menjadi satu unit semantik?

## Pola argumentasi
Setiap jawaban kelompok menggunakan struktur:

1. **Klaim** — keputusan yang diambil.
2. **Bukti** — hasil eksperimen atau karakteristik tugas NLP.
3. **Contoh** — teks nyata sebelum dan sesudah diproses.
4. **Keputusan** — pilihan akhir beserta batas penggunaannya.

## Exit ticket
- Satu preprocessing yang sebelumnya Anda anggap selalu perlu, tetapi sekarang Anda ragukan.
- Satu contoh preprocessing yang dapat menghilangkan informasi penting.
- Lengkapi: "Pipeline preprocessing terbaik adalah ..."
