/* ==========================================================
   ROYAL CURRY KING — idiomas y cookies
   Compartido por la web y las páginas legales: elige idioma
   (castellano por defecto, ?lang=xx, lo mantiene al navegar),
   traduce los [data-i18n] y muestra el aviso de cookies con
   sus categorías. El mapa de Google solo carga si se acepta.
   ========================================================== */
(() => {
'use strict';

const UI = window.RCK_UI || { es: {} };
const CARTA = window.RCK_CARTA || {};
const LANGS = [
  { c: 'es', n: 'Castellano', loc: 'es-ES' },
  { c: 'ca', n: 'Català', loc: 'ca-ES' },
  { c: 'en', n: 'English', loc: 'en-IE' },
  { c: 'fr', n: 'Français', loc: 'fr-FR' },
  { c: 'de', n: 'Deutsch', loc: 'de-DE' },
  { c: 'hi', n: 'हिन्दी', loc: 'hi-IN' }
];
const CODES = LANGS.map((l) => l.c);
const LANG_KEY = 'rck-lang', CK_KEY = 'rck-consent', CK_AGE = 365 * 864e5;
const me = document.currentScript;
const root = (me && me.dataset.root) || '';

const sget = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
const sset = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
const lget = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lset = (k, v) => { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} };

const readConsent = () => { try { const v = JSON.parse(lget(CK_KEY)); return v && Date.now() - v.t < CK_AGE ? v : null; } catch (e) { return null; } };
let consent = readConsent();

const urlLang = new URLSearchParams(location.search).get('lang');
let lang = [urlLang, sget(LANG_KEY), consent && consent.prefs ? lget(LANG_KEY) : null].find((c) => CODES.includes(c)) || 'es';
sset(LANG_KEY, lang);

/* ----------------------------------------------------------
   TEXTOS
   ---------------------------------------------------------- */
const t = (k, vars) => {
  let s = (UI[lang] && UI[lang][k]) ?? (UI.es && UI.es[k]) ?? k;
  if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
  return s;
};
const tr = (s) => (CARTA.t && CARTA.t[lang] && CARTA.t[lang][s]) || s;
const money = (n) => new Intl.NumberFormat(LANGS.find((l) => l.c === lang).loc, { style: 'currency', currency: 'EUR' }).format(n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* ----------------------------------------------------------
   SELECTOR DE IDIOMA
   ---------------------------------------------------------- */
const paintSwitches = () => {
  const cur = LANGS.find((l) => l.c === lang);
  document.querySelectorAll('[data-lang-switch]').forEach((box) => {
    box.innerHTML = `<button class="lang__btn" type="button" aria-expanded="false" aria-label="${esc(t('lang.change'))} (${cur.n})"><i class="ph-bold ph-globe-simple" aria-hidden="true"></i><span>${cur.c.toUpperCase()}</span><i class="ph-bold ph-caret-down" aria-hidden="true"></i></button>
      <ul class="lang__menu" hidden>${LANGS.map((l) => `<li><button type="button" lang="${l.c}" data-set-lang="${l.c}"${l.c === lang ? ' aria-current="true"' : ''}><b>${l.c.toUpperCase()}</b>${l.n}</button></li>`).join('')}</ul>`;
  });
  document.querySelectorAll('[data-lang-list]').forEach((box) => {
    box.innerHTML = `<span>${t('lang.label')}</span>` + LANGS.map((l) => `<button type="button" lang="${l.c}" data-set-lang="${l.c}"${l.c === lang ? ' aria-current="true"' : ''}>${l.n}</button>`).join('');
  });
};
const closeMenus = () => document.querySelectorAll('.lang__menu:not([hidden])').forEach((m) => { m.hidden = true; m.previousElementSibling.setAttribute('aria-expanded', 'false'); });

const apply = () => {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => el.dataset.i18nAttr.split(';').forEach((p) => {
    const [a, k] = p.split(':'); if (a && k) el.setAttribute(a.trim(), t(k.trim()));
  }));
  paintSwitches();
  if (!ck.hidden) paintBanner();
  document.querySelectorAll('[data-cookie-table]').forEach((el) => { el.innerHTML = cookieTable(); });
  document.dispatchEvent(new CustomEvent('rck:lang', { detail: lang }));
};

const setLang = (c) => {
  if (!CODES.includes(c) || c === lang) return;
  lang = c; sset(LANG_KEY, c);
  if (consent && consent.prefs) lset(LANG_KEY, c);
  try {
    const u = new URL(location.href);
    if (c === 'es') u.searchParams.delete('lang'); else u.searchParams.set('lang', c);
    history.replaceState(history.state, '', u);
  } catch (e) {}
  apply();
};

/* ----------------------------------------------------------
   COOKIES · categorías y lo que se guarda en cada una
   [nombre, proveedor, tipo, duración, finalidad]
   ---------------------------------------------------------- */
const CATS = [
  { k: 'nec', fixed: true, rows: [['rck-consent', 'this', 'ls', 'd12m', 'r.consent'], ['rck-lang', 'this', 'ss', 'dsess', 'r.langs']] },
  { k: 'pref', f: 'prefs', rows: [['rck-lang', 'this', 'ls', 'dpersist', 'r.langl']] },
  { k: 'maps', f: 'maps', rows: [['NID, AEC, SOCS…', 'Google LLC · google.com', 'cookie', 'dgoogle', 'r.google']] }
];
const tableHtml = (cats) => `<div class="ck-table"><table><thead><tr><th>${t('ck.th.name')}</th><th>${t('ck.th.prov')}</th><th>${t('ck.th.type')}</th><th>${t('ck.th.exp')}</th><th>${t('ck.th.purpose')}</th></tr></thead><tbody>${
  cats.map((c) => c.rows.map((r) => `<tr><td><code>${r[0]}</code></td><td>${r[1] === 'this' ? t('ck.this') : r[1]}</td><td>${t('ck.' + r[2])}</td><td>${t('ck.' + r[3])}</td><td>${t('ck.' + r[4])}</td></tr>`).join('')).join('')
}</tbody></table></div>`;
const cookieTable = () => CATS.map((c) => `<h3>${t('ck.c.' + c.k)}</h3><p>${t('ck.c.' + c.k + '.d')}</p>${tableHtml([c])}`).join('');

const applyConsent = () => {
  const maps = !!(consent && consent.maps);
  document.documentElement.classList.toggle('maps-ok', maps);
  document.querySelectorAll('iframe[data-consent-src]').forEach((f) => {
    if (maps && !f.getAttribute('src')) f.src = f.dataset.consentSrc;
    if (!maps && f.getAttribute('src')) { const b = f.cloneNode(false); b.removeAttribute('src'); f.replaceWith(b); }
  });
};

const ck = document.createElement('div');
ck.className = 'ck';
ck.hidden = true;
ck.setAttribute('role', 'dialog');
ck.setAttribute('aria-labelledby', 'ck-t');
ck.setAttribute('aria-describedby', 'ck-p');
let details = false, draft = { prefs: false, maps: false }, lastFocus = null;

const paintBanner = () => {
  ck.innerHTML = `
    <div class="ck__head">
      <p class="ck__t" id="ck-t"><i class="ph-bold ph-cookie" aria-hidden="true"></i>${t('ck.title')}</p>
      <label class="ck__lang"><i class="ph-bold ph-globe-simple" aria-hidden="true"></i><span class="sr">${t('lang.label')}</span>
        <select data-ck-lang>${LANGS.map((l) => `<option value="${l.c}"${l.c === lang ? ' selected' : ''}>${l.n}</option>`).join('')}</select></label>
    </div>
    <p class="ck__p" id="ck-p">${t('ck.text')} <a href="${root}cookies/">${t('ck.more')}</a></p>
    <div class="ck__det"${details ? '' : ' hidden'}>
      ${CATS.map((c) => `<div class="ck__cat">
        <div class="ck__row"><div><b>${t('ck.c.' + c.k)}</b><p>${t('ck.c.' + c.k + '.d')}</p></div>
        ${c.fixed ? `<span class="ck__always">${t('ck.always')}</span>` : `<label class="sw"><input type="checkbox" data-ck-cat="${c.f}"${draft[c.f] ? ' checked' : ''}><span class="sw__ui" aria-hidden="true"></span><span class="sr">${t('ck.c.' + c.k)}</span></label>`}</div>
        <details><summary>${t('ck.list')}</summary>${tableHtml([c])}</details>
      </div>`).join('')}
    </div>
    <div class="ck__btns">
      <button type="button" class="ck__b ck__b--main" data-ck="accept">${t('ck.accept')}</button>
      <button type="button" class="ck__b" data-ck="reject">${t('ck.reject')}</button>
      ${details ? `<button type="button" class="ck__b ck__b--line" data-ck="save">${t('ck.save')}</button>` : ''}
      <button type="button" class="ck__more" data-ck="toggle" aria-expanded="${details}"><i class="ph-bold ph-sliders-horizontal" aria-hidden="true"></i>${t(details ? 'ck.hide' : 'ck.show')}</button>
    </div>`;
};
const openBanner = (withDetails, byUser) => {
  draft = { prefs: !!(consent && consent.prefs), maps: !!(consent && consent.maps) };
  details = !!withDetails;
  paintBanner();
  if (!ck.isConnected) document.body.append(ck);
  lastFocus = byUser ? document.activeElement : null;
  ck.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => ck.classList.add('is-in')));
  if (byUser) (ck.querySelector('[data-ck-cat]') || ck.querySelector('[data-ck="accept"]')).focus({ preventScroll: true });
};
const closeBanner = () => {
  ck.classList.remove('is-in');
  setTimeout(() => { if (!ck.classList.contains('is-in')) ck.hidden = true; }, 450);
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
};
const save = (v) => {
  consent = { prefs: !!v.prefs, maps: !!v.maps, t: Date.now(), v: 1 };
  lset(CK_KEY, JSON.stringify(consent));
  lset(LANG_KEY, consent.prefs ? lang : null);
  applyConsent();
  closeBanner();
};

