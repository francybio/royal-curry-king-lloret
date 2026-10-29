/* ==========================================================
   ROYAL CURRY KING — interacciones
   Mandala de entrada, especias flotantes que esquivan el
   cursor, tiffin de acero que se monta piso a piso con la
   cuenta, carta con la tabla de curris, galería de arcos.
   Carta y precios: su tienda en Glovo (octubre de 2026).
   Textos en 6 idiomas con site.js (RCK.t / RCK.tr): los datos
   de la carta siguen en castellano y se traducen al pintarlos.
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGSAP && !reduced;
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const R = window.RCK || { t: (k) => k, tr: (s) => s, money: (n) => n.toFixed(2).replace('.', ',') + ' €', lang: 'es' };
const t = (k, v) => R.t(k, v), tr = (x) => R.tr(x);
const eur = (n) => R.money(n);
const CURRY = (window.RCK_CARTA || {}).curry || {};
const cfg = () => CURRY[R.lang] || CURRY.es;
const IMG = (f) => 'assets/img/' + f;
const NS = 'http://www.w3.org/2000/svg';

/* ----------------------------------------------------------
   CARTA
   t: hot = picante · fire = muy picante · cream = cremoso · veg
   ---------------------------------------------------------- */
const SAUCES = [
  { n: 'Tikka masala', d: 'Horneado en el tandoor y bañado en salsa con especias del Himalaya', p: [13.9, 15.9, 15.9], c: '#D9662B' },
  { n: 'A la mantequilla', d: 'Salsa cremosa de tomate maduro, mantequilla y nata', p: [13.9, 15.9, 15.9], c: '#E58A3A', t: ['cream'] },
  { n: 'Korma', d: 'Salsa curry, coco, polvo de almendras y nata', p: [12.9, 14.9, 14.9], c: '#EBC277', t: ['cream'] },
  { n: 'Al mango', d: 'Salsa de mango, polvo de almendras, especias y nata', p: [13.9, 15.9, 15.9], c: '#F2B33D', t: ['cream'] },
  { n: 'Curry', d: 'Salsa curry y especias secretas del Himalaya', p: [12.9, 14.9, 14.9], c: '#B8642A' },
  { n: 'Curry con champiñones', d: 'Salsa curry, champiñones y especias del Himalaya', p: [13.9, 15.9, 15.9], c: '#9C6436' },
  { n: 'Saag', d: 'Salsa de tomate, espinacas y especias tradicionales', p: [14.9, 16.9, 16.9], c: '#4F7A2E' },
  { n: 'Jalfrezi', d: 'Pimiento rojo y verde, cebolla, salsa de tomate y especias', p: [14.9, 16.9, 16.9], c: '#C2452E' },
  { n: 'Bhuna', d: 'Cocido con tomate, cebolla, pimiento rojo y verde, y especias', p: [14.9, 16.9, 16.9], c: '#A9442A' },
  { n: 'Balti', d: 'Garbanzos, pimiento rojo y verde, cebolla, curry, tomate y especias', p: [14.9, 16.9, 16.9], c: '#B5532C' },
  { n: 'Kashmiri', d: 'Salsa de tomate, macedonia de frutas y especias tradicionales', p: [14.9, 16.9, 16.9], c: '#D9773F' },
  { n: 'Karahi', d: 'Tomate, curry, pimiento rojo y verde, cebolla y especias tradicionales', p: [15.9, 16.9, 16.9], c: '#A63A26' },
  { n: 'Madras', d: 'Al estilo madrás, picante', p: [12.9, 14.9, 14.9], c: '#B12F22', t: ['hot'] },
  { n: 'Vindaloo', d: 'Al estilo de Goa, muy picante', p: [14.9, 16.9, 16.9], c: '#8E1F17', t: ['fire'] }
];
const VEG = [
  { n: 'Saag paneer', d: 'Espinacas y paneer (queso indio) en salsa cremosa con especias', p: 14.9, c: '#5E8A3A', t: ['veg', 'cream'] },
  { n: 'Shahi paneer', d: 'Paneer, salsa cremosa de tomate y nata', p: 13.9, c: '#E39A55', t: ['veg', 'cream'] },
  { n: 'Mutter paneer', d: 'Paneer y guisantes en salsa cremosa de tomate', p: 13.9, c: '#D98A3E', t: ['veg', 'cream'] },
  { n: 'Malai kofta', d: 'Albóndigas vegetales, patata y paneer en salsa cremosa con almendra', p: 13.9, c: '#E4B067', t: ['veg', 'cream'] },
  { n: 'Saag aloo', d: 'Espinacas y patatas en salsa cremosa con especias', p: 13.9, c: '#6A8A36', t: ['veg'] },
  { n: 'Baingan bharta', d: 'Berenjenas especiadas con sofrito de cebolla, guisantes y tomate', p: 13.9, c: '#7A4A3A', t: ['veg'] },
  { n: 'Saag', d: 'Espinacas en salsa cremosa con especias', p: 13.9, c: '#4F7A2E', t: ['veg'] },
  { n: 'Chana masala', d: 'Garbanzos con salsa de tomate y cebolla especiada', p: 12.9, c: '#C0782F', t: ['veg'] },
  { n: 'Dal tadka', d: 'Lentejas guisadas con asafétida, comino y tomate', p: 12.9, c: '#E1A92C', t: ['veg'] },
  { n: 'Dal makhani', d: 'Lentejas negras a fuego lento con mantequilla y tomate', p: 12.9, c: '#6E3B26', t: ['veg', 'cream'] },
  { n: 'Navratan korma', d: 'Verduras con salsa curry, coco, frutos secos y nata', p: 12.9, c: '#E8C27A', t: ['veg', 'cream'] },
  { n: 'Bombay aloo', d: 'Patatas salteadas con comino, curry y cilantro', p: 12.9, c: '#D9A23A', t: ['veg'] },
  { n: 'Bhaji de champiñones', d: 'Champiñones con ajo, jengibre y especias', p: 12.9, c: '#8C6440', t: ['veg'] },
  { n: 'Mix sabji', d: 'Verduras salteadas con ajo, tomate, curry y especias', p: 12.9, c: '#B66A2E', t: ['veg'] }
];
const TANDOOR = [
  { n: 'Royal Curry Mix Grill (8 uds.)', d: 'Pollo tikka, pollo tandoori, jamoncitos de pollo y brocheta de cordero', p: 19.95 },
  { n: 'Shashlik de pollo', d: 'Pollo tikka con cebolla, pimiento y especias, al tandoor', p: 15.95 },
  { n: 'Sheek kebab de cordero (6 uds.)', d: 'Rollitos de cordero picado con especias, al tandoor', p: 13.95 },
  { n: 'Muslitos de pollo (4 uds.)', d: 'Jamoncitos adobados con salsa tandoori y especias', p: 13.95 },
  { n: 'Pollo tandoori (2 uds.)', d: 'Pollo adobado con especias, hecho en el tandoor', p: 13.95 },
  { n: 'Pollo tikka', d: 'Pollo adobado con salsa tandoori y especias, al tandoor', p: 12.5 }
];
const BIRYANI = [
  { n: 'Biryani mixto Royal Curry King', d: 'Pollo, cordero, gambas, pimientos, cebolla, basmati aromático y especias', p: 15 },
  { n: 'Biryani de gambas', d: 'Gambas, pimientos, cebolla, basmati y especias', p: 14 },
  { n: 'Biryani de cordero', d: 'Cordero con pimientos, cebolla, basmati y especias', p: 14 },
  { n: 'Biryani de pollo tikka', d: 'Pollo, pimientos, cebolla, basmati y especias', p: 13 },
  { n: 'Biryani de kebab', d: 'Carne kebab, verduras, arroz especial y especias', p: 12 },
  { n: 'Biryani de pollo', d: 'Pollo con arroz especial, cebolla y especias', p: 12 },
  { n: 'Biryani de verduras', d: 'Verdura variada, basmati aromático y especias', p: 11, t: ['veg'] }
];
const STARTERS = [
  { n: 'Samosa vegetal (2 uds.)', d: 'Rellenas de verduras y especias, fritas', p: 5.9, c: '#D9A441', t: ['veg'] },
  { n: 'Samosas de cordero', d: 'Rellenas de cordero picado, guisantes y especias', p: 5.95, c: '#C98B3A' },
  { n: 'Bhaji de cebolla (2 uds.)', d: 'Cebolla crujiente con especias y harina de garbanzo', p: 7.95, c: '#C47A2C', t: ['veg'] },
  { n: 'Aloo tikki (2 uds.)', d: 'Tortitas de patata con jengibre y cilantro, salsa de tamarindo y menta', p: 6.9, c: '#B97B35', t: ['veg'] },
  { n: 'Pakora de verduras', d: 'Verduras rebozadas en harina de garbanzo, fritas', p: 6.5, c: '#C88A3C', t: ['veg'] },
  { n: 'Pakora de pollo', d: 'Pollo rebozado con hierbas y harina de garbanzo', p: 7.95, c: '#BF7A35' },
  { n: 'Paneer pakora (8 uds.)', d: 'Queso indio rebozado con hierbas y garbanzo', p: 8.95, c: '#E3B65F', t: ['veg'] },
  { n: 'Pakora de pescado (8 uds.)', d: 'Pescado rebozado con hierbas y harina de garbanzo', p: 9.95, c: '#C99A52' },
  { n: 'Chili de pollo', d: 'Pimiento rojo y verde, cebolla, salsa de soja y especias', p: 13.9, c: '#A8402B' },
  { n: 'Chili con queso', d: 'Pimiento rojo y verde, cebolla, salsa de soja y especias', p: 13.9, c: '#C2603A' },
  { n: 'Papadum (2 uds.)', d: 'Pan fino y crujiente de lentejas y arroz', p: 2.5, c: '#EED9A3', t: ['veg'] },
  { n: 'Sopa dal', d: 'Sopa de lentejas tradicional', p: 6.95, c: '#E3A52B', t: ['veg'] },
  { n: 'Sopa de pollo', d: 'Sopa tradicional de pollo', p: 7.95, c: '#E2B65A' }
];
const SALADS = [
  { n: 'Ensalada búfala', d: 'Lechuga, tomate, aceitunas y mozzarella fresca', p: 7.95 },
  { n: 'Ensalada de atún', d: 'Atún, lechuga, tomate, aceitunas, cebolla, col y zanahoria', p: 7.95 },
  { n: 'Ensalada mixta', d: 'Lechuga, tomate, aceitunas, cebolla y zanahoria', p: 6.95 },
  { n: 'Ensalada india', d: 'Tomate, cebolla, pepino, limón y pimiento verde picante con especias', p: 6.95, t: ['hot'] },
  { n: 'Ensalada de cebolla', d: 'Cebolla con limón, pimiento verde picante y especias', p: 3.95, t: ['hot'] }
];
const BREADS = [
  { n: 'Naan con queso y ajo', d: 'Relleno de queso y ajo', p: 4.5, c: '#E9C98A' },
  { n: 'Naan peshawari', d: 'Relleno de coco y frutos secos', p: 4.5, c: '#EAD3A0' },
  { n: 'Paratha tandoori de patata', d: 'Relleno de patata y especias, al tandoor', p: 4.5, c: '#D8A85A' },
  { n: 'Naan con queso', d: 'Relleno de queso y especias', p: 3.9, c: '#EBCB8E' },
  { n: 'Naan con ajo', d: 'Con ajo', p: 3.5, c: '#E3C483' },
  { n: 'Naan con mantequilla', d: 'De nuestro horno tandoori, con mantequilla', p: 3.5, c: '#EECF8C' },
  { n: 'Naan clásico', d: 'Pan de trigo de nuestro horno tandoori', p: 2.5, c: '#E8CB93' },
  { n: 'Tawa roti', d: 'Tortitas de harina de trigo', p: 2.5, c: '#E2C996' }
];
const RICES = [
  { n: 'Arroz al limón', d: 'Basmati con zumo de limón y especias', p: 7.95, c: '#F1D35A' },
  { n: 'Arroz con coco', d: 'Basmati con coco, frutos secos, azafrán y especias', p: 6.95, c: '#F3E3B5' },
  { n: 'Arroz pulao de verduras', d: 'Basmati con verduras y especias', p: 6.95, c: '#E5C26A' },
  { n: 'Arroz con champiñones', d: 'Basmati con champiñones y especias', p: 6.95, c: '#D9C39A' },
  { n: 'Arroz frito', d: 'Basmati con huevo y cebolla', p: 6.95, c: '#EBCF7A' },
  { n: 'Arroz jeera', d: 'Basmati con comino y cebolla', p: 5.95, c: '#EAD9A8' },
  { n: 'Arroz pulao', d: 'Basmati con comino y especias', p: 4.95, c: '#F0C64A' },
  { n: 'Arroz basmati blanco', d: 'Basmati hervido', p: 3, c: '#F6F0DE' }
];
const PICKLES = [
  { n: 'Encurtido de mango', d: 'Mango crudo con aceite y semillas de mostaza, fenogreco, hinojo y cúrcuma', p: 2.5 },
  { n: 'Encurtido mixto', d: 'Verduras y frutas con aceite de mostaza y especias', p: 2.5 },
  { n: 'Chile verde', d: '', p: 2.5, t: ['hot'] }
];
const SWEETS = [
  { n: 'Mango lassi', d: 'Yogur y mango (150 ml)', p: 4.5, c: '#F4B63C' },
  { n: 'Sweet lassi', d: 'Yogur con azúcar y especias (150 ml)', p: 3.9, c: '#F5EBD2' },
  { n: 'Salt lassi', d: 'Yogur con sal y especias (150 ml)', p: 3.9, c: '#EFEAD8' },
  { n: 'Kesar pista kulfi', d: 'Helado casero de leche con azafrán y pistacho (150 ml)', p: 5.95, c: '#C9D18A' },
  { n: 'Mango kulfi', d: 'Helado indio de leche, cardamomo, azafrán y mango (150 ml)', p: 4.95, c: '#F2B84A' },
  { n: 'Gajar halwa', d: 'Zanahoria, khoya, cardamomo y frutos secos', p: 5.95, c: '#E0702E' },
  { n: 'Suji halwa', d: 'Sémola, mantequilla clarificada, frutos secos, coco y leche', p: 5.95, c: '#E2B566' }
];
const DRINKS = [
  { n: 'Batidos (250 ml)', d: 'Coco loco, chocolate, vainilla, plátano, fresa o frutos rojos', p: 6.9 },
  { n: 'Smoothies (250 ml)', d: 'Fresa, frambuesa, aguacate, mango, granada, piña, verde…', p: 5.9 },
  { n: 'Cerveza Cobra', d: 'Importación', p: 3.5 },
  { n: 'Cerveza Kingfisher (330 ml)', d: 'Importación de la India', p: 3.5 }
];
const PITA = [
  ['Pita normal', 5.5], ['Pita especial grande', 6.5], ['Pita de falafel', 5.5], ['Pita especial de falafel', 6.5],
  ['Pita solo carne', 6.5], ['Pita especial solo carne', 7.5], ['Dürüm normal', 5.5], ['Dürüm de falafel', 4],
  ['Dürüm solo carne', 6.5], ['Dürüm de arroz con carne', 6.5], ['Dürüm de patatas con carne', 6.5], ['Kapsalon completo', 10.9],
  ['Plato solo carne', 9.9], ['Plato de falafel, ensalada y patatas', 9], ['Plato de carne con patatas', 8], ['Plato de carne con ensalada', 8],
  ['Plato de carne con arroz especial', 8], ['Plato de falafel con ensalada', 8], ['Hamburguesas (pollo, ternera, pescado o vegetal)', 5.9], ['Hot dog', 3.95]
];
const MORE = [
  { h: 'Pizzas (32 cm)', items: [['Margarita, pepperoni, jamón, salami o gorgonzola', 10.5], ['Hawaiana, kebab, cuatro quesos, carbonara, vegetal, indian…', 11], ['Barbacoa, calzone, gambas, calabacín, berenjena, brócoli…', 11.5], ['Pizza King o napolitana', 12]] },
  { h: 'Pastas', items: [['Espaguetis o macarrones: boloñesa, napolitana, cuatro quesos o carbonara', 9.9], ['Macarrones al horno', 11.9]] },
  { h: 'Tapas y snacks', items: [['Patatas fritas', 4], ['Aros de cebolla, nuggets o varitas de merluza', 4.95], ['Patatas bravas, deluxe o calamares', 5.95], ['Patatas con queso al horno o alitas de pollo', 6.95], ['Frikandel, kipcorn o kassouffle', 2.95]] }
];

