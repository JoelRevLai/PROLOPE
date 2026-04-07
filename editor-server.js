/**
 * Editor de contenidos PROLOPE — Servidor local
 *
 * Uso:
 *   node editor-server.js
 *
 * Abre http://localhost:3000 en el navegador.
 * No requiere instalar ninguna dependencia (npm install).
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf':  'application/pdf',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.ogv':  'video/ogg',
  '.mov':  'video/quicktime',
};

/* ── helpers ─────────────────────────────────────────────── */

function listHtmlFiles(root) {
  const dirs = [
    '', 'el-grupo', 'objetivos', 'publicaciones',
    'proyectos-digitales', 'formacion', 'eventos',
    'multimedia', 'noticias'
  ];
  const pages = [];
  dirs.forEach(dir => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) return;
    fs.readdirSync(abs).forEach(f => {
      if (!/\.html?$/i.test(f)) return;
      if (f === 'editor-web.html' || f === 'generador-noticias.html') return;
      pages.push({
        path: dir ? dir + '/' + f : f,
        name: f,
        dir:  dir || '(raíz)',
      });
    });
  });
  return pages;
}

function listMedia(root) {
  const mediaDir = path.join(root, 'media');
  if (!fs.existsSync(mediaDir)) return [];
  return fs.readdirSync(mediaDir)
    .filter(f => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f))
    .sort();
}

