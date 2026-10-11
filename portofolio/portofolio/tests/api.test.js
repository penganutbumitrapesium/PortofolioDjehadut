'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { site, categories, projects } = require('../data/content');
const { pick, TEXT_FIELDS, localizeProject } = require('../data/lang');
const projectsApi = require('../api/projects');
const siteApi = require('../api/site');
const contactApi = require('../api/contact');

function call(handler, { method = 'GET', body, query = {}, headers = {} } = {}) {
  return new Promise(async (resolve) => {
    const req = { method, body, query, headers, socket: { remoteAddress: '127.0.0.1' } };
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        resolve(this);
        return this;
      },
    };
    await handler(req, res);
  });
}

/* ---------- Kelengkapan konten dua bahasa ---------- */

test('setiap proyek punya teks Indonesia dan Inggris yang terisi', () => {
  for (const p of projects) {
    for (const lang of ['id', 'en']) {
      const localized = localizeProject(p, lang);
      for (const field of TEXT_FIELDS) {
        if (field === 'note') continue; // catatan boleh kosong
        const value = localized[field];
        const empty = Array.isArray(value) ? value.length === 0 : !String(value || '').trim();
        assert.ok(!empty, `${p.slug}.${field} kosong untuk bahasa ${lang}`);
      }
    }
  }
});

test('versi Inggris tidak sama persis dengan versi Indonesia untuk teks panjang', () => {
  for (const p of projects) {
    for (const field of ['summary', 'problem', 'solution', 'outcome']) {
      assert.notEqual(pick(p[field], 'en'), pick(p[field], 'id'), `${p.slug}.${field} belum diterjemahkan`);
    }
    assert.equal(pick(p.features, 'en').length, pick(p.features, 'id').length, `${p.slug}.features beda jumlah`);
  }
});

test('slug unik dan kategori yang dipakai terdaftar', () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  const ids = categories.map((c) => c.id);
  for (const p of projects) for (const c of p.categories) assert.ok(ids.includes(c), `${p.slug}: kategori ${c}`);
});

/* ---------- API proyek ---------- */

test('GET /api/projects mengembalikan bahasa Indonesia secara bawaan', async () => {
  const res = await call(projectsApi);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.lang, 'id');
  assert.equal(res.body.count, projects.length);
  assert.equal(res.body.categories.find((c) => c.id === 'aplikasi').label, 'Aplikasi');
});

test('GET /api/projects?lang=en mengembalikan bahasa Inggris', async () => {
  const res = await call(projectsApi, { query: { lang: 'en' } });
  assert.equal(res.body.lang, 'en');
  assert.equal(res.body.categories.find((c) => c.id === 'aplikasi').label, 'Applications');
  const kado = res.body.projects.find((p) => p.slug === 'kado-web-interaktif');
  assert.equal(kado.title, 'Interactive Web Gift');
});

test('saring kategori dan ambil satu proyek', async () => {
  const filtered = await call(projectsApi, { query: { category: 'website' } });
  assert.ok(filtered.body.projects.every((p) => p.categories.includes('website')));
  const one = await call(projectsApi, { query: { slug: 'run-system', lang: 'en' } });
  assert.equal(one.body.project.role, 'Designer and developer');
  const missing = await call(projectsApi, { query: { slug: 'tidak-ada' } });
  assert.equal(missing.statusCode, 404);
});

test('metode selain GET ditolak', async () => {
  const res = await call(projectsApi, { method: 'POST' });
  assert.equal(res.statusCode, 405);
});

/* ---------- API situs ---------- */

test('GET /api/site berisi email dan menyembunyikan tautan kosong', async () => {
  const res = await call(siteApi);
  assert.equal(res.body.email, site.email);
  assert.deepEqual(res.body.links.map((l) => l.id), ['email']);
});

/* ---------- API kontak ---------- */

const valid = {
  name: 'Budi',
  email: 'budi@example.com',
  service: 'Website',
  message: 'Saya butuh landing page untuk toko saya.',
  elapsed: 9000,
};

test('kontak: hanya menerima POST', async () => {
  const res = await call(contactApi, { method: 'GET' });
  assert.equal(res.statusCode, 405);
});

test('kontak: jebakan bot dan pengiriman terlalu cepat', async () => {
  const bot = await call(contactApi, { method: 'POST', body: { ...valid, website: 'spam' } });
  assert.equal(bot.statusCode, 200);
  const fast = await call(contactApi, { method: 'POST', body: { ...valid, elapsed: 300 } });
  assert.equal(fast.statusCode, 400);
});

test('kontak: pesan validasi mengikuti bahasa', async () => {
  const headers = { 'x-forwarded-for': '10.0.0.1' };
  const id = await call(contactApi, { method: 'POST', headers, body: { ...valid, email: 'salah', lang: 'id' } });
  assert.equal(id.statusCode, 422);
  assert.equal(id.body.field, 'email');
  assert.match(id.body.message, /Format email/);

  const en = await call(contactApi, { method: 'POST', headers, body: { ...valid, email: 'wrong', lang: 'en' } });
  assert.match(en.body.message, /not valid/);
});

test('kontak: tanpa RESEND_API_KEY memberi 503 yang jelas', async () => {
  delete process.env.RESEND_API_KEY;
  const res = await call(contactApi, { method: 'POST', headers: { 'x-forwarded-for': '10.0.0.2' }, body: { ...valid, lang: 'en' } });
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'EMAIL_NOT_CONFIGURED');
  assert.match(res.body.message, /directly/);
});

test('kontak: mengirim email lewat Resend dengan isi yang aman', async () => {
  process.env.RESEND_API_KEY = 're_test';
  const original = global.fetch;
  let sent;
  global.fetch = async (url, opt) => {
    sent = { url, body: JSON.parse(opt.body) };
    return { ok: true, text: async () => '' };
  };
  try {
    const res = await call(contactApi, {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.3' },
      body: { ...valid, name: '<b>Budi</b>\nBcc: x', lang: 'en' },
    });
    assert.equal(res.statusCode, 200);
    assert.equal(sent.url, 'https://api.resend.com/emails');
    assert.deepEqual(sent.body.to, [site.email]);
    assert.equal(sent.body.reply_to, valid.email);
    assert.match(sent.body.subject, /^\[Portfolio\]/);
    assert.ok(!/[\r\n]/.test(sent.body.subject), 'subjek tidak boleh berisi baris baru');
    assert.ok(sent.body.html.includes('&lt;b&gt;'), 'HTML harus di-escape');
  } finally {
    global.fetch = original;
    delete process.env.RESEND_API_KEY;
  }
});

test('kontak: dibatasi 5 pesan per 10 menit untuk satu IP', async () => {
  const headers = { 'x-forwarded-for': '10.0.0.99' };
  let last;
  for (let i = 0; i < 6; i += 1) {
    last = await call(contactApi, { method: 'POST', headers, body: valid });
  }
  assert.equal(last.statusCode, 429);
});