/* ----------------------------------------------------------
   HORARIO · todos los días de 10:30 a 1:00
   ---------------------------------------------------------- */
const madridMin = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return +p.hour * 60 + +p.minute;
};
const paintLive = () => {
  const m = madridMin(), open = m >= 630 || m < 60;
  const txt = t(open ? 'live.open' : 'live.closed');
  $$('[data-live]').forEach((el) => { el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open); $('[data-live-text]', el).textContent = txt; });
};
paintLive(); setInterval(paintLive, 30000);

/* ----------------------------------------------------------
   SCROLL + NAV
   ---------------------------------------------------------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const lock = (on) => { document.body.classList.toggle('is-locked', on); if (lenis) on ? lenis.stop() : lenis.start(); };
const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
const onScroll = () => nav.classList.toggle('is-solid', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
burger.addEventListener('click', () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); links.classList.toggle('is-open', o); });
const goTo = (id) => {
  const t = id === '#top' ? 0 : $(id); if (t === null) return;
  if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.4 });
  else (t === 0 ? scrollTo({ top: 0 }) : t.scrollIntoView());
};
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  e.preventDefault(); burger.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); goTo(id);
}));

/* ----------------------------------------------------------
   MANDALA (intro y aro del arco)
   ---------------------------------------------------------- */
