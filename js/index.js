/* ── CURSOR ─────────────────────────────── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  if (!cursor) return;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a, button, .service-card, .portfolio-card, .cookie-banner').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('grow'));
});

/* Hero kinetic parallax */
const hero = document.getElementById('hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (hero && !reducedMotion) {
  hero.addEventListener('pointermove', e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
    hero.style.setProperty('--hero-x', `${x}px`);
    hero.style.setProperty('--hero-y', `${y}px`);
  }, { passive: true });

  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
  });
}

/* ── NAV SCROLL ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU ────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SCROLL REVEAL ──────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ── LANGUAGE TOGGLE ────────────────────── */
let currentLang = 'de';
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-de]').forEach(el => {
    const val = lang === 'de' ? el.dataset.de : el.dataset.es;
    if (val !== undefined) el.innerHTML = val;
  });
  // Select options
  document.querySelectorAll('select option[data-de]').forEach(opt => {
    opt.textContent = lang === 'de' ? opt.dataset.de : opt.dataset.es;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
  });
  document.documentElement.lang = lang;
  localStorage.setItem('amstudio-lang', lang);
}
// Restore preference
const savedLang = localStorage.getItem('amstudio-lang');
if (savedLang && savedLang !== 'de') setLang(savedLang);

/* ── COOKIE CONSENT ─────────────────────────── */
const cookieBanner    = document.getElementById('cookieBanner');
const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
const cookieConsentKey  = 'amstudio-cookie-consent';

function showCookieSettings() {
  if (cookieSettingsBtn) cookieSettingsBtn.classList.remove('is-visible');
  if (cookieBanner) {
    cookieBanner.classList.add('is-visible');
    document.body.classList.add('cookie-visible');
  }
}

function setCookieConsent(choice) {
  localStorage.setItem(cookieConsentKey, JSON.stringify({
    choice,
    savedAt: new Date().toISOString()
  }));
  cookieBanner.classList.remove('is-visible');
  document.body.classList.remove('cookie-visible');
  // Mostrar botón de configuración con pequeño retraso
  if (cookieSettingsBtn) {
    setTimeout(() => cookieSettingsBtn.classList.add('is-visible'), 500);
  }
}

if (cookieBanner && !localStorage.getItem(cookieConsentKey)) {
  setTimeout(() => {
    cookieBanner.classList.add('is-visible');
    document.body.classList.add('cookie-visible');
  }, 1400);
} else if (cookieSettingsBtn) {
  // Ya hay consentimiento → mostrar botón directamente
  cookieSettingsBtn.classList.add('is-visible');
}

document.querySelectorAll('[data-cookie-choice]').forEach(btn => {
  btn.addEventListener('click', () => setCookieConsent(btn.dataset.cookieChoice));
});

if (cookieSettingsBtn) {
  cookieSettingsBtn.addEventListener('click', showCookieSettings);
}

/* ── FORM ───────────────────────────────── */
function submitForm() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  if (!name || !email || !message) {
    alert(currentLang === 'de'
      ? 'Bitte füllt alle Pflichtfelder aus.'
      : 'Por favor completa todos los campos obligatorios.');
    return;
  }
  const phone   = document.getElementById('fphone')?.value.trim() || '';
  const service = document.getElementById('fservice')?.value || '';

  const btn = document.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = currentLang === 'de' ? 'Wird gesendet…' : 'Enviando…';

  const body = new URLSearchParams({ nombre: name, email, telefono: phone, servicio: service, mensaje: message });

  fetch('enviar-contacto.php', { method: 'POST', body })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        document.getElementById('contactForm').style.display = 'none';
        const success = document.getElementById('formSuccess');
        success.classList.add('show');
      } else {
        alert(data.error || (currentLang === 'de' ? 'Fehler beim Senden.' : 'Error al enviar.'));
        btn.disabled = false;
        btn.textContent = currentLang === 'de' ? 'Nachricht senden →' : 'Enviar mensaje →';
      }
    })
    .catch(() => {
      alert(currentLang === 'de' ? 'Verbindungsfehler. Bitte versuche es später erneut.' : 'Error de conexión. Por favor intenta más tarde.');
      btn.disabled = false;
      btn.textContent = currentLang === 'de' ? 'Nachricht senden →' : 'Enviar mensaje →';
    });
}

