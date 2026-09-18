# README.md — Cara Mulai

## 1. Prasyarat
- Node.js (LTS terbaru, disarankan v20+)
- PostgreSQL (lokal atau cloud, misal Supabase/Railway/Neon)
- npm

## 2. Instalasi

```bash
# 1. Clone / masuk ke folder project
cd project-root

# 2. Install dependency
npm install

# 3. Salin file environment
cp .env.example .env
# lalu isi DATABASE_URL dan SESSION_SECRET di .env

# 4. Jalankan migrasi database (bikin tabel sesuai SCHEMA.md)
npx prisma migrate dev

# 5. Isi data awal pertanyaan (seed)
npx prisma db seed

# 6. (opsional) Buat akun admin pertama
node scripts/create-admin.js
```

## 3. Menjalankan di Local

```bash
npm run dev
```
Buka `http://localhost:3000` untuk halaman peserta, dan `http://localhost:3000/admin` untuk halaman admin.

## 4. Struktur Folder Singkat
Lihat detail lengkap di `ARCHITECTURE.md`. Ringkasnya:
- `src/routes` — routing halaman peserta & admin
- `src/services/scoringService.js` — logika hitung skor & bidang dominan
- `prisma/schema.prisma` — struktur tabel database
- `src/views` — file tampilan (.ejs)

## 5. Dokumen Lain di Project Ini
| File | Isi |
|---|---|
| `PRD.md` | Apa yang dibangun |
| `ARCHITECTURE.md` | Bagaimana caranya (stack, alur, keamanan) |
| `SCHEMA.md` | Struktur data/tabel |
| `RULES.md` | Aturan bisnis, apa boleh & tidak boleh |
| `DESAIN.md` | Tampilan & alur halaman |

## 6. Deploy (Singkat)
1. Siapkan database PostgreSQL di hosting pilihan.
2. Set environment variable (`DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`) di hosting.
3. Jalankan `npx prisma migrate deploy` di server production.
4. Pastikan HTTPS aktif (biasanya otomatis di hosting seperti Railway/Render, atau lewat reverse proxy seperti Nginx + Let's Encrypt kalau pakai VPS).

> Detail platform hosting belum ditentukan — isi bagian ini lebih lanjut setelah platform dipilih.