const mandala = (svg, rings) => {
  let html = '';
  rings.forEach(([r, n, len, w, kind]) => {
    for (let i = 0; i < n; i++) {
      const a = 360 / n * i;
      if (kind === 'dot') html += `<circle cx="0" cy="${-r}" r="${w}" transform="rotate(${a})"/>`;
      else if (kind === 'arc') html += `<path d="M0 ${-r} A ${len} ${len} 0 0 1 ${(Math.sin(Math.PI * 2 / n) * r).toFixed(2)} ${(-Math.cos(Math.PI * 2 / n) * r).toFixed(2)}" transform="rotate(${a})"/>`;
      else html += `<path d="M0 ${-r} Q ${w} ${-(r + len / 2)} 0 ${-(r + len)} Q ${-w} ${-(r + len / 2)} 0 ${-r}Z" transform="rotate(${a})"/>`;
    }
  });
  html += '<circle r="18"/><circle r="30"/>';
  svg.innerHTML = html;
};
mandala($('#mandala'), [[34, 8, 26, 9], [62, 16, 34, 8], [100, 24, 40, 7], [148, 12, 20, 6, 'arc'], [146, 36, 0, 2.4, 'dot'], [156, 32, 36, 5], [196, 48, 0, 2, 'dot']]);
mandala($('#heroRing'), [[120, 24, 30, 6], [156, 48, 0, 2.2, 'dot'], [168, 36, 26, 5], [198, 72, 0, 1.6, 'dot']]);