/* ── PORTFOLIO MODAL ───────────────────── */
const PROJECTS = {
  gastro: {
    client: 'Cengiz Schwimmbadgastronomie',
    tags: { de: ['Web Design','Gastronomie','Multi-Standort'], es: ['Web Design','Gastronomía','Multi-sede'] },
    title: 'cengiz-gastro.de',
    desc: {
      de: 'Website für eine Schwimmbad-Gastronomie mit mehreren Standorten — mobil, schnell und klar strukturiert. Einfache Navigation für Gäste an verschiedenen Standorten.',
      es: 'Sitio web para gastronomía de piscina con múltiples sedes — móvil, rápido y bien estructurado. Navegación sencilla para clientes en distintas ubicaciones.'
    },
    brief: {
      de: '"Mehrere Standorte, ein Auftritt — der Gast soll in Sekunden wissen, wo er was findet."',
      es: '"Varias ubicaciones, una presencia — el cliente sabe en segundos dónde encontrar qué."'
    },
    meta: {
      de: [['Format','Website'],['Standorte','Multi-Standort'],['Sprachen','Deutsch'],['Stil','Modern & Clean']],
      es: [['Tipo','Sitio web'],['Sedes','Multi-sede'],['Idiomas','Alemán'],['Estilo','Moderno & Clean']]
    },
    stats: {
      de: [{n:'1',l:'Website für mehrere Standorte'},{n:'100%',l:'Mobile-first Design'}],
      es: [{n:'1',l:'Sitio web multi-sede'},{n:'100%',l:'Diseño mobile-first'}]
    },
    image: 'Portafolio/Web Sites/Cengiz Gastro Capture.png',
    url: 'https://cengiz-gastro.de'
  },
  jokili: {
    client: 'Tovarer Jokili Verein',
    tags: { de: ['Custom Web','Kulturverein','Venezuela'], es: ['Web Custom','Asociación','Venezuela'] },
    title: 'tovarerjokili.com',
    desc: {
      de: 'Maßgeschneiderte Website für einen Kulturverein aus Venezuela — mit Fokus auf Gemeinschaft, kulturelle Identität und mehrsprachigen Inhalten.',
      es: 'Sitio web a medida para una asociación cultural venezolana — enfocado en comunidad, identidad cultural y contenido multilingüe.'
    },
    brief: {
      de: '"Eine digitale Heimat für eine Gemeinschaft, die ihre Wurzeln nie vergisst."',
      es: '"Un hogar digital para una comunidad que nunca olvida sus raíces."'
    },
    meta: {
      de: [['Typ','Custom Website'],['Einsatz','Kulturverein'],['Sprachen','Español'],['Stil','Cultural & Warm']],
      es: [['Tipo','Web a medida'],['Uso','Asociación cultural'],['Idiomas','Español'],['Estilo','Cultural & Cálido']]
    },
    stats: {
      de: [{n:'1',l:'Maßgeschneiderte Plattform'},{n:'2',l:'Sprachen unterstützt'}],
      es: [{n:'1',l:'Plataforma a medida'},{n:'2',l:'Idiomas soportados'}]
    },
    image: 'Portafolio/Web Sites/Tovarerjokili Capture.png',
    url: 'https://tovarerjokili.com'
  },
  am: {
    client: 'AM Solutions IT Services',
    tags: { de: ['Corporate Web','IT-Unternehmen','Trilingual'], es: ['Web Corporativa','Empresa IT','Trilingüe'] },
    title: 'am-itsolutions.de',
    desc: {
      de: 'Trilinguale Corporate Website für ein IT-Dienstleistungsunternehmen — auf Deutsch, Spanisch und Englisch. Professionell, klar und ohne Kompromisse.',
      es: 'Sitio web corporativo trilingüe para empresa de servicios IT — en alemán, español e inglés. Profesional, claro y sin compromisos.'
    },
    brief: {
      de: '"Drei Sprachen, ein starker Auftritt — professionell und ohne Kompromisse."',
      es: '"Tres idiomas, una presencia sólida — profesional y sin compromisos."'
    },
    meta: {
      de: [['Typ','Corporate Website'],['Sprachen','DE / ES / EN'],['Einsatz','IT-Dienstleister'],['Stil','Corporate & Modern']],
      es: [['Tipo','Web corporativa'],['Idiomas','DE / ES / EN'],['Uso','Servicios IT'],['Estilo','Corporativo & Moderno']]
    },
    stats: {
      de: [{n:'3',l:'Sprachen ohne Aufpreis'},{n:'100%',l:'Responsive Design'}],
      es: [{n:'3',l:'Idiomas sin costo extra'},{n:'100%',l:'Diseño responsive'}]
    },
    image: 'Portafolio/Web Sites/AM Solutions Capture.png',
    url: 'https://am-itsolutions.de'
  },
  loadedfries: {
    client: 'Cengiz Schwimmbadgastronomie',
    tags: { de: ['Menükarte','Print Design','Food'], es: ['Carta','Print Design','Food'] },
    title: 'Loaded Fries Produktkarte',
    desc: {
      de: 'Einführung einer neuen Produktlinie mit 7 Varianten. Die Karte musste Appetit machen, Preise klar kommunizieren und im Schwimmbadbereich gut lesbar sein — sowohl als Aushang als auch digital.',
      es: 'Lanzamiento de una nueva línea de productos con 7 variantes. La carta debía despertar apetito, comunicar precios claramente y ser legible en el área de la piscina — tanto impresa como digital.'
    },
    brief: {
      de: '"Sieben Produkte, ein klares Layout — und trotzdem soll man beim Anschauen sofort Hunger bekommen."',
      es: '"Siete productos, un layout claro — y aun así, al verlo debes sentir hambre al instante."'
    },
    meta: {
      de: [['Format','A2 Aushang · Digital'],['Produkte','7 Varianten abgebildet'],['Einsatz','Multi-Standort'],['Stil','Food-Fotografie + Grafik']],
      es: [['Formato','A2 cartel · Digital'],['Productos','7 variantes'],['Uso','Multi-sede'],['Estilo','Fotografía food + Gráfica']]
    },
    stats: {
      de: [{n:'7',l:'Produkte klar kommuniziert'},{n:'2',l:'Formate — Print & Digital'}],
      es: [{n:'7',l:'Productos comunicados'},{n:'2',l:'Formatos — Print & Digital'}]
    },
    image: 'Portafolio/Banner and Flyers/Loaded_Fries_G&G@300x.png',
    url: null
  },
  kindergeburtstag: {
    client: 'Privatkunde',
    tags: { de: ['Event Design','Print','Einladung'], es: ['Diseño Evento','Print','Invitación'] },
    title: 'Kindergeburtstag Einladung',
    desc: {
      de: 'Einladungskarte für einen Kindergeburtstag — bunt, lebendig und passend für das Thema. Gedruckt im A3-Format als Aushang und digital als Versand.',
      es: 'Invitación para una fiesta de cumpleaños infantil — colorida, dinámica y temática. Impresa en A3 y en versión digital para enviar.'
    },
    brief: {
      de: '"Kinder sollen beim ersten Anschauen schon wissen: Das wird ein Fest."',
      es: '"Los niños deben saber al primer vistazo: esto va a ser una fiesta."'
    },
    meta: {
      de: [['Format','A3 Print'],['Anlass','Kindergeburtstag'],['Einsatz','Einladung & Aushang'],['Stil','Farbenfroh & Verspielt']],
      es: [['Formato','A3 impreso'],['Ocasión','Cumpleaños infantil'],['Uso','Invitación & Cartel'],['Estilo','Colorido & Lúdico']]
    },
    stats: {
      de: [{n:'1',l:'Druckfertige Vorlage'},{n:'2',l:'Versionen — Print & Digital'}],
      es: [{n:'1',l:'Plantilla lista para imprimir'},{n:'2',l:'Versiones — Print & Digital'}]
    },
    image: 'Portafolio/Banner and Flyers/Kindergeburstag_A3_QF_1.png',
    url: null
  },
  grillabend: {
    client: 'Privatkunde',
    tags: { de: ['Event Design','Print','Einladung'], es: ['Diseño Evento','Print','Invitación'] },
    title: 'Grill Abend Einladung',
    desc: {
      de: 'Einladungsflyer für einen Grill-Abend — warm, einladend und mit dem richtigen Feeling für gesellige Sommerabende im Freien.',
      es: 'Flyer de invitación para una noche de barbacoa — cálido, acogedor y con el ambiente perfecto para tardes de verano al aire libre.'
    },
    brief: {
      de: '"Man soll das Feuer fast riechen können — direkt beim ersten Blick."',
      es: '"Casi deberías poder oler el fuego al primer vistazo."'
    },
    meta: {
      de: [['Format','Digital & Print'],['Anlass','Grill-Event'],['Einsatz','Einladung'],['Stil','Warm & Rustikal']],
      es: [['Formato','Digital & Print'],['Ocasión','Evento barbacoa'],['Uso','Invitación'],['Estilo','Cálido & Rústico']]
    },
    stats: {
      de: [{n:'1',l:'Fertige Druckvorlage'},{n:'100%',l:'Individuell gestaltet'}],
      es: [{n:'1',l:'Plantilla terminada'},{n:'100%',l:'Diseño personalizado'}]
    },
    image: 'Portafolio/Banner and Flyers/Grill Abend korrektur_Mesa de trabajo 1.jpg',
    url: null
  }
};

