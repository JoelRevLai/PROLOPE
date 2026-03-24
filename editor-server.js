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

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function safePath(rel) {
  // Prevent directory traversal
  const norm = path.normalize(rel).replace(/\\/g, '/');
  if (norm.startsWith('..') || path.isAbsolute(norm)) return null;
  return path.join(ROOT, norm);
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