/* ----------------------------------------------------------
   INTRO
   ---------------------------------------------------------- */
const intro = $('#intro');
const heroIn = () => {
  const v = $('.arch--hero video'); if (v) { const p = v.play(); if (p) p.catch(() => {}); }
  if (!motion) return;
  gsap.from('.hero__crown', { y: -80, rotate: -20, opacity: 0, duration: 1.2, ease: 'bounce.out' });
  gsap.from('.hero__title .l1, .hero__title .l2', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, delay: .1 });
  gsap.from('.hero__k, .hero__lead, .hero__cta .btn, .hero__score', { y: 24, opacity: 0, duration: .9, ease: 'power3.out', stagger: .06, delay: .3 });
  gsap.from('.arch--hero', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut' });
};
if (motion) {
  lock(true);
  const paths = $$('#mandala path, #mandala circle');
  paths.forEach((p) => { const l = p.getTotalLength ? p.getTotalLength() : 100; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
  gsap.timeline({ onComplete: () => intro.remove() })
    .to(paths, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', stagger: { each: .004, from: 'center' } })
    .from('#mandala', { rotate: -60, duration: 2.2, ease: 'power2.out' }, 0)
    .from('.intro__crown', { y: -60, opacity: 0, duration: .8, ease: 'bounce.out' }, .3)
    .from('.intro__hi, .intro__t', { y: 20, opacity: 0, duration: .7, stagger: .1, ease: 'power3.out' }, .5)
    .to('.intro__name', { opacity: 0, scale: .9, duration: .4 }, 2.1)
    .to('#mandala', { scale: 4, opacity: 0, rotate: 90, duration: 1.1, ease: 'power3.in' }, 2.1)
    .add(() => { lock(false); heroIn(); }, 2.6)
    .to(intro, { backgroundColor: 'rgba(12,23,48,0)', duration: .6 }, 2.6);
  setTimeout(() => { if (document.body.contains(intro)) { intro.remove(); lock(false); } }, 6000);
} else { intro.remove(); heroIn(); }
if (motion) gsap.to('#heroRing', { rotate: 360, duration: 120, repeat: -1, ease: 'none' });

/* ----------------------------------------------------------
   ESPECIAS FLOTANTES
   ---------------------------------------------------------- */
(() => {
  const cv = $('#spices'), ctx = cv.getContext('2d'), hero = $('.hero');
  const KINDS = [
    { c: '#F2B400', s: [2, 4], k: 'dot' }, { c: '#E9A100', s: [1.5, 3], k: 'dot' },
    { c: '#C8352B', s: [3, 6], k: 'flake' }, { c: '#7A9A3E', s: [4, 6], k: 'pod' },
    { c: '#6B3E22', s: [5, 8], k: 'star' }, { c: '#F6E7CC', s: [1, 2], k: 'dot' }
  ];
  let W = 0, H = 0, DPR = 1, parts = [], on = false, mx = -999, my = -999;
  const size = () => { const r = hero.getBoundingClientRect(); DPR = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; };
  const make = () => {
    const n = Math.round(clamp(W * H / 16000, 30, 90));
    parts = Array.from({ length: n }, () => { const k = KINDS[Math.floor(Math.random() * KINDS.length)]; return { k, x: Math.random() * W, y: Math.random() * H, s: k.s[0] + Math.random() * (k.s[1] - k.s[0]), vx: 0, vy: 0, a: Math.random() * 6.28, va: (Math.random() - .5) * .02, sp: .15 + Math.random() * .35, ph: Math.random() * 6.28 }; });
  };
  const drawP = (p) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.k.c; ctx.globalAlpha = .75;
    if (p.k.k === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
    else if (p.k.k === 'flake') { ctx.beginPath(); ctx.moveTo(-p.s, -p.s * .4); ctx.lineTo(p.s, -p.s * .2); ctx.lineTo(p.s * .6, p.s * .5); ctx.closePath(); ctx.fill(); }
    else if (p.k.k === 'pod') { ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .45, 0, 0, 6.28); ctx.fill(); }
    else { ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? p.s * .35 : p.s, a = i / 16 * 6.28; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
    ctx.restore();
  };
  const frame = (t) => {
    if (!on) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    parts.forEach((p) => {
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
      if (d < 140) { const f = (140 - d) / 140 * .6; p.vx += dx / d * f; p.vy += dy / d * f; }
      p.vx *= .92; p.vy *= .92;
      p.x += p.vx + Math.sin(t / 1800 + p.ph) * .25; p.y += p.vy - p.sp; p.a += p.va;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      drawP(p);
    });
    requestAnimationFrame(frame);
  };
  hero.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { mx = my = -999; });
  size(); make();
  if (reduced) { ctx.setTransform(DPR, 0, 0, DPR, 0, 0); parts.forEach(drawP); return; }
  new IntersectionObserver((en) => { const was = on; on = en[0].isIntersecting; if (on && !was) requestAnimationFrame(frame); }).observe(hero);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); make(); }, 200); });
})();