function openModal(id) {
  const p = PROJECTS[id];
  if (!p) return;
  const lang = currentLang || 'de';
  document.getElementById('pmTags').innerHTML = p.tags[lang].map(t => `<span class="pm-tag">${t}</span>`).join('');
  document.getElementById('pmClient').textContent = p.client;
  document.getElementById('pmTitle').textContent = p.title;
  document.getElementById('pmDesc').textContent = p.desc[lang];
  document.getElementById('pmBriefLabel').textContent = lang === 'de' ? 'DIE AUFGABE' : 'EL ENCARGO';
  document.getElementById('pmBriefQuote').textContent = p.brief[lang];
  document.getElementById('pmMeta').innerHTML = p.meta[lang].map(([label, value]) =>
    `<div class="pm-meta-cell"><div class="pm-meta-label">${label}</div><div class="pm-meta-value">${value}</div></div>`
  ).join('');
  document.getElementById('pmStats').innerHTML = p.stats[lang].map(s =>
    `<div><div class="pm-stat-num">${s.n}</div><div class="pm-stat-label">${s.l}</div></div>`
  ).join('');
  document.getElementById('pmActions').innerHTML = p.url
    ? `<a href="${p.url}" target="_blank" class="pm-visit-link">${lang === 'de' ? 'Website besuchen' : 'Visitar sitio web'} →</a>`
    : '';
  const img = document.getElementById('pmImage');
  img.src = p.image;
  img.alt = p.title;
  document.getElementById('portfolioModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('portfolioModal').classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalBg(e) {
  if (e.target === document.getElementById('portfolioModal')) closeModal();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── SMOOTH ANCHOR SCROLL ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
