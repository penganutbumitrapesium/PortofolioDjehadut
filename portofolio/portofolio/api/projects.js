'use strict';

const { categories, projects } = require('../data/content');
const { normalizeLang, localizeProject, localizeCategories } = require('../data/lang');

const MESSAGES = {
  id: { method: 'Metode tidak diizinkan.', notFound: 'Proyek tidak ditemukan.' },
  en: { method: 'Method not allowed.', notFound: 'Project not found.' },
};

/**
 * GET /api/projects                         -> semua proyek (bahasa Indonesia)
 * GET /api/projects?lang=en                 -> semua proyek dalam bahasa Inggris
 * GET /api/projects?category=website        -> saring per kategori
 * GET /api/projects?slug=run-system&lang=en -> satu proyek
 */
module.exports = function handler(req, res) {
  const query = req.query || {};
  const lang = normalizeLang(query.lang);
  const text = MESSAGES[lang];

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ ok: false, message: text.method });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const slug = typeof query.slug === 'string' ? query.slug : '';
  const category = typeof query.category === 'string' ? query.category : '';

  if (slug) {
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
      return res.status(404).json({ ok: false, message: text.notFound });
    }
    return res.status(200).json({ ok: true, lang, project: localizeProject(project, lang) });
  }

  let list = projects;
  if (category && category !== 'semua') {
    list = projects.filter((p) => p.categories.includes(category));
  }

  return res.status(200).json({
    ok: true,
    lang,
    count: list.length,
    total: projects.length,
    categories: localizeCategories(categories, projects, lang),
    projects: list.map((p) => localizeProject(p, lang)),
  });
};
