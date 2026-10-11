'use strict';

/**
 * SATU-SATUNYA TEMPAT UNTUK MENGEDIT KONTEN PROYEK DAN KONTAK.
 *
 * Halaman web membaca data ini lewat API (/api/site dan /api/projects).
 * Teks yang tampil ke pengunjung ditulis dua bahasa:  { id: '...', en: '...' }
 * Kalau sebuah teks sama untuk kedua bahasa (misalnya nama teknologi), tulis string biasa.
 *
 * Kosongkan string ("") untuk tautan yang belum kamu punya, nanti otomatis disembunyikan.
 */

const site = {
  name: 'Fransisco Roberto Djehadut',
  shortName: 'Hin',
  email: 'djehadutbss@gmail.com',
  // Isi nomor dengan format internasional tanpa tanda plus, contoh: '6281234567890'
  whatsapp: '',
  github: '', // contoh: 'https://github.com/usernamekamu'
  linkedin: '', // contoh: 'https://www.linkedin.com/in/usernamekamu'
  instagram: '', // contoh: 'https://www.instagram.com/usernamekamu'
};

const categories = [
  { id: 'aplikasi', label: { id: 'Aplikasi', en: 'Applications' } },
  { id: 'website', label: { id: 'Website', en: 'Websites' } },
  { id: 'bisnis', label: { id: 'Bisnis', en: 'Business' } },
  { id: 'tulisan', label: { id: 'Tulisan', en: 'Writing' } },
];