/* ----------------------------------------------------------
   MONTA TU TIFFIN
   ---------------------------------------------------------- */
const tf = { starter: null, prot: 0, curry: null, side: 'rice', extra: null, sweet: null, step: 1 };
const STEPS = [
  { k: 'starter', n: 'tf.s1', opt: true },
  { k: 'curry', n: 'tf.s2', opt: false },
  { k: 'extra', n: 'tf.s3', opt: true },
  { k: 'sweet', n: 'tf.s4', opt: true }
];
// cada opción guarda su clave en castellano (k) y se pinta traducida
const loc = (o) => ({ ...o, k: o.n, n: tr(o.n), d: tr(o.d) });
const fill = (tpl, i) => { const c = cfg(), P = c.prots[i], p = c.lower[i]; return tpl.replace('{P}', P).replace('{de}', /^[aeiouhéèàâ]/i.test(p) ? 'd’' : 'de ').replace('{p}', p); };
const curryList = () => tf.prot === 3 ? VEG.map(loc) : SAUCES.map((s) => {
  const top = tf.prot === 0 && ['Tikka masala', 'A la mantequilla', 'Curry'].includes(s.n);
  return { k: tf.prot + '|' + s.n, n: fill(cfg().sauces[s.n][1], tf.prot), d: tr(s.d), p: s.p[tf.prot], c: s.c, t: top ? ['top', ...(s.t || [])] : s.t };
});
const LISTS = { starter: () => STARTERS.map(loc), curry: curryList, extra: () => [...BREADS, ...RICES].map(loc), sweet: () => SWEETS.map(loc) };
const sel = (k) => tf[k] ? LISTS[k]().find((o) => o.k === tf[k]) || null : null;
const sideName = (lower) => t((tf.side === 'naan' ? 'tf.naan' : 'tf.rice') + (lower ? 'L' : ''));
const tagHtml = (x) => (x || []).map((k) => `<span class="tag tag--${k}">${t('tag.' + k)}</span>`).join('');
const stepsEl = $('#tfSteps'), panelEl = $('#tfPanel');
const stepVal = (k) => { const o = sel(k); return o ? o.n : t(k === 'curry' ? 'tf.pick' : 'tf.optional'); };
const paintSteps = () => {
  stepsEl.innerHTML = STEPS.map((s, i) => `<li><button class="step${tf.step === i ? ' is-on' : ''}${tf[s.k] ? ' is-set' : ''}" type="button" role="tab" aria-selected="${tf.step === i}" data-i="${i}"><small>${t('tf.floor', { n: i + 1 })}</small><span>${t(s.n)}</span><em>${stepVal(s.k)}</em></button></li>`).join('');
  $$('.step', stepsEl).forEach((b) => b.addEventListener('click', () => { tf.step = +b.dataset.i; paintSteps(); paintPanel(); }));
};
const optHtml = (o, on) => `<button class="opt${on ? ' is-on' : ''}" type="button" aria-pressed="${on}"><span class="opt__dot" style="background:${o.c || '#E8CB93'}"></span><b>${o.n}</b><span class="opt__p">${eur(o.p)}</span>${o.d ? `<span class="opt__d">${o.d}</span>` : ''}${o.t ? `<span class="opt__tags">${tagHtml(o.t)}</span>` : ''}</button>`;
const paintPanel = (quiet) => {
  const s = STEPS[tf.step], list = LISTS[s.k]();
  let html = '';
  if (s.k === 'starter') html = `<p class="panel__q">${t('tf.q1')}</p><p class="panel__hint">${t('tf.h1')}</p>`;
  if (s.k === 'curry') {
    html = `<p class="panel__q">${t('tf.q2')}</p><p class="panel__hint">${t('tf.h2')}</p>
      <div class="seg" id="segProt">${[...cfg().prots, t('tf.veg')].map((p, i) => `<button type="button" class="${tf.prot === i ? 'is-on' : ''}" aria-pressed="${tf.prot === i}" data-i="${i}">${p}</button>`).join('')}</div>
      <div class="seg" id="segSide"><span class="panel__hint" style="align-self:center">${t('tf.included')}</span>${['rice', 'naan'].map((x) => `<button type="button" class="${tf.side === x ? 'is-on' : ''}" aria-pressed="${tf.side === x}" data-v="${x}">${t(x === 'naan' ? 'tf.naan' : 'tf.rice')}</button>`).join('')}</div>`;
  }
  if (s.k === 'extra') html = `<p class="panel__q">${t('tf.q3')}</p><p class="panel__hint">${t('tf.h3')}</p>`;
  if (s.k === 'sweet') html = `<p class="panel__q">${t('tf.q4')}</p><p class="panel__hint">${t('tf.h4')}</p>`;
  html += `<div class="opts">${list.map((o) => optHtml(o, tf[s.k] === o.k)).join('')}</div>`;
  html += `<div class="panel__foot">${s.opt ? `<button class="skip" type="button" id="tfSkip">${t(tf[s.k] ? 'tf.remove' : 'tf.skip')}</button>` : '<span></span>'}${tf.step < 3 ? `<button class="btn btn--saffron btn--sm" type="button" id="tfNext"><span>${t('tf.next')}</span><i class="ph-bold ph-arrow-right"></i></button>` : ''}</div>`;
  panelEl.innerHTML = html;
  $$('.opt', panelEl).forEach((b, i) => b.addEventListener('click', () => {
    const o = list[i];
    tf[s.k] = tf[s.k] === o.k ? null : o.k;
    paintSteps(); paintPanel(); paintTin(); paintBill();
  }));
  const sp = $('#segProt'); if (sp) $$('button', sp).forEach((b) => b.addEventListener('click', () => {
    tf.prot = +b.dataset.i; tf.curry = null;
    paintSteps(); paintPanel(); paintTin(); paintBill();
  }));
  const ss = $('#segSide'); if (ss) $$('button', ss).forEach((b) => b.addEventListener('click', () => { tf.side = b.dataset.v; paintPanel(); paintTin(); paintBill(); }));
  const sk = $('#tfSkip'); if (sk) sk.addEventListener('click', () => { tf[s.k] = null; if (tf.step < 3) tf.step++; paintSteps(); paintPanel(); paintTin(); paintBill(); });
  const nx = $('#tfNext'); if (nx) nx.addEventListener('click', () => { tf.step++; paintSteps(); paintPanel(); });
  if (motion && !quiet) gsap.from($$('.opt', panelEl), { y: 14, opacity: 0, duration: .4, stagger: .015, ease: 'power2.out' });
};

