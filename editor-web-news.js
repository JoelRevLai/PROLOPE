    // ── DELETE PAGE ───────────────────────────────────────────────────────────────
    async function deletePage() {
      var pagePath = S.currentPath;
      if (!pagePath) return;
      if (!confirm('¿Eliminar la página "' + pagePath + '"?\n\nSe guardará una copia de seguridad (.bak) pero la página dejará de estar disponible en el sitio.')) return;
      try {
        var r = await fetch('/api/delete-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pagePath })
        });
        var data = await r.json();
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        toast('Página eliminada: ' + pagePath, 'ok');
        // Remove from search index
        try { await fetch('/api/search-index', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'remove', entry: { url: pagePath } }) }); } catch (e) { }
        // Remove from menu
        try {
          var mr = await fetch('/api/menu');
          var menuData = await mr.json();
          var menuChanged = false;
          menuData.forEach(function (section) {
            if (section.items) {
              var before = section.items.length;
              section.items = section.items.filter(function (item) { return item.url !== pagePath; });
              if (section.items.length !== before) menuChanged = true;
            }
          });
          if (menuChanged) {
            await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(menuData) });
          }
        } catch (e) { }
        S.currentPath = '';
        document.getElementById('topbar').style.display = 'none';
        document.getElementById('edBody').innerHTML = '<div class="welcome" id="welcomeScreen"><h2>Página eliminada</h2><p>La página <em>' + esc(pagePath) + '</em> ha sido eliminada.</p></div>';
        // Refresh page list in sidebar
        try { var pr = await fetch('/api/pages'); S.pages = await pr.json(); renderNav(); } catch (e) { }
      } catch (e) {
        toast('Error: ' + e.message, 'err');
      }
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // NEWS — HELPERS
    // ══════════════════════════════════════════════════════════════════════════════

    function escJs(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' '); }

    async function loadNewsEntry(pagePath) {
      var filename = pagePath.split('/').pop();
      NC.cats = [];
      try {
        var r = await fetch('/api/page?path=noticias-data.js');
        var src = await r.text();
        var newsArr = [];
        try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (e) { }
        S.newsEntry = newsArr.find(function (n) { return n.url === filename; }) || null;
        if (S.newsEntry && S.newsFormData) S.newsFormData.excerpt = S.newsEntry.excerpt || '';
        // Populate cats for the editor dropdowns
        var seen = {};
        newsArr.forEach(function (n) { if (n.cat && !seen[n.cat]) { seen[n.cat] = true; NC.cats.push(n.cat); } });
        NC.cats.sort();
      } catch (e) { S.newsEntry = null; }
    }

    function renderNewsEditor() {
      NC.blockId = 0;
      var f = S.newsFormData || {};
      var catOpts = '<option value="__nueva__">— Nueva categoría —</option>';
      NC.cats.forEach(function (c) { catOpts += '<option value="' + escA(c) + '"' + (c === f.cat ? ' selected' : '') + '>' + esc(c) + '</option>'; });
      // If cat not in list, add it
      if (f.cat && NC.cats.indexOf(f.cat) === -1) catOpts = '<option value="' + escA(f.cat) + '" selected>' + esc(f.cat) + '</option>' + catOpts;

      var h = '';

      // Datos básicos
      h += '<div class="ed-section"><h2>Datos de la noticia</h2>';
      h += '<div class="field"><label>Tipo de noticia</label>';
      h += '<select id="nc-tipo" onchange="ncToggleEvento()"><option value="suceso"' + (f.tipo !== 'evento' ? ' selected' : '') + '>Noticia / suceso</option><option value="evento"' + (f.tipo === 'evento' ? ' selected' : '') + '>Evento (congreso, seminario, jornadas…)</option></select></div>';
      h += '<div class="field"><label>Categoría</label><div style="display:flex;gap:.5rem">';
      h += '<select id="nc-cat-sel" onchange="ncOnCatChange()" style="flex:1">' + catOpts + '</select>';
      h += '<input type="text" id="nc-cat-custom" placeholder="Nueva categoría" style="flex:1;display:none"></div></div>';
      h += '<div class="field"><label>Título</label>';
      h += '<div class="rich-wrap"><div class="rich-toolbar"><button onmousedown="execRich(event,\'bold\')"><b>N</b></button><button onmousedown="execRich(event,\'italic\')"><i>C</i></button></div>';
      h += '<div class="rich-edit" contenteditable="true" id="nc-titulo" style="min-height:40px">' + f.titulo + '</div></div></div>';
      h += '<div class="field"><label>Nombre del archivo (slug)</label>';
      h += '<p class="help">Solo informativo para noticias existentes.</p>';
      h += '<input type="text" id="nc-slug" value="' + escA(f.slug || '') + '" readonly style="background:#eee;color:#888"></div>';
      h += '<div class="field"><label>Fecha (completa)</label>';
      h += '<p class="help">Ej.: 27 de noviembre de 2024. Fecha corta: <strong id="nc-fecha-corta">' + esc(ncShortenDate(f.fechaLarga) || '—') + '</strong></p>';
      h += '<input type="text" id="nc-fecha" value="' + escA(f.fechaLarga || '') + '" placeholder="Ej.: 27 de noviembre de 2024"></div>';
      h += field('Texto del breadcrumb', 'nc-breadcrumb', f.breadcrumb, 'Ej.: Congreso XI 2024');
      h += field('Título SEO (pestaña del navegador)', 'nc-seo', f.tituloSeo, 'Ej.: XI Congreso Internacional Lope de Vega');
      h += '</div>';

      // Imagen
      h += '<div class="ed-section"><h2>Imagen (opcional)</h2>';
      h += imgField('Archivo de imagen', f.imgPath ? f.imgPath.replace(/^\.\.\//, '') : '', 'nc-img');
      h += '<p class="help" style="margin-top:.2rem">Si se deja vacío, se usará la imagen genérica de noticias.</p>';
      h += field('Texto alternativo de la imagen', 'nc-img-alt', f.imagenAlt || '', 'Ej.: Cartel del XI Congreso');
      h += '</div>';

      // Evento fields
      h += '<div class="ed-section" id="nc-evento-section" style="display:' + (f.tipo === 'evento' ? '' : 'none') + '"><h2>Datos del evento</h2>';
      h += field('Título del evento (en el recuadro)', 'nc-ev-titulo', f.evTitulo || '', 'Ej.: 18 Jornadas sobre teatro clásico');
      h += field('Subtítulo del evento (opcional)', 'nc-ev-subtitulo', f.evSubtitulo || '');
      h += field('Fechas del evento', 'nc-ev-fechas', f.evFechas || '', 'Ej.: 22–24 de julio de 2024');
      h += field('Lugar del evento', 'nc-ev-lugar', f.evLugar || '');
      h += '<div class="field"><label>Enlaces del evento</label><div id="nc-ev-links"></div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncAddEvLink()">+ Añadir enlace</button></div>';
      h += '</div>';

      // Contenido
      h += '<div class="ed-section"><h2>Contenido</h2>';
      h += '<div class="field"><label>Extracto (resumen para la tarjeta de noticias)</label>';
      h += '<textarea id="nc-excerpt" rows="2" placeholder="Breve resumen…">' + esc(f.excerpt || '') + '</textarea></div>';
      h += '<div class="field"><label>Bloques de contenido</label>';
      h += '<p class="help">Añade bloques en el orden en que aparecerán.</p>';
      h += '<div id="nc-blocks"></div>';
      h += '<div style="display:flex;gap:.4rem;margin-top:.4rem;flex-wrap:wrap">';
      h += '<button class="btn btn-blue btn-sm" onclick="ncAddBlock(\'parrafo\')">+ Párrafo</button>';
      h += '<button class="btn btn-sm" style="background:var(--dorado);color:#fff" onclick="ncAddBlock(\'titulo\')">+ Título</button>';
      h += '<button class="btn btn-sm" style="background:#7a6f60;color:#fff" onclick="ncAddBlock(\'subtitulo\')">+ Subtítulo</button>';
      h += '<button class="btn btn-sm" style="background:#5a7d5a;color:#fff" onclick="ncAddBlock(\'figura\')">+ Figura</button>';
      h += '<button class="btn btn-sm" style="background:#6d7a60;color:#fff" onclick="ncAddBlock(\'cita\')">+ Cita destacada</button>';
      h += '<button class="btn btn-sm" style="background:#4a6a8a;color:#fff" onclick="ncAddBlock(\'enlaces\')">+ Enlaces</button>';
      h += '<button class="btn btn-sm" style="background:#8a6a4a;color:#fff" onclick="ncAddBlock(\'recuadro\')">+ Recuadro destacado con enlace</button>';
      h += '<button class="btn btn-sm" style="background:#4a7a8a;color:#fff;font-weight:600" onclick="ncAddBlock(\'lista\')">+ Lista bibliográfica</button>';
      h += '<button class="btn btn-sm" style="background:#5a7a5a;color:#fff" onclick="ncAddBlock(\'imagegrid\')">+ Cuadrícula de imágenes</button>';
      h += '<button class="btn btn-sm" style="background:#5a5a6a;color:#fff" onclick="ncAddBlock(\'html-directo\')">+ HTML directo</button>';
      h += '</div></div></div>';

      // Enlaces externos
      h += '<div class="ed-section"><h2>Enlaces externos (al final de la noticia)</h2>';
      h += '<div id="nc-links"></div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncAddLink()">+ Añadir enlace</button>';
      h += '</div>';

      // Búsqueda
      h += '<div class="ed-section"><h2>Datos para el buscador</h2>';
      h += field('Descripción para el buscador (opcional)', 'nc-search-desc', f.searchDesc || '', 'Se usa el extracto si se deja vacío');
      h += '</div>';


      document.getElementById('edBody').innerHTML = h;
      document.getElementById('edBody').scrollTop = 0;

      // Wire events
      document.getElementById('nc-fecha').addEventListener('input', ncAutoFechaCorta);

      // Pre-populate content blocks
      (f.contentBlocks || []).forEach(function (b) { ncAddBlockWithContent(b); });
      if (!(f.contentBlocks || []).length) ncAddBlock('parrafo');

      // Pre-populate links
      (f.links || []).forEach(function (l) { ncAddLinkWithValues('nc-links', l.label, l.url); });
      if (!(f.links || []).length) ncAddLink();

      // Pre-populate evento links
      (f.evLinks || []).forEach(function (l) { ncAddLinkWithValues('nc-ev-links', l.label, l.url); });

      // Nuevas funcionalidades
      resetEditorState();
      injectHelpButtons();
      injectCollapseToggles();
    }

    function ncAddBlockWithContent(b) {
      var type = b.type;
      ncAddBlock(type);
      var c = document.getElementById('nc-blocks');
      var cards = c.querySelectorAll('[data-ncbid]');
      var last = cards[cards.length - 1];
      if (!last) return;
      if (type === 'figura') {
        var srcI = last.querySelector('.nc-fig-src'); if (srcI) srcI.value = b.src || '';
        var altI = last.querySelector('.nc-fig-alt'); if (altI) altI.value = b.alt || '';
        var capI = last.querySelector('.nc-fig-cap'); if (capI) capI.innerHTML = b.caption || '';
        var posI = last.querySelector('.nc-fig-pos'); if (posI) posI.value = b.position || 'right';
        var szI = last.querySelector('.nc-fig-size'); if (szI) szI.value = b.size || 'medium';
      } else if (type === 'enlaces') {
        var rowsC = last.querySelector('.nc-links-rows');
        if (rowsC) {
          rowsC.innerHTML = '';
          (b.links || []).forEach(function (l) { rowsC.appendChild(ncMakeLinkRow(l.label, l.url)); });
          if (!rowsC.children.length) rowsC.appendChild(ncMakeLinkRow('', ''));
        }
      } else if (type === 'recuadro') {
        var ed = last.querySelector('.rich-edit'); if (ed) ed.innerHTML = b.text || '';
        var lblI = last.querySelector('.nc-hl-label'); if (lblI) lblI.value = b.btnLabel || '↓ Consultar aquí (PDF)';
        var urlI = last.querySelector('.nc-hl-url'); if (urlI) urlI.value = b.btnUrl || '';
      } else if (type === 'lista') {
        var entriesC = last.querySelector('.nc-lista-entries');
        if (entriesC) {
          entriesC.innerHTML = '';
          (b.items || []).forEach(function (item) {
            ncBlockAddListEntry(last.querySelector('button[onclick*=ncBlockAddListEntry]'), true);
            var entries = entriesC.querySelectorAll('.nc-list-entry');
            var entry = entries[entries.length - 1];
            if (entry) {
              var eds = entry.querySelectorAll('.rich-edit');
              if (eds[0]) eds[0].innerHTML = item.main || '';
              if (eds[1]) eds[1].innerHTML = item.note || '';
            }
          });
        }
      } else if (type === 'imagegrid') {
        var colsI = last.querySelector('.nc-igrid-cols'); if (colsI) colsI.value = b.cols || 2;
        var gszI = last.querySelector('.nc-igrid-size'); if (gszI) gszI.value = b.size || 'medium';
        var rowsC2 = last.querySelector('.nc-igrid-rows');
        if (rowsC2) {
          rowsC2.innerHTML = '';
          (b.imgs || []).forEach(function (img) {
            ncBlockAddGridImg(last.querySelector('button[onclick*=ncBlockAddGridImg]'), true);
            var rows = rowsC2.querySelectorAll('.nc-igrid-row');
            var row = rows[rows.length - 1];
            if (row) {
              var sI = row.querySelector('.nc-igrid-src'); if (sI) sI.value = img.src || '';
              var aI = row.querySelector('.nc-igrid-alt'); if (aI) aI.value = img.alt || '';
            }
          });
        }
      } else if (type === 'html-directo') {
        var ta = last.querySelector('.nc-rawhtml'); if (ta) ta.value = b.html || '';
      } else {
        var ed2 = last.querySelector('.rich-edit'); if (ed2) ed2.innerHTML = b.text || '';
      }
    }

    function ncAddLinkWithValues(containerId, label, url) {
      var c = document.getElementById(containerId);
      var d = document.createElement('div'); d.className = 'link-row';
      d.innerHTML = '<input type="text" placeholder="Texto del enlace" value="' + escA(label || '') + '">'
        + '<input type="text" placeholder="URL" value="' + escA(url || '') + '"><button class="del-link" onclick="this.parentElement.remove()">×</button>';
      c.appendChild(d);
    }

    async function saveNewsPage() {
      await flushPendingUploads();
      var tipo = document.getElementById('nc-tipo').value;
      var cat = ncGetCat();
      var tituloEl = document.getElementById('nc-titulo');
      var titulo = tituloEl ? tituloEl.innerHTML.trim() : '';
      var tituloPlain = titulo.replace(/<[^>]+>/g, '');
      var slug = (S.newsFormData || {}).slug || document.getElementById('nc-slug').value.trim();
      var fechaLarga = document.getElementById('nc-fecha').value.trim();
      var fechaCorta = ncGetFechaCorta();
      var breadcrumb = document.getElementById('nc-breadcrumb').value.trim();
      var tituloSeo = document.getElementById('nc-seo').value.trim();
      var imgInput = document.getElementById('nc-img');
      var imgRaw = imgInput ? imgInput.value.trim() : '';
      var imagenAlt = document.getElementById('nc-img-alt').value.trim();
      var excerpt = document.getElementById('nc-excerpt').value.trim();
      var searchDesc = document.getElementById('nc-search-desc').value.trim();
      var contentBlocks = ncGetBlocks();
      var links = ncGetLinks('nc-links');
      var evTitulo = document.getElementById('nc-ev-titulo').value.trim();
      var evSubtitulo = document.getElementById('nc-ev-subtitulo').value.trim();
      var evFechas = document.getElementById('nc-ev-fechas').value.trim();
      var evLugar = document.getElementById('nc-ev-lugar').value.trim();
      var evLinks = ncGetLinks('nc-ev-links');

      var errors = [];
      if (!tituloPlain) errors.push('título');
      if (!fechaLarga || fechaCorta === '—') errors.push('fecha');
      if (!cat) errors.push('categoría');
      if (!excerpt) errors.push('extracto');
      if (!contentBlocks.length) errors.push('al menos un bloque de contenido');
      if (errors.length) { toast('Faltan campos: ' + errors.join(', '), 'err'); return; }

      var imgPath = '';
      if (imgRaw) {
        var imgFilename = imgRaw.replace(/^(\.\.\/)?media\//, '');
        imgPath = '../media/' + imgFilename;
      }

      var html = ncGenerateHtml({ tipo, cat, titulo, tituloPlain, slug, fechaLarga, fechaCorta, breadcrumb, tituloSeo, imgPath, imagenAlt, excerpt, contentBlocks, links, evTitulo, evSubtitulo, evFechas, evLugar, evLinks, filename: S.currentPath.split('/').pop() });

      toast('Guardando…', 'info');
      try {
        var r = await fetch('/api/page?path=' + encodeURIComponent(S.currentPath), { method: 'POST', headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: html });
        var data = await r.json();
        if (!data.ok) { toast('Error al guardar: ' + (data.error || ''), 'err'); return; }
      } catch (e) { toast('Error de conexión', 'err'); return; }

      // Update noticias-data.js entry
      try {
        var nr = await fetch('/api/page?path=noticias-data.js');
        var src = await nr.text();
        var newsArr = [];
        try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (ex) { }
        var filename = S.currentPath.split('/').pop();
        var entry = newsArr.find(function (n) { return n.url === filename; });
        if (entry) {
          entry.cat = cat;
          entry.date = ncShortenDate(fechaLarga) || entry.date;
          entry.title = tituloPlain;
          entry.excerpt = excerpt;
          if (imgPath) entry.img = imgPath;
          var paras = contentBlocks.filter(function (b) { return b.type === 'parrafo'; });
          entry.content = paras.map(function (b) { return b.text.replace(/<[^>]+>/g, ''); });
          var allLinks = links.concat(tipo === 'evento' ? evLinks : []);
          entry.links = allLinks;
          var newSrc = ncSerializeNoticiasData(newsArr);
          await fetch('/api/page?path=noticias-data.js', { method: 'POST', headers: { 'Content-Type': 'application/javascript; charset=utf-8' }, body: newSrc });
        }
      } catch (ex) { /* silent */ }

      // Update search-data.js
      try {
        var desc = (searchDesc || excerpt).replace(/"/g, '\\"');
        await fetch('/api/search-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: 'noticias/' + S.currentPath.split('/').pop(), content: desc }) });
      } catch (ex) { /* silent */ }

      markClean();
      toast('Noticia guardada correctamente', 'ok');
      // Reload to reflect saved state
      setTimeout(function () { loadPage(S.currentPath); }, 1000);
    }

    function ncShortenDate(fechaLarga) {
      var NC_MESES = { enero: 'ene.', febrero: 'feb.', marzo: 'mar.', abril: 'abr.', mayo: 'may.', junio: 'jun.', julio: 'jul.', agosto: 'ago.', septiembre: 'sep.', octubre: 'oct.', noviembre: 'nov.', diciembre: 'dic.' };
      var raw = (fechaLarga || '').trim().toLowerCase();
      if (!raw) return '';
      var corta = raw;
      for (var m in NC_MESES) corta = corta.replace(new RegExp(m, 'gi'), NC_MESES[m]);
      corta = corta.replace(/ de /g, ' ');
      return corta.charAt(0).toUpperCase() + corta.slice(1);
    }

    function ncSerializeNoticiasData(arr) {
      var lines = '// ── NEWS DATA (shared across noticias.html and individual news pages) ──\nconst news = [\n';
      arr.forEach(function (n, i) {
        lines += '  {\n';
        lines += '    id: ' + n.id + ',\n';
        lines += "    cat: '" + escJs(n.cat || '') + "',\n";
        lines += "    date: '" + escJs(n.date || '') + "',\n";
        lines += "    title: '" + escJs(n.title || '') + "',\n";
        lines += "    excerpt: '" + escJs(n.excerpt || '') + "',\n";
        lines += "    img: '" + escJs(n.img || '') + "',\n";
        lines += "    url: '" + escJs(n.url || '') + "',\n";
        lines += '    content: [\n';
        (n.content || []).forEach(function (c, ci) {
          lines += "      '" + escJs(c) + "'" + (ci < (n.content.length - 1) ? ',' : '') + '\n';
        });
        lines += '    ],\n';
        lines += '    links: [\n';
        (n.links || []).forEach(function (l, li) {
          lines += "      { label: '" + escJs(l.label || '') + "', url: '" + escJs(l.url || '') + "' }" + (li < (n.links.length - 1) ? ',' : '') + '\n';
        });
        lines += '    ]\n';
        lines += '  }' + (i < arr.length - 1 ? ',' : '') + '\n';
      });
      lines += '];\n';
      return lines;
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // NEWS MANAGER
    // ══════════════════════════════════════════════════════════════════════════════

    var NM = { rows: [], sort: 'recent', page: 1, perPage: 10, q: '' };

    async function loadNewsManager() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__news_manager__'); });
      document.getElementById('topbar').style.display = 'none';
      var _ws2 = document.getElementById('welcomeScreen'); if (_ws2) _ws2.style.display = 'none';

      // Load data from noticias-data.js
      var dataMap = {}; // filename -> {title, date, order}
      try {
        var r = await fetch('/api/page?path=noticias-data.js');
        var src = await r.text();
        var newsArr = [];
        try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (e) { }
        // newsArr is ordered newest-first (unshift on create), so index 0 = most recent
        newsArr.forEach(function (n, i) { if (n.url) dataMap[n.url] = { title: n.title || '', date: n.date || '', order: i }; });
      } catch (e) { }

      var noticias = S.pages.filter(function (p) { return p.path.startsWith('noticias/noticia-'); });
      NM.rows = noticias.map(function (p) {
        var d = dataMap[p.name] || {};
        var title = d.title || p.name.replace('.html', '').replace(/^noticia-/, '').replace(/-/g, ' ');
        if (title) title = title.charAt(0).toUpperCase() + title.slice(1);
        return { path: p.path, name: p.name, title: title, date: d.date || '', order: d.order != null ? d.order : 9999 };
      });
      NM.sort = 'recent'; NM.page = 1; NM.q = '';

      var h = '<div class="ed-section">';
      h += '<h2>Noticias <button class="btn btn-green btn-sm" style="float:right" onclick="loadNewNews()">+ Nueva noticia</button></h2>';
      if (!NM.rows.length) {
        h += '<p style="color:#888;padding:.5rem 0">No hay noticias todavía. Pulsa «+ Nueva noticia» para crear una.</p>';
      } else {
        h += '<div style="display:flex;gap:.6rem;align-items:center;margin:.6rem 0;flex-wrap:wrap">';
        h += '<input type="text" id="nm-search" placeholder="Buscar noticia…" oninput="nmOnSearch()" style="flex:1;min-width:180px;max-width:360px">';
        h += '<span style="font-size:.8rem;color:#888;font-family:Raleway,sans-serif">Ordenar por:</span>';
        h += '<button id="nm-sort-recent" class="btn btn-sm btn-blue" onclick="nmSetSort(\'recent\')" title="Más recientes primero">Recientes ▾</button>';
        h += '<button id="nm-sort-old" class="btn btn-sm btn-outline" onclick="nmSetSort(\'old\')" title="Más antiguas primero">Antiguas ▴</button>';
        h += '<button id="nm-sort-name" class="btn btn-sm btn-outline" onclick="nmSetSort(\'name\')" title="Orden alfabético">Nombre A–Z</button>';
        h += '</div>';
        h += '<table style="width:100%;border-collapse:collapse;font-size:.88rem">';
        h += '<thead><tr style="border-bottom:2px solid var(--borde)"><th style="padding:.4rem .6rem;text-align:left">Título</th><th style="padding:.4rem .6rem;text-align:left;white-space:nowrap">Fecha</th><th style="width:140px"></th></tr></thead>';
        h += '<tbody id="nm-body"></tbody></table>';
        h += '<div id="nm-pagination" style="margin-top:.8rem;display:flex;gap:.3rem;align-items:center;flex-wrap:wrap"></div>';
      }
      h += '</div>';
      document.getElementById('edBody').innerHTML = h;
      if (NM.rows.length) nmRender();
    }

    function nmGetSorted() {
      var rows = NM.rows.filter(function (r) { return !NM.q || nmNorm(r.title).indexOf(NM.q) !== -1; });
      rows = rows.slice(); // copy
      if (NM.sort === 'recent') rows.sort(function (a, b) { return a.order - b.order; });
      else if (NM.sort === 'old') rows.sort(function (a, b) { return b.order - a.order; });
      else rows.sort(function (a, b) { return a.title.localeCompare(b.title, 'es'); });
      return rows;
    }

    function nmRender() {
      var rows = nmGetSorted();
      var total = rows.length;
      var totalPages = Math.max(1, Math.ceil(total / NM.perPage));
      if (NM.page > totalPages) NM.page = totalPages;
      var start = (NM.page - 1) * NM.perPage;
      var pageRows = rows.slice(start, start + NM.perPage);

      // Table body
      var tbody = document.getElementById('nm-body');
      var html = '';
      pageRows.forEach(function (r) {
        html += '<tr style="border-bottom:1px solid var(--borde)">';
        html += '<td style="padding:.5rem .6rem"><strong>' + esc(r.title) + '</strong><br><span style="font-size:.72rem;color:#aaa">' + esc(r.name) + '</span></td>';
        html += '<td style="padding:.5rem .6rem;white-space:nowrap;color:#777;font-size:.85rem">' + esc(r.date) + '</td>';
        html += '<td style="padding:.5rem .6rem;white-space:nowrap">'
          + '<button class="btn btn-blue btn-sm" onclick="loadPage(decodeURIComponent(this.dataset.path))" data-path="' + encodeURIComponent(r.path) + '" style="margin-right:.3rem">Editar</button>'
          + '<button class="btn btn-sm" style="background:var(--rojo);color:#fff" onclick="deleteNews(decodeURIComponent(this.dataset.path),decodeURIComponent(this.dataset.title))" data-path="' + encodeURIComponent(r.path) + '" data-title="' + encodeURIComponent(r.title) + '">Eliminar</button>'
          + '</td>';
        html += '</tr>';
      });
      if (tbody) tbody.innerHTML = html;

      // Pagination
      var pg = document.getElementById('nm-pagination');
      if (pg) {
        var ph = '<span style="font-size:.8rem;color:#888;font-family:Raleway,sans-serif;margin-right:.3rem">' +
          (total ? (start + 1) + '–' + Math.min(start + NM.perPage, total) + ' de ' + total : '0') + '</span>';
        ph += '<button class="btn btn-sm btn-outline" onclick="nmGoPage(1)" ' + (NM.page <= 1 ? 'disabled' : '') + ' title="Primera">«</button>';
        ph += '<button class="btn btn-sm btn-outline" onclick="nmGoPage(' + (NM.page - 1) + ')" ' + (NM.page <= 1 ? 'disabled' : '') + ' title="Anterior">‹</button>';
        for (var p = Math.max(1, NM.page - 2); p <= Math.min(totalPages, NM.page + 2); p++) {
          ph += '<button class="btn btn-sm ' + (p === NM.page ? 'btn-blue' : 'btn-outline') + '" onclick="nmGoPage(' + p + ')">' + p + '</button>';
        }
        ph += '<button class="btn btn-sm btn-outline" onclick="nmGoPage(' + (NM.page + 1) + ')" ' + (NM.page >= totalPages ? 'disabled' : '') + ' title="Siguiente">›</button>';
        ph += '<button class="btn btn-sm btn-outline" onclick="nmGoPage(' + totalPages + ')" ' + (NM.page >= totalPages ? 'disabled' : '') + ' title="Última">»</button>';
        pg.innerHTML = ph;
      }

      // Sort button styles
      ['recent', 'old', 'name'].forEach(function (s) {
        var btn = document.getElementById('nm-sort-' + s);
        if (btn) btn.className = 'btn btn-sm ' + (NM.sort === s ? 'btn-blue' : 'btn-outline');
      });
    }

    function nmNorm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

    function nmOnSearch() {
      NM.q = nmNorm(document.getElementById('nm-search').value || '');
      NM.page = 1;
      nmRender();
    }

    function nmSetSort(s) { NM.sort = s; NM.page = 1; nmRender(); }
    function nmGoPage(p) { NM.page = p; nmRender(); document.getElementById('edBody').scrollTop = 0; }

    async function deleteNews(pagePath, title) {
      var filename = pagePath.split('/').pop();
      if (!confirm('¿Eliminar la noticia «' + title + '»?\n\nEsta acción no se puede deshacer (aunque se guardará una copia de seguridad .bak).')) return;

      toast('Eliminando…', 'info');

      // 1. Delete the HTML file
      try {
        var r = await fetch('/api/delete-page', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: pagePath }) });
        var data = await r.json();
        if (!data.ok) { toast('Error al eliminar el archivo: ' + (data.error || ''), 'err'); return; }
      } catch (e) { toast('Error de conexión', 'err'); return; }

      // 2. Remove from noticias-data.js
      try {
        var nr = await fetch('/api/page?path=noticias-data.js');
        var src = await nr.text();
        var newsArr = [];
        try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (ex) { }
        newsArr = newsArr.filter(function (n) { return n.url !== filename; });
        var newSrc = ncSerializeNoticiasData(newsArr);
        await fetch('/api/page?path=noticias-data.js', { method: 'POST', headers: { 'Content-Type': 'application/javascript; charset=utf-8' }, body: newSrc });
      } catch (e) { /* silent */ }

      // 3. Remove from search-index
      try { await fetch('/api/search-index', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'remove', entry: { url: 'noticias/' + filename } }) }); } catch (e) { }

      // 4. Refresh nav and reload manager
      try { var pr = await fetch('/api/pages'); S.pages = await pr.json(); renderNav(); } catch (e) { }
      toast('Noticia «' + title + '» eliminada', 'ok');
      loadNewsManager();
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // NEW NEWS CREATION
    // ══════════════════════════════════════════════════════════════════════════════

    async function loadNewNews() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__new_news__'); });
      var _wsX = document.getElementById('welcomeScreen'); if (_wsX) _wsX.style.display = 'none';
      NC.blockId = 0; NC.cats = [];
      try {
        var r = await fetch('/api/page?path=noticias-data.js');
        var src = await r.text();
        var newsArr = [];
        try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (e) { }
        var seen = {};
        newsArr.forEach(function (n) { if (n.cat && !seen[n.cat]) { seen[n.cat] = true; NC.cats.push(n.cat); } });
        NC.cats.sort();
      } catch (e) { NC.cats = []; }
      // Show topbar with "Crear noticia" action
      document.getElementById('topTitle').textContent = 'Nueva noticia';
      document.getElementById('topBadge').textContent = 'Noticia';
      document.getElementById('btnDelete').style.display = 'none';
      document.getElementById('btnUndo').style.display = 'none';
      var btnSave = document.getElementById('btnSave');
      btnSave.textContent = '💾 Crear noticia';
      btnSave.onclick = function () { createNews(); };
      document.getElementById('topbar').style.display = '';
      renderNewNewsForm();
    }

    function renderNewNewsForm() {
      var catOpts = '<option value="__nueva__">— Nueva categoría —</option>';
      NC.cats.forEach(function (c) { catOpts += '<option value="' + escA(c) + '">' + esc(c) + '</option>'; });

      var h = '';

      // Datos básicos
      h += '<div class="ed-section"><h2>Datos de la noticia</h2>';
      h += '<div class="field"><label>Tipo de noticia</label>';
      h += '<select id="nc-tipo" onchange="ncToggleEvento()"><option value="suceso">Noticia / suceso</option><option value="evento">Evento (congreso, seminario, jornadas…)</option></select></div>';
      h += '<div class="field"><label>Categoría</label><div style="display:flex;gap:.5rem">';
      h += '<select id="nc-cat-sel" onchange="ncOnCatChange()" style="flex:1">' + catOpts + '</select>';
      h += '<input type="text" id="nc-cat-custom" placeholder="Nueva categoría" style="flex:1;display:none"></div></div>';
      h += '<div class="field"><label>Título</label>';
      h += '<div class="rich-wrap"><div class="rich-toolbar"><button onmousedown="execRich(event,\'bold\')"><b>N</b></button><button onmousedown="execRich(event,\'italic\')"><i>C</i></button></div>';
      h += '<div class="rich-edit" contenteditable="true" id="nc-titulo" style="min-height:40px"></div></div></div>';
      h += '<div class="field"><label>Nombre del archivo</label>';
      h += '<p class="help">Se genera automáticamente del título. <a href="#" onclick="(function(){var s=document.getElementById(\'nc-slug\');s.removeAttribute(\'readonly\');s.style.background=\'\';s.style.color=\'\';s.dataset.manual=\'1\';s.focus();return false;})();return false">Editar manualmente</a></p>';
      h += '<input type="text" id="nc-slug" placeholder="se completará al escribir el título" readonly style="background:#eee;color:#555"></div>';
      h += '<div class="field"><label>Fecha (completa)</label>';
      h += '<p class="help">Ej.: 27 de noviembre de 2024. Fecha corta: <strong id="nc-fecha-corta">—</strong></p>';
      h += '<input type="text" id="nc-fecha" placeholder="Ej.: 27 de noviembre de 2024"></div>';
      h += field('Texto del breadcrumb', 'nc-breadcrumb', '', 'Ej.: Congreso XI 2024');
      h += field('Título SEO (pestaña del navegador)', 'nc-seo', '', 'Ej.: XI Congreso Internacional Lope de Vega');
      h += '</div>';

      // Imagen
      h += '<div class="ed-section"><h2>Imagen (opcional)</h2>';
      h += imgField('Archivo de imagen', '', 'nc-img');
      h += '<p class="help" style="margin-top:.2rem">Si se deja vacío, se usará la imagen genérica de noticias.</p>';
      h += field('Texto alternativo de la imagen', 'nc-img-alt', '', 'Ej.: Cartel del XI Congreso');
      h += '</div>';

      // Evento fields (hidden)
      h += '<div class="ed-section" id="nc-evento-section" style="display:none"><h2>Datos del evento</h2>';
      h += field('Título del evento (en el recuadro)', 'nc-ev-titulo', '', 'Ej.: 18 Jornadas sobre teatro clásico');
      h += field('Subtítulo del evento (opcional)', 'nc-ev-subtitulo', '');
      h += field('Fechas del evento', 'nc-ev-fechas', '', 'Ej.: 22–24 de julio de 2024');
      h += field('Lugar del evento', 'nc-ev-lugar', '');
      h += '<div class="field"><label>Enlaces del evento</label><div id="nc-ev-links"></div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncAddEvLink()">+ Añadir enlace</button></div>';
      h += '</div>';

      // Contenido
      h += '<div class="ed-section"><h2>Contenido</h2>';
      h += '<div class="field"><label>Extracto (resumen para la tarjeta de noticias)</label>';
      h += '<textarea id="nc-excerpt" rows="2" placeholder="Breve resumen…"></textarea></div>';
      h += '<div class="field"><label>Bloques de contenido</label>';
      h += '<p class="help">Añade bloques en el orden en que aparecerán.</p>';
      h += '<div id="nc-blocks"></div>';
      h += '<div style="display:flex;gap:.4rem;margin-top:.4rem;flex-wrap:wrap">';
      h += '<button class="btn btn-blue btn-sm" onclick="ncAddBlock(\'parrafo\')">+ Párrafo</button>';
      h += '<button class="btn btn-sm" style="background:var(--dorado);color:#fff" onclick="ncAddBlock(\'titulo\')">+ Título</button>';
      h += '<button class="btn btn-sm" style="background:#7a6f60;color:#fff" onclick="ncAddBlock(\'subtitulo\')">+ Subtítulo</button>';
      h += '<button class="btn btn-sm" style="background:#5a7d5a;color:#fff" onclick="ncAddBlock(\'figura\')">+ Figura</button>';
      h += '<button class="btn btn-sm" style="background:#6d7a60;color:#fff" onclick="ncAddBlock(\'cita\')">+ Cita destacada</button>';
      h += '<button class="btn btn-sm" style="background:#4a6a8a;color:#fff" onclick="ncAddBlock(\'enlaces\')">+ Enlaces</button>';
      h += '<button class="btn btn-sm" style="background:#8a6a4a;color:#fff" onclick="ncAddBlock(\'recuadro\')">+ Recuadro destacado con enlace</button>';
      h += '<button class="btn btn-sm" style="background:#4a7a8a;color:#fff;font-weight:600" onclick="ncAddBlock(\'lista\')">+ Lista bibliográfica</button>';
      h += '<button class="btn btn-sm" style="background:#5a7a5a;color:#fff" onclick="ncAddBlock(\'imagegrid\')">+ Cuadrícula de imágenes</button>';
      h += '<button class="btn btn-sm" style="background:#5a5a6a;color:#fff" onclick="ncAddBlock(\'html-directo\')">+ HTML directo</button>';
      h += '</div></div></div>';

      // Enlaces externos
      h += '<div class="ed-section"><h2>Enlaces externos (al final de la noticia)</h2>';
      h += '<div id="nc-links"></div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncAddLink()">+ Añadir enlace</button>';
      h += '</div>';

      // Búsqueda
      h += '<div class="ed-section"><h2>Datos para el buscador</h2>';
      h += field('Descripción para el buscador (opcional)', 'nc-search-desc', '', 'Se usa el extracto si se deja vacío');
      h += '</div>';


      document.getElementById('edBody').innerHTML = h;
      document.getElementById('edBody').scrollTop = 0;

      // Wire up events
      document.getElementById('nc-fecha').addEventListener('input', ncAutoFechaCorta);
      document.getElementById('nc-slug').addEventListener('input', function () { this.value = this.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''); });
      document.getElementById('nc-titulo').addEventListener('input', ncAutoSlug);

      if (NC.cats.length) document.getElementById('nc-cat-sel').value = NC.cats[0];

      ncAddBlock('parrafo');
      ncAddLink();
    }

    function ncToggleEvento() {
      var isEv = document.getElementById('nc-tipo').value === 'evento';
      document.getElementById('nc-evento-section').style.display = isEv ? '' : 'none';
    }

    function ncOnCatChange() {
      var sel = document.getElementById('nc-cat-sel');
      var custom = document.getElementById('nc-cat-custom');
      custom.style.display = sel.value === '__nueva__' ? '' : 'none';
    }

    function ncGetCat() {
      var sel = document.getElementById('nc-cat-sel');
      if (sel.value === '__nueva__') return document.getElementById('nc-cat-custom').value.trim();
      return sel.value;
    }

    var NC_MESES = { enero: 'ene.', febrero: 'feb.', marzo: 'mar.', abril: 'abr.', mayo: 'may.', junio: 'jun.', julio: 'jul.', agosto: 'ago.', septiembre: 'sep.', octubre: 'oct.', noviembre: 'nov.', diciembre: 'dic.' };

    function ncAutoFechaCorta() {
      var raw = document.getElementById('nc-fecha').value.trim().toLowerCase();
      var el = document.getElementById('nc-fecha-corta');
      if (!raw) { el.textContent = '—'; return; }
      var corta = raw;
      for (var m in NC_MESES) corta = corta.replace(new RegExp(m, 'gi'), NC_MESES[m]);
      corta = corta.replace(/ de /g, ' ');
      el.textContent = corta.charAt(0).toUpperCase() + corta.slice(1);
    }

    function ncGetFechaCorta() {
      return document.getElementById('nc-fecha-corta').textContent.trim();
    }

    function ncAutoSlug() {
      var slugEl = document.getElementById('nc-slug');
      if (!slugEl || slugEl.dataset.manual === '1') return;
      var titulo = document.getElementById('nc-titulo');
      if (!titulo) return;
      var text = (titulo.textContent || titulo.innerText || '').trim();
      var slug = text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s\-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      slugEl.value = slug;
    }

    function ncAddBlock(type) {
      var c = document.getElementById('nc-blocks');
      var id = NC.blockId++;
      var div = document.createElement('div');
      div.className = 'item-card';
      div.setAttribute('draggable', 'true');
      div.dataset.ncbid = id;
      div.dataset.ncbtype = type;
      var colors = { parrafo: 'var(--azul)', titulo: 'var(--dorado)', subtitulo: '#7a6f60', figura: '#5a7d5a', cita: '#6d7a60', enlaces: '#6a5a8a', recuadro: '#8a6a4a', lista: '#4a7a8a', imagegrid: '#5a7a5a', 'html-directo': '#5a5a6a' };
      var labels = { parrafo: 'PÁRRAFO', titulo: 'TÍTULO', subtitulo: 'SUBTÍTULO', figura: 'FIGURA', cita: 'CITA DESTACADA', enlaces: 'ENLACES', recuadro: 'RECUADRO DESTACADO', lista: 'LISTA BIBLIOGRÁFICA', imagegrid: 'CUADRÍCULA DE IMÁGENES', 'html-directo': 'HTML DIRECTO' };
      var richToolbar = '<div class="rich-toolbar" style="margin:.3rem 0">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
        + '</div>';
      var richToolbarFull = '<div class="rich-toolbar" style="margin:.3rem 0">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
        + '<button onmousedown="execRich(event,\'insertUnorderedList\')">• Lista</button>'
        + '<button onmousedown="execRich(event,\'insertOrderedList\')">1. Lista</button>'
        + '</div>';
      var header = '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>'
        + '<button class="btn-del-item" onclick="this.closest(\'[data-ncbid]\').remove()">✕</button>'
        + '<div class="item-card-header" style="margin-bottom:.5rem">'
        + '<strong style="font-size:.73rem;background:' + (colors[type] || 'var(--azul)') + ';color:#fff;padding:.1rem .4rem;border-radius:3px;flex:none">' + (labels[type] || type) + '</strong>'
        + '</div>';

      if (type === 'parrafo') {
        div.innerHTML = header + richToolbarFull
          + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:70px;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;background:var(--crema)" title="Escribe un párrafo…"></div>';
      } else if (type === 'titulo') {
        div.innerHTML = header
          + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:36px;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;background:var(--crema)" title="Escribe un título…"></div>';
      } else if (type === 'subtitulo') {
        div.innerHTML = header
          + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:36px;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;background:var(--crema)" title="Escribe un subtítulo…"></div>';
      } else if (type === 'cita') {
        div.innerHTML = header + richToolbar
          + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:50px;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;background:var(--crema)" title="Texto de la cita destacada…"></div>';
      } else if (type === 'figura') {
        div.innerHTML = header
          + '<div class="field"><label>Imagen</label><div class="img-picker">'
          + '<input type="text" class="nc-fig-src" placeholder="Ej.: ../media/imagen.jpg" style="flex:1">'
          + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen"><input type="file" accept="image/*" style="display:none" onchange="ncUploadBlockImg(this,\'nc-fig-src\',' + id + ')">Subir</label>'
          + '</div></div>'
          + '<div class="field"><label>Texto alternativo</label><input type="text" class="nc-fig-alt" placeholder="Descripción breve de la imagen"></div>'
          + '<div class="field"><label>Pie de foto (opcional)</label>'
          + '<div class="rich-wrap">'
          + '<div class="rich-toolbar">'
          + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
          + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
          + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
          + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
          + '</div>'
          + '<div class="rich-edit nc-fig-cap" contenteditable="true" draggable="false"></div>'
          + '</div>'
          + '</div>'
          + '<div class="field"><label>Posición</label><select class="nc-fig-pos"><option value="right">Derecha</option><option value="left">Izquierda</option><option value="center">Centrada</option></select></div>'
          + '<div class="field"><label>Tamaño</label><select class="nc-fig-size"><option value="small">Pequeña</option><option value="medium" selected>Normal</option><option value="large">Grande</option><option value="full">Completa</option></select></div>';
      } else if (type === 'enlaces') {
        div.innerHTML = header
          + '<div class="nc-links-rows"></div>'
          + '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncBlockAddLink(this)">+ Añadir enlace</button>';
        // add one empty row
        div.querySelector('.nc-links-rows').appendChild(ncMakeLinkRow('', ''));
      } else if (type === 'recuadro') {
        div.innerHTML = header + richToolbar
          + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:50px;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;background:var(--crema)" title="Texto del recuadro…"></div>'
          + '<div class="field" style="margin-top:.4rem"><label>Texto del botón</label><input type="text" class="nc-hl-label" placeholder="Ej.: ↓ Consultar aquí (PDF)" value="↓ Consultar aquí (PDF)"></div>'
          + '<div class="field"><label>URL del botón</label><div style="display:flex;gap:.4rem;align-items:center">'
          + '<input type="text" class="nc-hl-url" placeholder="Ej.: ../media/archivo.pdf" style="flex:1">'
          + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir archivo (PDF)"><input type="file" accept=".pdf,image/*" style="display:none" onchange="ncUploadBlockFile(this,\'nc-hl-url\',' + id + ')">Subir</label>'
          + '</div></div>';
      } else if (type === 'lista') {
        div.innerHTML = header
          + '<div class="nc-lista-entries"></div>'
          + '<button class="btn btn-outline btn-sm" style="margin-top:.4rem" onclick="ncBlockAddListEntry(this)">+ Añadir entrada</button>';
        ncBlockAddListEntry(div.querySelector('button[onclick*=ncBlockAddListEntry]'), true);
      } else if (type === 'imagegrid') {
        div.innerHTML = header
          + '<div class="field"><label>Columnas</label><select class="nc-igrid-cols"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select></div>'
          + '<div class="field"><label>Tamaño</label><select class="nc-igrid-size"><option value="small">Pequeña</option><option value="medium" selected>Normal</option><option value="large">Grande</option><option value="full">Completa</option></select></div>'
          + '<div class="nc-igrid-rows"></div>'
          + '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="ncBlockAddGridImg(this)">+ Añadir imagen</button>';
        ncBlockAddGridImg(div.querySelector('button[onclick*=ncBlockAddGridImg]'), true);
        ncBlockAddGridImg(div.querySelector('button[onclick*=ncBlockAddGridImg]'), true);
      } else if (type === 'html-directo') {
        div.innerHTML = header
          + '<textarea class="nc-rawhtml" style="font-family:monospace;font-size:.78rem;min-height:100px;width:100%;resize:vertical;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem" placeholder="Escribe HTML directo aquí…"></textarea>';
      }

      c.appendChild(div);
      initNcBlocksDrag();
      injectCollapseToggles();
    }

    function initNcBlocksDrag() {
      initDraggable('nc-blocks', '[data-ncbid]', function (srcCard, tgtCard) {
        var c2 = tgtCard.parentNode;
        var cards = Array.from(c2.children);
        var srcIdx = cards.indexOf(srcCard);
        var tgtIdx = cards.indexOf(tgtCard);
        if (srcIdx < tgtIdx) c2.insertBefore(srcCard, tgtCard.nextSibling);
        else c2.insertBefore(srcCard, tgtCard);
      });
    }

    function ncMakeLinkRow(label, url) {
      var d = document.createElement('div'); d.className = 'link-row nc-link-row';
      d.innerHTML = '<input type="text" placeholder="Texto del enlace" value="' + escA(label || '') + '">'
        + '<input type="text" placeholder="URL" value="' + escA(url || '') + '">'
        + '<button class="del-link" onclick="this.parentElement.remove()">×</button>';
      return d;
    }

    function ncBlockAddLink(btn) {
      var card = btn.closest('[data-ncbid]');
      if (!card) return;
      card.querySelector('.nc-links-rows').appendChild(ncMakeLinkRow('', ''));
    }

    function ncBlockAddListEntry(btn, skipConfirm) {
      var card = btn.closest('[data-ncbid]');
      if (!card) return;
      var container = card.querySelector('.nc-lista-entries');
      var idx = container.children.length;
      var entry = document.createElement('div');
      entry.className = 'nc-list-entry';
      entry.style.cssText = 'border:1px solid var(--borde);border-radius:4px;padding:.5rem;margin-bottom:.5rem';
      var richTb = '<div class="rich-toolbar" style="margin:.2rem 0">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
        + '</div>';
      entry.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem">'
        + '<span style="font-size:.72rem;font-weight:600;color:var(--azul)">Entrada ' + (idx + 1) + '</span>'
        + '<button class="del" title="Eliminar entrada" onclick="this.closest(\'.nc-list-entry\').remove()">✕</button>'
        + '</div>'
        + '<label style="font-size:.78rem;font-weight:600;margin-bottom:.2rem;display:block">Citación</label>'
        + richTb
        + '<div class="rich-edit" contenteditable="true" draggable="false" style="min-height:40px;border:1px solid var(--borde);border-radius:4px;padding:.3rem .4rem;background:var(--crema);margin-bottom:.4rem" title="Citación…"></div>'
        + '<label style="font-size:.78rem;font-weight:600;margin-bottom:.2rem;display:block">Nota descriptiva (opcional)</label>'
        + richTb
        + '<div class="rich-edit nc-list-note" contenteditable="true" draggable="false" style="min-height:30px;border:1px solid var(--borde);border-radius:4px;padding:.3rem .4rem;background:var(--crema)" title="Nota…"></div>';
      container.appendChild(entry);
    }

    function ncBlockAddGridImg(btn, skipConfirm) {
      var card = btn.closest('[data-ncbid]');
      if (!card) return;
      var container = card.querySelector('.nc-igrid-rows');
      var row = document.createElement('div');
      row.className = 'nc-igrid-row';
      row.style.cssText = 'display:flex;gap:.4rem;align-items:flex-end;margin-bottom:.4rem';
      row.innerHTML = '<div style="flex:1"><label style="font-size:.78rem;font-weight:600">Imagen</label>'
        + '<div class="img-picker">'
        + '<input type="text" class="nc-igrid-src" placeholder="../media/imagen.jpg" style="flex:1">'
        + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen"><input type="file" accept="image/*" style="display:none" onchange="ncUploadBlockImgInRow(this)">Subir</label>'
        + '</div></div>'
        + '<div style="flex:1"><label style="font-size:.78rem;font-weight:600">Texto alternativo</label>'
        + '<input type="text" class="nc-igrid-alt" placeholder="Alt de la imagen"></div>'
        + '<button class="del-link" onclick="this.closest(\'.nc-igrid-row\').remove()" title="Eliminar imagen">×</button>';
      container.appendChild(row);
    }

    async function ncUploadBlockImg(fileInput, cls, bid) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      toast('Subiendo imagen…', 'info');
      try {
        var r = await fetch('/api/upload-image?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (!data.filename) throw new Error(data.error || 'Sin ruta');
        var card = fileInput.closest('[data-ncbid]');
        if (card) { var inp = card.querySelector('.' + cls); if (inp) inp.value = '../media/' + data.filename; }
        toast('Imagen subida', 'ok');
      } catch (e) { toast('Error al subir: ' + e.message, 'err'); }
    }

    async function ncUploadBlockImgInRow(fileInput) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      toast('Subiendo imagen…', 'info');
      try {
        var r = await fetch('/api/upload-image?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (!data.filename) throw new Error(data.error || 'Sin ruta');
        var row = fileInput.closest('.nc-igrid-row');
        if (row) { var inp = row.querySelector('.nc-igrid-src'); if (inp) inp.value = '../media/' + data.filename; }
        toast('Imagen subida', 'ok');
      } catch (e) { toast('Error al subir: ' + e.message, 'err'); }
    }

    async function ncUploadBlockFile(fileInput, cls, bid) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      toast('Subiendo archivo…', 'info');
      try {
        var r = await fetch('/api/upload-image?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (!data.filename) throw new Error(data.error || 'Sin ruta');
        var card = fileInput.closest('[data-ncbid]');
        if (card) { var inp = card.querySelector('.' + cls); if (inp) inp.value = '../media/' + data.filename; }
        toast('Archivo subido', 'ok');
      } catch (e) { toast('Error al subir: ' + e.message, 'err'); }
    }

    function ncAddLink() {
      var c = document.getElementById('nc-links');
      var d = document.createElement('div'); d.className = 'link-row';
      d.innerHTML = '<input type="text" placeholder="Texto del enlace"><input type="text" placeholder="URL"><button class="del-link" onclick="this.parentElement.remove()">×</button>';
      c.appendChild(d);
    }

    function ncAddEvLink() {
      var c = document.getElementById('nc-ev-links');
      var d = document.createElement('div'); d.className = 'link-row';
      d.innerHTML = '<input type="text" placeholder="Texto (ej.: Programa en PDF)"><input type="text" placeholder="URL o ruta">'
        + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir PDF u otro archivo" style="padding:.3rem .5rem;cursor:pointer">'
        + '<input type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.webp" style="display:none" onchange="uploadEvLinkFile(this)">Subir</label>'
        + '<button class="del-link" onclick="this.parentElement.remove()">×</button>';
      c.appendChild(d);
    }

    async function uploadEvLinkFile(fileInput) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      toast('Subiendo archivo…', 'info');
      try {
        var r = await fetch('/api/upload-image?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (data.ok) {
          var row = fileInput.closest('.link-row');
          var urlInput = row.querySelectorAll('input[type=text]')[1];
          if (urlInput) urlInput.value = '../media/' + data.filename;
          toast('Archivo subido: ' + data.filename, 'ok');
        } else {
          toast('Error: ' + (data.error || 'fallo al subir'), 'err');
        }
      } catch (e) {
        toast('Error de conexión', 'err');
      }
    }

    function ncGetLinks(containerId) {
      var result = [];
      document.querySelectorAll('#' + containerId + ' .link-row').forEach(function (row) {
        var inputs = row.querySelectorAll('input[type=text]');
        if (inputs.length >= 2 && inputs[0].value.trim() && inputs[1].value.trim())
          result.push({ label: inputs[0].value.trim(), url: inputs[1].value.trim() });
      });
      return result;
    }

    function ncGetBlocks() {
      var blocks = [];
      document.querySelectorAll('#nc-blocks [data-ncbid]').forEach(function (el) {
        var type = el.dataset.ncbtype;
        if (type === 'figura') {
          var src = (el.querySelector('.nc-fig-src') || {}).value || '';
          var alt = (el.querySelector('.nc-fig-alt') || {}).value || '';
          var capEl = el.querySelector('.nc-fig-cap');
          var cap = capEl ? capEl.innerHTML.trim() : '';
          var posEl = el.querySelector('.nc-fig-pos');
          var figPosVal = posEl ? posEl.value : 'right';
          var szEl = el.querySelector('.nc-fig-size');
          var sz = szEl ? szEl.value : 'medium';
          if (src.trim()) blocks.push({ type: 'figura', src: src.trim(), alt: alt.trim(), caption: cap, position: figPosVal, size: sz });
        } else if (type === 'enlaces') {
          var links = [];
          el.querySelectorAll('.nc-link-row').forEach(function (row) {
            var ins = row.querySelectorAll('input[type=text]');
            if (ins.length >= 2) links.push({ label: ins[0].value.trim(), url: ins[1].value.trim() });
          });
          if (links.length) blocks.push({ type: 'enlaces', links: links });
        } else if (type === 'recuadro') {
          var ed = el.querySelector('.rich-edit');
          var html = ed ? ed.innerHTML.trim() : '';
          var btnLabel = (el.querySelector('.nc-hl-label') || {}).value || '';
          var btnUrl = (el.querySelector('.nc-hl-url') || {}).value || '';
          if (html && html !== '<br>') blocks.push({ type: 'recuadro', text: html, btnLabel: btnLabel.trim(), btnUrl: btnUrl.trim() });
        } else if (type === 'lista') {
          var items = [];
          el.querySelectorAll('.nc-list-entry').forEach(function (entry) {
            var eds = entry.querySelectorAll('.rich-edit');
            var main = eds[0] ? eds[0].innerHTML.trim() : '';
            var note = eds[1] ? eds[1].innerHTML.trim() : '';
            if (main && main !== '<br>') items.push({ main: main, note: note });
          });
          if (items.length) blocks.push({ type: 'lista', items: items });
        } else if (type === 'imagegrid') {
          var colsEl = el.querySelector('.nc-igrid-cols');
          var cols = colsEl ? parseInt(colsEl.value) || 2 : 2;
          var gszEl = el.querySelector('.nc-igrid-size');
          var gsz = gszEl ? gszEl.value : 'medium';
          var imgs = [];
          el.querySelectorAll('.nc-igrid-row').forEach(function (row) {
            var src = (row.querySelector('.nc-igrid-src') || {}).value || '';
            var alt = (row.querySelector('.nc-igrid-alt') || {}).value || '';
            imgs.push({ src: src.trim(), alt: alt.trim() });
          });
          blocks.push({ type: 'imagegrid', cols: cols, size: gsz, imgs: imgs });
        } else if (type === 'html-directo') {
          var ta = el.querySelector('.nc-rawhtml');
          var raw = ta ? ta.value.trim() : '';
          if (raw) blocks.push({ type: 'html-directo', html: raw });
        } else {
          var ed = el.querySelector('.rich-edit');
          var html = ed ? ed.innerHTML.trim() : '';
          if (html && html !== '<br>') blocks.push({ type: type, text: html });
        }
      });
      return blocks;
    }

    async function createNews() {
      var tipo = document.getElementById('nc-tipo').value;
      var cat = ncGetCat();
      var tituloEl = document.getElementById('nc-titulo');
      var titulo = tituloEl ? tituloEl.innerHTML.trim() : '';
      var tituloPlain = titulo.replace(/<[^>]+>/g, '');
      var slug = document.getElementById('nc-slug').value.trim();
      var fechaLarga = document.getElementById('nc-fecha').value.trim();
      var fechaCorta = ncGetFechaCorta();
      var breadcrumb = document.getElementById('nc-breadcrumb').value.trim();
      var tituloSeo = document.getElementById('nc-seo').value.trim();
      var imgInput = document.getElementById('nc-img');
      var imgRaw = imgInput ? imgInput.value.trim() : '';
      var imagenAlt = document.getElementById('nc-img-alt').value.trim();
      var excerpt = document.getElementById('nc-excerpt').value.trim();
      var searchDesc = document.getElementById('nc-search-desc').value.trim();
      var contentBlocks = ncGetBlocks();
      var links = ncGetLinks('nc-links');
      var evTitulo = document.getElementById('nc-ev-titulo').value.trim();
      var evSubtitulo = document.getElementById('nc-ev-subtitulo').value.trim();
      var evFechas = document.getElementById('nc-ev-fechas').value.trim();
      var evLugar = document.getElementById('nc-ev-lugar').value.trim();
      var evLinks = ncGetLinks('nc-ev-links');

      // Validation
      var errors = [];
      if (!tituloPlain) errors.push('título');
      if (!slug) errors.push('nombre del archivo (slug)');
      if (!fechaLarga || fechaCorta === '—') errors.push('fecha');
      if (!cat) errors.push('categoría');
      if (!breadcrumb) errors.push('breadcrumb');
      if (!tituloSeo) errors.push('título SEO');
      if (!excerpt) errors.push('extracto');
      if (!contentBlocks.length) errors.push('al menos un bloque de contenido');
      if (errors.length) { toast('Faltan campos: ' + errors.join(', '), 'err'); return; }

      // Normalize image path: always store as ../media/xxx or empty
      var imgPath = '';
      if (imgRaw) {
        var imgFilename = imgRaw.replace(/^(\.\.\/)?media\//, '');
        imgPath = '../media/' + imgFilename;
      }
      var filename = 'noticia-' + slug + '.html';

      toast('Creando noticia…', 'info');

      var html = ncGenerateHtml({ tipo, cat, titulo, tituloPlain, slug, fechaLarga, fechaCorta, breadcrumb, tituloSeo, imgPath, imagenAlt, excerpt, contentBlocks, links, evTitulo, evSubtitulo, evFechas, evLugar, evLinks, filename });

      try {
        var r = await fetch('/api/page?path=noticias/' + filename, { method: 'POST', headers: { 'Content-Type': 'text/html; charset=utf-8' }, body: html });
        var data = await r.json();
        if (!data.ok) { toast('Error al guardar HTML: ' + (data.error || ''), 'err'); return; }
      } catch (e) { toast('Error de conexión', 'err'); return; }

      // Update noticias-data.js
      try { await ncUpdateNoticiasData({ tipo, cat, fechaCorta, tituloPlain, excerpt, imgPath, filename, contentBlocks, links, evLinks }); }
      catch (e) { toast('HTML guardado pero error en noticias-data.js: ' + e.message, 'err'); }

      // Update search-data.js
      try { await ncUpdateSearchData({ tituloPlain, filename, searchDesc, excerpt, cat, fechaCorta, contentBlocks, links, evLinks, tipo }); }
      catch (e) { /* silent */ }

      // Refresh page list and nav
      try { var pr = await fetch('/api/pages'); S.pages = await pr.json(); renderNav(); } catch (e) { }

      toast('Noticia «' + tituloPlain + '» creada correctamente', 'ok');
      setTimeout(function () { loadPage('noticias/' + filename); }, 1000);
    }

    async function ncUpdateNoticiasData(data) {
      var src = await (await fetch('/api/page?path=noticias-data.js')).text();
      var newsArr = [];
      try { newsArr = new Function(src.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var') + ';return typeof news!=="undefined"?news:[];')(); } catch (e) { }
      var maxId = 0;
      newsArr.forEach(function (n) { if ((n.id || 0) > maxId) maxId = n.id; });
      var id = maxId + 1;
      var allLinks = data.links.concat(data.tipo === 'evento' ? data.evLinks : []);
      var imgForData = data.imgPath || '../media/fondo-noticias.jpg';
      var paras = data.contentBlocks.filter(function (b) { return b.type === 'parrafo'; });
      var newEntry = {
        id: id, cat: data.cat, date: data.fechaCorta, title: data.tituloPlain,
        excerpt: data.excerpt, img: imgForData, url: data.filename,
        content: paras.map(function (b) { return b.text.replace(/<[^>]+>/g, ''); }),
        links: allLinks
      };
      newsArr.unshift(newEntry);
      var newSrc = ncSerializeNoticiasData(newsArr);
      await fetch('/api/page?path=noticias-data.js', { method: 'POST', headers: { 'Content-Type': 'application/javascript; charset=utf-8' }, body: newSrc });
    }

    async function ncUpdateSearchData(data) {
      var src = await (await fetch('/api/page?path=search-data.js')).text();
      var desc = (data.searchDesc || data.excerpt).replace(/"/g, '\\"');
      var content = ncBuildSearchContent(data).replace(/"/g, '\\"');
      var entry = '  {\n';
      entry += '    title: "' + data.tituloPlain.replace(/"/g, '\\"') + '",\n';
      entry += '    url: "noticias/' + data.filename + '",\n';
      entry += '    description: "' + desc + '",\n';
      entry += '    content: "' + content + '"\n';
      entry += '  },';
      var idx = src.indexOf('SEARCH_INDEX = [');
      if (idx === -1) idx = src.indexOf('SEARCH_INDEX=[');
      if (idx === -1) return;
      var lineEnd = src.indexOf('\n', idx);
      var newSrc = src.substring(0, lineEnd + 1) + entry + '\n' + src.substring(lineEnd + 1);
      await fetch('/api/page?path=search-data.js', { method: 'POST', headers: { 'Content-Type': 'application/javascript; charset=utf-8' }, body: newSrc });
    }

    function ncBuildSearchContent(data) {
      var parts = [data.tituloPlain, data.cat, data.fechaCorta, data.excerpt];
      (data.contentBlocks || []).forEach(function (b) { if (b.text) parts.push(b.text.replace(/<[^>]+>/g, '')); });
      (data.links || []).forEach(function (l) { parts.push(l.label); });
      (data.evLinks || []).forEach(function (l) { parts.push(l.label); });
      var text = parts.join(' ');
      var normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      var STOP = ['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'a', 'un', 'una', 'que', 'por', 'con', 'se', 'es', 'al', 'lo', 'su', 'no', 'para'];
      var seen = {}, unique = [];
      (text + ' ' + normalized).toLowerCase().split(/\W+/).forEach(function (w) {
        if (w.length > 2 && STOP.indexOf(w) === -1 && !seen[w]) { seen[w] = true; unique.push(w); }
      });
      return unique.join(' ');
    }

    function ncGenerateHtml(d) {
      var tipo = d.tipo, cat = d.cat, titulo = d.titulo, tituloPlain = d.tituloPlain;
      var fechaLarga = d.fechaLarga, breadcrumb = d.breadcrumb, tituloSeo = d.tituloSeo;
      var imgPath = d.imgPath, imagenAlt = d.imagenAlt, contentBlocks = d.contentBlocks;
      var links = d.links, evTitulo = d.evTitulo, evSubtitulo = d.evSubtitulo;
      var evFechas = d.evFechas, evLugar = d.evLugar, evLinks = d.evLinks;

      // Content block HTML
      var cH = '';
      if (tipo === 'evento') {
        cH += '\n      <div class="event-box">\n';
        if (imgPath) {
          cH += '        <div class="event-box-img-wrap" onclick="openLightbox(\'' + imgPath + '\')">\n';
          cH += '          <img src="' + imgPath + '" alt="' + esc(imagenAlt) + '" />\n';
          cH += '          <span class="zoom-hint" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
          cH += '        </div>\n';
        }
        cH += '        <div class="event-box-info">\n';
        cH += '          <div class="event-box-title">' + esc(evTitulo || tituloPlain);
        if (evSubtitulo) cH += '<br><em style="font-weight:400;font-size:0.88rem">' + esc(evSubtitulo) + '</em>';
        cH += '</div>\n';
        cH += '          <ul class="event-box-meta">\n';
        cH += '            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' + esc(evFechas) + '</li>\n';
        cH += '            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' + esc(evLugar) + '</li>\n';
        cH += '          </ul>\n';
        if (evLinks.length) {
          cH += '          <div class="event-box-links">\n';
          evLinks.forEach(function (l) { cH += '            <a class="event-box-link" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' + esc(l.label) + '</a>\n'; });
          cH += '          </div>\n';
        }
        cH += '        </div>\n      </div>\n';
      } else if (imgPath) {
        cH += '\n      <div class="article-figure">\n';
        cH += '        <div class="article-figure-img-wrap" onclick="openLightbox(\'' + imgPath + '\')">\n';
        cH += '          <img src="' + imgPath + '" alt="' + esc(imagenAlt) + '" />\n';
        cH += '          <span class="zoom-hint" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
        cH += '        </div>\n      </div>\n';
      }
      contentBlocks.forEach(function (b) {
        if (b.type === 'titulo') {
          cH += '\n      <h2 class="article-lead-title">' + b.text + '</h2>\n';
        } else if (b.type === 'subtitulo') {
          cH += '\n      <p class="article-lead-subtitle">' + b.text + '</p>\n';
        } else if (b.type === 'figura') {
          var ncFigPos = b.position || 'right', ncFigSz = b.size || 'medium';
          var fc = (ncFigPos === 'left') ? 'inline-figure-left' : 'inline-figure';
          var ncFigSizeBase = { small: 'width:150px', medium: '', large: 'width:380px', full: 'float:none;clear:both;width:100%;margin:1.5rem 0' };
          var ncFigSS = ncFigSizeBase[ncFigSz] || '';
          if (ncFigPos === 'center' && ncFigSz !== 'full') ncFigSS = (ncFigSS ? ncFigSS + ';' : '') + 'float:none;clear:both;margin-left:auto;margin-right:auto;display:block';
          var ncFigWrapStyle = (ncFigSz === 'full') ? ' style="display:block;max-width:100%"' : '';
          cH += '\n      <figure class="' + fc + '"' + (ncFigSS ? ' style="' + ncFigSS + '"' : '') + '>' + '\n';
          cH += '        <div class="article-figure-img-wrap"' + ncFigWrapStyle + ' onclick="openLightbox(\'' + escA(b.src).replace(/'/g, '\\\'') + '\')">\n';
          cH += '          <img src="' + escA(b.src) + '" alt="' + escA(b.alt) + '" />\n';
          cH += '          <span class="zoom-hint" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
          cH += '        </div>\n';
          if (b.caption) cH += '        <figcaption>' + b.caption + '</figcaption>\n';
          cH += '      </figure>\n';
        } else if (b.type === 'cita') {
          cH += '\n      <div class="pull-quote">\n        ' + b.text + '\n      </div>\n';
        } else if (b.type === 'enlaces') {
          if (b.links && b.links.length) {
            cH += '\n      <div class="article-links" data-block="enlaces">\n';
            b.links.forEach(function (l) {
              if (!l.label || !l.url) return;
              cH += '        <a class="article-ext-link" href="' + escA(l.url) + '" target="_blank" rel="noopener noreferrer">'
                + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
                + esc(l.label) + '</a>\n';
            });
            cH += '      </div>\n';
          }
        } else if (b.type === 'recuadro') {
          cH += '\n      <div class="book-highlight">\n';
          cH += '        <p>\n          ' + b.text + '\n        </p>\n';
          if (b.btnUrl) {
            cH += '        <a class="btn-consultar" href="' + escA(b.btnUrl) + '" target="_blank" rel="noopener noreferrer">\n';
            cH += '          ' + esc(b.btnLabel || '↓ Consultar aquí') + '\n        </a>\n';
          }
          cH += '      </div>\n';
        } else if (b.type === 'lista') {
          cH += '\n      <ul class="biblio-list">\n';
          (b.items || []).forEach(function (item) {
            var noteClean = (item.note || '').replace(/<br\s*\/?>/gi, '').trim();
            cH += '\n        <li>\n          ' + item.main;
            if (noteClean && noteClean !== '<br>') cH += '\n          <span class="biblio-note">' + item.note + '</span>';
            cH += '\n        </li>\n';
          });
          cH += '      </ul>\n';
        } else if (b.type === 'imagegrid') {
          var gcols = b.cols || 2;
          var gtc = Array(gcols).fill('1fr').join(' ');
          var ncGridSizeStyles = { small: 'max-width:400px;margin-left:auto;margin-right:auto', medium: '', large: 'max-width:700px;margin-left:auto;margin-right:auto', full: '' };
          var ncGridSS = ncGridSizeStyles[b.size || 'medium'] || '';
          var ncGridStyle = 'display: grid; grid-template-columns: ' + gtc + '; gap: 1rem;' + (ncGridSS ? ' ' + ncGridSS : '');
          cH += '\n      <div class="article-imagegrid" style="' + ncGridStyle + '">\n';
          (b.imgs || []).forEach(function (img) {
            cH += '        <figure class="inline-figure" style="float: none; width: 100%; margin: 0;">\n';
            cH += '          <div class="article-figure-img-wrap" onclick="openLightbox(\'' + escA(img.src).replace(/'/g, '\\\'') + '\')">\n';
            cH += '            <img src="' + escA(img.src) + '" alt="' + escA(img.alt) + '" />\n';
            cH += '            <span class="zoom-hint" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
            cH += '          </div>\n        </figure>\n';
          });
          cH += '      </div>\n';
        } else if (b.type === 'html-directo') {
          cH += '\n' + (b.html || '') + '\n';
        } else {
          cH += '\n      <p>' + b.text + '</p>\n';
        }
      });
      if (links.length) {
        cH += '\n      <div class="article-links">\n';
        links.forEach(function (l) { cH += '        <a class="article-ext-link" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' + esc(l.label) + '</a>\n'; });
        cH += '      </div>\n';
      }

      // Full page HTML
      var H = '<!DOCTYPE html>\n<html lang="es">\n<head>\n';
      H += '  <link rel="icon" href="../media/favicon_5.gif" type="image/gif" />\n';
      H += '  <meta charset="UTF-8" />\n';
      H += '  <meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src \'self\' data:; frame-src https://www.google.com; base-uri \'self\'; connect-src \'self\'" />\n';
      H += '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n';
      H += '  <title>' + esc(tituloSeo || tituloPlain) + ' | PROLOPE</title>\n';
      H += '  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n';
      H += '  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />\n';
      H += '  <link rel="stylesheet" href="../prolope.css" />\n';
      H += '  <script>(function(){var t=localStorage.getItem(\'theme\');if(t===\'dark\'||(!t&&window.matchMedia(\'(prefers-color-scheme:dark)\').matches))document.documentElement.setAttribute(\'data-theme\',\'dark\');})();<\/script>\n\n</head>\n<body>\n\n\n';

      H += '  <!-- HEADER -->\n  <header>\n    <div class="header-inner">\n';
      H += '      <a href="../index.html" class="logo-link"><img src="../media/logo-menu.png" alt="PROLOPE" /></a>\n';
      H += '      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú"><span></span><span></span><span></span></button>\n';
      H += '      <nav class="main-nav" id="mainNav">\n        <ul>\n';
      H += '          <li class="has-dropdown"><span>El grupo <small>▾</small></span><div class="dropdown"><ul><li><a href="../el-grupo/el-grupo.html">El grupo de investigación</a></li><li><a href="../el-grupo/historial-proyectos.html">Historial de proyectos</a></li><li><a href="../el-grupo/estatutos.html">Estatutos del grupo</a></li><li><a href="../el-grupo/miembros.html">Miembros</a></li><li><a href="../el-grupo/contacto.html">Contacto y ubicación</a></li></ul></div></li>\n';
      H += '          <li class="has-dropdown"><span>Objetivos <small>▾</small></span><div class="dropdown"><ul><li><a href="../objetivos/vida-obra.html">Vida y obra de Lope de Vega</a></li><li><a href="../objetivos/transmision.html">Transmisión y edición del teatro de Lope de Vega</a></li><li><a href="../objetivos/criterios.html">Criterios y materiales para la edición</a></li></ul></div></li>\n';
      H += '          <li class="has-dropdown"><span>Publicaciones <small>▾</small></span><div class="dropdown"><ul><li><a href="../publicaciones/partes-comedias.html">Partes de comedias</a></li><li><a href="https://revistes.uab.cat/anuariolopedevega/index" target="_blank" rel="noopener noreferrer">Anuario Lope de Vega</a></li><li><a href="../publicaciones/otras-publicaciones.html">Otras publicaciones</a></li></ul></div></li>\n';
      H += '          <li class="has-dropdown"><span>Proyectos digitales <small>▾</small></span><div class="dropdown"><ul><li><a href="../proyectos-digitales/biblioteca-virtual.html">Biblioteca virtual</a></li><li><a href="https://prolope.uab.cat/biblioteca/" target="_blank" rel="noopener noreferrer">Biblioteca Digital Prolope</a></li><li><a href="../proyectos-digitales/mujeres-criados.html">Mujeres y criados</a></li><li><a href="../proyectos-digitales/mapping-lope.html">Mapping Lope</a></li><li><a href="https://theatheor-fe.netseven.it" target="_blank" rel="noopener noreferrer">AUTESO</a></li><li><a href="../proyectos-digitales/la-dama-boba.html">La dama boba</a></li><li><a href="../proyectos-digitales/gondomar.html">Gondomar Digital</a></li></ul></div></li>\n';
      H += '          <li class="has-dropdown"><span>Formación <small>▾</small></span><div class="dropdown"><ul><li><a href="../formacion/tesis.html">Tesis</a></li></ul></div></li>\n';
      H += '          <li class="has-dropdown"><span>Eventos <small>▾</small></span><div class="dropdown"><ul><li><a href="../eventos/congresos.html">Congresos</a></li><li><a href="../eventos/seminarios.html">Seminarios</a></li></ul></div></li>\n';
      H += '          <li><a href="../multimedia/multimedia.html">Multimedia</a></li>\n';
      H += '          <li><a href="noticias.html">Noticias</a></li>\n';
      H += '        </ul>\n      </nav>\n';
      H += '      <button class="theme-toggle" id="themeToggle" aria-label="Alternar modo noche" title="Modo noche"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></button>\n';
      H += '      <button class="site-search-btn" id="siteSearchBtn" aria-label="Buscar en el sitio"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>\n';
      H += '      <div class="site-search-inline"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" id="siteSearchInput" placeholder="Buscar en el sitio…" autocomplete="off" /><button class="site-search-close" id="siteSearchClose" aria-label="Cerrar búsqueda">✕</button><div class="site-search-dropdown" id="siteSearchDropdown"><div id="siteSearchCount" class="site-search-count"></div><div id="siteSearchResults" class="site-search-results"></div></div></div>\n';
      H += '    </div>\n  </header>\n\n';

      H += '  <!-- HERO -->\n  <section class="article-hero">\n';
      H += '    <div class="article-hero-bg" style="background-image: url(\'../media/fondo-noticias.jpg\'); background-size: fill; background-repeat: no-repeat; background-position: right; opacity: 0.15;"></div>\n';
      H += '    <div class="article-hero-inner">\n';
      H += '      <p class="article-breadcrumb"><a href="../index.html">Inicio</a><span>›</span><a href="noticias.html">Noticias</a><span>›</span>' + esc(breadcrumb || tituloPlain) + '</p>\n';
      H += '      <span class="article-cat-badge">' + esc(cat) + '</span>\n';
      H += '      <h1>' + titulo + '</h1>\n';
      H += '      <div class="article-hero-meta"><span class="article-date">' + esc(fechaLarga) + '</span></div>\n';
      H += '      <div class="article-hero-rule"></div>\n';
      H += '    </div>\n  </section>\n\n';

      H += '  <!-- LAYOUT -->\n  <div class="article-layout">\n\n';
      H += '    <!-- MAIN CONTENT -->\n    <article class="article-body">\n';
      H += cH;
      H += '\n      <div style="clear:both"></div>\n\n';
      H += '      <a class="back-link" href="noticias.html">← Volver a todas las noticias</a>\n\n';
      H += '    </article>\n\n';

      H += '    <!-- SIDEBAR -->\n    <aside class="article-sidebar">\n';
      H += '      <div class="sidebar-card">\n        <div class="sidebar-card-header"><h3>Noticias recientes</h3></div>\n';
      H += '        <ul class="sidebar-news-list"></ul>\n';
      H += '        <a class="sidebar-all-link" href="noticias.html">Ver todas las noticias →</a>\n';
      H += '      </div>\n    </aside>\n\n';
      H += '  </div>\n\n';

      H += '  <!-- LIGHTBOX -->\n  <div class="lightbox" id="lightbox" onclick="closeLightbox()">\n';
      H += '    <button class="lightbox-close" onclick="closeLightbox()" aria-label="Cerrar">✕</button>\n';
      H += '    <img id="lightbox-img" src="" alt="" />\n  </div>\n';
      H += '  <script>function openLightbox(src){document.getElementById(\'lightbox-img\').src=src;document.getElementById(\'lightbox\').classList.add(\'open\');document.body.style.overflow=\'hidden\';}function closeLightbox(){document.getElementById(\'lightbox\').classList.remove(\'open\');document.body.style.overflow=\'\';}document.addEventListener(\'keydown\',function(e){if(e.key===\'Escape\')closeLightbox();});document.addEventListener(\'click\',function(e){var w=e.target.closest(\'.article-figure-img-wrap,.event-box-img-wrap\');if(!w)return;var img=w.querySelector(\'img\');if(img)openLightbox(img.src);});<\/script>\n\n';

      H += '  <!-- FUNDERS -->\n  <section class="funders">\n    <div class="funders-inner">\n      <p class="funders-title">Entidades financiadoras</p>\n      <div class="funders-logos">\n';
      H += '        <a class="funder-logo-link" href="https://www.march.es/" target="_blank" rel="noopener noreferrer"><img src="../media/fundacion-march.png" alt="Fundación March" /></a>\n';
      H += '        <a class="funder-logo-link" href="https://www.culturaydeporte.gob.es/" target="_blank" rel="noopener noreferrer"><img src="../media/ace.png" alt="ACE" /></a>\n';
      H += '        <a class="funder-logo-link" href="https://agaur.gencat.cat/" target="_blank" rel="noopener noreferrer"><img src="../media/agaur_gencat.png" alt="AGAUR Gencat" /></a>\n';
      H += '        <a class="funder-logo-link" href="https://www.ciencia.gob.es/" target="_blank" rel="noopener noreferrer"><img src="../media/ministerio-feder.png" alt="Ministerio / FEDER" /></a>\n';
      H += '        <a class="funder-logo-link" href="https://www.uab.cat/" target="_blank" rel="noopener noreferrer"><img src="../media/uab.png" alt="UAB" /></a>\n';
      H += '      </div>\n    </div>\n  </section>\n\n';

      H += '  <!-- FOOTER -->\n  <footer>\n    <div class="footer-inner">\n';
      H += '      <div class="footer-logo"><img src="../media/logo-prolope_inici.png" alt="PROLOPE" /></div>\n';
      H += '      <address class="footer-address" style="font-style:normal;">Grupo de investigación PROLOPE.<br />Departament de Filologia Espanyola.<br /><br />Facultat de Filosofia i Lletres UAB<br />CAMPUS DE LA UAB<br />Carrer de la fortuna s/n<br />08193 Bellaterra (Barcelona)</address>\n';
      H += '      <div class="footer-contact">Teléfono (Secretaría): <a href="tel:+34935811034">93 581 10 34</a><br />Correo: <a href="mailto:prolope@uab.es">prolope@uab.es</a><div class="footer-social"><a href="https://twitter.com/ProlopeUab" target="_blank" rel="noopener noreferrer" title="Seguir en X">𝕏</a><a href="https://www.facebook.com/prolope.uab" target="_blank" rel="noopener noreferrer" title="Seguir en Facebook">f</a></div></div>\n';
      H += '    </div>\n    <div class="footer-bottom">© 2025 Grupo de Investigación PROLOPE – Universitat Autònoma de Barcelona</div>\n  </footer>\n\n';

      H += '  <script>(function(){if(!(\'IntersectionObserver\'in window))return;var els=document.querySelectorAll(\'.card,.sidebar-card,.founder-card,.news-card,.video-card,.congress-card,.funders,.inline-figure,.inline-figure-left,.event-box,.article-figure\');if(!els.length)return;els.forEach(function(el){el.style.opacity=\'0\';el.style.transform=\'translateY(30px)\';});var obs=new IntersectionObserver(function(entries){var v=entries.filter(function(e){return e.isIntersecting;});v.forEach(function(e,i){e.target.style.transition=\'opacity 0.5s ease-out \'+(i*0.07)+\'s, transform 0.5s ease-out \'+(i*0.07)+\'s\';e.target.style.opacity=\'1\';e.target.style.transform=\'translateY(0)\';obs.unobserve(e.target);});},{threshold:0.1});els.forEach(function(el){obs.observe(el);});})();<\/script>\n';
      H += '  <script>const toggle=document.getElementById(\'menuToggle\');const nav=document.getElementById(\'mainNav\');toggle.addEventListener(\'click\',()=>{nav.classList.toggle(\'open\');document.body.classList.toggle(\'menu-open\',nav.classList.contains(\'open\'));});document.querySelectorAll(\'.has-dropdown > span\').forEach(function(el){el.addEventListener(\'click\',function(){if(window.innerWidth<=1100){el.parentElement.classList.toggle(\'open\');}});});<\/script>\n\n';
      H += '  <script src="../noticias-data.js"><\/script>\n';
      H += '  <script src="../sidebar-noticias.js"><\/script>\n';
      H += '  <script>var SITE_ROOT=\'../\';<\/script>\n';
      H += '  <script src="../search-data.js"><\/script>\n';
      H += '  <script src="../site-search.js"><\/script>\n';
      H += '  <script>(function(){var toggle=document.getElementById(\'themeToggle\');var saved=localStorage.getItem(\'theme\');if(saved===\'dark\'||(!saved&&window.matchMedia(\'(prefers-color-scheme: dark)\').matches)){document.documentElement.setAttribute(\'data-theme\',\'dark\');toggle.innerHTML=\'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>\';}toggle.addEventListener(\'click\',function(){var isDark=document.documentElement.getAttribute(\'data-theme\')===\'dark\';if(isDark){document.documentElement.removeAttribute(\'data-theme\');localStorage.setItem(\'theme\',\'light\');toggle.innerHTML=\'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>\';}else{document.documentElement.setAttribute(\'data-theme\',\'dark\');localStorage.setItem(\'theme\',\'dark\');toggle.innerHTML=\'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>\';}});})();<\/script>\n';
      H += '</body>\n</html>\n';
      return H;
    }