function listMediaAll(root) {
  const mediaDir = path.join(root, 'media');
  if (!fs.existsSync(mediaDir)) return [];
  return fs.readdirSync(mediaDir)
    .filter(f => /\.(jpg|jpeg|png|gif|svg|webp|mp4|webm|ogv|mov|pdf)$/i.test(f))
    .map(f => {
      const stat = fs.statSync(path.join(mediaDir, f));
      const ext = path.extname(f).toLowerCase().slice(1);
      let type = 'otro';
      if (/^(jpg|jpeg|png|gif|svg|webp)$/.test(ext)) type = 'imagen';
      else if (/^(mp4|webm|ogv|mov)$/.test(ext)) type = 'vídeo';
      else if (ext === 'pdf') type = 'pdf';
      return { name: f, type, ext, size: stat.size, date: stat.mtime.toISOString() };
    });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function readBodyBinary(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function safePath(rel) {
  // Prevent directory traversal
  const norm = path.normalize(rel).replace(/\\/g, '/');
  if (norm.startsWith('..') || path.isAbsolute(norm)) return null;
  return path.join(ROOT, norm);
}

/* ── menu helpers ───────────────────────────────────────── */

function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

function resolveUrl(menuUrl, pageDir) {
  if (/^https?:\/\//.test(menuUrl)) return menuUrl;
  if (pageDir === '') return menuUrl;
  const urlDir = menuUrl.includes('/') ? menuUrl.split('/')[0] : '';
  if (urlDir === pageDir) return menuUrl.slice(pageDir.length + 1);
  return '../' + menuUrl;
}

const EXT_LINK_SVG = '<svg class="ext-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

function buildNavHtml(menu, pageDir) {
  let h = '<nav class="main-nav" id="mainNav">\n        <ul>\n';
  menu.forEach(item => {
    if (item.items && item.items.length) {
      h += '          <li class="has-dropdown">\n';
      h += '            <span>' + escHtml(item.label) + ' <small>▾</small></span>\n';
      h += '            <div class="dropdown">\n              <ul>\n';
      item.items.forEach(sub => {
        const isExt = /^https?:\/\//.test(sub.url) || sub.external;
        const href = resolveUrl(sub.url || '#', pageDir);
        h += '                <li><a href="' + escAttr(href) + '"' + (isExt ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + escHtml(sub.label) + (isExt ? ' ' + EXT_LINK_SVG : '') + '</a></li>\n';
      });
      h += '              </ul>\n            </div>\n          </li>\n';
    } else {
      const isExt = /^https?:\/\//.test(item.url);
      const href = resolveUrl(item.url || '#', pageDir);
      h += '          <li><a href="' + escAttr(href) + '"' + (isExt ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + escHtml(item.label) + '</a></li>\n';
    }
  });
  h += '        </ul>\n      </nav>';
  return h;
}

function getDefaultMenu() {
  return [
    { label: 'El grupo', items: [
      { label: 'El grupo de investigación', url: 'el-grupo/el-grupo.html' },
      { label: 'Historial de proyectos', url: 'el-grupo/historial-proyectos.html' },
      { label: 'Estatutos del grupo', url: 'el-grupo/estatutos.html' },
      { label: 'Miembros', url: 'el-grupo/miembros.html' },
      { label: 'Contacto y ubicación', url: 'el-grupo/contacto.html' }
    ]},
    { label: 'Objetivos', items: [
      { label: 'Vida y obra de Lope de Vega', url: 'objetivos/vida-obra.html' },
      { label: 'Transmisión y edición del teatro de Lope de Vega', url: 'objetivos/transmision.html' },
      { label: 'Criterios y materiales para la edición', url: 'objetivos/criterios.html' }
    ]},
    { label: 'Publicaciones', items: [
      { label: 'Partes de comedias', url: 'publicaciones/partes-comedias.html' },
      { label: 'Anuario Lope de Vega', url: 'https://revistes.uab.cat/anuariolopedevega/index', external: true },
      { label: 'Otras publicaciones', url: 'publicaciones/otras-publicaciones.html' }
    ]},
    { label: 'Proyectos digitales', items: [
      { label: 'Biblioteca virtual', url: 'proyectos-digitales/biblioteca-virtual.html' },
      { label: 'Biblioteca Digital Prolope', url: 'https://prolope.uab.cat/biblioteca/', external: true },
      { label: 'Mujeres y criados', url: 'proyectos-digitales/mujeres-criados.html' },
      { label: 'Mapping Lope', url: 'proyectos-digitales/mapping-lope.html' },
      { label: 'AUTESO', url: 'https://theatheor-fe.netseven.it', external: true },
      { label: 'La dama boba', url: 'proyectos-digitales/la-dama-boba.html' },
      { label: 'Gondomar Digital', url: 'proyectos-digitales/gondomar.html', external: true }
    ]},
    { label: 'Formación', items: [
      { label: 'Tesis', url: 'formacion/tesis.html' }
    ]},
    { label: 'Eventos', items: [
      { label: 'Congresos', url: 'eventos/congresos.html' },
      { label: 'Seminarios', url: 'eventos/seminarios.html' }
    ]},
    { label: 'Multimedia', url: 'multimedia/multimedia.html' },
    { label: 'Noticias', url: 'noticias/noticias.html' }
  ];
}

const SECTION_BG = {
  'el-grupo': 'fondo-grupo.png',
  'objetivos': 'fondo-vida.jpg',
  'publicaciones': 'fondo-grupo.png',
  'proyectos-digitales': 'fondo-grupo.png',
  'formacion': 'fondo-tesis.jpg',
  'eventos': 'eventos-fondo.jpg',
  'multimedia': 'fondo-multimedia.jpg',
};
const SECTION_LABEL = {
  'el-grupo': 'El grupo', 'objetivos': 'Objetivos', 'publicaciones': 'Publicaciones',
  'proyectos-digitales': 'Proyectos digitales', 'formacion': 'Formación',
  'eventos': 'Eventos', 'multimedia': 'Multimedia',
};

// Adds a new <li> entry to sidebar-nav-list blocks that contain section-style links (.html hrefs)
function addPageToSidebarNavLists(html, filename, title) {
  return html.replace(/(<ul class="sidebar-nav-list">)([\s\S]*?)(<\/ul>)/g, function(match, open, inner, close) {
    // Only touch lists that have at least one .html link (section nav, not TOC anchors)
    if (!/<a\s[^>]*href="[^#"][^"]*\.html[^"]*"/.test(inner)) return match;
    // Skip if already present
    if (inner.includes('href="' + filename + '"')) return match;
    const indent = (inner.match(/^(\s*)<li/) || ['','          '])[1];
    return open + inner.trimEnd() + '\n' + indent + '<li><a href="' + filename + '">' + title + '</a></li>\n        ' + close;
  });
}

// Removes a <li> entry matching filename from sidebar-nav-list blocks
function removePageFromSidebarNavLists(html, filename) {
  const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match a single <li> containing exactly the target href — no cross-entry matching
  const liRe = new RegExp('\\n?[ \\t]*<li><a[^>]*href="' + escaped + '"[^>]*>[^<]*<\\/a><\\/li>', 'g');
  return html.replace(/(<ul class="sidebar-nav-list">)([\s\S]*?)(<\/ul>)/g, function(match, open, inner, close) {
    if (!inner.includes('href="' + filename + '"')) return match;
    return open + inner.replace(liRe, '') + close;
  });
}

function buildNewPageHtml({ dir, title, breadcrumbSection, navHtml, bgImage }) {
  // bgImage may arrive as 'media/file.jpg' — strip the prefix since template adds '../media/'
  const bgNorm = bgImage ? bgImage.replace(/^(\.\.\/)?media\//, '') : '';
  const bg = bgNorm || SECTION_BG[dir] || 'fondo-grupo.png';
  const sectionLabel = SECTION_LABEL[dir] || dir;
  const themeToggleSvgSun = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const themeToggleSvgMoon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <link rel="icon" href="../media/favicon_5.gif" type="image/gif" />
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; base-uri 'self'; connect-src 'self'" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)} | PROLOPE – UAB</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../prolope.css" />
  <!-- early theme -->
  <script>
    (function(){var t=localStorage.getItem('theme');if(t==='dark'||(! t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.setAttribute('data-theme','dark');})();
  </script>

</head>
<body>


  <!-- HEADER -->
  <header>
    <div class="header-inner">
      <a href="../index.html" class="logo-link">
        <img src="../media/logo-menu.png" alt="PROLOPE" />
      </a>

      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>

      ${navHtml}
      <button class="theme-toggle" id="themeToggle" aria-label="Alternar modo noche" title="Modo noche">${themeToggleSvgSun}</button>
      <button class="site-search-btn" id="siteSearchBtn" aria-label="Buscar en el sitio">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <div class="site-search-inline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="siteSearchInput" placeholder="Buscar en el sitio…" autocomplete="off" />
        <button class="site-search-close" id="siteSearchClose" aria-label="Cerrar búsqueda">✕</button>
        <div class="site-search-dropdown" id="siteSearchDropdown">
          <div id="siteSearchCount" class="site-search-count"></div>
          <div id="siteSearchResults" class="site-search-results"></div>
        </div>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="page-hero">
    <div class="page-hero-bg" style="background-image: url('../media/${bg}'); background-size: fill; background-repeat: no-repeat; background-position: right; opacity: 0.15;"></div>
    <div class="page-hero-inner">
      <p class="page-hero-breadcrumb">
        Inicio
        <span>›</span>
        ${escHtml(breadcrumbSection || sectionLabel)}
        <span>›</span>
        ${escHtml(title)}
      </p>
      <h1>${escHtml(title)}</h1>
      <div class="page-hero-rule"></div>
    </div>
  </section>

  <!-- CONTENT -->
  <div class="page-wrap">

    <!-- MAIN -->
    <main class="article-main">

      <p>Contenido de la página.</p>

    </main>

  </div><!-- /page-wrap -->


  <!-- FUNDERS -->
  <section class="funders">
    <div class="funders-inner">
      <p class="funders-title">Entidades financiadoras</p>
      <div class="funders-logos">
        <a class="funder-logo-link" href="https://www.march.es/" target="_blank" rel="noopener noreferrer">
          <img src="../media/fundacion-march.png" alt="Fundación March" />
        </a>
        <a class="funder-logo-link" href="https://www.culturaydeporte.gob.es/" target="_blank" rel="noopener noreferrer">
          <img src="../media/ace.png" alt="ACE" />
        </a>
        <a class="funder-logo-link" href="https://agaur.gencat.cat/" target="_blank" rel="noopener noreferrer">
          <img src="../media/agaur_gencat.png" alt="AGAUR Gencat" />
        </a>
        <a class="funder-logo-link" href="https://www.ciencia.gob.es/" target="_blank" rel="noopener noreferrer">
          <img src="../media/ministerio-feder.png" alt="Ministerio / FEDER" />
        </a>
        <a class="funder-logo-link" href="https://www.uab.cat/" target="_blank" rel="noopener noreferrer">
          <img src="../media/uab.png" alt="UAB" />
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div class="footer-logo">
        <img src="../media/logo-prolope_inici.png" alt="PROLOPE" />
      </div>
      <address class="footer-address" style="font-style:normal;">
        Grupo de investigación PROLOPE.<br />
        Departament de Filologia Espanyola.<br /><br />
        Facultat de Filosofia i Lletres UAB<br />
        CAMPUS DE LA UAB<br />
        Carrer de la fortuna s/n<br />
        08193 Bellaterra (Barcelona)
      </address>
      <div class="footer-contact">
        Teléfono (Secretaría): <a href="tel:+34935811034">93 581 10 34</a><br />
        Correo: <a href="mailto:prolope@uab.es">prolope@uab.es</a>
        <div class="footer-social">
          <a href="https://twitter.com/ProlopeUab" target="_blank" rel="noopener noreferrer" title="Seguir en X">𝕏</a>
          <a href="https://www.facebook.com/prolope.uab" target="_blank" rel="noopener noreferrer" title="Seguir en Facebook">f</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      © 2025 Grupo de Investigación PROLOPE – Universitat Autònoma de Barcelona
    </div>
  </footer>



  <script>
    /* ---- Page reveal animations ---- */
    (function () {
      if (!('IntersectionObserver' in window)) return;
      var els = document.querySelectorAll('.card, .sidebar-card, .founder-card, .news-card, .video-card, .congress-card, .funders, .inline-figure, .inline-figure-left');
      if (!els.length) return;
      els.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; });
      var obs = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        visible.forEach(function (e, i) {
          e.target.style.transition = 'opacity 0.5s ease-out ' + (i * 0.07) + 's, transform 0.5s ease-out ' + (i * 0.07) + 's';
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        });
      }, { threshold: 0.1 });
      els.forEach(function (el) { obs.observe(el); });
    })();
  </script>
  <script>
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    toggle.addEventListener('click', () => { nav.classList.toggle('open'); document.body.classList.toggle('menu-open', nav.classList.contains('open')); });
    document.querySelectorAll('.has-dropdown > span').forEach(function(el) {
      el.addEventListener('click', function() { if (window.innerWidth <= 1100) { el.parentElement.classList.toggle('open'); } });
    });
  </script>
  <script>var SITE_ROOT='../';</script>
  <script src="../search-data.js"></script>
  <script src="../site-search.js"></script>
  <script>
    (function() {
      var toggle = document.getElementById('themeToggle');
      var saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '${themeToggleSvgMoon}';
      }
      toggle.addEventListener('click', function() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          toggle.innerHTML = '${themeToggleSvgSun}';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          toggle.innerHTML = '${themeToggleSvgMoon}';
        }
      });
    })();
  </script>
</body>
</html>
`;
}

/* ── server ──────────────────────────────────────────────── */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // ── Editor entry point ──
  if (url.pathname === '/' || url.pathname === '/editor') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(ROOT, 'editor-web.html'), 'utf8'));
    return;
  }

  // ── API: list pages ──
  if (url.pathname === '/api/pages') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listHtmlFiles(ROOT)));
    return;
  }

  // ── API: list media ──
  if (url.pathname === '/api/media') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listMedia(ROOT)));
    return;
  }

  // ── API: list all media with metadata ──
  if (url.pathname === '/api/media-all') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listMediaAll(ROOT)));
    return;
  }

  // ── API: read / write page ──
  if (url.pathname === '/api/page') {
    const rel = url.searchParams.get('path');
    if (!rel) { res.writeHead(400); res.end('Missing path'); return; }
    const full = safePath(rel);
    if (!full) { res.writeHead(403); res.end('Forbidden'); return; }

    if (req.method === 'GET') {
      if (!fs.existsSync(full)) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(full, 'utf8'));
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await readBody(req);
        // Create backup
        if (fs.existsSync(full)) {
          fs.copyFileSync(full, full + '.bak');
        }
        fs.writeFileSync(full, body, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, backup: rel + '.bak' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
  }

  // ── API: update a search-data.js entry ──
  if (url.pathname === '/api/search-data' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { url: entryUrl, content, title: entryTitle, description: entryDesc, upsert } = JSON.parse(body);
      const sdPath = path.join(ROOT, 'search-data.js');
      let src = fs.readFileSync(sdPath, 'utf8');
      // Escape content for embedding in a JS double-quoted string
      const escaped = content.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '');
      // Find the entry by URL using a position-based approach (avoids regex issues with {} in HTML content)
      const urlToken = `"${entryUrl}"`;
      const urlIdx = src.indexOf(urlToken);
      if (urlIdx !== -1) {
        // Find the content field after the URL marker
        const contentLabel = 'content: "';
        const contentFieldIdx = src.indexOf(contentLabel, urlIdx);
        if (contentFieldIdx !== -1) {
          const valueStart = contentFieldIdx + contentLabel.length;
          // Find the closing unescaped " by scanning forward
          let i = valueStart;
          while (i < src.length) {
            if (src[i] === '"' && src[i - 1] !== '\\') break;
            i++;
          }
          // Replace old value with escaped new value
          src = src.substring(0, valueStart) + escaped + src.substring(i);
        }
      } else if (upsert) {
        // Add new entry before the closing bracket
        const tEsc = (entryTitle||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"');
        const dEsc = (entryDesc||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"');
        const newEntry = `  {\n    title: "${tEsc}",\n    url: "${entryUrl}",\n    description: "${dEsc}",\n    content: "${escaped}"\n  },\n`;
        src = src.replace(/}\s*\];\s*$/, '},\n' + newEntry + '];\n');
      }
      fs.copyFileSync(sdPath, sdPath + '.bak');
      fs.writeFileSync(sdPath, src, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: replace all search-data.js entries for a section (by URL prefix) ──
  if (url.pathname === '/api/search-data-section' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { prefix, entries } = JSON.parse(body);
      if (!prefix) throw new Error('prefix required');
      const sdPath = path.join(ROOT, 'search-data.js');
      const src = fs.readFileSync(sdPath, 'utf8');

      // Parse existing entries via vm sandbox
      const vm = require('vm');
      const ctx = {};
      vm.runInNewContext(src, ctx);
      const existing = Array.isArray(ctx.SEARCH_INDEX) ? ctx.SEARCH_INDEX : [];

      // Keep entries whose URL does NOT start with the prefix, add the new ones
      const kept = existing.filter(e => !e.url.startsWith(prefix));
      const all = kept.concat(entries || []);

      // Rebuild file
      const esc = s => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '');
      const header = '/**\n * search-data.js \u2014 \u00cdndice de b\u00fasqueda del sitio PROLOPE\n */\nvar SEARCH_INDEX = [\n';
      const body2 = all.map(e =>
        `  {\n    title: "${esc(e.title)}",\n    url: "${esc(e.url)}",\n    description: "${esc(e.description)}",\n    content: "${esc(e.content)}"\n  }`
      ).join(',\n');
      const newSrc = header + body2 + '\n];\n';

      fs.copyFileSync(sdPath, sdPath + '.bak');
      fs.writeFileSync(sdPath, newSrc, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: upload image (or PDF) to media/ ──
  if (url.pathname === '/api/upload-image' && req.method === 'POST') {
    const rawName = url.searchParams.get('name') || '';
    if (!/^[^/\\]+\.(jpg|jpeg|png|gif|svg|webp|pdf)$/i.test(rawName)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Nombre de archivo inválido. Solo se permiten jpg, jpeg, png, gif, svg, webp, pdf.' }));
      return;
    }
    const safeFilename = rawName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
    const destPath = path.join(ROOT, 'media', safeFilename);
    const ws = fs.createWriteStream(destPath);
    req.pipe(ws);
    ws.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, filename: safeFilename }));
    });
    ws.on('error', e => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    req.on('error', e => {
      ws.destroy();
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── API: upload video to media/ ──
  if (url.pathname === '/api/upload-media' && req.method === 'POST') {
    const rawName = url.searchParams.get('name') || '';
    if (!/^[^/\\]+\.(mp4|webm|ogv|mov)$/i.test(rawName)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Nombre de archivo inválido. Solo se permiten mp4, webm, ogv, mov.' }));
      return;
    }
    const safeFilename = rawName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
    const destPath = path.join(ROOT, 'media', safeFilename);
    const ws = fs.createWriteStream(destPath);
    req.pipe(ws);
    ws.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, filename: safeFilename }));
    });
    ws.on('error', e => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    req.on('error', e => {
      ws.destroy();
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── API: get/save menu structure ──
  if (url.pathname === '/api/menu') {
    const menuPath = path.join(ROOT, 'menu-data.json');
    if (req.method === 'GET') {
      const menu = fs.existsSync(menuPath)
        ? JSON.parse(fs.readFileSync(menuPath, 'utf8'))
        : getDefaultMenu();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(menu));
      return;
    }
    if (req.method === 'POST') {
      try {
        const body = await readBody(req);
        const menu = JSON.parse(body);
        if (fs.existsSync(menuPath)) fs.copyFileSync(menuPath, menuPath + '.bak');
        fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2), 'utf8');
        // Update nav in all HTML files
        const pages = listHtmlFiles(ROOT);
        const errors = [];
        pages.forEach(p => {
          const full = path.join(ROOT, p.path);
          const pageDir = p.dir === '(raíz)' ? '' : p.dir;
          try {
            let html = fs.readFileSync(full, 'utf8');
            const navStart = html.indexOf('<nav class="main-nav" id="mainNav">');
            if (navStart === -1) return;
            const navEnd = html.indexOf('</nav>', navStart);
            if (navEnd === -1) return;
            const newNav = buildNavHtml(menu, pageDir);
            html = html.slice(0, navStart) + newNav + html.slice(navEnd + 6);
            fs.copyFileSync(full, full + '.bak');
            fs.writeFileSync(full, html, 'utf8');
          } catch(e) {
            errors.push({ path: p.path, error: e.message });
          }
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, updated: pages.length - errors.length, errors }));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
  }

  // ── API: create new page ──
  if (url.pathname === '/api/new-page' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const data = JSON.parse(body);
      const { dir, filename, title, breadcrumbSection, bgImage } = data;
      if (!dir || !filename || !title) throw new Error('Faltan campos obligatorios (dir, filename, title).');
      const validDirs = ['el-grupo','objetivos','publicaciones','proyectos-digitales','formacion','eventos','multimedia'];
      if (!validDirs.includes(dir)) throw new Error('Sección inválida: ' + dir);
      if (!/^[a-z0-9][a-z0-9\-]*\.html$/.test(filename)) throw new Error('Nombre de archivo inválido. Usa solo letras minúsculas, números y guiones (ej: mi-pagina.html).');
      const rel = dir + '/' + filename;
      const full = path.join(ROOT, rel);
      if (fs.existsSync(full)) throw new Error('Ya existe una página con ese nombre: ' + rel);
      const menuPath = path.join(ROOT, 'menu-data.json');
      const menu = fs.existsSync(menuPath) ? JSON.parse(fs.readFileSync(menuPath, 'utf8')) : getDefaultMenu();
      const navHtml = buildNavHtml(menu, dir);
      const html = buildNewPageHtml({ dir, title, breadcrumbSection, navHtml, bgImage });
      fs.writeFileSync(full, html, 'utf8');
      // Add new page to sidebar-nav-list cards in sibling pages of the same section
      const siblingPages = listHtmlFiles(ROOT).filter(p => p.dir === dir && p.path !== rel);
      siblingPages.forEach(p => {
        const sibFull = path.join(ROOT, p.path);
        try {
          const orig = fs.readFileSync(sibFull, 'utf8');
          const updated = addPageToSidebarNavLists(orig, filename, title);
          if (updated !== orig) {
            fs.copyFileSync(sibFull, sibFull + '.bak');
            fs.writeFileSync(sibFull, updated, 'utf8');
          }
        } catch(e) { /* ignore individual file errors */ }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, path: rel }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: search index (add / remove entry) ──
  if (url.pathname === '/api/search-index' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { action, entry } = JSON.parse(body); // action: 'add' | 'remove', entry: { title, url, description, content }
      const searchPath = path.join(ROOT, 'search-data.js');
      let src = fs.existsSync(searchPath) ? fs.readFileSync(searchPath, 'utf8') : 'var SEARCH_INDEX = [];\n';
      // Parse existing array
      let index = [];
      try {
        const fn = new Function(src + '; return SEARCH_INDEX;');
        index = fn();
      } catch(e) { /* fallback: keep index empty */ }
      if (action === 'add') {
        // Remove any existing entry with the same url first
        index = index.filter(e => e.url !== entry.url);
        index.push(entry);
      } else if (action === 'remove') {
        index = index.filter(e => e.url !== entry.url);
      }
      // Serialize back
      const lines = index.map(e =>
        `  {\n    title: ${JSON.stringify(e.title||'')},\n    url: ${JSON.stringify(e.url||'')},\n    description: ${JSON.stringify(e.description||'')},\n    content: ${JSON.stringify(e.content||'')}\n  }`
      );
      const newSrc = '/**\n * search-data.js — Índice de búsqueda del sitio PROLOPE\n */\nvar SEARCH_INDEX = [\n' + lines.join(',\n') + '\n];\n';
      fs.copyFileSync(searchPath, searchPath + '.bak');
      fs.writeFileSync(searchPath, newSrc, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, count: index.length }));
    } catch(e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: delete a page ──
  if (url.pathname === '/api/delete-page' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { path: rel } = JSON.parse(body);
      if (!rel) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Missing path'})); return; }
      const full = safePath(rel);
      if (!full) { res.writeHead(403, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Forbidden'})); return; }
      // Protect core pages that should never be deleted
      const PROTECTED = ['index.html','editor-web.html','generador-noticias.html','noticias/noticias.html'];
      if (PROTECTED.includes(rel)) { res.writeHead(403, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Esta página está protegida y no puede eliminarse.'})); return; }
      // Only allow pages within known dirs
      const validDirs = ['el-grupo','objetivos','publicaciones','proyectos-digitales','formacion','eventos','multimedia','noticias',''];
      const pageDir = rel.includes('/') ? rel.split('/')[0] : '';
      if (!validDirs.includes(pageDir)) { res.writeHead(403, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Directorio no permitido.'})); return; }
      if (!rel.endsWith('.html')) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Solo se pueden eliminar archivos .html'})); return; }
      const deletedFilename = rel.includes('/') ? rel.split('/').pop() : rel;
      if (fs.existsSync(full)) {
        fs.copyFileSync(full, full + '.bak');
        fs.unlinkSync(full);
      }
      // Remove entry from noticias-data.js if this is a news page
      if (pageDir === 'noticias') {
        const ndPath = path.join(ROOT, 'noticias-data.js');
        if (fs.existsSync(ndPath)) {
          try {
            let ndSrc = fs.readFileSync(ndPath, 'utf8');
            // Parse: replace leading `const` with `var` so new Function can return it
            const parseSrc = ndSrc.replace(/^\s*const\s+news\s*=/, 'var news =');
            let newsArr = [];
            try { const fn = new Function(parseSrc + '; return news;'); newsArr = fn(); } catch(e) { /* keep empty */ }
            const before = newsArr.length;
            newsArr = newsArr.filter(n => n.url !== deletedFilename);
            if (newsArr.length !== before) {
              // Re-assign ids to keep them sequential
              newsArr = newsArr.map((n, i) => Object.assign({}, n, { id: i + 1 }));
              const entries = newsArr.map(n => '  ' + JSON.stringify(n, null, 2).replace(/\n/g, '\n  '));
              const newNd = '// ── NEWS DATA (shared across noticias.html and individual news pages) ──\nconst news = [\n\n' + entries.join(',\n\n') + '\n];\n';
              fs.copyFileSync(ndPath, ndPath + '.bak');
              fs.writeFileSync(ndPath, newNd, 'utf8');
            }
          } catch(e) { /* ignore noticias-data errors */ }
        }
      }
      // Remove deleted page from sidebar-nav-list cards in sibling pages
      if (pageDir) {
        const siblingPages = listHtmlFiles(ROOT).filter(p => p.dir === pageDir && p.path !== rel);
        siblingPages.forEach(p => {
          const sibFull = path.join(ROOT, p.path);
          try {
            const orig = fs.readFileSync(sibFull, 'utf8');
            const updated = removePageFromSidebarNavLists(orig, deletedFilename);
            if (updated !== orig) {
              fs.copyFileSync(sibFull, sibFull + '.bak');
              fs.writeFileSync(sibFull, updated, 'utf8');
            }
          } catch(e) { /* ignore individual file errors */ }
        });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── Static files (for preview, CSS, images…) ──
  const full = safePath(url.pathname.slice(1));
  if (full && fs.existsSync(full) && fs.statSync(full).isFile()) {
    const ext = path.extname(full).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(full).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════════╗');
  console.log('  ║   Editor de contenidos PROLOPE             ║');
  console.log(`  ║   http://localhost:${PORT}                    ║`);
  console.log('  ╚════════════════════════════════════════════╝');
  console.log('');
  console.log('  Abre la dirección de arriba en el navegador.');
  console.log('  Pulsa Ctrl+C para detener el servidor.');
  console.log('');
});