// el tiffin de acero, dibujado en SVG
const tin = $('#tin');
let shownTiers = [];
const tierSvg = (t, i, y) => `
  <g class="tier" data-key="${t.key}" transform="translate(0 ${y})">
    <ellipse cx="160" cy="72" rx="110" ry="14" fill="url(#steelD)"/>
    <rect x="50" y="10" width="220" height="62" fill="url(#steel)"/>
    <rect x="50" y="26" width="220" height="30" fill="${t.c}" opacity=".92"/>
    <rect x="50" y="26" width="220" height="30" fill="url(#band)"/>
    <text class="lbl" x="160" y="40" text-anchor="middle">${t.n.length > 30 ? t.n.slice(0, 29) + '…' : t.n}</text>
    <text class="lbl2" x="160" y="52" text-anchor="middle">${t.sub}</text>
    <ellipse cx="160" cy="10" rx="110" ry="14" fill="url(#rim)" stroke="#7D8794" stroke-width="1"/>
  </g>`;
const paintTin = () => {
  const tiers = [], st = sel('starter'), cu = sel('curry'), ex = sel('extra'), sw = sel('sweet');
  if (st) tiers.push({ key: 's-' + st.k, n: st.n, sub: t('tf.subStart') + ' · ' + eur(st.p), c: st.c });
  if (cu) tiers.push({ key: 'c-' + cu.k + tf.side, n: cu.n, sub: t('tf.subWith', { side: sideName(true) }) + ' · ' + eur(cu.p), c: cu.c });
  if (ex) tiers.push({ key: 'e-' + ex.k, n: ex.n, sub: t('tf.subExtra') + ' · ' + eur(ex.p), c: ex.c });
  if (sw) tiers.push({ key: 'd-' + sw.k, n: sw.n, sub: t('tf.subEnd') + ' · ' + eur(sw.p), c: sw.c });
  const base = 470, th = 66, top = base - Math.max(tiers.length, 1) * th;
  let body = '';
  if (!tiers.length) for (let i = 0; i < 4; i++) body += `<g transform="translate(0 ${base - (i + 1) * th})"><rect x="50" y="10" width="220" height="62" rx="2" fill="none" stroke="rgba(255,245,228,.25)" stroke-dasharray="6 6"/><ellipse cx="160" cy="10" rx="110" ry="14" fill="none" stroke="rgba(255,245,228,.25)" stroke-dasharray="6 6"/></g>`;
  tiers.forEach((t, i) => { body += tierSvg(t, i, base - (i + 1) * th); });
  const lidY = top - 14, clampTop = lidY - 46;
  const steam = tf.curry ? `<g class="steam" fill="none" stroke="rgba(255,245,228,.55)" stroke-width="3" stroke-linecap="round"><path d="M130 ${clampTop - 10} c-10 -14 10 -22 0 -38"/><path d="M160 ${clampTop - 16} c-10 -14 10 -22 0 -38"/><path d="M190 ${clampTop - 10} c-10 -14 10 -22 0 -38"/></g>` : '';
  if (hasGSAP) gsap.killTweensOf($$('.steam path, .tier', tin));
  tin.innerHTML = `
    <defs>
      <linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#7E8896"/><stop offset=".18" stop-color="#E9EDF2"/><stop offset=".35" stop-color="#B9C1CC"/><stop offset=".7" stop-color="#8F99A6"/><stop offset=".86" stop-color="#D8DEE6"/><stop offset="1" stop-color="#6E7886"/></linearGradient>
      <linearGradient id="steelD" x1="0" x2="1"><stop offset="0" stop-color="#5E6774"/><stop offset=".5" stop-color="#9AA3AF"/><stop offset="1" stop-color="#525B67"/></linearGradient>
      <radialGradient id="rim" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#F4F6F9"/><stop offset=".7" stop-color="#B4BCC7"/><stop offset="1" stop-color="#8A94A1"/></radialGradient>
      <linearGradient id="band" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity=".25"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
    </defs>
    <ellipse cx="160" cy="${base + 16}" rx="140" ry="18" fill="rgba(0,0,0,.35)"/>
    ${body}
    ${steam}
    <g class="lid" transform="translate(0 ${lidY})">
      <path d="M50 24 Q160 -36 270 24 Z" fill="url(#steel)"/>
      <ellipse cx="160" cy="24" rx="110" ry="14" fill="url(#steelD)" opacity=".6"/>
      <circle cx="160" cy="-6" r="7" fill="url(#rim)"/>
    </g>
    <g class="clamp" fill="none" stroke="#8F99A6" stroke-width="7" stroke-linecap="round">
      <path d="M40 ${base + 4} V${clampTop + 20} Q40 ${clampTop} 70 ${clampTop} H250 Q280 ${clampTop} 280 ${clampTop + 20} V${base + 4}"/>
    </g>
    <path d="M118 ${clampTop} Q160 ${clampTop - 46} 202 ${clampTop}" fill="none" stroke="#C9A24A" stroke-width="8" stroke-linecap="round"/>`;
  // los pisos nuevos caen desde arriba
  const keys = tiers.map((t) => t.key);
  if (motion) $$('.tier', tin).forEach((g) => { if (!shownTiers.includes(g.dataset.key)) gsap.from(g, { y: -260, opacity: 0, duration: .9, ease: 'bounce.out' }); });
  if (motion && tf.curry) gsap.fromTo($$('.steam path', tin), { opacity: 0, y: 10 }, { opacity: .9, y: -10, duration: 1.6, stagger: .3, repeat: -1, ease: 'sine.inOut', yoyo: true });
  shownTiers = keys;
};
const billEl = $('#billList'), totalEl = $('#billTotal');
const lines = () => {
  const l = [], st = sel('starter'), cu = sel('curry'), ex = sel('extra'), sw = sel('sweet');
  if (st) l.push([st.n, st.p]);
  if (cu) l.push([t('tf.line', { dish: cu.n, side: sideName(true) }), cu.p]);
  if (ex) l.push([ex.n, ex.p]);
  if (sw) l.push([sw.n, sw.p]);
  return l;
};
const paintBill = (quiet) => {
  const l = lines(), tot = l.reduce((a, [, p]) => a + p, 0);
  billEl.innerHTML = l.length ? l.map(([n, p]) => `<li><span>${n}</span><span>${eur(p)}</span></li>`).join('') : `<li class="empty">${t('tf.empty')}</li>`;
  if (motion && tot && !quiet) gsap.fromTo(totalEl, { scale: 1.15 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
  totalEl.textContent = eur(tot);
};
const toast = $('#toast');
const say = (t) => { toast.textContent = t; toast.hidden = false; clearTimeout(say.t); say.t = setTimeout(() => { toast.hidden = true; }, 2600); };
$('#billCopy').addEventListener('click', async () => {
  const l = lines(); if (!l.length) { say(t('tf.first')); return; }
  const txt = `${t('tf.msgHi')}\n${l.map(([n, p]) => `· ${n} — ${eur(p)}`).join('\n')}\n${t('tf.msgTotal')} ${eur(l.reduce((a, [, p]) => a + p, 0))}`;
  try { await navigator.clipboard.writeText(txt); say(t('tf.copied')); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); say(t('tf.copiedShort')); } catch (er) { say(t('tf.copyFail')); } ta.remove(); }
});
tf.step = 1; tf.curry = curryList()[0].k; shownTiers = ['c-' + tf.curry + tf.side]; paintSteps(); paintPanel(); paintTin(); paintBill();

