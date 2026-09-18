# README.md — Cara Mulai

ITC - Minatku adalah website tes minat bidang workshop milik UKMFT ITC.

## 1. Prasyarat
- Node.js LTS (disarankan v20+)
- MySQL 8+ (lokal melalui Laragon/XAMPP/Docker, atau cloud)
- npm

Pastikan service MySQL sudah berjalan sebelum menjalankan migration Prisma.

## 2. Instalasi

```bash
# 1. Masuk ke folder project
cd D:\laragon\www\workshop-interest-test

# 2. Install dependency
npm install

# 3. Buat file environment
Copy-Item .env.example .env
# Edit .env, lalu sesuaikan username/password MySQL dan SESSION_SECRET.
# Contoh jika MySQL Laragon memakai password:
# DATABASE_URL="mysql://root:password@localhost:3306/workshop_interest_test"
# Jika root tidak memakai password:
# DATABASE_URL="mysql://root@localhost:3306/workshop_interest_test"

# 4. Buat database kosong MySQL terlebih dahulu.
#    Jalankan SQL berikut di MySQL Console atau phpMyAdmin:
mysql -u root -p -e "CREATE DATABASE workshop_interest_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Generate Prisma Client
npx prisma generate

# 6. Jalankan migration (membuat tabel sesuai SCHEMA.md)
npx prisma migrate dev --name init

# 7. Isi 30 pertanyaan awal
npx prisma db seed

# 8. Buat akun admin pertama
node scripts/create-admin.js admin password-lokal
```

> Pada PowerShell, perintah `Copy-Item` digunakan untuk menyalin `.env.example`. Jika database sudah pernah dimigrasikan, gunakan `npx prisma migrate deploy` hanya untuk menerapkan migration yang sudah ada; jangan membuat migration `init` kedua.

## 3. Menjalankan di Local

```bash
npm run dev
```
Buka `http://localhost:3000` untuk halaman peserta, dan `http://localhost:3000/admin` untuk halaman admin.

Login admin menggunakan username dan password yang dibuat pada langkah sebelumnya.

## 4. Perintah Database

```bash
# Cek status koneksi dan migration
npx prisma migrate status

# Membuka Prisma Studio untuk melihat data
npx prisma studio

# Menjalankan seed ulang (menghapus data peserta dan pertanyaan lama)
npx prisma db seed
```

## 5. Struktur Folder Singkat
Lihat detail lengkap di `ARCHITECTURE.md`. Ringkasnya:
- `src/routes` — routing halaman peserta & admin
- `src/services/scoringService.js` — logika hitung skor & bidang dominan
- `prisma/schema.prisma` — struktur tabel database
- `src/views` — file tampilan (.ejs)

## 6. Dokumen Lain di Project Ini
| File | Isi |
|---|---|
| `PRD.md` | Apa yang dibangun |
| `ARCHITECTURE.md` | Bagaimana caranya (stack, alur, keamanan) |
| `SCHEMA.md` | Struktur data/tabel |
| `RULES.md` | Aturan bisnis, apa boleh & tidak boleh |
| `DESAIN.md` | Tampilan & alur halaman |

## 7. Deploy (Singkat)
1. Siapkan database MySQL di hosting pilihan.
2. Set environment variable (`DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`) di hosting.
3. Jalankan `npx prisma migrate deploy` di server production.
4. Pastikan HTTPS aktif (biasanya otomatis di hosting seperti Railway/Render, atau lewat reverse proxy seperti Nginx + Let's Encrypt kalau pakai VPS).

> Detail platform hosting belum ditentukan — isi bagian ini lebih lanjut setelah platform dipilih.