const projects = [
  {
    slug: 'run-system',
    title: 'RUN System',
    year: 2026,
    categories: ['aplikasi'],
    role: { id: 'Perancang dan pengembang', en: 'Designer and developer' },
    status: { id: 'Siap serah terima', en: 'Ready for handover' },
    summary: {
      id: 'Sistem pencatat dan penganalisis hubungan dengan peserta event komunitas, dari data mentah Google Form sampai laporan bulanan.',
      en: 'A system for tracking and analyzing relationships with community event participants, from raw Google Form data to monthly reports.',
    },
    problem: {
      id: 'Setelah setiap event selesai, data peserta masih diolah manual dari file CSV. Prosesnya lambat, mudah salah, dan sulit dipakai untuk menilai apakah sebuah event benar-benar efektif.',
      en: 'After every event, participant data was still processed by hand from CSV files. It was slow, error-prone, and hard to use for judging whether an event was truly effective.',
    },
    solution: {
      id: 'Aplikasi web analitik (Analytical CRM, yaitu sistem yang menganalisis data pelanggan untuk membantu keputusan) dengan dua peran pengguna. Staff mengelola kontak dan tindak lanjut harian, Manager memantau dashboard dan laporan bulanan.',
      en: 'A web analytics application (an Analytical CRM, a system that analyzes customer data to support decisions) with two user roles. Staff manage daily contacts and follow-ups, while Managers monitor the dashboard and monthly reports.',
    },
    features: {
      id: [
        'Pendaftaran tiga langkah: data akun, syarat dan ketentuan, lalu verifikasi kode OTP (kode sekali pakai) lewat email',
        'Akun baru otomatis berstatus Staff dan menunggu persetujuan Manager',
        'Kata sandi disimpan terenkripsi dengan bcrypt, bukan teks biasa',
        'Pipeline kontak dengan edit langsung per baris, tautan WhatsApp, dan satu klik untuk menandai "Dihubungi"',
        'Pencarian global serta pengingat tindak lanjut untuk kontak yang lama tidak disentuh',
        'Laporan bulanan dari gabungan beberapa sesi event, dengan ekspor Excel dan PDF berlogo',
        'Log aktivitas dan tempat sampah, hapus permanen harus mengetik "HAPUS" lebih dulu',
      ],
      en: [
        'Three-step registration: account details, terms and conditions, then email verification with an OTP (one-time password)',
        'New accounts start as Staff and wait for Manager approval',
        'Passwords are stored encrypted with bcrypt, never as plain text',
        'A contact pipeline with inline row editing, WhatsApp links, and one click to mark "Contacted"',
        'Global search and follow-up reminders for contacts that have gone quiet',
        'Monthly reports combining several event sessions, with branded Excel and PDF export',
        'An activity log and a recycle bin; permanent deletion requires typing "HAPUS" first',
      ],
    },
    stack: ['Python', 'Streamlit', 'SQLite', 'bcrypt', 'ReportLab', 'Docker', 'Git'],
    outcome: {
      id: 'Sudah diuji langsung oleh tim komunitas dan manajer. Aplikasi dikemas dengan Docker (kotak pengemas aplikasi) supaya bisa dipasang di server cukup dengan Git pull dan menjalankan image.',
      en: 'Tested directly by the community team and the manager. The app is packaged with Docker (a shipping container for software) so it can be installed on a server with just a Git pull and by running the image.',
    },
    note: {
      id: 'Kode bersifat privat. Demo bisa diberikan atas permintaan.',
      en: 'The code is private. A demo is available on request.',
    },
    links: { demo: '', repo: '' },
  },
  {
    slug: 'netraflow',
    title: 'NetraFlow',
    year: 2026,
    categories: ['bisnis'],
    role: {
      id: 'Technical Lead dan System Architect, tim Audible Enterprise',
      en: 'Technical Lead and System Architect, team Audible Enterprise',
    },
    status: { id: 'Finalis INSPIRE 1.0', en: 'INSPIRE 1.0 finalist' },
    summary: {
      id: 'Konsep produk teknologi inklusif untuk penyandang disabilitas dan lansia, dibawa sampai tahap final kompetisi rencana bisnis.',
      en: 'An inclusive technology product concept for people with disabilities and the elderly, taken all the way to the final round of a business plan competition.',
    },
    problem: {
      id: 'Tema kompetisi menantang peserta menurunkan hambatan fisik dan sosial bagi kelompok yang sering tertinggal dalam layanan digital, yaitu penyandang disabilitas dan lansia.',
      en: 'The competition challenged participants to reduce physical and social barriers for groups often left behind in digital services: people with disabilities and the elderly.',
    },
    solution: {
      id: 'Saya merancang arsitektur sistem tiga lapisan (Decision, Execution, dan BI atau Business Intelligence, yaitu analisis data untuk keputusan) sekaligus ikut menyusun laporan final dan bahan presentasi.',
      en: 'I designed a three-layer system architecture (Decision, Execution, and BI, or Business Intelligence, meaning data analysis for decision-making) and helped write the final report and presentation materials.',
    },
    features: {
      id: [
        'Subtema Inclusive Technology pada INSPIRE 1.0 Business Plan Competition',
        'Laporan final: analisis pasar dan kompetitor, Business Model Canvas, SWOT, strategi pemasaran, anggaran, proyeksi keuangan, dan mitigasi risiko',
        'Model bisnis freemium untuk pengguna dan lisensi untuk instansi pemerintah',
        'Pitch deck dan video presentasi untuk juri',
      ],
      en: [
        'Inclusive Technology sub-theme in the INSPIRE 1.0 Business Plan Competition',
        'Final report: market and competitor analysis, Business Model Canvas, SWOT, marketing strategy, budget, financial projections, and risk mitigation',
        'Business model: freemium for users and licensing for government institutions',
        'Pitch deck and presentation video for the judges',
      ],
    },
    stack: {
      id: ['Arsitektur sistem', 'Business Model Canvas', 'Analisis keuangan', 'Pitch'],
      en: ['System architecture', 'Business Model Canvas', 'Financial analysis', 'Pitching'],
    },
    outcome: {
      id: 'Masuk daftar finalis Business Plan Competition INSPIRE 1.0 dan menyelesaikan laporan final serta presentasi.',
      en: 'Made the finalist list of the INSPIRE 1.0 Business Plan Competition and completed the final report and presentation.',
    },
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'alpha-core',
    title: 'Alpha Core',
    year: 2026,
    categories: ['bisnis', 'website'],
    role: {
      id: 'Perancang konsep dan kehadiran digital',
      en: 'Concept and digital presence designer',
    },
    status: { id: 'Dalam persiapan', en: 'In preparation' },
    summary: {
      id: 'Fondasi brand digital untuk perusahaan jasa ERP berbasis Odoo, termasuk konsep komunitas pengguna Odoo.',
      en: 'The digital foundation for an Odoo-based ERP services company, including a concept for an Odoo user community.',
    },
    problem: {
      id: 'Perusahaan jasa baru perlu tampil kredibel dan punya cara menjangkau perusahaan yang sudah memakai Odoo (ERP, yaitu sistem terpadu untuk mengelola keuangan, stok, dan penjualan).',
      en: 'A new service company needs to look credible and have a way to reach businesses that already use Odoo (ERP, an integrated system for managing finance, inventory, and sales).',
    },
    solution: {
      id: 'Menyusun kerangka kehadiran digital: profil perusahaan, pemilihan domain profesional, rencana iklan, dan konsep komunitas yang merangkul pengguna Odoo.',
      en: 'Building the framework for a digital presence: company profile, professional domain selection, an ad plan, and a community concept that brings Odoo users together.',
    },
    features: {
      id: [
        'Layanan yang dirumuskan: implementasi ERP, konsultasi, kustomisasi sistem, pelatihan pengguna, dan dukungan teknis',
        'Konsep event Founding 100 Business Community: 100 perusahaan founding member, pelatihan mingguan, dan business clinic (sesi konsultasi bisnis)',
        'Alur program dari kesadaran masalah sampai proyek berbayar dan referral',
      ],
      en: [
        'Defined services: ERP implementation, consulting, system customization, user training, and technical support',
        'Event concept Founding 100 Business Community: 100 founding member companies, weekly training, and a business clinic (a consulting session)',
        'A program flow from problem awareness to paid projects and referrals',
      ],
    },
    stack: {
      id: ['Odoo ERP', 'Domain dan DNS', 'Google Ads', 'Strategi komunitas'],
      en: ['Odoo ERP', 'Domain and DNS', 'Google Ads', 'Community strategy'],
    },
    outcome: {
      id: 'Kerangka kerja dan alur program sudah tersusun. Website dan peluncuran komunitas menjadi tahap berikutnya.',
      en: 'The framework and program flow are in place. The website and community launch are the next stage.',
    },
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'kado-web-interaktif',
    title: { id: 'Kado Web Interaktif', en: 'Interactive Web Gift' },
    year: 2026,
    categories: ['website'],
    role: { id: 'Perancang dan pengembang', en: 'Designer and developer' },
    status: { id: 'Selesai', en: 'Completed' },
    summary: {
      id: 'Hadiah berupa satu aplikasi web multi-layar yang bisa dimainkan, dibuat khusus untuk satu orang.',
      en: 'A gift in the form of a multi-screen web app you can play with, made for one person.',
    },
    problem: {
      id: 'Ucapan lewat pesan singkat terasa biasa saja dan cepat terlupakan.',
      en: 'A message sent as a short text feels ordinary and is quickly forgotten.',
    },
    solution: {
      id: 'Satu halaman web interaktif dengan beberapa layar yang dibuka bertahap, ditulis murni dengan HTML, CSS, dan JavaScript tanpa perlu server.',
      en: 'A single interactive web page with several screens that unlock step by step, written in pure HTML, CSS, and JavaScript with no server needed.',
    },
    features: {
      id: [
        'Hitung mundur (countdown) menuju momen penting',
        'Permainan kartu mengingat pasangan (memory card game)',
        'Kuis bahasa Jawa',
        'Modul belajar dengan kemajuan terkunci, bagian berikutnya terbuka setelah bagian sebelumnya selesai',
      ],
      en: [
        'A countdown to an important moment',
        'A memory card matching game',
        'A Javanese language quiz',
        'A learning module with locked progress, where the next part opens after the previous one is finished',
      ],
    },
    stack: ['HTML', 'CSS', 'JavaScript'],
    outcome: {
      id: 'Menunjukkan kemampuan membuat pengalaman web yang interaktif dan personal. Pola yang sama bisa dipakai untuk kampanye brand, undangan digital, atau kuis pelanggan.',
      en: 'Shows the ability to build interactive, personal web experiences. The same approach works for brand campaigns, digital invitations, or customer quizzes.',
    },
    note: {
      id: 'Berisi konten pribadi sehingga tidak ditampilkan untuk umum.',
      en: 'Contains personal content, so it is not shown publicly.',
    },
    links: { demo: '', repo: '' },
  },
  {
    slug: 'setidaknya-jangan-hiraukan-rasa',
    title: 'Setidaknya Jangan Hiraukan Rasa',
    year: 2026,
    categories: ['tulisan', 'website'],
    role: { id: 'Penulis dan perancang', en: 'Writer and designer' },
    status: { id: 'Selesai', en: 'Completed' },
    summary: {
      id: 'Antologi puisi berbahasa Indonesia, dalam dua bentuk: naskah siap terbit dan pengalaman membaca di web.',
      en: 'A poetry anthology in Indonesian, in two forms: a publication-ready manuscript and a reading experience on the web.',
    },
    problem: {
      id: 'Puisi biasanya berhenti sebagai file dokumen. Padahal cara sebuah teks ditampilkan ikut menentukan bagaimana ia dirasakan pembaca.',
      en: 'Poetry usually ends up as a document file. Yet the way a text is displayed shapes how readers feel it.',
    },
    solution: {
      id: 'Naskah ditata untuk penerbit, lalu dibuatkan versi web bertema gelap yang terasa seperti membuka buku di ruangan sepi.',
      en: 'The manuscript is laid out for a publisher, then paired with a dark-themed web version that feels like opening a book in a quiet room.',
    },
    features: {
      id: [
        'Naskah siap terbit berformat A5 dengan lima bagian yang mengikuti alur emosi',
        'Versi baca di web dengan ilustrasi SVG (gambar vektor yang tetap tajam di layar apa pun)',
        'Efek teks muncul perlahan saat halaman digulir',
      ],
      en: [
        'A publication-ready A5 manuscript with five sections that follow an emotional arc',
        'A web reading version with SVG illustrations (vector graphics that stay sharp on any screen)',
        'Text that fades in gently as the page is scrolled',
      ],
    },
    stack: ['HTML', 'CSS', 'JavaScript', 'SVG', 'DOCX'],
    outcome: {
      id: 'Satu karya tulis yang tampil rapi di dua media, cetak dan layar. Contoh nyata kemampuan menulis sekaligus merancang tampilannya.',
      en: 'One piece of writing that looks polished in two media, print and screen. A concrete example of writing skill together with design of its presentation.',
    },
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'smart-tumbler-modular',
    title: 'Smart Tumbler Modular',
    year: 2026,
    categories: ['bisnis'],
    role: {
      id: 'Anggota kelompok, dokumen dan ilustrasi prototipe',
      en: 'Group member, documents and prototype illustrations',
    },
    status: { id: 'Tugas ide bisnis', en: 'Business idea assignment' },
    summary: {
      id: 'Konsep tumbler dengan alas pemanas USB yang bisa dilepas dan kipas pendingin mini di tutupnya.',
      en: 'A modular tumbler concept with a detachable USB-powered heating base and a mini cooling fan in the lid.',
    },
    problem: {
      id: 'Orang yang membawa makanan dan minuman sering butuh menghangatkan atau mendinginkannya tanpa membawa banyak perangkat.',
      en: 'People who carry food and drinks often need to warm or cool them without carrying several devices.',
    },
    solution: {
      id: 'Satu produk modular: alas pemanas bisa dipakai sendiri untuk makanan atau digabung dengan tumbler untuk minuman, sedangkan kipas mini di tutup mendinginkan isi lewat satu tombol di pegangan.',
      en: 'One modular product: the heating base can be used alone for food or attached to the tumbler for drinks, while the mini fan in the lid cools the contents at the press of a button on the handle.',
    },
    features: {
      id: [
        'Alas pemanas berdaya USB yang dapat dilepas',
        'Kipas pendingin mini di tutup, diaktifkan dari tombol di pegangan',
        'Profil produk dan template branding (warna, logo, tagline)',
        'Ilustrasi prototipe dari empat sudut: depan, urai, samping, dan atas',
        'Laporan kebutuhan, konsep produk, dan analisis pasar',
      ],
      en: [
        'A detachable USB-powered heating base',
        'A mini cooling fan in the lid, activated from a button on the handle',
        'Product profile and branding template (colors, logo, tagline)',
        'Prototype illustrations from four angles: front, exploded, side, and top',
        'Report on needs, product concept, and market analysis',
      ],
    },
    stack: {
      id: ['Riset pasar', 'Branding', 'Model keuangan', 'Ilustrasi prototipe'],
      en: ['Market research', 'Branding', 'Financial model', 'Prototype illustration'],
    },
    outcome: {
      id: 'Paket dokumen lengkap untuk tugas Ide Bisnis dan Financial Model, dikerjakan bersama kelompok lintas jurusan.',
      en: 'A complete document package for the Business Idea and Financial Model assignment, produced with a cross-major group.',
    },
    note: '',
    links: { demo: '', repo: '' },
  },
  {
    slug: 'manunggal',
    title: 'Manunggal dan Sudut Pandang Kawan-nya',
    year: 2026,
    categories: ['tulisan'],
    role: { id: 'Penulis', en: 'Writer' },
    status: { id: 'Dalam penyempurnaan', en: 'Being refined' },
    summary: {
      id: 'Antologi naratif tentang satu hari di Bandung, saat seorang tokoh bertemu lima belas temannya.',
      en: 'A narrative anthology about one day in Bandung, as a character meets fifteen friends.',
    },
    problem: {
      id: 'Tantangan utamanya menjaga lima belas pertemuan tetap terasa berbeda dan hidup, bukan seperti daftar yang diulang.',
      en: 'The main challenge is keeping fifteen encounters feeling different and alive rather than like a repeated list.',
    },
    solution: {
      id: 'Setiap bab diberi struktur berbeda, dan peralihan antarbab ditulis sebagai prosa dan puisi yang memakai detail lingkungan serta suasana batin tokoh.',
      en: "Each chapter has a different structure, and the transitions between chapters are written as prose and poetry using details of the surroundings and the character's inner state.",
    },
    features: {
      id: [
        'Lima belas pertemuan dalam satu hari',
        'Perpaduan prosa dan puisi',
        'Detail tempat dan suasana yang menjembatani antarbab',
      ],
      en: [
        'Fifteen encounters in a single day',
        'A blend of prose and poetry',
        'Details of place and mood that bridge the chapters',
      ],
    },
    stack: {
      id: ['Penulisan naratif', 'Puisi', 'Penyuntingan'],
      en: ['Narrative writing', 'Poetry', 'Editing'],
    },
    outcome: {
      id: 'Naskah terus direvisi. Proyek ini mengasah kemampuan bercerita yang sama dipakai untuk copywriting.',
      en: 'The manuscript is still being revised. This project sharpens the same storytelling skill used in copywriting.',
    },
    note: '',
    links: { demo: '', repo: '' },
  },
];

module.exports = { site, categories, projects };