/* ----------------------------------------------------------
   LA CARTA
   ---------------------------------------------------------- */
const dishes = (arr) => arr.map(loc).map((o) => `<div class="dish"><b>${o.n}</b><span class="p">${eur(o.p)}</span>${o.d ? `<span class="d">${o.d}</span>` : ''}${o.t ? `<span class="tags">${tagHtml(o.t)}</span>` : ''}</div>`).join('');
const sub = (k) => `<h3 class="sub">${t(k)}</h3>`;
const TABS = [
  ['carta.t1', () => `<div class="matrix-wrap"><table class="matrix"><thead><tr><th>${t('carta.sauce')}</th>${cfg().prots.map((p) => `<th class="p">${p}</th>`).join('')}</tr></thead><tbody>${SAUCES.map((s) => `<tr><td><span class="n">${cfg().sauces[s.n][0]}</span>${s.t ? `<span class="tags">${tagHtml(s.t)}</span>` : ''}<span class="d">${tr(s.d)}</span></td>${s.p.map((p) => `<td class="p">${eur(p)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="cols" style="margin-top:50px">${sub('carta.vegs')}${dishes(VEG)}</div>`],
  ['carta.t2', () => `<div class="cols">${sub('carta.tandoor')}${dishes(TANDOOR)}${sub('carta.biryani')}${dishes(BIRYANI)}</div>`],
  ['carta.t3', () => `<div class="cols">${sub('carta.starters')}${dishes(STARTERS)}${sub('carta.salads')}${dishes(SALADS)}</div>`],
  ['carta.t4', () => `<div class="cols">${sub('carta.breads')}${dishes(BREADS)}${sub('carta.rices')}${dishes(RICES)}${sub('carta.pickles')}${dishes(PICKLES)}</div>`],
  ['carta.t5', () => `<div class="cols">${sub('carta.sweets')}${dishes(SWEETS)}${sub('carta.drinks')}${dishes(DRINKS)}</div>`],
  ['carta.t6', () => `<div class="cols">${MORE.map((g) => `<h3 class="sub">${tr(g.h)}</h3>${g.items.map(([n, p]) => `<div class="dish"><b>${tr(n)}</b><span class="p">${eur(p)}</span></div>`).join('')}`).join('')}</div>`]
];
const tabsEl = $('#cartaTabs'), cartaBody = $('#cartaBody');
let curTab = 0;
const showTab = (i, quiet) => {
  curTab = i;
  $$('.tab', tabsEl).forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', k === i); });
  cartaBody.innerHTML = TABS[i][1]() + `<p class="carta__note">${t('carta.note')}</p>`;
  if (motion && !quiet) gsap.from(cartaBody.querySelectorAll('tr, .dish, .sub'), { y: 16, opacity: 0, duration: .45, stagger: .012, ease: 'power2.out' });
};
TABS.forEach(([k], i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.dataset.k = k; b.textContent = t(k); b.addEventListener('click', () => showTab(i)); tabsEl.appendChild(b); });
showTab(0);
const paintPita = () => { $('#pitaList').innerHTML = PITA.map(([n, p]) => `<li><span>${tr(n)}</span><b>${eur(p)}</b></li>`).join(''); };
paintPita();

/* ----------------------------------------------------------
   GALERÍA DE ARCOS
   ---------------------------------------------------------- */
const IG = 'fotos.ig', GG = 'fotos.gg';
const PHOTOS = [
  ['tikka-sizzler.jpg', 'Pollo tikka en plancha de hierro', GG],
  ['mesa-curries.jpg', 'Curris, arroz y naan', GG],
  ['naan-ajo.jpg', 'Naan con ajo', GG],
  ['sala-arcos.jpg', 'Los arcos del comedor', GG],
  ['terraza-grupo.jpg', 'Cena en la terraza', IG],
  ['curry-mantequilla.jpg', 'Curry para llevar', GG],
  ['naan-tandoor.jpg', 'Naan del tandoor', GG],
  ['sala.jpg', 'El comedor', IG],
  ['mesa-noche.jpg', 'Mesa para compartir', GG],
  ['arroz-azafran.jpg', 'Arroz con especias', GG],
  ['mesa-grupo.jpg', 'Nuestros clientes', IG],
  ['naan-queso.jpg', 'Naan relleno', GG],
  ['korma.jpg', 'Curry cremoso', GG],
  ['arroz-basmati.jpg', 'Arroz basmati', GG]
];
const gal = $('#gallery'), galCap = $('#galCap'), galSrc = $('#galSrc');
PHOTOS.forEach(([f, c, s], i) => {
  const el = document.createElement('figure'); el.className = 'gal';
  el.innerHTML = `<button type="button" aria-label="${t('fotos.view', { c: tr(c) })}"><div class="arch"><img src="${IMG(f)}" alt="${tr(c)}" loading="lazy" draggable="false"></div></button>`;
  $('button', el).addEventListener('click', () => { if (galDrag.moved) return; if (i === galCur) openLb(i); else centerOn(i); });
  gal.appendChild(el);
});
const gals = $$('.gal', gal);
let galCur = -1;
const centerOn = (i, instant) => { i = clamp(i, 0, gals.length - 1); const el = gals[i]; gal.scrollTo({ left: el.offsetLeft - (gal.clientWidth - el.offsetWidth) / 2, behavior: instant || reduced ? 'auto' : 'smooth' }); };
const paintGal = () => {
  const mid = gal.scrollLeft + gal.clientWidth / 2; let best = 0, bd = 1e9;
  gals.forEach((g, i) => { const c = g.offsetLeft + g.offsetWidth / 2, d = Math.abs(c - mid); if (d < bd) { bd = d; best = i; } });
  if (best === galCur) return; galCur = best;
  gals.forEach((g, i) => g.classList.toggle('is-center', i === best));
  galCap.textContent = tr(PHOTOS[best][1]); galSrc.textContent = `${String(best + 1).padStart(2, '0')} / ${PHOTOS.length} · ${t(PHOTOS[best][2])}`;
};
let gRaf = 0; gal.addEventListener('scroll', () => { if (!gRaf) gRaf = requestAnimationFrame(() => { gRaf = 0; paintGal(); }); }, { passive: true });
$('#galPrev').addEventListener('click', () => centerOn(galCur - 1));
$('#galNext').addEventListener('click', () => centerOn(galCur + 1));
gal.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); centerOn(galCur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); centerOn(galCur - 1); } });
// arrastrar con el ratón
const galDrag = { on: false, moved: false, x: 0, s: 0 };
gal.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; Object.assign(galDrag, { on: true, moved: false, x: e.clientX, s: gal.scrollLeft }); gal.style.scrollSnapType = 'none'; });
addEventListener('pointermove', (e) => { if (!galDrag.on) return; const dx = e.clientX - galDrag.x; if (Math.abs(dx) > 5) galDrag.moved = true; gal.scrollLeft = galDrag.s - dx; });
addEventListener('pointerup', () => { if (!galDrag.on) return; galDrag.on = false; gal.style.scrollSnapType = ''; centerOn(galCur); setTimeout(() => { galDrag.moved = false; }, 0); });
requestAnimationFrame(() => { centerOn(0, true); paintGal(); });
addEventListener('resize', () => centerOn(Math.max(galCur, 0), true));

