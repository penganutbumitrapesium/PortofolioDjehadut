'use strict';

/**
 * SATU-SATUNYA TEMPAT UNTUK MENGEDIT KONTEN.
 * Halaman web membaca data ini lewat API (/api/site dan /api/projects).
 * Kosongkan string ("") untuk tautan yang belum kamu punya, nanti otomatis disembunyikan.
 */

const site = {
  name: 'Fransisco Roberto Djehadut',
  shortName: 'Hin',
  email: 'djehadutbss@gmail.com',
  // Isi nomor dengan format internasional tanpa tanda plus, contoh: '6281234567890'
  whatsapp: '',
  github: '',     // contoh: 'https://github.com/usernamekamu'
  linkedin: '',   // contoh: 'https://www.linkedin.com/in/usernamekamu'
  instagram: '',  // contoh: 'https://www.instagram.com/usernamekamu'
};

const categories = [
  { id: 'aplikasi', label: 'Aplikasi' },
  { id: 'website', label: 'Website' },
  { id: 'bisnis', label: 'Bisnis' },
  { id: 'tulisan', label: 'Tulisan' },
];

const projects = [
  {
    slug: 'run-system',
    title: 'RUN System',
    year: 2026,
    categories: ['aplikasi'],
    role: 'Perancang dan pengembang',
    status: 'Siap serah terima',
    summary:
      'Sistem pencatat dan penganalisis hubungan dengan peserta event komunitas, dari data mentah Google Form sampai laporan bulanan.',
    problem:
      'Setelah setiap event selesai, data peserta masih diolah manual dari file CSV. Prosesnya lambat, mudah salah, dan sulit dipakai untuk menilai apakah sebuah event benar-benar efektif.',
    solution:
      'Aplikasi web analitik (Analytical CRM, yaitu sistem yang menganalisis data pelanggan untuk membantu keputusan) dengan dua peran pengguna. Staff mengelola kontak dan tindak lanjut harian, Manager memantau dashboard dan laporan bulanan.',
    features: [
      'Pendaftaran tiga langkah: data akun, syarat dan ketentuan, lalu verifikasi kode OTP (kode sekali pakai) lewat email',
      'Akun baru otomatis berstatus Staff dan menunggu persetujuan Manager',
      'Kata sandi disimpan terenkripsi dengan bcrypt, bukan teks biasa',
      'Pipeline kontak dengan edit langsung per baris, tautan WhatsApp, dan satu klik untuk menandai "Dihubungi"',
      'Pencarian global serta pengingat tindak lanjut untuk kontak yang lama tidak disentuh',
      'Laporan bulanan dari gabungan beberapa sesi event, dengan ekspor Excel dan PDF berlogo',
      'Log aktivitas dan tempat sampah, hapus permanen harus mengetik "HAPUS" lebih dulu',
    ],
    stack: ['Python', 'Streamlit', 'SQLite', 'bcrypt', 'ReportLab', 'Docker', 'Git'],
    outcome:
      'Sudah diuji langsung oleh tim komunitas dan manajer. Aplikasi dikemas dengan Docker (kotak pengemas aplikasi) supaya bisa dipasang di server cukup dengan Git pull dan menjalankan image.',
    note: 'Kode bersifat privat. Demo bisa diberikan atas permintaan.',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'netraflow',
    title: 'NetraFlow',
    year: 2026,
    categories: ['bisnis'],
    role: 'Technical Lead dan System Architect, tim Audible Enterprise',
    status: 'Finalis INSPIRE 1.0',
    summary:
      'Konsep produk teknologi inklusif untuk penyandang disabilitas dan lansia, dibawa sampai tahap final kompetisi rencana bisnis.',
    problem:
      'Tema kompetisi menantang peserta menurunkan hambatan fisik dan sosial bagi kelompok yang sering tertinggal dalam layanan digital, yaitu penyandang disabilitas dan lansia.',
    solution:
      'Saya merancang arsitektur sistem tiga lapisan (Decision, Execution, dan BI atau Business Intelligence, yaitu analisis data untuk keputusan) sekaligus ikut menyusun laporan final dan bahan presentasi.',
    features: [
      'Subtema Inclusive Technology pada INSPIRE 1.0 Business Plan Competition',
      'Laporan final: analisis pasar dan kompetitor, Business Model Canvas, SWOT, strategi pemasaran, anggaran, proyeksi keuangan, dan mitigasi risiko',
      'Model bisnis freemium untuk pengguna dan lisensi untuk instansi pemerintah',
      'Pitch deck dan video presentasi untuk juri',
    ],
    stack: ['Arsitektur sistem', 'Business Model Canvas', 'Analisis keuangan', 'Pitch'],
    outcome:
      'Masuk daftar finalis Business Plan Competition INSPIRE 1.0 dan menyelesaikan laporan final serta presentasi.',
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'alpha-core',
    title: 'Alpha Core',
    year: 2026,
    categories: ['bisnis', 'website'],
    role: 'Perancang konsep dan kehadiran digital',
    status: 'Dalam persiapan',
    summary:
      'Fondasi brand digital untuk perusahaan jasa ERP berbasis Odoo, termasuk konsep komunitas pengguna Odoo.',
    problem:
      'Perusahaan jasa baru perlu tampil kredibel dan punya cara menjangkau perusahaan yang sudah memakai Odoo (ERP, yaitu sistem terpadu untuk mengelola keuangan, stok, dan penjualan).',
    solution:
      'Menyusun kerangka kehadiran digital: profil perusahaan, pemilihan domain profesional, rencana iklan, dan konsep komunitas yang merangkul pengguna Odoo.',
    features: [
      'Layanan yang dirumuskan: implementasi ERP, konsultasi, kustomisasi sistem, pelatihan pengguna, dan dukungan teknis',
      'Konsep event Founding 100 Business Community: 100 perusahaan founding member, pelatihan mingguan, dan business clinic (sesi konsultasi bisnis)',
      'Alur program dari kesadaran masalah sampai proyek berbayar dan referral',
    ],
    stack: ['Odoo ERP', 'Domain dan DNS', 'Google Ads', 'Strategi komunitas'],
    outcome:
      'Kerangka kerja dan alur program sudah tersusun. Website dan peluncuran komunitas menjadi tahap berikutnya.',
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'kado-web-interaktif',
    title: 'Kado Web Interaktif',
    year: 2026,
    categories: ['website'],
    role: 'Perancang dan pengembang',
    status: 'Selesai',
    summary:
      'Hadiah berupa satu aplikasi web multi-layar yang bisa dimainkan, dibuat khusus untuk satu orang.',
    problem:
      'Ucapan lewat pesan singkat terasa biasa saja dan cepat terlupakan.',
    solution:
      'Satu halaman web interaktif dengan beberapa layar yang dibuka bertahap, ditulis murni dengan HTML, CSS, dan JavaScript tanpa perlu server.',
    features: [
      'Hitung mundur (countdown) menuju momen penting',
      'Permainan kartu mengingat pasangan (memory card game)',
      'Kuis bahasa Jawa',
      'Modul belajar dengan kemajuan terkunci, bagian berikutnya terbuka setelah bagian sebelumnya selesai',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    outcome:
      'Menunjukkan kemampuan membuat pengalaman web yang interaktif dan personal. Pola yang sama bisa dipakai untuk kampanye brand, undangan digital, atau kuis pelanggan.',
    note: 'Berisi konten pribadi sehingga tidak ditampilkan untuk umum.',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'setidaknya-jangan-hiraukan-rasa',
    title: 'Setidaknya Jangan Hiraukan Rasa',
    year: 2026,
    categories: ['tulisan', 'website'],
    role: 'Penulis dan perancang',
    status: 'Selesai',
    summary:
      'Antologi puisi berbahasa Indonesia, dalam dua bentuk: naskah siap terbit dan pengalaman membaca di web.',
    problem:
      'Puisi biasanya berhenti sebagai file dokumen. Padahal cara sebuah teks ditampilkan ikut menentukan bagaimana ia dirasakan pembaca.',
    solution:
      'Naskah ditata untuk penerbit, lalu dibuatkan versi web bertema gelap yang terasa seperti membuka buku di ruangan sepi.',
    features: [
      'Naskah siap terbit berformat A5 dengan lima bagian yang mengikuti alur emosi',
      'Versi baca di web dengan ilustrasi SVG (gambar vektor yang tetap tajam di layar apa pun)',
      'Efek teks muncul perlahan saat halaman digulir',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'SVG', 'DOCX'],
    outcome:
      'Satu karya tulis yang tampil rapi di dua media, cetak dan layar. Contoh nyata kemampuan menulis sekaligus merancang tampilannya.',
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'smart-tumbler-modular',
    title: 'Smart Tumbler Modular',
    year: 2026,
    categories: ['bisnis'],
    role: 'Anggota kelompok, dokumen dan ilustrasi prototipe',
    status: 'Tugas ide bisnis',
    summary:
      'Konsep tumbler dengan alas pemanas USB yang bisa dilepas dan kipas pendingin mini di tutupnya.',
    problem:
      'Orang yang membawa makanan dan minuman sering butuh menghangatkan atau mendinginkannya tanpa membawa banyak perangkat.',
    solution:
      'Satu produk modular: alas pemanas bisa dipakai sendiri untuk makanan atau digabung dengan tumbler untuk minuman, sedangkan kipas mini di tutup mendinginkan isi lewat satu tombol di pegangan.',
    features: [
      'Alas pemanas berdaya USB yang dapat dilepas',
      'Kipas pendingin mini di tutup, diaktifkan dari tombol di pegangan',
      'Profil produk dan template branding (warna, logo, tagline)',
      'Ilustrasi prototipe dari empat sudut: depan, urai, samping, dan atas',
      'Laporan kebutuhan, konsep produk, dan analisis pasar',
    ],
    stack: ['Riset pasar', 'Branding', 'Model keuangan', 'Ilustrasi prototipe'],
    outcome:
      'Paket dokumen lengkap untuk tugas Ide Bisnis dan Financial Model, dikerjakan bersama kelompok lintas jurusan.',
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'manunggal',
    title: 'Manunggal dan Sudut Pandang Kawan-nya',
    year: 2026,
    categories: ['tulisan'],
    role: 'Penulis',
    status: 'Dalam penyempurnaan',
    summary:
      'Antologi naratif tentang satu hari di Bandung, saat seorang tokoh bertemu lima belas temannya.',
    problem:
      'Tantangan utamanya menjaga lima belas pertemuan tetap terasa berbeda dan hidup, bukan seperti daftar yang diulang.',
    solution:
      'Setiap bab diberi struktur berbeda, dan peralihan antarbab ditulis sebagai prosa dan puisi yang memakai detail lingkungan serta suasana batin tokoh.',
    features: [
      'Lima belas pertemuan dalam satu hari',
      'Perpaduan prosa dan puisi',
      'Detail tempat dan suasana yang menjembatani antarbab',
    ],
    stack: ['Penulisan naratif', 'Puisi', 'Penyuntingan'],
    outcome:
      'Naskah terus direvisi. Proyek ini mengasah kemampuan bercerita yang sama dipakai untuk copywriting.',
    note: '',
    links: { demo: '', repo: '' },
  },
];

module.exports = { site, categories, projects };
