/* ==========================================================
   ROYAL CURRY KING — páginas legales
   Pinta el documento (body[data-doc]) en el idioma elegido a
   partir de i18n/legal.js y resalta en el índice la sección
   que se está leyendo. El castellano ya viene en el HTML.
   ========================================================== */
(() => {
'use strict';
const R = window.RCK, DATA = window.RCK_LEGAL;
if (!R || !DATA) return;
const doc = document.body.dataset.doc;
const H = DATA.holder;
const $ = (s) => document.querySelector(s);

const card = () => `<dl class="legal__card">${[
  ['lg.h.legal', H.legal && R.esc(H.legal)],
  ['lg.h.trade', R.esc(H.trade)],
  ['lg.h.nif', H.nif && R.esc(H.nif)],
  ['lg.h.address', R.esc(H.address)],
  ['lg.h.phone', `<a href="tel:${H.tel}">${H.phone}</a>`],
  ['lg.h.email', H.email && `<a href="mailto:${H.email}">${H.email}</a>`],
  ['lg.h.activity', R.t('lg.h.activityV')]
].map(([k, v]) => `<dt>${R.t(k)}</dt><dd>${v || `<span class="pending">${R.t('lg.pending')}</span>`}</dd>`).join('')}</dl>`;

const fill = (html) => html
  .replace('{{holder}}', card())
  .replace('{{cookies}}', `<div data-cookie-table>${R.cookieTable()}</div>`)
  .replace('{{settings}}', `<button type="button" class="btn btn--saffron btn--sm" data-cookie-settings><i class="ph-bold ph-sliders-horizontal" aria-hidden="true"></i><span>${R.t('legal.settings')}</span></button>`);

let io = null;
const spy = () => {
  if (io) io.disconnect();
  const links = [...document.querySelectorAll('.legal__toc a')];
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!secs.length || !('IntersectionObserver' in window)) return;
  const vis = new Set();
  io = new IntersectionObserver((en) => {
    en.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
    const cur = secs.find((s) => vis.has(s));
    if (cur) links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur.id));
  }, { rootMargin: '-20% 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));
};

const render = () => {
  const L = (DATA[R.lang] && DATA[R.lang][doc]) || DATA.es[doc];
  document.title = `${L.t} · Royal Curry King`;
  $('.legal__title').innerHTML = L.h;
  $('.legal__lead').innerHTML = L.lead;
  $('.legal__toc ol').innerHTML = L.s.map((s, i) => `<li><a href="#s${i + 1}">${s[0]}</a></li>`).join('');
  $('.legal__doc').innerHTML = L.s.map((s, i) => `<section id="s${i + 1}"><h2><span class="n">${String(i + 1).padStart(2, '0')}</span>${s[0]}</h2>${fill(s[1])}</section>`).join('');
  spy();
};

render();
document.addEventListener('rck:lang', render);
})();