/* ----------------------------------------------------------
   VISOR
   ---------------------------------------------------------- */
const lb = $('#lb'), lbImg = $('#lbImg');
function openLb(i) { lbImg.src = IMG(PHOTOS[i][0]); lbImg.alt = tr(PHOTOS[i][1]); $('#lbCap').textContent = tr(PHOTOS[i][1]); lb.hidden = false; lock(true); $('.lb__close').focus(); }
const closeLb = () => { lb.hidden = true; lock(false); };
$('.lb__close').addEventListener('click', closeLb);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
addEventListener('keydown', (e) => { if (!lb.hidden && e.key === 'Escape') closeLb(); });

/* ----------------------------------------------------------
   APARICIONES
   ---------------------------------------------------------- */
if (motion) {
  $$('.head .h2, .head .lead, .head .eyebrow, .pita__copy > *, .visita__copy > *').forEach((el) => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  gsap.from('.revs blockquote', { y: 60, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.revs', start: 'top 75%', once: true } });
  gsap.from('.revs__score b', { scale: .5, opacity: 0, duration: 1.1, ease: 'back.out(2)', scrollTrigger: { trigger: '.revs', start: 'top 75%', once: true } });
  gsap.from('.pita__board', { rotate: 8, y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.pita', start: 'top 70%', once: true } });
  gsap.from('.foot__big', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 90%', once: true } });
}
addEventListener('load', () => { if (hasGSAP) ScrollTrigger.refresh(); });

/* ----------------------------------------------------------
   CAMBIO DE IDIOMA · se repinta todo lo que genera este archivo
   ---------------------------------------------------------- */
document.addEventListener('rck:lang', () => {
  paintLive();
  paintSteps(); paintPanel(true); paintTin(); paintBill(true);
  $$('.tab', tabsEl).forEach((b) => { b.textContent = t(b.dataset.k); });
  showTab(curTab, true); paintPita();
  gals.forEach((g, i) => { const c = tr(PHOTOS[i][1]); $('button', g).setAttribute('aria-label', t('fotos.view', { c })); $('img', g).alt = c; });
  galCur = -1; paintGal();
  if (!lb.hidden) { const i = PHOTOS.findIndex((p) => lbImg.src.endsWith(p[0])); if (i > -1) { lbImg.alt = tr(PHOTOS[i][1]); $('#lbCap').textContent = tr(PHOTOS[i][1]); } }
  if (hasGSAP) ScrollTrigger.refresh();
});
})();
