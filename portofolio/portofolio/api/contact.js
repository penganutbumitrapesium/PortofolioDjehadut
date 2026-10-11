'use strict';

const { site } = require('../data/content');
const { normalizeLang } = require('../data/lang');

// Pesan untuk pengunjung, tersedia dalam dua bahasa.
const MSG = {
  id: {
    method: 'Metode tidak diizinkan.',
    unreadable: 'Data yang dikirim tidak terbaca. Coba muat ulang halaman.',
    tooFast: 'Formulir terkirim terlalu cepat. Coba lagi sebentar lagi.',
    rate: 'Terlalu banyak pesan dalam waktu singkat. Coba lagi dalam 10 menit.',
    name: 'Nama minimal 2 huruf.',
    email: 'Format email belum benar.',
    service: 'Pilih jenis layanan yang dibutuhkan.',
    message: 'Pesan minimal 10 karakter.',
    notConfigured: (to) => `Pengiriman otomatis belum aktif. Silakan kirim langsung ke ${to}.`,
    failed: (to) => `Pesan belum terkirim. Silakan kirim langsung ke ${to}.`,
    subject: (service, name) => `[Portofolio] ${service} dari ${name}`,
    heading: 'Pesan baru dari portofolio',
    labels: { name: 'Nama', email: 'Email', service: 'Layanan' },
  },
  en: {
    method: 'Method not allowed.',
    unreadable: 'The data could not be read. Please reload the page.',
    tooFast: 'The form was submitted too quickly. Please try again in a moment.',
    rate: 'Too many messages in a short time. Please try again in 10 minutes.',
    name: 'Name must be at least 2 characters.',
    email: 'The email format is not valid.',
    service: 'Please choose the service you need.',
    message: 'The message must be at least 10 characters.',
    notConfigured: (to) => `Automatic sending is not active yet. Please email ${to} directly.`,
    failed: (to) => `Your message could not be sent. Please email ${to} directly.`,
    subject: (service, name) => `[Portfolio] ${service} from ${name}`,
    heading: 'New message from the portfolio',
    labels: { name: 'Name', email: 'Email', service: 'Service' },
  },
};

const SERVICES = ['Website', 'WordPress', 'Aplikasi', 'Copywriting', 'Lainnya'];

// Pembatas kecepatan sederhana (best effort, tersimpan di memori instance serverless).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

function clean(value, max) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim().slice(0, max) : '';
}

function fail(res, status, message, field) {
  return res.status(status).json({ ok: false, message, field });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, MSG.id.method);
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      body = null;
    }
  }
  if (!body || typeof body !== 'object') {
    return fail(res, 400, MSG.id.unreadable);
  }

  const m = MSG[normalizeLang(body.lang)];

  // Jebakan bot: kolom "website" disembunyikan dari manusia. Bot biasanya mengisinya.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  // Manusia butuh waktu untuk mengisi formulir.
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < 2500) {
    return fail(res, 400, m.tooFast);
  }

  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
  if (rateLimited(ip)) {
    return fail(res, 429, m.rate);
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const service = clean(body.service, 30);
  const message = clean(body.message, 3000);

  if (name.length < 2) return fail(res, 422, m.name, 'name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return fail(res, 422, m.email, 'email');
  }
  if (!SERVICES.includes(service)) return fail(res, 422, m.service, 'service');
  if (message.length < 10) return fail(res, 422, m.message, 'message');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      code: 'EMAIL_NOT_CONFIGURED',
      message: m.notConfigured(site.email),
    });
  }

  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || 'Portofolio <onboarding@resend.dev>';
  const subjectName = name.replace(/[\r\n]+/g, ' ');

  const text = [
    `${m.labels.name}: ${name}`,
    `${m.labels.email}: ${email}`,
    `${m.labels.service}: ${service}`,
    '',
    message,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">${escapeHtml(m.heading)}</h2>
      <p><strong>${escapeHtml(m.labels.name)}:</strong> ${escapeHtml(name)}<br>
         <strong>${escapeHtml(m.labels.email)}:</strong> ${escapeHtml(email)}<br>
         <strong>${escapeHtml(m.labels.service)}:</strong> ${escapeHtml(service)}</p>
      <p style="white-space:pre-wrap;border-left:3px solid #c9a04a;padding-left:12px">${escapeHtml(message)}</p>
    </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: m.subject(service, subjectName),
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('Resend menolak permintaan:', response.status, detail);
      return fail(res, 502, m.failed(site.email));
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Gagal menghubungi Resend:', err);
    return fail(res, 502, m.failed(site.email));
  }
};
