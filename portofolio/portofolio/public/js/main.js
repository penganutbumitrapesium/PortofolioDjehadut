(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pageLoadedAt = Date.now();

  const SITE_EMAIL = 'djehadutbss@gmail.com';

  const state = {
    lang: document.documentElement.lang === 'en' ? 'en' : 'id',
    projects: [],
    categories: [],
    filter: 'semua',
    lastFocus: null,
    loadToken: 0,
  };

  // Terjemahan teks tetap, dengan isian variabel seperti {n}.
  const tr = (key, vars) => window.I18N.t(state.lang, key, vars);

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

  function refreshThemeButton() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', tr(light ? 'ui.theme.toDark' : 'ui.theme.toLight'));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    refreshThemeButton();
  }

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

  function refreshMenuButton() {
    const open = header.classList.contains('nav-open');
    menuBtn.textContent = tr(open ? 'ui.menuClose' : 'ui.menu');
  }

  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    refreshMenuButton();
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

  /* ---------- Menyorot menu sesuai bagian yang sedang dibaca ---------- */

  function watchSections() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav-links a');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links) {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    for (const link of links) {
      const target = $(link.getAttribute('href'));
      if (target) observer.observe(target);
    }
  }

  /* ---------- Bahasa ---------- */

  function applyStaticText() {
    document.documentElement.lang = state.lang;

    for (const el of $$('[data-i18n]')) el.textContent = tr(el.dataset.i18n);

    for (const el of $$('[data-i18n-attr]')) {
      for (const pair of el.dataset.i18nAttr.split(';')) {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, tr(key));
      }
    }

    document.title = tr('meta.title');
    const description = $('meta[name="description"]');
    if (description) description.setAttribute('content', tr('meta.desc'));
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', tr('meta.title'));
    const ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', tr('meta.desc'));
    const ogLocale = $('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', state.lang === 'en' ? 'en_US' : 'id_ID');

    for (const btn of $$('.lang-switch button')) {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    }

    refreshThemeButton();
    refreshMenuButton();
  }

  async function setLanguage(next) {
    if (next === state.lang) return;
    state.lang = next;
    try {
      localStorage.setItem('lang', next);
    } catch (err) {
      /* abaikan */
    }
    applyStaticText();
    setFormStatus('', '');
    await Promise.all([loadSite(), loadProjects()]);
  }

  for (const btn of $$('.lang-switch button')) {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  }

  /* ---------- Data situs (kontak dan tautan sosial) ---------- */

  async function loadSite() {
    try {
      const data = await getJSON(`/api/site?lang=${state.lang}`);
      if (!data.links || !data.links.length) return;
      $('#contact-links').replaceChildren(
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
    const items = [{ id: 'semua', label: tr('ui.all'), count: state.projects.length }, ...state.categories];
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
      ? tr('ui.showing', { n: visible.length, total: state.projects.length })
      : tr('ui.none');

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
    const token = ++state.loadToken;
    statusEl.textContent = tr('ui.loading');
    try {
      const data = await getJSON(`/api/projects?lang=${state.lang}`);
      if (token !== state.loadToken) return; // ada permintaan yang lebih baru
      state.projects = data.projects || [];
      state.categories = (data.categories || []).filter((c) => c.count > 0);
      if (state.filter !== 'semua' && !state.categories.some((c) => c.id === state.filter)) {
        state.filter = 'semua';
      }
      renderFilters();
      renderList();
      openFromHash();
    } catch (err) {
      if (token !== state.loadToken) return;
      listEl.replaceChildren();
      filtersEl.replaceChildren();
      statusEl.replaceChildren(tr('ui.loadfail'), h('button', { type: 'button', text: tr('ui.retry'), onclick: loadProjects }));
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
      links.push(h('a', { class: 'btn btn-primary', href: p.links.demo, target: '_blank', rel: 'noopener noreferrer', text: tr('dlg.demo') }));
    }
    if (p.links && p.links.repo) {
      links.push(h('a', { class: 'btn btn-ghost', href: p.links.repo, target: '_blank', rel: 'noopener noreferrer', text: tr('dlg.repo') }));
    }
    links.push(h('a', { class: 'btn btn-ghost', href: '#kontak', text: tr('dlg.similar'), onclick: () => closeDialog() }));

    return [
      h(
        'div',
        { class: 'panel-top' },
        h('h2', { id: 'dlg-title', text: p.title }),
        h('button', { class: 'close-btn', type: 'button', text: tr('dlg.close'), onclick: () => closeDialog() })
      ),
      h('p', { class: 'lead-sum', text: p.summary }),
      h(
        'dl',
        { class: 'meta' },
        h('div', {}, h('dt', { text: tr('dlg.role') }), h('dd', { text: p.role })),
        h('div', {}, h('dt', { text: tr('dlg.year') }), h('dd', { text: String(p.year) })),
        h('div', {}, h('dt', { text: tr('dlg.status') }), h('dd', { text: p.status }))
      ),
      section(tr('dlg.problem'), h('p', { text: p.problem })),
      section(tr('dlg.solution'), h('p', { text: p.solution })),
      section(tr('dlg.features'), h('ul', { class: 'feature-list' }, p.features.map((f) => h('li', { text: f })))),
      section(tr('dlg.stack'), h('ul', { class: 'tags' }, p.stack.map((s) => h('li', { text: s })))),
      section(tr('dlg.outcome'), h('p', { text: p.outcome })),
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
      history.replaceState(null, '', `${location.pathname}${location.search}#proyek-${slug}`);
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
        history.replaceState(null, '', `${location.pathname}${location.search}#proyek`);
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
    if (match && !dialog.open) openProject(decodeURIComponent(match[1]));
  }

  /* ---------- Formulir kontak ---------- */

  const form = $('#contact-form');
  const submitBtn = $('#form-submit');
  const statusMsg = $('#form-status');

  function setFormStatus(message, kind) {
    statusMsg.className = `form-status${kind ? ` is-${kind}` : ''}`;
    statusMsg.textContent = message;
  }

  function mailtoFallback(data) {
    const subject = encodeURIComponent(tr('mail.subject', { service: data.service || '', name: data.name || '' }).trim());
    const body = encodeURIComponent(`${data.message || ''}\n\n${data.name || ''}\n${data.email || ''}`);
    return `mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`;
  }

  function showError(prefix, data) {
    statusMsg.className = 'form-status is-error';
    statusMsg.replaceChildren(`${prefix} `, h('a', { href: mailtoFallback(data), text: tr('form.mail') }));
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
      setFormStatus(tr('form.invalid'), 'error');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.elapsed = Date.now() - pageLoadedAt;
    data.lang = state.lang;

    submitBtn.disabled = true;
    setFormStatus(tr('form.sending'), '');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        form.reset();
        setFormStatus(tr('form.ok'), 'ok');
        return;
      }

      if (result.field) {
        const field = form.elements[result.field];
        if (field) {
          field.setAttribute('aria-invalid', 'true');
          field.focus();
        }
      }
      showError(result.message || tr('form.generic'), data);
    } catch (err) {
      showError(tr('form.netfail'), data);
    } finally {
      submitBtn.disabled = false;
    }
  });

  /* ---------- Mulai ---------- */

  $('#year').textContent = String(new Date().getFullYear());
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  applyStaticText();
  watchSections();
  loadSite();
  loadProjects();
})();
