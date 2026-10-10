# Portofolio Fransisco Roberto Djehadut

Website portofolio freelance bertema hitam, putih, dan gold. Terdiri dari dua bagian:

- **Front end** (yang dilihat pengunjung): `public/` berisi HTML, CSS, dan JavaScript murni, tanpa proses build.
- **Back end** (yang bekerja di balik layar): `api/` berisi *serverless function*, yaitu potongan kode kecil yang hanya berjalan saat dipanggil, seperti kasir yang baru bekerja ketika ada pelanggan datang.

## Struktur folder

```
portofolio/
├─ api/
│  ├─ projects.js    GET  /api/projects   daftar proyek, bisa disaring ?category=website
│  ├─ site.js        GET  /api/site       email dan tautan sosial yang terisi
│  └─ contact.js     POST /api/contact    menerima formulir lalu mengirim email
├─ data/
│  └─ content.js     SEMUA konten (profil, kategori, proyek) ada di sini
├─ public/
│  ├─ index.html
│  ├─ css/style.css
│  ├─ js/main.js
│  ├─ favicon.svg
│  └─ robots.txt
├─ vercel.json       pengaturan Vercel (folder output dan header keamanan)
├─ package.json
└─ .env.example      contoh variabel rahasia
```

## Mengubah isi

Buka `data/content.js`.

1. **Tautan sosial**: isi `whatsapp`, `github`, `linkedin`, `instagram` di bagian `site`. Yang dikosongkan otomatis disembunyikan.
   Contoh WhatsApp: `'6281234567890'` (kode negara tanpa tanda plus dan tanpa angka 0 di depan).
2. **Menambah proyek**: salin satu blok di dalam daftar `projects`, ubah isinya, dan pastikan `slug` unik (huruf kecil dan tanda hubung).
3. **Demo dan kode**: isi `links.demo` dan `links.repo` dengan alamat lengkap. Tombolnya akan muncul sendiri.
4. **Kategori**: pakai salah satu dari `aplikasi`, `website`, `bisnis`, `tulisan`, atau tambah kategori baru di daftar `categories`.

Teks layanan, cara kerja, dan "Tentang saya" ada langsung di `public/index.html`.

> Nama perusahaan klien sengaja tidak ditulis di proyek RUN System. Tambahkan hanya jika perusahaan mengizinkan.
> Semua hasil proyek ditulis tanpa angka karangan. Kalau kamu punya angka nyata (misalnya waktu kerja yang terpangkas), tambahkan di kolom `outcome`.

## Menjalankan di laptop

```bash
npm i -g vercel
cd portofolio
vercel dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:3000`). `vercel dev` menjalankan halaman dan API sekaligus. Kalau hanya membuka `index.html` dengan klik dua kali, bagian API tidak akan jalan.

## Deploy ke Vercel

1. Unggah folder ini ke repository GitHub baru.
2. Di Vercel: **Add New, Project**, pilih repository, lalu **Deploy**. Framework Preset biarkan **Other**. Pengaturan lain sudah diatur oleh `vercel.json`.
3. Setiap `git push`, Vercel otomatis memperbarui situs.

Soal paket: situs ini dipakai untuk mencari klien berbayar, jadi aturan Vercel menganggapnya penggunaan komersial. Baca bagian paket (Hobby atau Pro) di vercel.com/pricing sebelum memutuskan.

## Mengaktifkan formulir kontak (email masuk ke kotak suratmu)

Formulir memakai layanan **Resend** untuk mengirim email.

1. Daftar di **resend.com** memakai email `djehadutbss@gmail.com`.
2. Buka **API Keys**, buat satu kunci, lalu salin.
3. Di Vercel: **Project, Settings, Environment Variables**, tambahkan:
   - `RESEND_API_KEY` berisi kunci tadi
4. Klik **Redeploy** supaya variabel terbaca.

Selama belum memakai domain sendiri, Resend hanya mengizinkan pengiriman ke email pemilik akun. Karena kamu mendaftar dengan email yang sama dengan tujuan, ini sudah cukup. Kalau nanti punya domain, verifikasi di Resend lalu isi `CONTACT_FROM`.

Jika kunci belum dipasang, formulir menampilkan pesan yang jelas dan tautan untuk mengirim lewat aplikasi email, jadi pengunjung tidak buntu.

### Perlindungan spam yang sudah dipasang

- Kolom jebakan tersembunyi (bot biasanya mengisinya)
- Formulir yang terkirim kurang dari 2,5 detik setelah halaman dibuka ditolak
- Maksimal 5 pesan per alamat IP dalam 10 menit
- Semua isi pesan di-escape sebelum masuk ke email

## Hal yang sebaiknya kamu lakukan berikutnya

- Isi `github` dan `linkedin` supaya calon klien bisa memeriksa profilmu.
- Tambahkan demo publik untuk proyek yang boleh dilihat umum (isi `links.demo`).
- Setelah punya klien pertama, minta testimoni dan tambahkan seksi baru di `index.html`.
- Pasang domain sendiri di Vercel (Settings, Domains).
