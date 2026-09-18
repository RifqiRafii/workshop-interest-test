const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const questions = [
  ['Saya menikmati memecahkan masalah dengan langkah-langkah logis.', 'ALGORITMA'],
  ['Saya tertarik memahami cara kerja program di balik layar.', 'ALGORITMA'],
  ['Saya senang mencari pola dari data atau angka.', 'ALGORITMA'],
  ['Saya tertarik membuat algoritma untuk menyelesaikan masalah.', 'ALGORITMA'],
  ['Saya menikmati tantangan yang membutuhkan ketelitian tinggi.', 'ALGORITMA'],
  ['Saya ingin memahami struktur data dan cara mengelola informasi.', 'ALGORITMA'],
  ['Saya merasa puas ketika berhasil memperbaiki error pada program.', 'ALGORITMA'],
  ['Saya suka menguji beberapa cara untuk menemukan solusi paling efisien.', 'ALGORITMA'],
  ['Saya tertarik belajar bahasa pemrograman baru.', 'ALGORITMA'],
  ['Saya nyaman bekerja dengan aturan dan logika yang terstruktur.', 'ALGORITMA'],
  ['Saya ingin membuat halaman web yang dapat digunakan banyak orang.', 'WEBSITE'],
  ['Saya tertarik mempelajari HTML dan CSS.', 'WEBSITE'],
  ['Saya senang melihat perubahan tampilan web setelah mengubah kode.', 'WEBSITE'],
  ['Saya ingin memahami cara kerja website dari browser sampai server.', 'WEBSITE'],
  ['Saya tertarik membuat website yang cepat dan mudah diakses.', 'WEBSITE'],
  ['Saya menikmati menyusun tata letak konten dalam sebuah halaman.', 'WEBSITE'],
  ['Saya ingin mempelajari JavaScript untuk membuat web interaktif.', 'WEBSITE'],
  ['Saya tertarik membangun portofolio atau profil pribadi berbentuk website.', 'WEBSITE'],
  ['Saya senang membandingkan tampilan website di berbagai perangkat.', 'WEBSITE'],
  ['Saya ingin mengubah ide menjadi website yang bisa langsung dicoba.', 'WEBSITE'],
  ['Saya memperhatikan apakah sebuah aplikasi terasa mudah digunakan.', 'UIUX'],
  ['Saya tertarik memahami kebutuhan dan kebiasaan pengguna.', 'UIUX'],
  ['Saya menikmati memilih warna, tipografi, dan ikon untuk sebuah tampilan.', 'UIUX'],
  ['Saya suka membuat sketsa atau rancangan awal sebuah aplikasi.', 'UIUX'],
  ['Saya tertarik menguji desain dengan meminta pendapat orang lain.', 'UIUX'],
  ['Saya memperhatikan jarak, susunan, dan keseimbangan elemen visual.', 'UIUX'],
  ['Saya ingin membuat pengalaman digital yang nyaman dan menyenangkan.', 'UIUX'],
  ['Saya tertarik mempelajari tools desain seperti Figma.', 'UIUX'],
  ['Saya senang menyederhanakan alur yang terasa membingungkan.', 'UIUX'],
  ['Saya dapat menjelaskan alasan di balik pilihan desain saya.', 'UIUX']
];

async function main() {
  await prisma.answer.deleteMany();
  await prisma.hasilRingkasan.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.question.deleteMany();
  await prisma.question.createMany({ data: questions.map(([teks, kategori], index) => ({ teks, kategori, urutan: index + 1 })) });
  console.log(`Seeded ${questions.length} questions.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
