'use strict';

const { site } = require('../data/content');

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
    return fail(res, 405, 'Metode tidak diizinkan.');
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
    return fail(res, 400, 'Data yang dikirim tidak terbaca. Coba muat ulang halaman.');
  }

  // Jebakan bot: kolom "website" disembunyikan dari manusia. Bot biasanya mengisinya.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  // Manusia butuh waktu untuk mengisi formulir.
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < 2500) {
    return fail(res, 400, 'Formulir terkirim terlalu cepat. Coba lagi sebentar lagi.');
  }

  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
  if (rateLimited(ip)) {
    return fail(res, 429, 'Terlalu banyak pesan dalam waktu singkat. Coba lagi dalam 10 menit.');
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const service = clean(body.service, 30);
  const message = clean(body.message, 3000);

  if (name.length < 2) return fail(res, 422, 'Nama minimal 2 huruf.', 'name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return fail(res, 422, 'Format email belum benar.', 'email');
  }
  if (!SERVICES.includes(service)) return fail(res, 422, 'Pilih jenis layanan yang dibutuhkan.', 'service');
  if (message.length < 10) return fail(res, 422, 'Pesan minimal 10 karakter.', 'message');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      code: 'EMAIL_NOT_CONFIGURED',
      message: `Pengiriman otomatis belum aktif. Silakan kirim langsung ke ${site.email}.`,
    });
  }

  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || 'Portofolio <onboarding@resend.dev>';
  const subjectName = name.replace(/[\r\n]+/g, ' ');

  const text = [
    `Nama: ${name}`,
    `Email: ${email}`,
    `Layanan: ${service}`,
    '',
    message,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">Pesan baru dari portofolio</h2>
      <p><strong>Nama:</strong> ${escapeHtml(name)}<br>
         <strong>Email:</strong> ${escapeHtml(email)}<br>
         <strong>Layanan:</strong> ${escapeHtml(service)}</p>
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
        subject: `[Portofolio] ${service} dari ${subjectName}`,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('Resend menolak permintaan:', response.status, detail);
      return fail(res, 502, `Pesan belum terkirim. Silakan kirim langsung ke ${site.email}.`);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Gagal menghubungi Resend:', err);
    return fail(res, 502, `Pesan belum terkirim. Silakan kirim langsung ke ${site.email}.`);
  }
};