ck.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ck]'); if (!b) return;
  const a = b.dataset.ck;
  if (a === 'accept') save({ prefs: true, maps: true });
  else if (a === 'reject') save({ prefs: false, maps: false });
  else if (a === 'save') save(draft);
  else if (a === 'toggle') { details = !details; paintBanner(); ck.querySelector('[data-ck="toggle"]').focus(); }
});
ck.addEventListener('change', (e) => {
  if (e.target.matches('[data-ck-cat]')) draft[e.target.dataset.ckCat] = e.target.checked;
  if (e.target.matches('[data-ck-lang]')) { setLang(e.target.value); const s = ck.querySelector('[data-ck-lang]'); if (s) s.focus(); }
});

/* ----------------------------------------------------------
   EVENTOS (delegados: los botones se repintan al cambiar idioma)
   ---------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const sw = e.target.closest('.lang__btn');
  if (sw) {
    const m = sw.nextElementSibling, open = m.hidden;
    closeMenus(); m.hidden = !open; sw.setAttribute('aria-expanded', open);
    if (open) { const c = m.querySelector('[aria-current]'); if (c) c.focus(); }
    return;
  }
  const set = e.target.closest('[data-set-lang]');
  if (set) {
    const box = set.closest('[data-lang-switch]');
    closeMenus(); setLang(set.dataset.setLang);
    if (box) { const b = box.querySelector('.lang__btn'); if (b) b.focus(); }
    return;
  }
  if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); openBanner(true, true); return; }
  if (e.target.closest('[data-map-on]')) { save({ prefs: !!(consent && consent.prefs), maps: true }); return; }
  if (!e.target.closest('.lang__menu')) closeMenus();
});
document.addEventListener('keydown', (e) => {
  const m = document.querySelector('.lang__menu:not([hidden])');
  if (!m) return;
  const items = [...m.querySelectorAll('button')], i = items.indexOf(document.activeElement);
  if (e.key === 'Escape') { closeMenus(); m.previousElementSibling.focus(); }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
  if (e.key === 'Tab' && !m.contains(document.activeElement)) closeMenus();
});
document.addEventListener('focusin', (e) => { const m = document.querySelector('.lang__menu:not([hidden])'); if (m && !m.parentNode.contains(e.target)) closeMenus(); });

window.RCK = {
  t, tr, money, esc, setLang, cookieTable,
  langs: LANGS,
  get lang() { return lang; },
  openCookies: () => openBanner(true, true)
};

apply();
applyConsent();

// el aviso sale al terminar la entrada del mandala (o enseguida si no la hay)
let shown = false;
const firstShow = () => { if (shown) return; shown = true; if (!consent) openBanner(false, false); };
const intro = document.getElementById('intro');
if (intro && intro.parentNode) {
  const mo = new MutationObserver(() => { if (!intro.isConnected) { mo.disconnect(); firstShow(); } });
  mo.observe(intro.parentNode, { childList: true });
  setTimeout(() => { mo.disconnect(); firstShow(); }, 7000);
} else firstShow();
})();
