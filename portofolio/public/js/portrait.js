/*
 * Gerak halus pada foto di hero:
 *  - kursor menggeser foto sedikit ke arah berlawanan (efek kedalaman)
 *  - bingkai memiringkan diri tipis mengikuti kursor
 *  - cahaya gold mengikuti kursor di atas foto
 *  - saat halaman digulir, foto bergeser lebih lambat dari teks
 * Semua dimatikan otomatis jika pengunjung memilih "kurangi gerakan" di perangkatnya.
 */
(function () {
  'use strict';

  var root = document.getElementById('portrait');
  if (!root) return;

  var frame = root.querySelector('.portrait-frame');
  var hero = document.getElementById('atas');
  if (!frame || !hero) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // batas gerak (piksel dan derajat)
  var MAX_X = 12;
  var MAX_Y = 9;
  var MAX_SCROLL = 14;
  var MAX_TILT = 3.2;

  var target = { x: 0, y: 0, rx: 0, ry: 0 };
  var current = { x: 0, y: 0, rx: 0, ry: 0 };
  var scrollShift = 0;
  var running = false;
  var visible = true;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function render() {
    // mendekati target sedikit demi sedikit supaya geraknya halus
    current.x += (target.x - current.x) * 0.1;
    current.y += (target.y - current.y) * 0.1;
    current.rx += (target.rx - current.rx) * 0.1;
    current.ry += (target.ry - current.ry) * 0.1;

    root.style.setProperty('--px', current.x.toFixed(2) + 'px');
    root.style.setProperty('--py', (current.y + scrollShift).toFixed(2) + 'px');
    root.style.setProperty('--rx', current.rx.toFixed(2) + 'deg');
    root.style.setProperty('--ry', current.ry.toFixed(2) + 'deg');

    var settled =
      Math.abs(target.x - current.x) < 0.05 &&
      Math.abs(target.y - current.y) < 0.05 &&
      Math.abs(target.rx - current.rx) < 0.01 &&
      Math.abs(target.ry - current.ry) < 0.01;

    if (settled) {
      running = false;
    } else {
      requestAnimationFrame(render);
    }
  }

  function kick() {
    if (!running && visible) {
      running = true;
      requestAnimationFrame(render);
    }
  }

  // Gerak mengikuti kursor (hanya perangkat dengan mouse)
  if (hasPointer) {
    hero.addEventListener('pointermove', function (e) {
      var nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 sampai 1
      var ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = clamp(-nx * MAX_X, -MAX_X, MAX_X);
      target.y = clamp(-ny * MAX_Y, -MAX_Y, MAX_Y);
      target.ry = clamp(nx * MAX_TILT, -MAX_TILT, MAX_TILT);
      target.rx = clamp(-ny * MAX_TILT, -MAX_TILT, MAX_TILT);

      var rect = frame.getBoundingClientRect();
      frame.style.setProperty('--mx', e.clientX - rect.left + 'px');
      frame.style.setProperty('--my', e.clientY - rect.top + 'px');
      kick();
    });

    hero.addEventListener('pointerleave', function () {
      target.x = 0;
      target.y = 0;
      target.rx = 0;
      target.ry = 0;
      kick();
    });
  }

  // Gerak saat digulir
  function onScroll() {
    var h = hero.offsetHeight || 1;
    var progress = clamp(window.scrollY / h, 0, 1);
    scrollShift = progress * MAX_SCROLL;
    kick();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hemat baterai: berhenti saat hero tidak terlihat
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(hero);
  }

  onScroll();
})();
