(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const pageLoadedAt = Date.now();

  const state = {
    projects: [],
    categories: [],
    filter: 'semua',
    lastFocus: null,
  };

  /* ---------- Pembantu ---------- */

  // Membuat elemen dengan aman (memakai textContent, bukan innerHTML).
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') el.className = value;
      else if (key === 'text') el.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child.nodeType ? child : document.createTextNode(child));
    }
    return el;
  }

  async function getJSON(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function categoryLabel(id) {
    const found = state.categories.find((c) => c.id === id);
    return found ? found.label : id;
  }

  /* ---------- Tema ---------- */

  const themeBtn = $('#theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    themeBtn.setAttribute('aria-label', theme === 'light' ? 'Ganti ke mode gelap' : 'Ganti ke mode terang');
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (err) {
      /* penyimpanan tidak tersedia, abaikan */
    }
  });

  /* ---------- Menu mobile ---------- */

  const header = $('#site-header');
  const menuBtn = $('#menu-toggle');

  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Tutup' : 'Menu';
  }

  menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
  $('#nav').addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* ---------- Data situs (kontak dan tautan sosial) ---------- */

  async function loadSite() {
    try {
      const data = await getJSON('/api/site');
      if (!data.links || !data.links.length) return;
      const list = $('#contact-links');
      list.replaceChildren(
        ...data.links.map((link) =>
          h(
            'li',
            {},
            h('span', { text: link.label }),
            h('a', {
              href: link.href,
              text: link.text,
              target: link.id === 'email' ? null : '_blank',
              rel: link.id === 'email' ? null : 'noopener noreferrer',
            })
          )
        )
      );
    } catch (err) {
      /* Email statis di HTML tetap tampil, jadi tidak perlu pesan error. */
    }
  }

  /* ---------- Daftar proyek ---------- */

  const filtersEl = $('#filters');
  const listEl = $('#project-list');
  const statusEl = $('#projects-status');

  function renderFilters() {
    const total = state.projects.length;
    const items = [{ id: 'semua', label: 'Semua', count: total }, ...state.categories];
    filtersEl.replaceChildren(
      ...items.map((item) =>
        h(
          'button',
          {
            class: 'filter-btn',
            type: 'button',
            'data-filter': item.id,
            'aria-pressed': String(item.id === state.filter),
            onclick: () => {
              state.filter = item.id;
              renderFilters();
              renderList();
            },
          },
          item.label,
          h('span', { class: 'filter-count', text: String(item.count) })
        )
      )
    );
  }

  function renderList() {
    const visible =
      state.filter === 'semua'
        ? state.projects
        : state.projects.filter((p) => p.categories.includes(state.filter));

    statusEl.textContent = visible.length
      ? `Menampilkan ${visible.length} dari ${state.projects.length} proyek.`
      : 'Belum ada proyek di kategori ini.';

    listEl.replaceChildren(
      ...visible.map((p) =>
        h(
          'li',
          {},
          h(
            'button',
            {
              class: 'project-row',
              type: 'button',
              'aria-haspopup': 'dialog',
              'data-slug': p.slug,
              onclick: (e) => openProject(p.slug, e.currentTarget),
            },
            h('span', { class: 'pr-year', text: String(p.year) }),
            h('span', { class: 'pr-main' }, h('h3', { class: 'pr-title', text: p.title }), h('p', { class: 'pr-sum', text: p.summary })),
            h('span', { class: 'pr-cats', text: p.categories.map(categoryLabel).join(', ') }),
            h('span', { class: 'pr-icon', 'aria-hidden': 'true', text: '+' })
          )
        )
      )
    );
  }

  async function loadProjects() {
    statusEl.textContent = 'Memuat proyek...';
    try {
      const data = await getJSON('/api/projects');
      state.projects = data.projects || [];
      state.categories = (data.categories || []).filter((c) => c.count > 0);
      renderFilters();
      renderList();
      openFromHash();
    } catch (err) {
      listEl.replaceChildren();
      filtersEl.replaceChildren();
      statusEl.replaceChildren(
        'Proyek belum bisa dimuat. Periksa koneksi lalu coba lagi.',
        h('button', { type: 'button', text: 'Coba lagi', onclick: loadProjects })
      );
    }
  }

  /* ---------- Panel detail proyek ---------- */

  const dialog = $('#project-dialog');
  const panel = $('#dlg-panel');

  function section(title, content) {
    return [h('h3', { text: title }), content];
  }

  function buildPanel(p) {
    const links = [];
    if (p.links && p.links.demo) {
      links.push(h('a', { class: 'btn btn-primary', href: p.links.demo, target: '_blank', rel: 'noopener noreferrer', text: 'Buka demo' }));
    }
    if (p.links && p.links.repo) {
      links.push(h('a', { class: 'btn btn-ghost', href: p.links.repo, target: '_blank', rel: 'noopener noreferrer', text: 'Lihat kode' }));
    }
    links.push(h('a', { class: 'btn btn-ghost', href: '#kontak', text: 'Saya butuh yang serupa', onclick: () => closeDialog() }));

    return [
      h(
        'div',
        { class: 'panel-top' },
        h('h2', { id: 'dlg-title', text: p.title }),
        h('button', { class: 'close-btn', type: 'button', text: 'Tutup', onclick: () => closeDialog() })
      ),
      h('p', { class: 'lead-sum', text: p.summary }),
      h(
        'dl',
        { class: 'meta' },
        h('div', {}, h('dt', { text: 'Peran' }), h('dd', { text: p.role })),
        h('div', {}, h('dt', { text: 'Tahun' }), h('dd', { text: String(p.year) })),
        h('div', {}, h('dt', { text: 'Status' }), h('dd', { text: p.status }))
      ),
      section('Masalah', h('p', { text: p.problem })),
      section('Solusi', h('p', { text: p.solution })),
      section('Fitur dan isi utama', h('ul', { class: 'feature-list' }, p.features.map((f) => h('li', { text: f })))),
      section('Alat dan teknologi', h('ul', { class: 'tags' }, p.stack.map((s) => h('li', { text: s })))),
      section('Hasil', h('p', { text: p.outcome })),
      p.note ? h('p', { class: 'note', text: p.note }) : null,
      h('div', { class: 'panel-links' }, links),
    ];
  }

  function openProject(slug, trigger) {
    const project = state.projects.find((p) => p.slug === slug);
    if (!project) return;
    state.lastFocus = trigger || document.activeElement;
    panel.replaceChildren(...buildPanel(project).flat().filter(Boolean));
    panel.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    try {
      history.replaceState(null, '', `#proyek-${slug}`);
    } catch (err) {
      /* abaikan */
    }
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (location.hash.startsWith('#proyek-')) {
      try {
        history.replaceState(null, '', '#proyek');
      } catch (err) {
        /* abaikan */
      }
    }
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  });

  // Klik di area gelap (di luar panel) menutup panel.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog();
  });

  function openFromHash() {
    const match = location.hash.match(/^#proyek-(.+)$/);
    if (match) openProject(decodeURIComponent(match[1]));
  }

  /* ---------- Formulir kontak ---------- */

  const form = $('#contact-form');
  const submitBtn = $('#form-submit');
  const statusMsg = $('#form-status');

  function setStatus(message, kind) {
    statusMsg.className = `form-status${kind ? ` is-${kind}` : ''}`;
    statusMsg.textContent = message;
  }

  function mailtoFallback(data) {
    const subject = encodeURIComponent(`Proyek ${data.service || ''} dari ${data.name || ''}`.trim());
    const body = encodeURIComponent(`${data.message || ''}\n\n${data.name || ''}\n${data.email || ''}`);
    return `mailto:djehadutbss@gmail.com?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

    if (!form.checkValidity()) {
      const firstBad = form.querySelector(':invalid');
      if (firstBad) {
        firstBad.setAttribute('aria-invalid', 'true');
        firstBad.focus();
      }
      setStatus('Lengkapi dulu kolom yang ditandai, lalu kirim lagi.', 'error');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.elapsed = Date.now() - pageLoadedAt;

    submitBtn.disabled = true;
    setStatus('Mengirim pesan...', '');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        form.reset();
        setStatus('Terima kasih, pesanmu sudah terkirim. Saya akan membalas lewat email.', 'ok');
        return;
      }

      if (result.field) {
        const field = form.elements[result.field];
        if (field) {
          field.setAttribute('aria-invalid', 'true');
          field.focus();
        }
      }
      statusMsg.className = 'form-status is-error';
      statusMsg.replaceChildren(
        `${result.message || 'Pesan belum terkirim.'} `,
        h('a', { href: mailtoFallback(data), text: 'Kirim lewat aplikasi email' })
      );
    } catch (err) {
      statusMsg.className = 'form-status is-error';
      statusMsg.replaceChildren(
        'Koneksi bermasalah, pesan belum terkirim. ',
        h('a', { href: mailtoFallback(data), text: 'Kirim lewat aplikasi email' })
      );
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Mulai ---------- */

  $('#year').textContent = String(new Date().getFullYear());
  loadSite();
  loadProjects();
})();
