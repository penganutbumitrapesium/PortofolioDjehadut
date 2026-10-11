'use strict';

/**
 * Pembantu dua bahasa (Indonesia "id" dan Inggris "en").
 *
 * Di data/content.js, sebuah teks boleh berupa:
 *   - string biasa            -> sama untuk semua bahasa (misalnya nama proyek)
 *   - { id: '...', en: '...' } -> berbeda per bahasa
 *   - daftar yang sama        -> { id: [...], en: [...] }
 */

const SUPPORTED = ['id', 'en'];
const DEFAULT_LANG = 'id';

function normalizeLang(value) {
  const v = String(value || '').toLowerCase();
  return v.startsWith('en') ? 'en' : DEFAULT_LANG;
}

function isLangObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => SUPPORTED.includes(k));
}

function pick(value, lang) {
  if (Array.isArray(value)) return value.map((item) => pick(item, lang));
  if (isLangObject(value)) {
    const chosen = value[lang] !== undefined ? value[lang] : value[DEFAULT_LANG];
    return pick(chosen, lang);
  }
  return value;
}

// Kolom yang berisi teks untuk dibaca pengunjung.
const TEXT_FIELDS = [
  'title',
  'role',
  'status',
  'summary',
  'problem',
  'solution',
  'features',
  'stack',
  'outcome',
  'note',
];

function localizeProject(project, lang) {
  const out = { ...project };
  for (const field of TEXT_FIELDS) out[field] = pick(project[field], lang);
  return out;
}

function localizeCategories(categories, projects, lang) {
  return categories.map((c) => ({
    id: c.id,
    label: pick(c.label, lang),
    count: projects.filter((p) => p.categories.includes(c.id)).length,
  }));
}

module.exports = {
  SUPPORTED,
  DEFAULT_LANG,
  TEXT_FIELDS,
  normalizeLang,
  pick,
  localizeProject,
  localizeCategories,
};
