'use strict';

const { site } = require('../data/content');

/** GET /api/site -> data kontak dan tautan sosial (hanya yang terisi). */
module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ ok: false, message: 'Metode tidak diizinkan.' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const links = [];
  if (site.email) {
    links.push({ id: 'email', label: 'Email', text: site.email, href: `mailto:${site.email}` });
  }
  if (site.whatsapp) {
    const digits = String(site.whatsapp).replace(/\D/g, '');
    if (digits) {
      links.push({ id: 'whatsapp', label: 'WhatsApp', text: `+${digits}`, href: `https://wa.me/${digits}` });
    }
  }
  if (site.github) {
    links.push({ id: 'github', label: 'GitHub', text: site.github.replace(/^https?:\/\//, ''), href: site.github });
  }
  if (site.linkedin) {
    links.push({ id: 'linkedin', label: 'LinkedIn', text: site.linkedin.replace(/^https?:\/\//, ''), href: site.linkedin });
  }
  if (site.instagram) {
    links.push({ id: 'instagram', label: 'Instagram', text: site.instagram.replace(/^https?:\/\//, ''), href: site.instagram });
  }

  return res.status(200).json({
    ok: true,
    name: site.name,
    shortName: site.shortName,
    email: site.email,
    links,
  });
};
