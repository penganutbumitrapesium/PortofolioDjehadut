'use strict';

const { site } = require('../data/content');
const { normalizeLang } = require('../data/lang');

const LABELS = {
  id: { email: 'Email', whatsapp: 'WhatsApp', github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram' },
  en: { email: 'Email', whatsapp: 'WhatsApp', github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram' },
};

function bare(url) {
  return String(url).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** GET /api/site -> data kontak dan tautan sosial (hanya yang terisi). */
module.exports = function handler(req, res) {
  const lang = normalizeLang((req.query || {}).lang);

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res
      .status(405)
      .json({ ok: false, message: lang === 'en' ? 'Method not allowed.' : 'Metode tidak diizinkan.' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const labels = LABELS[lang];
  const links = [];

  if (site.email) {
    links.push({ id: 'email', label: labels.email, text: site.email, href: `mailto:${site.email}` });
  }
  if (site.whatsapp) {
    const digits = String(site.whatsapp).replace(/\D/g, '');
    if (digits) {
      links.push({ id: 'whatsapp', label: labels.whatsapp, text: `+${digits}`, href: `https://wa.me/${digits}` });
    }
  }
  if (site.github) {
    links.push({ id: 'github', label: labels.github, text: bare(site.github), href: site.github });
  }
  if (site.linkedin) {
    links.push({ id: 'linkedin', label: labels.linkedin, text: bare(site.linkedin), href: site.linkedin });
  }
  if (site.instagram) {
    links.push({ id: 'instagram', label: labels.instagram, text: bare(site.instagram), href: site.instagram });
  }

  return res.status(200).json({
    ok: true,
    lang,
    name: site.name,
    shortName: site.shortName,
    email: site.email,
    links,
  });
};
