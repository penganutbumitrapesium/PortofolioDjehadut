# Portofolio Fransisco Roberto Djehadut (versi 2, dua bahasa)

Website portofolio freelance bertema hitam, putih, dan gold, dalam **Bahasa Indonesia dan English**.

- **Front end** (yang dilihat pengunjung): `public/`, berisi HTML, CSS, dan JavaScript murni, tanpa proses build.
- **Back end** (yang bekerja di balik layar): `api/`, berisi *serverless function*, yaitu potongan kode kecil yang hanya berjalan saat dipanggil, seperti kasir yang baru bekerja ketika ada pelanggan datang.

## Struktur folder

```
portofolio/
├─ api/
│  ├─ projects.js    GET  /api/projects?lang=en   daftar proyek per bahasa, bisa disaring ?category=website
│  ├─ site.js        GET  /api/site?lang=en       email dan tautan sosial yang terisi
│  └─ contact.js     POST /api/contact            menerima formulir lalu mengirim email (pesan error ikut bahasa)
├─ data/
│  ├─ content.js     SEMUA konten proyek dan kontak, ditulis dua bahasa
│  └─ lang.js        pemilih bahasa (id/en) yang dipakai API
├─ public/
│  ├─ index.html
│  ├─ css/style.css
│  └─ js/
│     ├─ boot.js     menentukan tema dan bahasa sebelum halaman digambar
│     ├─ i18n.js     kamus teks tetap dua bahasa
│     └─ main.js     logika halaman
├─ tests/api.test.js uji otomatis (termasuk cek kelengkapan terjemahan)
├─ dev-server.js     server lokal tanpa akun Vercel
├─ vercel.json       pengaturan Vercel (folder output, header keamanan)
├─ package.json
└─ .env.example      contoh variabel rahasia
```

## Cara kerja pilihan bahasa

Bahasa ditentukan dengan urutan ini:

1. Alamat `?lang=en` atau `?lang=id`. Berguna untuk membagikan tautan, misalnya `namakamu.com/?lang=en` untuk klien luar negeri.
2. Pilihan yang tersimpan dari kunjungan sebelumnya (tombol **ID | EN** di pojok kanan atas).
3. Bahasa browser pengunjung: Indonesia tampil Indonesia, selain itu tampil English.

Terjemahannya ditulis manual, bukan terjemahan mesin saat halaman dibuka, jadi kualitasnya terjaga dan tidak tergantung layanan luar.

## Mengubah isi

**Proyek, kategori, dan tautan sosial**: buka `data/content.js`.

- Setiap teks yang dibaca pengunjung ditulis `{ id: '...', en: '...' }`. Kalau sama di kedua bahasa (misalnya nama teknologi), tulis string biasa.
- Daftar (fitur, teknologi) ditulis `{ id: [...], en: [...] }`.
- Menambah proyek: salin satu blok di `projects`, ubah isinya, dan pastikan `slug` unik (huruf kecil dan tanda hubung).
- Tautan sosial: isi `whatsapp`, `github`, `linkedin`, `instagram` di bagian `site`. Yang dikosongkan otomatis disembunyikan. Contoh WhatsApp: `'6281234567890'`.
- Demo dan kode: isi `links.demo` dan `links.repo`, tombolnya muncul sendiri.

**Teks tetap (hero, layanan, cara kerja, tentang, formulir)**: buka `public/js/i18n.js`, ubah kedua bahasa. Kalau menambah elemen baru di `index.html`, beri atribut `data-i18n="kunci"` lalu tulis kuncinya di kedua bahasa.

**Cek terjemahan**: jalankan `npm test`. Uji otomatis akan gagal kalau ada proyek yang belum punya terjemahan Inggris.

> Nama perusahaan klien sengaja tidak ditulis di proyek RUN System. Tambahkan hanya jika perusahaan mengizinkan.
> Hasil proyek ditulis tanpa angka karangan. Kalau punya angka nyata, tambahkan di kolom `outcome`.

## Menjalankan di laptop

Pilih salah satu:

```bash
npm start        # tanpa akun Vercel, buka http://localhost:3000
npm run dev      # memakai Vercel CLI (butuh login Vercel)
```

`npm start` menyajikan halaman dan menjalankan semua API, jadi daftar proyek dan formulir ikut berfungsi. Kalau `.env.local` berisi `RESEND_API_KEY`, formulir benar-benar mengirim email.

## Deploy dan pembaruan ke Vercel

Proyek sudah terhubung ke GitHub, jadi cukup kirim perubahan:

```bash
git add .
git commit -m "pesan singkat tentang perubahan"
git push
```

Vercel otomatis memasang versi baru dalam sekitar satu menit. Root Directory di Vercel harus tetap `portofolio` bila folder ini berada di dalam repository.

## Mengaktifkan formulir kontak (email masuk ke kotak suratmu)

1. Daftar di **resend.com** memakai email `djehadutbss@gmail.com`.
2. Buka **API Keys**, buat satu kunci, lalu salin.
3. Di Vercel: **Project, Settings, Environment Variables**, tambahkan `RESEND_API_KEY` berisi kunci itu.
4. **Redeploy** supaya variabel terbaca.

Selama belum memakai domain sendiri, Resend hanya mengizinkan pengiriman ke email pemilik akun. Karena kamu mendaftar dengan email yang sama dengan tujuan, itu sudah cukup. Kalau nanti punya domain, verifikasi di Resend lalu isi `CONTACT_FROM`.

Jika kunci belum dipasang, formulir menampilkan pesan yang jelas dan tautan untuk mengirim lewat aplikasi email, jadi pengunjung tidak buntu.

### Perlindungan yang sudah dipasang

- Kolom jebakan tersembunyi untuk bot, penolakan formulir yang terkirim kurang dari 2,5 detik setelah halaman dibuka, dan batas 5 pesan per IP dalam 10 menit.
- Semua isi pesan di-escape sebelum masuk ke email, dan judul email dibersihkan dari baris baru.
- Header keamanan di `vercel.json`, termasuk Content-Security-Policy yang hanya mengizinkan skrip dari situsmu sendiri dan font dari Google Fonts. Kalau suatu hari kamu menambah skrip dari luar (misalnya analitik), alamatnya harus ditambahkan ke `script-src` dan `connect-src` di file itu.

## Langkah berikutnya yang disarankan

- Isi `github` dan `linkedin` supaya calon klien bisa memeriksa profilmu.
- Tambahkan demo publik untuk proyek yang boleh dilihat umum.
- Setelah punya klien pertama, minta testimoni dan tambahkan seksi baru.
- Pasang domain sendiri di Vercel (Settings, Domains).
