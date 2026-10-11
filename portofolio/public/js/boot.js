/*
 * Dijalankan paling awal (sebelum halaman digambar) supaya tema dan bahasa
 * langsung benar dan layar tidak berkedip.
 *
 * Urutan penentuan bahasa:
 *   1. alamat ?lang=en atau ?lang=id (berguna untuk membagikan tautan)
 *   2. pilihan yang tersimpan dari kunjungan sebelumnya
 *   3. bahasa browser: Indonesia -> id, selain itu -> en
 */
(function () {
  var root = document.documentElement;

  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  } catch (e) {}

  var lang = null;

  try {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl) lang = /^en/i.test(fromUrl) ? 'en' : 'id';
  } catch (e) {}

  if (!lang) {
    try {
      var saved = localStorage.getItem('lang');
      if (saved === 'en' || saved === 'id') lang = saved;
    } catch (e) {}
  }

  if (!lang) {
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'id';
    lang = /^(id|in)/i.test(nav) ? 'id' : 'en';
  }

  root.setAttribute('lang', lang);
})();
