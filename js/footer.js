(function () {
  if (!document.getElementById('am-footer-css')) {
    const s = document.createElement('style');
    s.id = 'am-footer-css';
    s.textContent = `
      footer {
        background: #0E0C0A;
        border-top: 1px solid rgba(255,255,255,0.06);
        font-family: 'Outfit', sans-serif;
      }
      .footer-main {
        padding: 72px 80px 56px;
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr;
        gap: 56px;
      }
      .f-logo {
        display: inline-flex;
        flex-direction: column;
        text-decoration: none;
        margin-bottom: 24px;
      }
      .f-logo-am {
        font-weight: 800;
        font-size: 24px;
        color: #F3EDE3;
        letter-spacing: -0.04em;
        line-height: 0.9;
      }
      .f-logo-rule {
        width: 24px;
        height: 2px;
        background: #C4521C;
        margin: 4px 0 3px;
      }
      .f-logo-studio {
        font-weight: 200;
        font-size: 8px;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #F3EDE3;
        opacity: 0.7;
      }
      .footer-tagline {
        font-size: 14px;
        font-weight: 300;
        color: #8A837A;
        line-height: 1.75;
        max-width: 280px;
        margin-bottom: 24px;
      }
      .footer-address {
        font-size: 13px;
        color: #8A837A;
        opacity: 0.6;
        line-height: 1.9;
      }
      .footer-col-title {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: #C4521C;
        margin-bottom: 22px;
      }
      .footer-nav {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 13px;
      }
      .footer-nav a,
      .footer-contact a {
        font-size: 14px;
        color: #8A837A;
        text-decoration: none;
        transition: color 0.2s;
      }
      .footer-nav a:hover,
      .footer-contact a:hover { color: #F3EDE3; }
      .footer-contact {
        display: flex;
        flex-direction: column;
        gap: 13px;
      }
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.06);
        padding: 24px 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }
      .footer-copyright {
        font-size: 12px;
        color: #8A837A;
        opacity: 0.6;
      }
      .footer-copyright span { color: #C4521C; opacity: 1; }
      .footer-legal { display: flex; gap: 32px; }
      .footer-legal a {
        font-size: 12px;
        color: #8A837A;
        opacity: 0.6;
        text-decoration: none;
        transition: color 0.2s, opacity 0.2s;
      }
      .footer-legal a:hover { color: #F3EDE3; opacity: 1; }
      @media (max-width: 768px) {
        .footer-main { grid-template-columns: 1fr; padding: 48px 24px 40px; gap: 40px; }
        .footer-bottom { padding: 20px 24px; }
      }
    `;
    document.head.appendChild(s);
  }

  const footer = document.querySelector('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-main">
      <div>
        <a href="index.html" class="f-logo">
          <span class="f-logo-am">AM</span>
          <div class="f-logo-rule"></div>
          <span class="f-logo-studio">Studio</span>
        </a>
        <p class="footer-tagline">Grafik &amp; Webdesign für Gastronomie, Vereine und lokale Unternehmen — auf Deutsch, Spanisch und Englisch.</p>
        <div class="footer-address">
          AM Studio · Eine Division von AM Solutions<br>
          Gengenbach · Offenburg · Endingen am Kaiserstuhl
        </div>
      </div>

      <div>
        <div class="footer-col-title">Navigation</div>
        <ul class="footer-nav">
          <li><a href="index.html">Startseite</a></li>
          <li><a href="portfolio.html">Portfolio</a></li>
          <li><a href="index.html#leistungen">Leistungen</a></li>
          <li><a href="index.html#kontakt">Kontakt</a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">Kontakt</div>
        <div class="footer-contact">
          <a href="mailto:info@am-itsolutions.de">info@am-itsolutions.de</a>
          <a href="https://am-itsolutions.de" target="_blank" rel="noopener">am-itsolutions.de</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-copyright">© 2026 <span>AM Studio</span> · Alle Rechte vorbehalten</div>
      <div class="footer-legal">
        <a href="https://am-itsolutions.de/impressum/" target="_blank" rel="noopener">Impressum</a>
        <a href="https://am-itsolutions.de/datenschutz/" target="_blank" rel="noopener">Datenschutz</a>
      </div>
    </div>
  `;
})();
