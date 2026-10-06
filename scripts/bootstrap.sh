#!/usr/bin/env bash
set -euo pipefail

echo "[1/3] Memasang dependensi..."
npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "[2/3] .env.local dibuat. Silakan isi NEXT_PUBLIC_GITHUB_REPO_URL."
else
  echo "[2/3] .env.local sudah tersedia."
fi

echo "[3/3] Menjalankan pengujian..."
npm test

echo "Selesai. Jalankan: npm run dev"
