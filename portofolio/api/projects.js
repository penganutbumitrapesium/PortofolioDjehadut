'use strict';

const { categories, projects } = require('../data/content');

/**
 * GET /api/projects                  -> semua proyek
 * GET /api/projects?category=website -> proyek dengan kategori tertentu
 * GET /api/projects?slug=run-system  -> satu proyek
 */
module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ ok: false, message: 'Metode tidak diizinkan.' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  const query = req.query || {};
  const slug = typeof query.slug === 'string' ? query.slug : '';
  const category = typeof query.category === 'string' ? query.category : '';

  if (slug) {
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
      return res.status(404).json({ ok: false, message: 'Proyek tidak ditemukan.' });
    }
    return res.status(200).json({ ok: true, project });
  }

  let list = projects;
  if (category && category !== 'semua') {
    list = projects.filter((p) => p.categories.includes(category));
  }

  const withCount = categories.map((c) => ({
    ...c,
    count: projects.filter((p) => p.categories.includes(c.id)).length,
  }));

  return res.status(200).json({
    ok: true,
    count: list.length,
    total: projects.length,
    categories: withCount,
    projects: list,
  });
};
