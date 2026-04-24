    // ── RECURSOS MULTIMEDIA ──────────────────────────────────────────────────────
    var _recursosSort = { col: 'name', dir: 1 };
    var _recursosFiles = [];

    async function loadRecursos() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__recursos__'); });
      document.getElementById('topbar').style.display = 'none';
      var _wsX = document.getElementById('welcomeScreen'); if (_wsX) _wsX.style.display = 'none';
      document.getElementById('edBody').innerHTML = '<p style="padding:2rem;opacity:.5">Cargando recursos…</p>';
      try {
        var r = await fetch('/api/media-all');
        _recursosFiles = await r.json();
        renderRecursos();
      } catch (e) {
        document.getElementById('edBody').innerHTML = '<p style="padding:2rem;color:red">Error al cargar recursos: ' + esc(e.message) + '</p>';
      }
    }

    function renderRecursos() {
      var files = _recursosFiles;
      var sort = _recursosSort;
      var sorted = files.slice().sort(function (a, b) {
        var av = a[sort.col] || '', bv = b[sort.col] || '';
        return av < bv ? -sort.dir : av > bv ? sort.dir : 0;
      });

      var th = function (col, label) {
        var active = sort.col === col;
        var arrow = active ? (sort.dir === 1 ? ' ▲' : ' ▼') : '';
        return '<th style="cursor:pointer;user-select:none;white-space:nowrap" onclick="recursosSetSort(\'' + col + '\')">' + label + arrow + '</th>';
      };

      var typeIcon = { imagen: '🖼', 'vídeo': '🎬', pdf: '📄', otro: '📁' };

      var rows = sorted.map(function (f) {
        var icon = typeIcon[f.type] || '📁';
        var isImg = f.type === 'imagen';
        var preview = isImg
          ? '<img src="media/' + escA(f.name) + '" style="width:48px;height:36px;object-fit:cover;border-radius:3px;vertical-align:middle">'
          : '<span style="font-size:1.4rem;vertical-align:middle">' + icon + '</span>';
        var size = f.size < 1024 ? f.size + 'B' : f.size < 1048576 ? Math.round(f.size / 1024) + 'KB' : (f.size / 1048576).toFixed(1) + 'MB';
        var date = f.date ? new Date(f.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
        return '<tr>'
          + '<td style="width:60px;text-align:center">' + preview + '</td>'
          + '<td><span title="' + escA(f.name) + '">' + esc(f.name) + '</span></td>'
          + '<td style="white-space:nowrap">' + icon + ' ' + esc(f.type) + '</td>'
          + '<td style="white-space:nowrap">' + esc(size) + '</td>'
          + '<td style="white-space:nowrap">' + esc(date) + '</td>'
          + '</tr>';
      }).join('');

      var h = '<div class="ed-section" style="padding:1.5rem">';
      h += '<h2 style="margin-bottom:1rem">Recursos multimedia</h2>';
      h += '<p class="help" style="margin-bottom:1rem">Todos los archivos en la carpeta <code>media/</code>. Puedes subir imágenes, vídeos y PDFs.</p>';
      h += '<div style="display:flex;gap:.8rem;margin-bottom:1.2rem;flex-wrap:wrap;align-items:center">';
      h += '<label class="btn btn-green" style="cursor:pointer" title="Subir archivos a media/">'
        + '<input type="file" accept="image/*,video/*,.pdf" multiple style="display:none" onchange="uploadRecursos(this)">'
        + 'Subir archivos</label>';
      h += '<span style="opacity:.5;font-size:.85rem">' + files.length + ' archivo' + (files.length !== 1 ? 's' : '') + '</span>';
      h += '</div>';
      h += '<div style="overflow-x:auto">';
      h += '<table style="width:100%;border-collapse:collapse;font-size:.86rem">';
      h += '<thead><tr style="border-bottom:2px solid var(--borde)">';
      h += '<th style="width:60px"></th>';
      h += th('name', 'Nombre');
      h += th('type', 'Tipo');
      h += '<th>Tamaño</th>';
      h += th('date', 'Fecha');
      h += '</tr></thead>';
      h += '<tbody id="recursosBody">' + rows + '</tbody>';
      h += '</table></div></div>';

      document.getElementById('edBody').innerHTML = h;
      // Style table rows
      document.querySelectorAll('#recursosBody tr').forEach(function (tr, i) {
        tr.style.background = i % 2 === 0 ? '' : 'rgba(0,0,0,.03)';
        tr.querySelectorAll('td').forEach(function (td) { td.style.padding = '.4rem .6rem'; });
      });
    }

    function recursosSetSort(col) {
      if (_recursosSort.col === col) {
        _recursosSort.dir *= -1;
      } else {
        _recursosSort.col = col;
        _recursosSort.dir = 1;
      }
      renderRecursos();
    }

    async function uploadRecursos(fileInput) {
      var files = Array.from(fileInput.files);
      if (!files.length) return;
      var ok = 0, err = 0;
      toast('Subiendo ' + files.length + ' archivo' + (files.length !== 1 ? 's' : '') + '…', 'info');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var ext = file.name.split('.').pop().toLowerCase();
        var isImg = /^(jpg|jpeg|png|gif|svg|webp)$/.test(ext);
        var isVid = /^(mp4|webm|ogv|mov)$/.test(ext);
        var isPdf = ext === 'pdf';
        if (!isImg && !isVid && !isPdf) { err++; continue; }
        var endpoint = isVid ? '/api/upload-media' : '/api/upload-image';
        try {
          var r = await fetch(endpoint + '?name=' + encodeURIComponent(file.name), {
            method: 'POST',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file,
          });
          var data = await r.json();
          if (data.ok) ok++; else err++;
        } catch (e) { err++; }
      }
      fileInput.value = '';
      // Refresh media list in S.media
      try { var mr = await fetch('/api/media'); S.media = await mr.json(); } catch (e) { }
      toast(ok + ' subido' + (ok !== 1 ? 's' : '') + (err ? ' · ' + err + ' error' + (err !== 1 ? 'es' : '') : ''), ok && !err ? 'ok' : 'err');
      loadRecursos();
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // MENU EDITOR
    // ══════════════════════════════════════════════════════════════════════════════

    var _menuData = null; // working copy of the menu structure

    async function loadMenuEditor() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__menu_editor__'); });
      document.getElementById('topbar').style.display = 'none';
      var _ws = document.getElementById('welcomeScreen'); if (_ws) _ws.style.display = 'none';
      document.getElementById('edBody').innerHTML = '<p style="padding:2rem;opacity:.5">Cargando menú…</p>';
      try {
        var r = await fetch('/api/menu');
        _menuData = await r.json();
        renderMenuEditor();
      } catch (e) {
        document.getElementById('edBody').innerHTML = '<p style="padding:2rem;color:red">Error al cargar el menú: ' + esc(e.message) + '</p>';
      }
    }

    function renderMenuEditor() {
      var h = '<div class="ed-section" style="padding:1.5rem">';
      h += '<h2 style="margin-bottom:.5rem">Editor de menú</h2>';
      h += '<p class="help" style="margin-bottom:1.2rem">Edita la estructura del menú de navegación. Los cambios se aplicarán a <strong>todas las páginas</strong> del sitio al guardar.</p>';

      _menuData.forEach(function (section, si) {
        h += '<div class="menu-section-card" data-si="' + si + '">';
        h += '<div class="menu-section-header" draggable="true" ondragstart="menuDragStart(event,' + si + ')" ondragover="menuDragOver(event,' + si + ')" ondrop="menuDrop(event,' + si + ')">';
        h += '<span style="color:#bbb;margin-right:.3rem;cursor:grab">⋮⋮</span>';
        if (section.items) {
          h += '<span class="menu-type-badge">Desplegable</span>';
        } else {
          h += '<span class="menu-type-badge" style="background:var(--dorado)">Enlace</span>';
        }
        h += '<span class="menu-section-label">' + esc(section.label) + '</span>';
        h += '<div class="menu-section-actions">';
        h += '<button title="Eliminar sección" class="del" onclick="menuRemoveSection(' + si + ')">✕</button>';
        h += '</div></div>';
        h += '<div class="menu-section-body">';
        // Section label field
        h += '<div class="field"><label>Etiqueta de la sección</label><input type="text" value="' + escA(section.label) + '" oninput="menuUpdateSection(' + si + ',\'label\',this.value)"></div>';
        if (!section.items) {
          // Direct link
          var secIsExt = /^https?:\/\//.test(section.url || '');
          h += '<div class="field"><label>Página</label>';
          if (secIsExt) {
            h += '<input type="text" value="' + escA(section.url || '') + '" placeholder="https://..." oninput="menuUpdateSection(' + si + ',\'url\',this.value)">';
          } else {
            h += '<select onchange="menuUpdateSection(' + si + ',\'url\',this.value)" style="flex:1">' + menuPageSelectOptions(section.url || '') + '</select>';
          }
          h += '</div>';
          h += '<label style="font-family:\'Raleway\',sans-serif;font-size:.8rem;display:flex;align-items:center;gap:.35rem;margin-bottom:.6rem"><input type="checkbox"' + (secIsExt ? ' checked' : '') + ' onchange="_menuData[' + si + '].url=\'\';_menuData[' + si + '].externalUrl=this.checked;renderMenuEditor()"> URL externa (https://…)</label>';
        } else {
          // Dropdown items
          h += '<div style="margin-top:.5rem"><label style="margin-bottom:.4rem">Elementos del desplegable</label>';
          h += '<div id="menu-items-' + si + '">';
          section.items.forEach(function (item, ii) {
            h += '<div class="menu-item-row" data-ii="' + ii + '">';
            h += '<span style="color:#ccc;cursor:grab;font-size:.9rem;padding:0 .2rem" draggable="true" ondragstart="menuItemDragStart(event,' + si + ',' + ii + ')" ondragover="menuItemDragOver(event,' + si + ',' + ii + ')" ondrop="menuItemDrop(event,' + si + ',' + ii + ')">⋮</span>';
            h += '<input type="text" value="' + escA(item.label) + '" placeholder="Etiqueta" oninput="menuUpdateItem(' + si + ',' + ii + ',\'label\',this.value)" style="flex:1.2">';
            if (item.external) {
              h += '<input type="text" value="' + escA(item.url || '') + '" placeholder="https://..." oninput="menuUpdateItem(' + si + ',' + ii + ',\'url\',this.value)" style="flex:1">';
            } else {
              h += '<select style="flex:1;min-width:0" onchange="menuUpdateItem(' + si + ',' + ii + ',\'url\',this.value)">' + menuPageSelectOptions(item.url || '') + '</select>';
            }
            h += '<button class="ext-toggle' + (item.external ? ' on' : '') + '" title="Enlace externo (abre en nueva pestaña)" onclick="menuToggleExternal(' + si + ',' + ii + ',this)">' + (item.external ? '↗ ext' : 'int') + '</button>';
            h += '<button style="background:var(--rojo);color:#fff;border:none;border-radius:4px;width:22px;height:22px;cursor:pointer;font-size:.8rem;flex-shrink:0" onclick="menuRemoveItem(' + si + ',' + ii + ')">✕</button>';
            h += '</div>';
          });
          h += '</div>';
          h += '<button class="menu-add-item" onclick="menuAddItem(' + si + ')">+ Añadir elemento</button>';
          h += '</div>';
        }
        h += '</div></div>'; // /menu-section-body, /menu-section-card
      });

      h += '<div style="display:flex;gap:.6rem;margin-top:.8rem;flex-wrap:wrap">';
      h += '<button class="btn btn-outline" onclick="menuAddSection(\'dropdown\')">+ Nueva sección desplegable</button>';
      h += '<button class="btn btn-outline" onclick="menuAddSection(\'link\')">+ Nuevo enlace directo</button>';
      h += '</div>';

      h += '<div style="margin-top:1.5rem;display:flex;gap:.8rem;align-items:center">';
      h += '<button class="btn btn-green" onclick="saveMenuEditor()">Guardar y aplicar a todo el sitio</button>';
      h += '<span id="menuSaveMsg" style="font-size:.82rem;color:#888"></span>';
      h += '</div>';
      h += '</div>';
      document.getElementById('edBody').innerHTML = h;
    }

    function menuUpdateSection(si, key, val) {
      _menuData[si][key] = val;
    }
    function menuUpdateItem(si, ii, key, val) {
      _menuData[si].items[ii][key] = val;
    }
    function menuToggleExternal(si, ii, btn) {
      var item = _menuData[si].items[ii];
      item.external = !item.external;
      if (!item.external) item.url = '';
      renderMenuEditor();
    }
    function menuPageSelectOptions(selectedPath) {
      var opts = '<option value="">— Seleccionar página —</option>';
      var groups = {};
      var dirOrder = ['(raíz)', 'el-grupo', 'objetivos', 'publicaciones', 'proyectos-digitales', 'formacion', 'eventos', 'multimedia', 'noticias'];
      var dirLabels = { '(raíz)': 'Inicio', 'el-grupo': 'El grupo', 'objetivos': 'Objetivos', 'publicaciones': 'Publicaciones', 'proyectos-digitales': 'Proyectos digitales', 'formacion': 'Formación', 'eventos': 'Eventos', 'multimedia': 'Multimedia', 'noticias': 'Noticias' };
      (S.pages || []).forEach(function (p) { if (!groups[p.dir]) groups[p.dir] = []; groups[p.dir].push(p); });
      var dirs = dirOrder.filter(function (d) { return groups[d]; }).concat(Object.keys(groups).filter(function (d) { return dirOrder.indexOf(d) === -1; }));
      dirs.forEach(function (dir) {
        opts += '<optgroup label="' + escA(dirLabels[dir] || dir) + '">';
        groups[dir].forEach(function (p) {
          var sel = (p.path === selectedPath || p.name === selectedPath) ? ' selected' : '';
          opts += '<option value="' + escA(p.path) + '"' + sel + '>' + esc(prettifyFilename(p.name)) + '</option>';
        });
        opts += '</optgroup>';
      });
      return opts;
    }
    function menuAddItem(si) {
      _menuData[si].items.push({ label: '', url: '', external: false });
      renderMenuEditor();
    }
    function menuRemoveItem(si, ii) {
      _menuData[si].items.splice(ii, 1);
      renderMenuEditor();
    }
    function menuAddSection(type) {
      if (type === 'dropdown') {
        _menuData.push({ label: 'Nueva sección', items: [] });
      } else {
        _menuData.push({ label: 'Nuevo enlace', url: '' });
      }
      renderMenuEditor();
    }
    function menuRemoveSection(si) {
      if (!confirm('¿Eliminar la sección "' + _menuData[si].label + '"?')) return;
      _menuData.splice(si, 1);
      renderMenuEditor();
    }

    // Drag & drop for sections
    var _menuDragSi = null;
    function menuDragStart(e, si) { _menuDragSi = si; e.dataTransfer.effectAllowed = 'move'; }
    function menuDragOver(e, si) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
    function menuDrop(e, si) {
      e.preventDefault();
      if (_menuDragSi === null || _menuDragSi === si) return;
      var item = _menuData.splice(_menuDragSi, 1)[0];
      _menuData.splice(si, 0, item);
      _menuDragSi = null;
      renderMenuEditor();
    }

    // Drag & drop for items within a section
    var _menuItemDrag = null;
    function menuItemDragStart(e, si, ii) { _menuItemDrag = { si, ii }; e.dataTransfer.effectAllowed = 'move'; e.stopPropagation(); }
    function menuItemDragOver(e, si, ii) { e.preventDefault(); e.stopPropagation(); }
    function menuItemDrop(e, si, ii) {
      e.preventDefault(); e.stopPropagation();
      if (!_menuItemDrag || _menuItemDrag.si !== si || _menuItemDrag.ii === ii) return;
      var items = _menuData[si].items;
      var item = items.splice(_menuItemDrag.ii, 1)[0];
      items.splice(ii, 0, item);
      _menuItemDrag = null;
      renderMenuEditor();
    }

    async function saveMenuEditor() {
      // Auto-detect external from URLs
      _menuData.forEach(function (s) {
        if (s.items) s.items.forEach(function (item) {
          if (/^https?:\/\//.test(item.url)) item.external = true;
          else delete item.external;
        });
      });
      var msg = document.getElementById('menuSaveMsg');
      if (msg) msg.textContent = 'Guardando…';
      try {
        var r = await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_menuData) });
        var data = await r.json();
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        var errTxt = data.errors && data.errors.length ? ' (' + data.errors.length + ' errores)' : '';
        if (msg) msg.textContent = '✓ Menú aplicado a ' + data.updated + ' páginas' + errTxt;
        toast('Menú guardado y aplicado a ' + data.updated + ' páginas', 'ok');
        // Refresh page list
        try { var pr = await fetch('/api/pages'); S.pages = await pr.json(); renderNav(); } catch (e) { }
      } catch (e) {
        if (msg) msg.textContent = 'Error: ' + e.message;
        toast('Error: ' + e.message, 'err');
      }
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // SECTION HERO IMAGE BATCH TOOL
    // ══════════════════════════════════════════════════════════════════════════════

    function loadSectionHero() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__section_hero__'); });
      document.getElementById('topbar').style.display = 'none';
      var _ws = document.getElementById('welcomeScreen'); if (_ws) _ws.style.display = 'none';

      var dirs = [
        { v: 'el-grupo', l: 'El grupo', bg: 'fondo-grupo.png' },
        { v: 'objetivos', l: 'Objetivos', bg: 'fondo-vida.jpg' },
        { v: 'publicaciones', l: 'Publicaciones', bg: 'comedias_parte-veinte-y-una-fondo.jpg' },
        { v: 'proyectos-digitales', l: 'Proyectos digitales', bg: 'foto-proyectos-digitales.png' },
        { v: 'formacion', l: 'Formación', bg: 'fondo-tesis.jpg' },
        { v: 'eventos', l: 'Eventos', bg: 'eventos-fondo.jpg' },
        { v: 'multimedia', l: 'Multimedia', bg: 'fondo-multimedia.jpg' },
        { v: 'noticias', l: 'Noticias', bg: 'fondo-noticias.jpg' },
      ];
      var dirOpts = dirs.map(function (d) { return '<option value="' + d.v + '" data-bg="' + d.bg + '">' + d.l + '</option>'; }).join('');

      var h = '<div class="ed-section" style="padding:1.5rem;max-width:640px">';
      h += '<h2>Imagen de cabecera por sección</h2>';
      h += '<p class="help" style="margin-bottom:1.2rem">Cambia la fotografía de cabecera de <strong>todas las páginas</strong> de una sección a la vez. Útil para aplicar un cambio de imagen globalmente sin tener que editar cada página.</p>';
      h += '<div class="field"><label>Sección</label>';
      h += '<select id="sh-dir" onchange="shUpdatePreview()">' + dirOpts + '</select></div>';
      h += '<div class="field"><label>Nueva fotografía de cabecera</label>';
      h += '<p class="help">Selecciona de la galería o sube una imagen nueva. La imagen predeterminada de la sección se muestra a continuación.</p>';
      h += '<div class="img-picker">';
      h += '<input type="text" id="sh-bg" value="../media/' + dirs[0].bg + '" placeholder="../media/fondo-grupo.png" oninput="refreshImgPreview(\'sh-bg\',this.value)">';
      h += '<button class="btn btn-outline btn-sm" type="button" onclick="openImgPicker(\'sh-bg\')">🖼 Galería</button>';
      h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen nueva">📁 Subir<input type="file" accept="image/*" style="display:none" onchange="shUploadAndSet(this)"></label>';
      h += '</div>';
      h += '<div id="sh-bg-preview" style="margin-top:.6rem"><img src="../media/' + dirs[0].bg + '" alt="Vista previa" style="max-height:100px;border-radius:6px;border:1px solid var(--borde);object-fit:cover;max-width:100%"></div>';
      h += '</div>';
      h += '<div id="sh-page-list" style="margin:.5rem 0 1rem"></div>';
      h += '<div style="display:flex;gap:.8rem;align-items:center;margin-top:.5rem">';
      h += '<button class="btn btn-blue" onclick="applySectionHero()">Aplicar a todas las páginas de la sección</button>';
      h += '<span id="sh-msg" style="font-size:.82rem;color:#888"></span>';
      h += '</div></div>';

      document.getElementById('edBody').innerHTML = h;
      shUpdatePreview();
    }

    function shUpdatePreview() {
      var sel = document.getElementById('sh-dir');
      if (!sel) return;
      var opt = sel.options[sel.selectedIndex];
      var bg = opt.dataset.bg || 'fondo-grupo.png';
      var bgPath = '../media/' + bg;
      var inp = document.getElementById('sh-bg');
      if (inp) inp.value = bgPath;
      refreshImgPreview('sh-bg', bgPath);
      shRenderPageList();
    }

    function shRenderPageList() {
      var dir = (document.getElementById('sh-dir') || {}).value;
      if (!dir) return;
      var pages = S.pages.filter(function (p) { return p.dir === dir || (dir === '(raíz)' && p.dir === '(raíz)'); });
      var el = document.getElementById('sh-page-list');
      if (!el) return;
      if (!pages.length) { el.innerHTML = '<p class="help">No hay páginas en esta sección.</p>'; return; }
      var names = pages.map(function (p) { return p.name.replace('.html', '').replace(/-/g, ' '); });
      el.innerHTML = '<p class="help">Páginas que se actualizarán (' + pages.length + '): '
        + names.map(function (n) { return '<strong>' + esc(n) + '</strong>'; }).join(', ')
        + '</p>';
    }

    async function shUploadAndSet(fileInput) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      var form = new FormData();
      form.append('file', file);
      try {
        var r = await fetch('/api/upload-image?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        var data = await r.json();
        if (!data.ok) throw new Error(data.error || 'Error');
        var inp = document.getElementById('sh-bg');
        var val = '../media/' + data.name;
        if (inp) inp.value = val;
        refreshImgPreview('sh-bg', val);
        toast('Imagen subida: ' + data.name, 'ok');
      } catch (e) {
        toast('Error al subir: ' + e.message, 'err');
      }
      fileInput.value = '';
    }

    async function applySectionHero() {
      var dir = (document.getElementById('sh-dir') || {}).value;
      var bgRaw = ((document.getElementById('sh-bg') || {}).value || '').trim();
      // Normalize to just the filename (server template uses '../media/<filename>')
      var bgFile = bgRaw.replace(/^(\.\.\/)?media\//, '');
      if (!dir || !bgFile) { toast('Selecciona sección e imagen', 'err'); return; }
      var msg = document.getElementById('sh-msg');
      if (msg) { msg.textContent = 'Aplicando…'; msg.style.color = '#888'; }
      try {
        var r = await fetch('/api/section-hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dir: dir, bgFile: bgFile })
        });
        var data = await r.json();
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        var txt = '✓ Actualizada en ' + data.updated + ' página' + (data.updated !== 1 ? 's' : '');
        if (data.errors && data.errors.length) txt += ' (' + data.errors.length + ' errores)';
        if (msg) { msg.textContent = txt; msg.style.color = 'var(--verde)'; }
        toast(txt, 'ok');
      } catch (e) {
        if (msg) { msg.textContent = 'Error: ' + e.message; msg.style.color = 'var(--rojo)'; }
        toast('Error: ' + e.message, 'err');
      }
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // NEW PAGE CREATOR
    // ══════════════════════════════════════════════════════════════════════════════

    function loadNewPage() {
      document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.path === '__new_page__'); });
      document.getElementById('topbar').style.display = 'none';
      var _ws = document.getElementById('welcomeScreen'); if (_ws) _ws.style.display = 'none';

      var dirs = [
        { v: 'el-grupo', l: 'El grupo', bg: 'fondo-grupo.png' },
        { v: 'objetivos', l: 'Objetivos', bg: 'fondo-vida.jpg' },
        { v: 'publicaciones', l: 'Publicaciones', bg: 'comedias_parte-veinte-y-una-fondo.jpg' },
        { v: 'proyectos-digitales', l: 'Proyectos digitales', bg: 'foto-proyectos-digitales.png' },
        { v: 'formacion', l: 'Formación', bg: 'fondo-tesis.jpg' },
        { v: 'eventos', l: 'Eventos', bg: 'eventos-fondo.jpg' },
        { v: 'multimedia', l: 'Multimedia', bg: 'fondo-multimedia.jpg' },
      ];
      var dirOpts = dirs.map(function (d) { return '<option value="' + d.v + '" data-bg="' + d.bg + '">' + d.l + '</option>'; }).join('');

      var h = '<div class="ed-section" style="padding:1.5rem;max-width:620px">';
      h += '<h2 style="margin-bottom:.5rem">Nueva página</h2>';
      h += '<p class="help" style="margin-bottom:1.2rem">Crea una nueva página de contenido en el sitio. La página se generará con la plantilla estándar de artículo.</p>';
      h += '<div class="field"><label>Sección *</label>';
      h += '<select id="np-dir" onchange="npUpdateBg()">' + dirOpts + '</select></div>';
      h += '<div class="field"><label>Título de la página *</label>';
      h += '<input type="text" id="np-title" placeholder="ej: Nuestra historia" oninput="npAutoSlug()"></div>';
      h += '<div class="field"><label>Nombre del archivo *</label><p class="help">Solo letras minúsculas, números y guiones. Termina en .html</p>';
      h += '<input type="text" id="np-filename" placeholder="ej: nuestra-historia.html"></div>';
      h += '<div class="field"><label>Texto del breadcrumb (opcional)</label><p class="help">Si se deja vacío, se usa el título.</p>';
      h += '<input type="text" id="np-breadcrumb" placeholder="ej: El grupo › Nuestra historia"></div>';
      h += '<div class="field"><label>Fotografía de cabecera</label>';
      h += '<p class="help">Imagen de fondo del encabezado. Se usa la predeterminada de la sección, pero puedes cambiarla.</p>';
      h += '<div class="img-picker">';
      h += '<input type="text" id="np-bg" value="../media/' + dirs[0].bg + '" placeholder="../media/fondo-grupo.png" oninput="refreshImgPreview(\'np-bg\',this.value)">';
      h += '<button class="btn btn-outline btn-sm" type="button" onclick="openImgPicker(\'np-bg\')">🖼 Galería</button>';
      h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen nueva">📁 Subir<input type="file" accept="image/*" style="display:none" onchange="uploadImage(\'np-bg\',this)"></label>';
      h += '</div>';
      h += '<div id="np-bg-preview" style="margin-top:.5rem"><img src="../media/' + dirs[0].bg + '" alt="Vista previa" style="max-height:70px;border-radius:5px;border:1px solid var(--borde);object-fit:cover;max-width:100%"></div>';
      h += '</div>';
      h += '<div style="margin-top:1.2rem;display:flex;gap:.8rem;align-items:center">';
      h += '<button class="btn btn-green" onclick="createNewPage()">Crear página</button>';
      h += '<span id="np-msg" style="font-size:.82rem;color:#888"></span>';
      h += '</div></div>';

      document.getElementById('edBody').innerHTML = h;
    }

    function npUpdateBg() {
      var sel = document.getElementById('np-dir');
      var opt = sel.options[sel.selectedIndex];
      var bg = opt.dataset.bg || 'fondo-grupo.png';
      var bgPath = '../media/' + bg;
      var inp = document.getElementById('np-bg');
      if (inp) inp.value = bgPath;
      refreshImgPreview('np-bg', bgPath);
    }

    function npAutoSlug() {
      var title = document.getElementById('np-title').value;
      var slug = title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s\-]/g, '')
        .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
      if (slug) slug += '.html';
      document.getElementById('np-filename').value = slug;
    }

    async function createNewPage() {
      var dir = document.getElementById('np-dir').value;
      var title = document.getElementById('np-title').value.trim();
      var filename = document.getElementById('np-filename').value.trim();
      var breadcrumbSection = document.getElementById('np-breadcrumb').value.trim();
      var bgImageRaw = (document.getElementById('np-bg') || {}).value || '';
      // Normalize: strip leading '../' so server gets 'media/filename.jpg'
      var bgImage = bgImageRaw.trim().replace(/^\.\.\//, '');
      var msg = document.getElementById('np-msg');
      if (!title || !filename) { msg.textContent = 'El título y el nombre de archivo son obligatorios.'; msg.style.color = 'var(--rojo)'; return; }
      if (!/^[a-z0-9][a-z0-9\-]*\.html$/.test(filename)) { msg.textContent = 'Nombre de archivo inválido (solo letras minúsculas, números y guiones, termina en .html).'; msg.style.color = 'var(--rojo)'; return; }
      msg.textContent = 'Creando…'; msg.style.color = '#888';
      try {
        var r = await fetch('/api/new-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dir, filename, title, breadcrumbSection, bgImage })
        });
        var data = await r.json();
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        toast('Página creada: ' + data.path, 'ok');
        msg.textContent = '✓ Página creada: ' + data.path; msg.style.color = 'var(--verde)';
        // Auto-add page to the site menu
        try {
          var dirToLabel = { 'el-grupo': 'El grupo', 'objetivos': 'Objetivos', 'publicaciones': 'Publicaciones', 'proyectos-digitales': 'Proyectos digitales', 'formacion': 'Formación', 'eventos': 'Eventos' };
          var sectionLabel = dirToLabel[dir];
          if (sectionLabel) {
            var mr = await fetch('/api/menu');
            var menuData = await mr.json();
            var section = menuData.find(function (s) { return s.label === sectionLabel && s.items; });
            if (section) {
              section.items.push({ label: title, url: data.path });
              await fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(menuData) });
              msg.textContent += ' (añadida al menú)';
            }
          }
        } catch (e) { /* silently ignore menu update errors */ }
        // Add to search index
        try {
          var dirLabels = { 'el-grupo': 'El grupo', 'objetivos': 'Objetivos', 'publicaciones': 'Publicaciones', 'proyectos-digitales': 'Proyectos digitales', 'formacion': 'Formación', 'eventos': 'Eventos', 'multimedia': 'Multimedia' };
          await fetch('/api/search-index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add',
              entry: {
                title: title + ' | PROLOPE – UAB',
                url: data.path,
                description: (breadcrumbSection || dirLabels[dir] || dir) + ' — ' + title,
                content: title + ' ' + (breadcrumbSection || dirLabels[dir] || '') + ' PROLOPE'
              }
            })
          });
        } catch (e) { /* silently ignore */ }
        // Refresh page list and open the new page
        try { var pr = await fetch('/api/pages'); S.pages = await pr.json(); renderNav(); } catch (e) { }
        setTimeout(function () { loadPage(data.path); }, 500);
      } catch (e) {
        msg.textContent = 'Error: ' + e.message; msg.style.color = 'var(--rojo)';
        toast('Error: ' + e.message, 'err');
      }
    }

