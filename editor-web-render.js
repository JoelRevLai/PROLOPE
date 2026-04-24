    // ── RENDER EDITOR ────────────────────────────────────────────────────────────
    function renderEditor() {
      var name = S.currentPath.split('/').pop().replace('.html', '').replace(/-/g, ' ');
      document.getElementById('topTitle').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      document.getElementById('topBadge').textContent = TYPE_LABELS[S.pageType] || 'Página';

      if (S.pageType === 'news') { renderNewsEditor(); return; }

      var h = '';

      // Metadata
      h += '<div class="ed-section"><h2>Metadatos</h2>';
      h += field('Título de la página (pestaña del navegador)', 'edTitle', S.pageTitle);
      h += '</div>';

      // Hero
      if (S.heroData) {
        h += '<div class="ed-section"><h2>Cabecera</h2>';
        h += richLineField('Título principal', 'edHeroTitle', S.heroData.title);
        h += field('Breadcrumb (último segmento)', 'edBreadcrumb', S.heroData.breadcrumbLast, 'Ej.: El grupo');
        if (S.heroData.type === 'article') {
          h += field('Categoría', 'edHeroCat', S.heroData.catBadge);
          h += field('Fecha', 'edHeroDate', S.heroData.date);
        }
        if (S.heroData.type === 'index') {
          h += richLineField('Subtítulo', 'edHeroSub', S.heroData.subtitle);
        }
        // Hero background image picker
        h += '<div class="field"><label>Fotografía de cabecera</label>';
        h += '<p class="help">Imagen de fondo del encabezado de esta página. Puede seleccionar una de la galería o subir una nueva.</p>';
        h += '<div class="img-picker">';
        h += '<input type="text" id="edHeroBg" value="' + escA(S.heroData.bgImage || '') + '" placeholder="ej: ../media/fondo-grupo.png" oninput="refreshImgPreview(\'edHeroBg\',this.value)">';
        h += '<button class="btn btn-outline btn-sm" type="button" onclick="openImgPicker(\'edHeroBg\')">🖼 Galería</button>';
        h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen nueva">📁 Subir<input type="file" accept="image/*" style="display:none" onchange="uploadImage(\'edHeroBg\',this)"></label>';
        h += '</div>';
        h += '<div id="edHeroBg-preview" style="margin-top:.5rem">' + (S.heroData.bgImage ? '<img src="' + escA(S.heroData.bgImage) + '" alt="Vista previa" style="max-height:80px;border-radius:5px;border:1px solid var(--borde);object-fit:cover;max-width:100%">' : '') + '</div>';
        h += '</div>';
        h += '</div>';
      }

      // Specialized editors
      if (S.pageType === 'theses') h += renderThesesEditor();
      else if (S.pageType === 'congresses') h += renderCongressesEditor();
      else if (S.pageType === 'seminars') h += renderSeminarsEditor();
      else if (S.pageType === 'multimedia') h += renderMultimediaEditor();
      else if (S.pageType === 'members') h += renderMembersEditor();
      else if (S.pageType === 'projects') h += renderProjectsEditor();
      else if (S.pageType === 'partes') h += renderPartesEditor();
      else h += renderBlocksEditor();

      // Sidebar
      h += renderSidebarEditor();

      document.getElementById('edBody').innerHTML = h;

      // Init all rich editors
      initRichEditors();
      if (S.pageType === 'members') initMembersDrag();
      if (S.pageType === 'theses' || S.pageType === 'congresses' || S.pageType === 'seminars' || S.pageType === 'projects') initThesisDrag();
      if (S.pageType === 'article' || S.pageType === 'libros' || S.pageType === 'contact') initBlocksDrag();
      if (S.hasSidebar) initSidebarDrag();

      // Nuevas funcionalidades
      resetEditorState();
      injectHelpButtons();
      injectCollapseToggles();
    }

    function field(label, id, value, placeholder) {
      return '<div class="field"><label for="' + id + '">' + label + '</label>'
        + '<input type="text" id="' + id + '" value="' + escA(value || '') + '"' + (placeholder ? ' placeholder="' + escA(placeholder) + '"' : '') + '>'
        + '</div>';
    }

    function richField(label, html, dataId) {
      return '<div class="field"><label>' + label + '</label>'
        + '<div class="rich-wrap">'
        + '<div class="rich-toolbar">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
        + '<button onmousedown="execRich(event,\'insertUnorderedList\')">• Lista</button>'
        + '<button onmousedown="execRich(event,\'insertOrderedList\')">1. Lista</button>'
        + '</div>'
        + '<div class="rich-edit" contenteditable="true" data-rich-id="' + dataId + '">' + html + '</div>'
        + '</div></div>';
    }

    function richFieldCaption(label, html, dataId) {
      return '<div class="field"><label>' + label + '</label>'
        + '<div class="rich-wrap">'
        + '<div class="rich-toolbar">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">Quitar enlace</button>'
        + '</div>'
        + '<div class="rich-edit" contenteditable="true" data-rich-id="' + dataId + '">' + html + '</div>'
        + '</div></div>';
    }

    function richFieldBiblio(label, html, dataId) {
      return '<div class="field"><label>' + label + '</label>'
        + '<div class="rich-wrap">'
        + '<div class="rich-toolbar">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">× enlace</button>'
        + '<button onmousedown="execRich(event,\'insertConsultLink\')" title="Inserta [CONSULTAR AQUÍ] con URL">[Consultar]</button>'
        + '<button onmousedown="execRich(event,\'wrapBiblioNote\')" title="Envuelve la selección en nota descriptiva (biblio-note)">Nota ▸</button>'
        + '</div>'
        + '<div class="rich-edit" contenteditable="true" data-rich-id="' + dataId + '">' + html + '</div>'
        + '</div></div>';
    }

    function richLineField(label, id, value, placeholder) {
      return '<div class="field"><label>' + label + '</label>'
        + '<div class="rich-wrap">'
        + '<div class="rich-toolbar">'
        + '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>'
        + '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>'
        + '<button onmousedown="execRich(event,\'link\')">Enlace</button>'
        + '<button onmousedown="execRich(event,\'removeLink\')">× enlace</button>'
        + '<button onmousedown="execRich(event,\'insertUnorderedList\')">• Lista</button>'
        + '<button onmousedown="execRich(event,\'insertOrderedList\')">1. Lista</button>'
        + '</div>'
        + '<div class="rich-edit rich-edit-sm" contenteditable="true" data-rich-id="' + id + '"'
        + (placeholder ? ' data-placeholder="' + escA(placeholder) + '"' : '') + '>' + (value || '') + '</div>'
        + '</div></div>';
    }
    // Helper to read a richLineField value by its data-rich-id
    function gR(id) {
      var el = document.querySelector('[data-rich-id="' + id + '"]');
      return el ? el.innerHTML : '';
    }

    function imgField(label, value, inputId) {
      return '<div class="field"><label>' + label + '</label>'
        + '<div class="img-picker">'
        + '<input type="text" id="' + inputId + '" value="' + escA(value || '') + '" placeholder="Ej.: ../media/imagen.jpg">'
        + '<button class="btn btn-outline btn-sm" onclick="openImgPicker(\'' + inputId + '\')">Elegir</button>'
        + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen nueva"><input type="file" accept="image/*" style="display:none" onchange="uploadImage(\'' + inputId + '\',this)">Subir</label>'
        + '</div></div>';
    }

    function uploadImage(inputId, fileInput) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      // Revoke previous temp URL for this input if any
      if (pendingUploads[inputId]) {
        URL.revokeObjectURL(pendingUploads[inputId].tempUrl);
      }
      var tempUrl = URL.createObjectURL(file);
      pendingUploads[inputId] = { file: file, tempUrl: tempUrl };
      var input = document.getElementById(inputId);
      if (input) input.value = tempUrl;
      refreshImgPreview(inputId, tempUrl);
      toast('Imagen lista. Se subirá al guardar.', 'info');
      fileInput.value = '';
    }

    async function flushPendingUploads() {
      var ids = Object.keys(pendingUploads);
      if (!ids.length) return;
      var depth = S.currentPath.split('/').length - 1;
      var prefix = depth > 0 ? '../' : '';
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        var entry = pendingUploads[id];
        try {
          var r = await fetch('/api/upload-image?name=' + encodeURIComponent(entry.file.name), {
            method: 'POST',
            headers: { 'Content-Type': entry.file.type || 'application/octet-stream' },
            body: entry.file,
          });
          var data = await r.json();
          if (data.ok) {
            var realPath = prefix + 'media/' + data.filename;
            var input = document.getElementById(id);
            if (input && input.value === entry.tempUrl) input.value = realPath;
            URL.revokeObjectURL(entry.tempUrl);
          } else {
            toast('Error al subir imagen: ' + (data.error || 'desconocido'), 'err');
          }
        } catch (e) {
          toast('Error de conexión al subir imagen', 'err');
        }
      }
      pendingUploads = {};
      try { var mr = await fetch('/api/media'); S.media = await mr.json(); } catch (e) { }
    }

    // ── RICH TEXT COMMANDS ────────────────────────────────────────────────────────
    function execRich(e, cmd) {
      e.preventDefault();
      if (cmd === 'link') {
        var url = prompt('Escribe la URL del enlace:', 'https://');
        if (url) document.execCommand('createLink', false, url);
      } else if (cmd === 'removeLink') {
        document.execCommand('unlink');
      } else if (cmd === 'insertBr') {
        document.execCommand('insertHTML', false, '<br>');
      } else if (cmd === 'wrapBiblioNote') {
        var sel = window.getSelection();
        if (sel && sel.rangeCount && !sel.isCollapsed) {
          var range = sel.getRangeAt(0);
          var span = document.createElement('span');
          span.className = 'biblio-note';
          try { range.surroundContents(span); } catch (ex) {
            // If selection crosses nodes, insert HTML
            var frag = range.extractContents();
            span.appendChild(frag);
            range.insertNode(span);
          }
        } else {
          document.execCommand('insertHTML', false, '<span class="biblio-note">Nota descriptiva. → <a href="https://" target="_blank" rel="noopener noreferrer">CONSULTAR AQUÍ</a></span>');
        }
      } else if (cmd === 'insertConsultLink') {
        var url = prompt('URL del enlace de consulta:', 'https://');
        if (url) document.execCommand('insertHTML', false, '[<a href="' + url + '" target="_blank" rel="noopener noreferrer">CONSULTAR AQUÍ</a>]');
      } else {
        document.execCommand(cmd);
      }
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // SIDEBAR — PARSE / RENDER / READ / GENERATE
    // ══════════════════════════════════════════════════════════════════════════════

    function parseSidebarCards(sidebarEl) {
      S.sidebarCards = [];
      var cardEls = Array.from(sidebarEl.querySelectorAll(':scope > .sidebar-card'));
      if (cardEls.length === 0) {
        // No .sidebar-card wrappers — treat entire content as one raw text card
        var raw = sidebarEl.innerHTML.trim();
        if (raw) S.sidebarCards.push({ id: ++blockId, type: 'text', rawMode: true, bodyHtml: raw, title: '', imageUrl: '', imageAlt: '', imagePosition: 'none' });
        return;
      }
      cardEls.forEach(function (card) {
        var id = ++blockId;
        if (card.getAttribute('data-sidebar-type') === 'toc') {
          var depth = parseInt(card.getAttribute('data-toc-depth')) || 3;
          var titleEl = card.querySelector('.sidebar-card-title');
          S.sidebarCards.push({ id: id, type: 'toc', title: titleEl ? titleEl.textContent.trim() : 'En esta página', depth: depth });
        } else if (card.querySelector('.sidebar-nav-list')) {
          var titleEl = card.querySelector('.sidebar-card-title');
          var links = [];
          card.querySelectorAll('.sidebar-nav-list li').forEach(function (li) {
            var a = li.querySelector('a');
            if (a) links.push({ label: a.textContent.trim(), href: a.getAttribute('href') || '', active: a.classList.contains('active') });
          });
          S.sidebarCards.push({ id: id, type: 'nav', title: titleEl ? titleEl.textContent.trim() : 'En esta sección', links: links });
        } else {
          var extraClasses = Array.from(card.classList).filter(function (c) { return c !== 'sidebar-card'; }).join(' ');
          S.sidebarCards.push({ id: id, type: 'text', rawMode: true, bodyHtml: card.innerHTML.trim(), title: '', imageUrl: '', imageAlt: '', imagePosition: 'none', extraClasses: extraClasses });
        }
      });
    }

    function renderSidebarEditor() {
      var h = '<div class="ed-section"><h2>Barra lateral</h2>';
      if (!S.hasSidebar) {
        h += '<p class="help">Esta página no tiene barra lateral.</p>';
        h += '<button class="sb-add-sidebar" onclick="toggleSidebar(true)">+ Añadir barra lateral</button>';
      } else {
        h += '<p class="help" style="margin-bottom:.55rem">Tarjetas de la barra lateral derecha. Haz clic en una tarjeta para editarla.</p>';
        h += '<div class="sb-editor" id="sbEditor">';
        S.sidebarCards.forEach(function (card, i) { h += renderSbCardEditor(card, i); });
        h += '</div>';
        h += '<div class="sb-add-row">';
        h += '<button class="btn btn-outline btn-sm" onclick="addSidebarCard(\'toc\')">+ Índice de contenido</button>';
        h += '<button class="btn btn-outline btn-sm" onclick="addSidebarCard(\'nav\')">+ Menú de sección</button>';
        h += '<button class="btn btn-outline btn-sm" onclick="addSidebarCard(\'text\')">+ Caja de texto</button>';
        h += '</div>';
        h += '<button class="sb-remove-btn" onclick="toggleSidebar(false)">✕ Eliminar barra lateral completa</button>';
      }
      h += '</div>';
      return h;
    }

    function renderSbCardEditor(card, idx) {
      var typeLabels = { toc: 'Índice', nav: 'Menú', text: 'Texto' };
      var typeCls = { toc: 'sb-type-toc', nav: 'sb-type-nav', text: 'sb-type-text' };
      var label = card.type === 'toc' ? (card.title || 'Índice de contenido')
        : card.type === 'nav' ? (card.title || 'Menú de sección')
          : 'Caja de texto';
      var h = '<div class="sb-card" id="sbCard_' + card.id + '" draggable="true" data-sbid="' + card.id + '">';
      h += '<div class="sb-card-header" onclick="toggleSbCard(' + card.id + ')">';
      h += '<span class="sb-drag-handle" onclick="event.stopPropagation()" title="Arrastrar para reordenar">⠿</span>';
      h += '<span class="sb-type-badge ' + typeCls[card.type] + '">' + typeLabels[card.type] + '</span>';
      h += '<span class="sb-card-label">' + esc(label) + '</span>';
      h += '<div class="sb-card-actions" onclick="event.stopPropagation()">';
      h += '<button class="del" title="Eliminar tarjeta" aria-label="Eliminar tarjeta" onclick="removeSidebarCard(' + idx + ')">✕</button>';
      h += '</div></div>';
      h += '<div class="sb-card-body open" id="sbBody_' + card.id + '">';

      if (card.type === 'toc') {
        h += '<div class="field"><label>Título de la tarjeta</label>';
        h += '<input type="text" id="sbTocTitle_' + card.id + '" value="' + escA(card.title || 'En esta página') + '"></div>';
        h += '<div class="field"><label>Profundidad del índice</label>';
        h += '<select id="sbTocDepth_' + card.id + '">';
        for (var d = 1; d <= 6; d++) h += '<option value="' + d + '"' + (card.depth === d ? ' selected' : '') + '>Hasta H' + d + '</option>';
        h += '</select><p class="help" style="margin-top:.3rem">Muestra los títulos del contenido principal hasta ese nivel.</p></div>';

      } else if (card.type === 'nav') {
        h += '<div class="field"><label>Título de la tarjeta</label>';
        h += '<input type="text" id="sbNavTitle_' + card.id + '" value="' + escA(card.title || 'En esta sección') + '"></div>';
        // Auto-detect section pages
        var sectionPages = getNavSectionPages();
        var linksMap = {};
        (card.links || []).forEach(function (l) { linksMap[l.href] = l; });
        var sectionHrefs = sectionPages.map(function (p) { return p.name; });
        var extraLinks = (card.links || []).filter(function (l) { return !sectionHrefs.includes(l.href); });
        if (sectionPages.length > 0) {
          h += '<div class="field"><label>Páginas de esta sección</label>';
          h += '<p class="help" style="margin-bottom:.3rem">Marca las páginas que quieres mostrar. La página activa se resaltará en el menú.</p>';
          h += '<div id="sbNavPgs_' + card.id + '">';
          sectionPages.forEach(function (pg, pi) {
            var existing = linksMap[pg.name];
            var checked = existing !== undefined;
            // Auto-check and auto-activate current page when creating fresh
            if (!existing && pg.path === S.currentPath) { checked = true; }
            var defaultLabel = prettifyFilename(pg.name);
            var label = existing ? (existing.label || defaultLabel) : defaultLabel;
            var isActive = !!(existing && existing.active) || (!existing && pg.path === S.currentPath);
            h += '<div style="display:grid;grid-template-columns:auto 1fr auto;gap:.3rem;align-items:center;margin-bottom:.28rem">';
            h += '<input type="checkbox" id="sbNpCk_' + card.id + '_' + pi + '"' + (checked ? ' checked' : '') + ' title="Incluir en el menú">';
            h += '<input type="text" id="sbNpLb_' + card.id + '_' + pi + '" value="' + escA(label) + '" style="font-size:.82rem;padding:.24rem .4rem" placeholder="' + escA(defaultLabel) + '">';
            h += '<label style="font-family:\'Raleway\',sans-serif;font-size:.72rem;display:flex;align-items:center;gap:.2rem;white-space:nowrap;cursor:pointer">';
            h += '<input type="radio" name="sbNpAct_' + card.id + '" value="' + pi + '"' + (isActive ? ' checked' : '') + '>Activa</label>';
            h += '</div>';
          });
          h += '</div></div>';
        } else {
          h += '<p class="help">No se han detectado páginas en esta sección.</p>';
        }
        // Extra links (outside the section)
        h += '<div id="sbNavExtra_' + card.id + '">';
        extraLinks.forEach(function (link, ei) {
          h += '<div class="nav-link-row" id="sbNeRow_' + card.id + '_' + ei + '">';
          h += '<input type="text" placeholder="Texto del enlace" value="' + escA(link.label || '') + '" id="sbNeLb_' + card.id + '_' + ei + '">';
          h += '<input type="text" placeholder="URL completa o relativa" value="' + escA(link.href || '') + '" id="sbNeHr_' + card.id + '_' + ei + '">';
          h += '<label class="active-lbl"><input type="checkbox" id="sbNeAct_' + card.id + '_' + ei + '"' + (link.active ? ' checked' : '') + '>Act.</label>';
          h += '<button class="del-lnk" onclick="removeNavExtra(' + card.id + ',' + ei + ')">✕</button>';
          h += '</div>';
        });
        h += '</div>';
        h += '<button class="menu-add-item" onclick="addNavExtra(' + card.id + ')">+ Añadir enlace externo a la sección</button>';

      } else { // text
        if (card.rawMode) {
          h += '<p class="help" style="margin-bottom:.35rem">Tarjeta con formato complejo. Puedes editarla como HTML o convertirla a formato simple.</p>';
          h += '<div class="rich-wrap"><textarea style="min-height:90px;font-family:monospace;font-size:.78rem;padding:.4rem" id="sbTextRaw_' + card.id + '">' + esc(card.bodyHtml || '') + '</textarea></div>';
          h += '<button class="btn btn-outline btn-sm" style="margin-top:.4rem" onclick="convertToSimpleText(' + card.id + ')">Convertir a formato simple</button>';
        } else {
          h += '<div class="field"><label>Título (opcional)</label>';
          h += '<input type="text" id="sbTextTitle_' + card.id + '" value="' + escA(card.title || '') + '"></div>';
          h += '<div class="field"><label>Imagen (opcional)</label>';
          h += '<div class="img-picker"><input type="text" id="sbTextImg_' + card.id + '" value="' + escA(card.imageUrl || '') + '" placeholder="../media/imagen.jpg">';
          h += '<button class="btn btn-outline btn-sm" onclick="openImgPicker(\'sbTextImg_' + card.id + '\')">Elegir</button></div>';
          h += '<input type="text" id="sbTextImgAlt_' + card.id + '" value="' + escA(card.imageAlt || '') + '" placeholder="Texto alternativo de la imagen" style="margin-top:.3rem"></div>';
          h += '<div class="field"><label>Posición de la imagen</label>';
          h += '<select id="sbTextImgPos_' + card.id + '">';
          h += '<option value="none"' + (card.imagePosition === 'none' || !card.imageUrl ? ' selected' : '') + '>Sin imagen / Ocultar</option>';
          h += '<option value="top"' + (card.imagePosition === 'top' ? ' selected' : '') + '>Arriba del texto</option>';
          h += '<option value="bottom"' + (card.imagePosition === 'bottom' ? ' selected' : '') + '>Debajo del texto</option>';
          h += '</select></div>';
          h += '<div class="field"><label>Contenido de la tarjeta</label>';
          h += '<div class="rich-wrap">';
          // Extended toolbar with typography controls
          h += '<div class="rich-toolbar rich-toolbar-ext">';
          h += '<button onmousedown="execRich(event,\'bold\')"><b>N</b></button>';
          h += '<button onmousedown="execRich(event,\'italic\')"><i>C</i></button>';
          h += '<button onmousedown="execRich(event,\'link\')">Enlace</button>';
          h += '<button onmousedown="execRich(event,\'removeLink\')">× enlace</button>';
          h += '<button onmousedown="execRich(event,\'insertUnorderedList\')">• Lista</button>';
          h += '<span class="tb-sep"></span>';
          h += '<select onmousedown="event.stopPropagation()" onchange="applyFontFamily(this)" title="Tipografía">';
          h += '<option value="">Fuente…</option>';
          h += '<option value="\'EB Garamond\',Georgia,serif">Garamond</option>';
          h += '<option value="\'Raleway\',sans-serif">Raleway</option>';
          h += '<option value="Arial,sans-serif">Arial</option>';
          h += '<option value="Georgia,serif">Georgia</option>';
          h += '<option value="monospace">Monoespaciado</option>';
          h += '</select>';
          h += '<input type="number" min="8" max="96" step="1" placeholder="px" title="Tamaño de letra (px)" onmousedown="event.stopPropagation()" onchange="applyFontSize(this)" style="width:52px">';
          h += '<input type="color" value="#333333" title="Color del texto" onmousedown="event.stopPropagation()" oninput="applyColor(this)">';
          h += '<input type="color" value="#ffff99" title="Color de fondo del fragmento" onmousedown="event.stopPropagation()" oninput="applyBgColor(this)">';
          h += '</div>';
          h += '<div class="rich-edit sb-rich-edit" contenteditable="true" id="sbTextBody_' + card.id + '">' + (card.bodyHtml || '<p>Texto de la tarjeta.</p>') + '</div>';
          h += '</div></div>';
        }
      }

      h += '</div></div>'; // sb-card-body + sb-card
      return h;
    }

    function toggleSbCard(id) {
      var body = document.getElementById('sbBody_' + id);
      if (body) body.classList.toggle('open');
    }

    function toggleSidebar(enable) {
      readSidebarCards();
      S.hasSidebar = enable;
      if (enable && S.sidebarCards.length === 0) {
        S.sidebarCards.push({ id: ++blockId, type: 'nav', title: 'En esta sección', links: [] });
      }
      renderEditor();
    }

    function addSidebarCard(type) {
      readSidebarCards();
      var id = ++blockId;
      if (type === 'toc') {
        S.sidebarCards.push({ id: id, type: 'toc', title: 'En esta página', depth: 3 });
      } else if (type === 'nav') {
        S.sidebarCards.push({ id: id, type: 'nav', title: 'En esta sección', links: [] });
      } else {
        S.sidebarCards.push({ id: id, type: 'text', rawMode: false, title: '', imageUrl: '', imageAlt: '', imagePosition: 'none', bodyHtml: '' });
      }
      renderEditor();
      setTimeout(function () { var el = document.getElementById('sbCard_' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    }

    function removeSidebarCard(idx) {
      readSidebarCards();
      S.sidebarCards.splice(idx, 1);
      renderEditor();
    }

    function moveSidebarCard(idx, dir) {
      readSidebarCards();
      var ni = idx + dir;
      if (ni < 0 || ni >= S.sidebarCards.length) return;
      var tmp = S.sidebarCards[idx]; S.sidebarCards[idx] = S.sidebarCards[ni]; S.sidebarCards[ni] = tmp;
      renderEditor();
    }

    function initSidebarDrag() {
      initDraggable('sbEditor', '.sb-card[draggable]', function (srcCard, tgtCard) {
        var srcId = parseInt(srcCard.getAttribute('data-sbid'));
        var tgtId = parseInt(tgtCard.getAttribute('data-sbid'));
        readSidebarCards();
        var srcIdx = S.sidebarCards.findIndex(function (c) { return c.id === srcId; });
        var tgtIdx = S.sidebarCards.findIndex(function (c) { return c.id === tgtId; });
        if (srcIdx === -1 || tgtIdx === -1) return;
        var tmp = S.sidebarCards.splice(srcIdx, 1)[0];
        S.sidebarCards.splice(tgtIdx, 0, tmp);
        renderEditor();
      });
    }

    function addNavExtra(cardId) {
      readSidebarCards();
      var card = S.sidebarCards.find(function (c) { return c.id === cardId; });
      if (!card) return;
      if (!card.links) card.links = [];
      // Extra links are those not in section — add a placeholder
      card.links.push({ label: '', href: '', active: false, _extra: true });
      renderEditor();
    }

    function removeNavExtra(cardId, extraIdx) {
      readSidebarCards();
      var card = S.sidebarCards.find(function (c) { return c.id === cardId; });
      if (!card) return;
      var sectionHrefs = getNavSectionPages().map(function (p) { return p.name; });
      var extras = card.links.filter(function (l) { return !sectionHrefs.includes(l.href); });
      var toRemove = extras[extraIdx];
      if (toRemove) card.links = card.links.filter(function (l) { return l !== toRemove; });
      renderEditor();
    }

    function getNavSectionPages() {
      var sectionDir = S.currentPath.includes('/') ? S.currentPath.split('/')[0] : '';
      return (S.pages || []).filter(function (p) {
        return sectionDir ? p.dir === sectionDir : p.dir === '(raíz)';
      });
    }

    function prettifyFilename(name) {
      return name.replace(/\.html?$/, '').replace(/-/g, ' ')
        .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function convertToSimpleText(cardId) {
      readSidebarCards();
      var card = S.sidebarCards.find(function (c) { return c.id === cardId; });
      if (!card) return;
      card.rawMode = false;
      card.title = ''; card.imageUrl = ''; card.imageAlt = ''; card.imagePosition = 'none';
      renderEditor();
    }

    function readSidebarCards() {
      S.sidebarCards.forEach(function (card) {
        if (card.type === 'toc') {
          var t = document.getElementById('sbTocTitle_' + card.id); if (t) card.title = t.value;
          var d = document.getElementById('sbTocDepth_' + card.id); if (d) card.depth = parseInt(d.value) || 3;
        } else if (card.type === 'nav') {
          var t = document.getElementById('sbNavTitle_' + card.id); if (t) card.title = t.value;
          var links = [];
          // Read auto-detected section pages
          var sectionPages = getNavSectionPages();
          sectionPages.forEach(function (pg, pi) {
            var ck = document.getElementById('sbNpCk_' + card.id + '_' + pi);
            if (!ck || !ck.checked) return;
            var lb = document.getElementById('sbNpLb_' + card.id + '_' + pi);
            var actEl = document.querySelector('input[name="sbNpAct_' + card.id + '"][value="' + pi + '"]');
            links.push({ label: lb ? lb.value : prettifyFilename(pg.name), href: pg.name, active: !!(actEl && actEl.checked) });
          });
          // Read extra links
          var ei = 0;
          while (true) {
            var lb = document.getElementById('sbNeLb_' + card.id + '_' + ei);
            if (!lb) break;
            var hr = document.getElementById('sbNeHr_' + card.id + '_' + ei);
            var act = document.getElementById('sbNeAct_' + card.id + '_' + ei);
            if (lb.value || (hr && hr.value)) links.push({ label: lb.value, href: hr ? hr.value : '', active: !!(act && act.checked) });
            ei++;
          }
          card.links = links;
        } else {
          if (card.rawMode) {
            var raw = document.getElementById('sbTextRaw_' + card.id); if (raw) card.bodyHtml = raw.value;
          } else {
            var t = document.getElementById('sbTextTitle_' + card.id); if (t) card.title = t.value;
            var img = document.getElementById('sbTextImg_' + card.id); if (img) card.imageUrl = img.value;
            var alt = document.getElementById('sbTextImgAlt_' + card.id); if (alt) card.imageAlt = alt.value;
            var pos = document.getElementById('sbTextImgPos_' + card.id); if (pos) card.imagePosition = pos.value;
            var body = document.getElementById('sbTextBody_' + card.id); if (body) card.bodyHtml = body.innerHTML;
          }
        }
      });
    }

    function genSidebar() {
      var h = '\n    <aside class="article-sidebar">\n';
      S.sidebarCards.forEach(function (card) {
        if (card.type === 'toc') h += genTocCard(card);
        else if (card.type === 'nav') h += genNavCard(card);
        else h += genTextCard(card);
      });
      h += '\n    </aside>\n';
      return h;
    }

    function genTocCard(card) {
      var depth = card.depth || 3;
      var title = card.title || 'En esta página';
      // Build slug counter for deduplication
      var slugCount = {};
      var tocItems = [];
      S.blocks.forEach(function (b) {
        if (b.type !== 'heading') return;
        var level = b.tag === 'h2' ? 2 : b.tag === 'h3' ? 3 : parseInt((b.tag || 'h6').replace('h', '')) || 6;
        if (level > depth) return;
        var tmp = document.createElement('div'); tmp.innerHTML = b.html;
        var text = (tmp.textContent || tmp.innerText || '').trim();
        var base = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-') || 'item';
        var slug = base; var n = 1;
        while (slugCount[slug]) { slug = base + '-' + (n++); }
        slugCount[slug] = true;
        b.tocId = slug;
        tocItems.push({ level: level, text: text, id: slug });
      });
      var h = '      <div class="sidebar-card" data-sidebar-type="toc" data-toc-depth="' + depth + '">\n';
      h += '        <p class="sidebar-card-title">' + esc(title) + '</p>\n';
      if (tocItems.length === 0) {
        h += '        <p style="font-size:.8rem;color:#999;padding:.5rem 0">No hay títulos en el contenido.</p>\n';
      } else {
        var minLevel = Math.min.apply(null, tocItems.map(function (i) { return i.level; }));
        h += '        <ul class="sidebar-nav-list">\n';
        tocItems.forEach(function (item) {
          var sub = item.level > minLevel ? ' class="sidebar-nav-sub"' : '';
          h += '          <li' + sub + '><a href="#' + escA(item.id) + '">' + esc(item.text) + '</a></li>\n';
        });
        h += '        </ul>\n';
      }
      h += '      </div>\n';
      return h;
    }

    function genNavCard(card) {
      var title = card.title || 'En esta sección';
      var h = '      <div class="sidebar-card">\n';
      h += '        <p class="sidebar-card-title">' + esc(title) + '</p>\n';
      h += '        <ul class="sidebar-nav-list">\n';
      (card.links || []).forEach(function (link) {
        if (!link.label && !link.href) return;
        var activeClass = link.active ? ' class="active"' : '';
        h += '          <li><a href="' + escA(link.href || '#') + '"' + activeClass + '>' + esc(link.label || link.href) + '</a></li>\n';
      });
      h += '        </ul>\n';
      h += '      </div>\n';
      return h;
    }

    function genTextCard(card) {
      if (card.rawMode) {
        var cls = 'sidebar-card' + (card.extraClasses ? ' ' + card.extraClasses : '');
        return '      <div class="' + cls + '">\n' + card.bodyHtml + '\n      </div>\n';
      }
      var h = '      <div class="sidebar-card">\n';
      if (card.title) h += '        <p class="sidebar-card-title">' + esc(card.title) + '</p>\n';
      if (card.imageUrl && card.imagePosition === 'top') {
        h += '        <img src="' + escA(card.imageUrl) + '" alt="' + escA(card.imageAlt || '') + '" style="width:100%;height:auto;display:block">\n';
      }
      if (card.bodyHtml) {
        h += '        <div class="sidebar-card-body" style="padding:.6rem .8rem">\n          ' + card.bodyHtml + '\n        </div>\n';
      }
      if (card.imageUrl && card.imagePosition === 'bottom') {
        h += '        <img src="' + escA(card.imageUrl) + '" alt="' + escA(card.imageAlt || '') + '" style="width:100%;height:auto;display:block">\n';
      }
      h += '      </div>\n';
      return h;
    }

    // ── INLINE TYPOGRAPHY HELPERS ─────────────────────────────────────────────────
    function wrapSelectionStyle(style) {
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      var range = sel.getRangeAt(0);
      var span = document.createElement('span');
      span.setAttribute('style', style);
      try {
        range.surroundContents(span);
      } catch (ex) {
        var frag = range.extractContents();
        span.appendChild(frag);
        range.insertNode(span);
      }
    }

    function applyFontFamily(sel) {
      var val = sel.value; if (!val) return;
      wrapSelectionStyle('font-family:' + val);
      sel.value = '';
    }

    function applyFontSize(inp) {
      var val = parseInt(inp.value); if (!val || val < 1) return;
      wrapSelectionStyle('font-size:' + val + 'px');
    }

    function applyColor(inp) {
      wrapSelectionStyle('color:' + inp.value);
    }

    function applyBgColor(inp) {
      wrapSelectionStyle('background-color:' + inp.value);
    }

    function initRichEditors() {
      document.querySelectorAll('.rich-edit').forEach(function (el) {
        if (el._pasteHandled) return;
        el._pasteHandled = true;
        var isSbRich = el.classList.contains('sb-rich-edit');
        var isSmall = el.classList.contains('rich-edit-sm');
        el.addEventListener('paste', function (e) {
          e.preventDefault();
          var html = (e.clipboardData || window.clipboardData).getData('text/html');
          var text = (e.clipboardData || window.clipboardData).getData('text/plain');
          if (html) {
            var tmp = document.createElement('div');
            tmp.innerHTML = html;
            if (isSbRich) { document.execCommand('insertHTML', false, tmp.innerHTML); return; }
            // Remove meta-elements that carry styles or scripts
            tmp.querySelectorAll('style,script,head,meta,link,img').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
            // Convert heading elements to paragraphs (browser defaults give them large sizes)
            tmp.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (node) {
              var p = document.createElement('p');
              while (node.firstChild) p.appendChild(node.firstChild);
              if (node.parentNode) node.parentNode.replaceChild(p, node);
            });
            // Convert inline-styled spans to semantic tags before stripping
            tmp.querySelectorAll('span,font').forEach(function (node) {
              var st = node.style || {};
              var isItalic = st.fontStyle === 'italic';
              var isBold = st.fontWeight === 'bold' || parseInt(st.fontWeight) >= 700;
              var parent = node.parentNode;
              if (!parent) return;
              var replacement = null;
              if (isItalic && isBold) {
                var em = document.createElement('em');
                var strong = document.createElement('strong');
                while (node.firstChild) em.appendChild(node.firstChild);
                strong.appendChild(em);
                replacement = strong;
              } else if (isItalic) {
                replacement = document.createElement('em');
                while (node.firstChild) replacement.appendChild(node.firstChild);
              } else if (isBold) {
                replacement = document.createElement('strong');
                while (node.firstChild) replacement.appendChild(node.firstChild);
              } else {
                // plain span: just unwrap
                while (node.firstChild) parent.insertBefore(node.firstChild, node);
              }
              if (replacement) parent.replaceChild(replacement, node);
              else parent.removeChild(node);
            });
            // Strip all attributes; for <a> keep only href and target
            tmp.querySelectorAll('*').forEach(function (node) {
              if (node.tagName === 'A') {
                var href = node.getAttribute('href');
                var target = node.getAttribute('target');
                while (node.attributes.length > 0) node.removeAttribute(node.attributes[0].name);
                if (href) node.setAttribute('href', href);
                if (target) node.setAttribute('target', target);
              } else {
                while (node.attributes.length > 0) node.removeAttribute(node.attributes[0].name);
              }
            });
            // For single-line fields: flatten all block elements to inline content
            if (isSmall) {
              tmp.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,blockquote,pre,li,ul,ol').forEach(function (node) {
                if (!node.parentNode) return;
                while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node);
                node.parentNode.removeChild(node);
              });
            }
            document.execCommand('insertHTML', false, tmp.innerHTML);
          } else {
            document.execCommand('insertText', false, text);
          }
        });
      });
    }

    // ── IMAGE PICKER ─────────────────────────────────────────────────────────────
    function openImgPicker(inputId) {
      imgPickerCallback = inputId;
      var grid = document.getElementById('imgGrid');
      grid.innerHTML = S.media.map(function (f) {
        return '<img src="media/' + escA(f) + '" alt="' + escA(f) + '" title="' + escA(f) + '" data-filename="' + escA(f) + '" onclick="pickImage(this.dataset.filename)">';
      }).join('');
      document.getElementById('imgModal').classList.add('open');
      document.getElementById('imgSearch').value = '';
    }

    function refreshImgPreview(inputId, val) {
      // Look for a sibling preview div named <inputId>-preview
      var prev = document.getElementById(inputId + '-preview');
      if (!prev) return;
      var img = prev.querySelector('img');
      if (img) img.src = val;
    }

    function pickImage(filename) {
      if (imgPickerCallback) {
        var input = document.getElementById(imgPickerCallback);
        // Determine relative path based on current page depth
        var depth = S.currentPath.split('/').length - 1;
        var prefix = depth > 0 ? '../' : '';
        input.value = prefix + 'media/' + filename;
        refreshImgPreview(imgPickerCallback, input.value);
      }
      closeImgModal();
    }

    function filterImages() {
      var q = document.getElementById('imgSearch').value.toLowerCase();
      document.querySelectorAll('#imgGrid img').forEach(function (img) {
        img.style.display = img.alt.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    }

    function closeImgModal() {
      document.getElementById('imgModal').classList.remove('open');
      imgPickerCallback = null;
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // BLOCK EDITOR (for article-type pages)
    // ══════════════════════════════════════════════════════════════════════════════
    function renderBlocksEditor() {
      var h = '<div class="ed-section"><h2>Contenido principal</h2>';
      h += '<p class="help" style="margin-bottom:.6rem">Edita el contenido de la página. Puedes añadir, eliminar y reordenar los bloques.</p>';
      h += '<div id="blocksContainer">';
      S.blocks.forEach(function (b, i) {
        if (b.type === '_skip') return;
        h += renderBlockCard(b, i);
      });
      h += '</div>';
      h += '<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.6rem">';
      h += '<button class="btn btn-blue btn-sm" onclick="addBlock(\'paragraph\')">+ Párrafo</button>';
      h += '<button class="btn btn-sm" style="background:var(--dorado);color:#fff" onclick="addBlock(\'heading\')">+ Título</button>';
      h += '<button class="btn btn-sm" style="background:#5a7d5a;color:#fff" onclick="addBlock(\'figure\')">+ Figura</button>';
      h += '<button class="btn btn-sm" style="background:#7a6f60;color:#fff" onclick="addBlock(\'pullquote\')">+ Cita destacada</button>';
      h += '<button class="btn btn-sm" style="background:#4a6a8a;color:#fff" onclick="addBlock(\'links\')">+ Enlaces</button>';
      h += '<button class="btn btn-sm" style="background:#8a6a4a;color:#fff" onclick="addBlock(\'highlight\')">+ Recuadro destacado con enlace</button>';
      h += '<button class="btn btn-sm" style="background:#4a7a8a;color:#fff" onclick="addBlock(\'list\')">+ Lista bibliográfica</button>';
      h += '<button class="btn btn-sm" style="background:#5a7a5a;color:#fff" onclick="addBlock(\'imagegrid\')">+ Cuadrícula de imágenes</button>';
      h += '<button class="btn btn-sm" style="background:#5a6a7a;color:#fff" onclick="addBlock(\'lead\')">+ Texto destacado</button>';
      h += '<button class="btn btn-sm" style="background:#7a4a6a;color:#fff" onclick="addBlock(\'libro\')">+ Libro</button>';
      h += '<button class="btn btn-sm" style="background:#5a5a6a;color:#fff" onclick="addBlock(\'_preserve\')">+ HTML directo</button>';
      h += '</div>';
      h += '</div>';
      return h;
    }

    // ── HTML BLOCKS (shared section for specialized page types) ──────────────────
    function renderHtmlBlocksSection() {
      var h = '<div class="ed-section"><h2>Bloques HTML adicionales</h2>';
      h += '<p class="help" style="margin-bottom:.6rem">Bloques de HTML directo insertados al final del contenido de la página.</p>';
      h += '<div id="htmlBlocksContainer">';
      (S.htmlBlocks || []).forEach(function (blockHtml, i) { h += renderHtmlBlockCard(i, blockHtml); });
      h += '</div>';
      h += '<button class="btn btn-sm" style="background:#5a5a6a;color:#fff;margin-top:.5rem" onclick="addHtmlBlock()">+ HTML directo</button>';
      h += '</div>';
      return h;
    }
    function renderHtmlBlockCard(i, blockHtml) {
      return '<div class="block-card" data-hbidx="' + i + '">'
        + '<div class="block-header">'
        + '<span class="block-type type-p" style="background:#5a5a6a">HTML directo</span>'
        + '<div class="block-actions"><button class="del" onclick="removeHtmlBlock(' + i + ')" title="Eliminar bloque" aria-label="Eliminar bloque">✕</button></div>'
        + '</div>'
        + '<textarea class="html-block-ta" style="font-family:monospace;font-size:.78rem;min-height:80px;width:100%;resize:vertical;border:1px solid var(--borde);border-radius:4px;padding:.4rem .5rem;display:block">' + esc(blockHtml) + '</textarea>'
        + '</div>';
    }
    function addHtmlBlock() {
      readHtmlBlocks();
      S.htmlBlocks.push('');
      rerenderHtmlBlocks();
    }
    function removeHtmlBlock(i) {
      readHtmlBlocks();
      S.htmlBlocks.splice(i, 1);
      rerenderHtmlBlocks();
    }
    function readHtmlBlocks() {
      S.htmlBlocks = [];
      document.querySelectorAll('#htmlBlocksContainer .html-block-ta').forEach(function (ta) {
        S.htmlBlocks.push(ta.value);
      });
    }
    function rerenderHtmlBlocks() {
      var c = document.getElementById('htmlBlocksContainer');
      if (!c) return;
      c.innerHTML = (S.htmlBlocks || []).map(function (b, i) { return renderHtmlBlockCard(i, b); }).join('');
      injectCollapseToggles();
    }

    function renderBlockCard(b) {
      var types = { heading: 'Título', paragraph: 'Párrafo', lead: 'Texto destacado', figure: 'Figura', imagegrid: 'Cuadrícula de imágenes', pullquote: 'Cita', links: 'Enlaces', highlight: 'Recuadro destacado con enlace', list: 'Lista', libro: 'Libro', '_preserve': 'HTML directo' };
      var tcls = { heading: 'type-h', paragraph: 'type-p', lead: 'type-quote', figure: 'type-fig', imagegrid: 'type-fig', pullquote: 'type-quote', links: 'type-links', highlight: 'type-quote', list: 'type-p', libro: 'type-links', '_preserve': 'type-p' };
      var h = '<div class="block-card" data-bid="' + b.id + '" draggable="true">';
      h += '<div class="block-header">';
      h += '<span class="block-handle" title="Arrastrar para reordenar" aria-label="Arrastrar">⠿</span>';
      h += '<span class="block-type ' + (tcls[b.type] || 'type-p') + '">' + (types[b.type] || b.type) + '</span>';
      h += '<div class="block-actions">';
      h += '<button class="del" title="Eliminar bloque" aria-label="Eliminar bloque" onclick="removeBlock(' + b.id + ')">✕</button>';
      h += '</div></div>';

      if (b.type === 'heading') {
        h += '<div style="display:flex;gap:.5rem;align-items:flex-end">';
        h += '<div style="width:70px"><label>Nivel</label><select onchange="updBlock(' + b.id + ',\'tag\',this.value)">';
        h += '<option value="h2"' + (b.tag === 'h2' ? ' selected' : '') + '>Título de sección</option>';
        h += '<option value="h3"' + (b.tag === 'h3' ? ' selected' : '') + '>Subtítulo</option></select></div>';
        h += '<div style="flex:1">' + richLineField('Texto', 'heading-' + b.id, b.html) + '</div>';
        h += '</div>';
      } else if (b.type === 'paragraph') {
        h += richField('Contenido', b.html, 'block-' + b.id);
      } else if (b.type === 'lead') {
        h += richField('Texto destacado (lead)', b.html, 'block-' + b.id);
      } else if (b.type === 'imagegrid') {
        var cols = b.cols || 2;
        var gsz = b.size || 'medium';
        h += '<div class="field"><label>Columnas</label><select id="gg-cols-' + b.id + '" onchange="updBlock(' + b.id + ',\'cols\',parseInt(this.value))">';
        [1, 2, 3, 4].forEach(function (n) { h += '<option value="' + n + '"' + (cols === n ? ' selected' : '') + '>' + n + '</option>'; });
        h += '</select></div>';
        h += '<div class="field"><label>Tamaño</label><select id="gg-size-' + b.id + '"><option value="small"' + (gsz === 'small' ? ' selected' : '') + '>Pequeña</option><option value="medium"' + (gsz === 'medium' ? ' selected' : '') + '>Normal</option><option value="large"' + (gsz === 'large' ? ' selected' : '') + '>Grande</option><option value="full"' + (gsz === 'full' ? ' selected' : '') + '>Completa</option></select></div>';
        h += '<div id="imggrid-' + b.id + '">';
        (b.imgs || []).forEach(function (img, i) {
          h += '<div style="display:flex;gap:.4rem;align-items:flex-end;margin-bottom:.4rem">';
          h += '<div style="flex:1">' + imgField('Imagen ' + (i + 1), img.src, 'gg-src-' + b.id + '-' + i) + '</div>';
          h += '<div style="flex:1">' + field('Texto alternativo', 'gg-alt-' + b.id + '-' + i, img.alt, 'Alt de la imagen') + '</div>';
          h += '<button class="del-link" onclick="delGridImg(' + b.id + ',' + i + ')" title="Eliminar imagen">×</button>';
          h += '</div>';
        });
        h += '</div>';
        h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="addGridImg(' + b.id + ')">+ Añadir imagen</button>';
      } else if (b.type === 'figure') {
        h += imgField('Imagen', b.src, 'img-' + b.id);
        h += field('Texto alternativo', 'alt-' + b.id, b.alt, 'Descripción breve de la imagen');
        h += richFieldCaption('Pie de foto', b.caption || '', 'cap-' + b.id);
        var bpos = b.position || 'right';
        h += '<div class="field"><label>Posición</label><select id="pos-' + b.id + '"><option value="right"' + (bpos === 'right' ? ' selected' : '') + '>Derecha</option><option value="left"' + (bpos === 'left' ? ' selected' : '') + '>Izquierda</option><option value="center"' + (bpos === 'center' ? ' selected' : '') + '>Centrada</option></select></div>';
        var sz = b.size || 'medium';
        h += '<div class="field"><label>Tamaño</label><select id="size-' + b.id + '"><option value="small"' + (sz === 'small' ? ' selected' : '') + '>Pequeña</option><option value="medium"' + (sz === 'medium' ? ' selected' : '') + '>Normal</option><option value="large"' + (sz === 'large' ? ' selected' : '') + '>Grande</option><option value="full"' + (sz === 'full' ? ' selected' : '') + '>Completa</option></select></div>';
      } else if (b.type === 'pullquote') {
        h += richField('Texto de la cita', b.html, 'block-' + b.id);
      } else if (b.type === 'links') {
        h += '<div id="links-' + b.id + '">';
        (b.links || []).forEach(function (l, li) {
          h += '<div class="link-row">';
          h += '<input type="text" value="' + escA(l.label) + '" placeholder="Texto del enlace">';
          h += '<input type="text" value="' + escA(l.url) + '" placeholder="URL">';
          h += '<button class="del-link" onclick="delLink(' + b.id + ',' + li + ')">×</button>';
          h += '</div>';
        });
        h += '</div>';
        h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="addLink(' + b.id + ')">+ Añadir enlace</button>';
      } else if (b.type === 'highlight') {
        h += richField('Texto del bloque destacado', b.html, 'block-' + b.id);
        h += field('Texto del botón', 'btnlabel-' + b.id, b.btnLabel, 'Ej.: ↓ Consultar aquí (PDF)');
        h += '<div class="field"><label>URL del botón</label><div style="display:flex;gap:.4rem;align-items:center">';
        h += '<input type="text" id="btnurl-' + b.id + '" value="' + escA(b.btnUrl || '') + '" placeholder="Ej.: ../media/archivo.pdf" style="flex:1">';
        h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir archivo (PDF)"><input type="file" accept=".pdf,image/*" style="display:none" onchange="uploadHighlightFile(this,\'' + b.id + '\')">Subir</label>';
        h += '</div></div>';
      } else if (b.type === 'libro') {
        h += renderLibroBlockFields(b);
      } else if (b.type === 'list') {
        h += '<div id="listEntries-' + b.id + '">';
        (b.items || []).forEach(function (item, i) {
          h += '<div class="list-entry" style="border:1px solid var(--borde);border-radius:4px;padding:.5rem;margin-bottom:.5rem">';
          h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem">';
          h += '<span style="font-size:.72rem;font-weight:600;color:var(--azul)">Entrada ' + (i + 1) + '</span>';
          h += '<button class="del" title="Eliminar entrada" onclick="delListEntry(' + b.id + ',' + i + ')">✕</button>';
          h += '</div>';
          h += richFieldBiblio('Citación (autor, título, publicación, año, páginas, enlace…)', item.main, 'listmain-' + b.id + '-' + i);
          h += richFieldBiblio('Nota descriptiva (descripción adicional con enlace; opcional)', item.note || '', 'listnote-' + b.id + '-' + i);
          h += '</div>';
        });
        h += '</div>';
        h += '<button class="btn btn-outline btn-sm" style="margin-top:.4rem" onclick="addListEntry(' + b.id + ')">+ Añadir entrada</button>';
      } else if (b.type === '_preserve') {
        h += '<div class="field"><label style="font-size:.72rem;color:var(--gris)">Bloque HTML (edición directa)</label>';
        h += '<textarea id="rawhtml-' + b.id + '" style="font-family:monospace;font-size:.78rem;min-height:120px;width:100%;resize:vertical">' + esc(b.html) + '</textarea>';
        h += '</div>';
      }
      h += '</div>';
      return h;
    }

    function addBlock(type) {
      var b = { id: blockId++, type: type };
      if (type === 'heading') { b.tag = 'h2'; b.html = ''; b.cls = ''; }
      else if (type === 'paragraph') { b.html = 'Nuevo párrafo'; b.cls = ''; }
      else if (type === 'figure') { b.src = ''; b.alt = ''; b.caption = ''; b.position = 'right'; b.cls = ''; b.size = 'medium'; }
      else if (type === 'pullquote') { b.html = ''; }
      else if (type === 'links') { b.links = [{ label: '', url: '' }]; }
      else if (type === 'highlight') { b.html = ''; b.btnLabel = '↓ Consultar aquí (PDF)'; b.btnUrl = ''; }
      else if (type === 'imagegrid') { b.cols = 2; b.imgs = [{ src: '', alt: '' }, { src: '', alt: '' }]; b.size = 'medium'; }
      else if (type === 'list') { b.cls = 'biblio-list'; b.items = [{ main: '', note: '' }]; }
      else if (type === 'libro') { b.title = ''; b.author = ''; b.editor = ''; b.year = ''; b.editorial = ''; b.city = ''; b.collection = ''; b.isbn = ''; b.buyUrl = ''; b.image = ''; b.displayMode = 'modal'; b.extraFields = []; }
      else if (type === '_preserve') { b.html = ''; }
      S.blocks.push(b);
      rerenderBlocks();
    }

    function removeBlock(bid) {
      if (!confirm('¿Eliminar este bloque?')) return;
      S.blocks = S.blocks.filter(function (b) { return b.id !== bid; });
      rerenderBlocks();
    }

    function moveBlock(bid, dir) {
      readAllBlocks();
      var i = S.blocks.findIndex(function (b) { return b.id === bid; });
      if (i === -1) return;
      var ni = i + dir;
      if (ni < 0 || ni >= S.blocks.length) return;
      var tmp = S.blocks[i]; S.blocks[i] = S.blocks[ni]; S.blocks[ni] = tmp;
      rerenderBlocks();
    }

    function updBlock(bid, key, val) {
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) b[key] = val;
    }

    function addLink(bid) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) { if (!b.links) b.links = []; b.links.push({ label: '', url: '' }); }
      rerenderBlocks();
    }

    function delLink(bid, li) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b && b.links) { b.links.splice(li, 1); }
      rerenderBlocks();
    }

    function addGridImg(bid) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) { if (!b.imgs) b.imgs = []; b.imgs.push({ src: '', alt: '' }); }
      rerenderBlocks();
    }

    function delGridImg(bid, idx) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b && b.imgs && b.imgs.length > 1) { b.imgs.splice(idx, 1); }
      rerenderBlocks();
    }

    function addListEntry(bid) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) { if (!b.items) b.items = []; b.items.push({ main: 'Nueva entrada bibliográfica.', note: '' }); }
      rerenderBlocks();
    }

    function delListEntry(bid, idx) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b && b.items) { b.items.splice(idx, 1); }
      rerenderBlocks();
    }

    async function uploadHighlightFile(fileInput, bid) {
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
          var depth = S.currentPath.split('/').length - 1;
          var prefix = depth > 0 ? '../' : '';
          var urlInput = document.getElementById('btnurl-' + bid);
          if (urlInput) urlInput.value = prefix + 'media/' + data.filename;
          toast('Archivo subido: ' + data.filename, 'ok');
        } else {
          toast('Error al subir: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al subir archivo', 'err');
      }
      fileInput.value = '';
    }

    function rerenderBlocks() {
      var c = document.getElementById('blocksContainer');
      if (!c) return;
      readAllBlocks();
      var h = '';
      S.blocks.forEach(function (b) {
        if (b.type === '_skip') return;
        h += renderBlockCard(b);
      });
      c.innerHTML = h;
      initRichEditors();
      initBlocksDrag();
      injectCollapseToggles();
    }

    function readAllBlocks() {
      S.blocks.forEach(function (b) {
        if (b.type === 'paragraph' || b.type === 'pullquote' || b.type === 'lead') {
          var el = document.querySelector('[data-rich-id="block-' + b.id + '"]');
          if (el) b.html = el.innerHTML;
        }
        if (b.type === 'imagegrid') {
          var colsSel = document.getElementById('gg-cols-' + b.id); if (colsSel) b.cols = parseInt(colsSel.value) || 2;
          var szSel = document.getElementById('gg-size-' + b.id); if (szSel) b.size = szSel.value;
          (b.imgs || []).forEach(function (img, i) {
            var si = document.getElementById('gg-src-' + b.id + '-' + i); if (si) img.src = si.value;
            var ai = document.getElementById('gg-alt-' + b.id + '-' + i); if (ai) img.alt = ai.value;
          });
        }
        if (b.type === 'figure') {
          var si = document.getElementById('img-' + b.id); if (si) b.src = si.value;
          var ai = document.getElementById('alt-' + b.id); if (ai) b.alt = ai.value;
          var ci = document.querySelector('[data-rich-id="cap-' + b.id + '"]'); if (ci) b.caption = ci.innerHTML;
          var pi = document.getElementById('pos-' + b.id); if (pi) b.position = pi.value;
          var szi = document.getElementById('size-' + b.id); if (szi) b.size = szi.value;
        }
        if (b.type === 'heading') {
          b.html = gR('heading-' + b.id);
        }
        if (b.type === 'links') {
          var container = document.getElementById('links-' + b.id);
          if (container) {
            b.links = [];
            container.querySelectorAll('.link-row').forEach(function (row) {
              var inputs = row.querySelectorAll('input');
              if (inputs.length >= 2) b.links.push({ label: inputs[0].value, url: inputs[1].value });
            });
          }
        }
        if (b.type === 'highlight') {
          var el = document.querySelector('[data-rich-id="block-' + b.id + '"]');
          if (el) b.html = el.innerHTML;
          var lbl = document.getElementById('btnlabel-' + b.id); if (lbl) b.btnLabel = lbl.value;
          var url = document.getElementById('btnurl-' + b.id); if (url) b.btnUrl = url.value;
        }
        if (b.type === 'list') {
          (b.items || []).forEach(function (item, i) {
            var mainEl = document.querySelector('[data-rich-id="listmain-' + b.id + '-' + i + '"]');
            var noteEl = document.querySelector('[data-rich-id="listnote-' + b.id + '-' + i + '"]');
            if (mainEl) item.main = mainEl.innerHTML;
            if (noteEl) item.note = noteEl.innerHTML;
          });
        }
        if (b.type === '_preserve') {
          var el = document.getElementById('rawhtml-' + b.id);
          if (el) b.html = el.value;
        }
        if (b.type === 'libro') {
          var mEl = document.querySelector('input[name="lbmode-' + b.id + '"]:checked'); if (mEl) b.displayMode = mEl.value;
          b.title = gR('lbtitle-' + b.id).replace(/^<(?:p|div)[^>]*>([\s\S]*)<\/(?:p|div)>$/i, '$1').trim();
          var au = document.getElementById('lbauthor-' + b.id); if (au) b.author = au.value;
          var en = document.getElementById('lbeditor-' + b.id); if (en) b.editor = en.value;
          var yr = document.getElementById('lbyear-' + b.id); if (yr) b.year = yr.value;
          var ed = document.getElementById('lbedit-' + b.id); if (ed) b.editorial = ed.value;
          var ct = document.getElementById('lbcity-' + b.id); if (ct) b.city = ct.value;
          var co = document.getElementById('lbcollection-' + b.id); if (co) b.collection = co.value;
          var is = document.getElementById('lbisbn-' + b.id); if (is) b.isbn = is.value;
          var bu = document.getElementById('lbbuy-' + b.id); if (bu) b.buyUrl = bu.value;
          var im = document.getElementById('lbimg-' + b.id); if (im) b.image = im.value;
          b.extraFields = [];
          var efC = document.getElementById('lbextra-' + b.id);
          if (efC) {
            efC.querySelectorAll('[data-ef-idx]').forEach(function (row) {
              var ei = parseInt(row.dataset.efIdx);
              var lbl = document.getElementById('lbef-label-' + b.id + '-' + ei);
              var val = document.getElementById('lbef-value-' + b.id + '-' + ei);
              if (lbl && val) b.extraFields.push({ label: lbl.value, value: val.value });
            });
          }
        }
      });
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // SPECIALIZED EDITORS
    // ══════════════════════════════════════════════════════════════════════════════

    // ── TESIS ────────────────────────────────────────────────────────────────────
    function renderThesesEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Tesis</h2>';
      h += '<div id="itemsContainer">';
      S.items.forEach(function (it) { h += renderThesisCard(it); });
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addThesis()">+ Añadir tesis</button>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderThesisCard(it) {
      var h = '<div class="item-card" data-iid="' + it.id + '" draggable="true">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<button class="btn-del-item" onclick="removeItem(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong>' + esc(it.title ? it.title.replace(/<[^>]+>/g, '').substring(0, 60) : 'Nueva tesis') + '</strong></div>';
      h += '<div class="row">';
      h += '<div>' + field('Año', 'thy-' + it.id, it.year, '2024') + '</div>';
      h += '<div><div class="field"><label>Estado</label><select id="thp-' + it.id + '"><option value="link"' + (it.pending ? '' : ' selected') + '>Con enlace</option><option value="pending"' + (it.pending ? ' selected' : '') + '>Pendiente</option></select></div></div>';
      h += '</div>';
      h += richLineField('Título', 'tht-' + it.id, it.title);
      h += richField('Datos (autor, director, universidad, fecha…)', it.meta, 'thm-' + it.id);
      h += field('URL de la tesis (si tiene enlace)', 'thl-' + it.id, it.link, 'https://...');
      h += '</div>';
      return h;
    }

    function addThesis() {
      readAllItems();
      S.items.unshift({ id: blockId++, year: '', title: '', meta: '<strong>Autor</strong><br>Dir.: Director<br>Universidad<br>Fecha de defensa', link: '', pending: true, linkText: '' });
      rerenderItems();
    }

    // ── CONGRESOS ────────────────────────────────────────────────────────────────
    function renderCongressesEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Congresos</h2>';
      h += '<div id="itemsContainer">';
      S.items.forEach(function (it) { h += renderCongressCard(it); });
      h += '</div>';
      h += '<div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">';
      h += '<button class="btn btn-blue btn-sm" onclick="addCongress()">+ Añadir congreso</button>';
      h += '<button class="btn btn-outline btn-sm" onclick="addCongressGroup()">+ Añadir subcategoría</button>';
      h += '</div>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderCongressCard(it) {
      if (it._group) return renderCongressGroupHeader(it);
      var openAttr = it._open ? ' open' : '';
      var label = esc((it.edition || 'Nuevo congreso').replace(/<[^>]+>/g, '')) + (it.year ? ' (' + it.year + ')' : '');
      var h = '<details class="item-card" data-iid="' + it.id + '" draggable="true"' + openAttr + '>';
      h += '<summary style="cursor:pointer;display:flex;align-items:center;gap:.5rem;list-style:none;padding-right:2rem">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<strong>' + label + '</strong>';
      h += '<button class="btn-del-item" onclick="event.preventDefault();removeItem(' + it.id + ')" style="position:static;margin-left:auto">✕</button>';
      h += '</summary>';
      h += '<div style="padding-top:.75rem">';
      h += '<div class="row">';
      h += '<div>' + field('Año', 'cgy-' + it.id, it.year) + '</div>';
      h += '<div>' + richLineField('Edición', 'cge-' + it.id, it.edition, 'XI Congreso Internacional') + '</div>';
      h += '</div>';
      h += richLineField('Título / tema', 'cgn-' + it.id, it.name);
      h += '<div class="row">';
      h += '<div>' + field('Fechas', 'cgd-' + it.id, it.dates, '27-29 nov. 2024') + '</div>';
      h += '<div>' + field('Lugar', 'cgl-' + it.id, it.location, 'UAB, Barcelona') + '</div>';
      h += '</div>';
      h += imgField('Imagen del cartel', it.image, 'cgi-' + it.id);
      h += field('Texto alt de imagen', 'cga-' + it.id, it.imageAlt);
      // Modal detail section — modalId is auto-generated, not shown to user
      h += '<input type="hidden" id="cgoid-' + it.id + '" value="' + escA(it.modalId || '') + '">';
      h += '<details style="margin-top:.6rem"><summary style="cursor:pointer;font-weight:600;font-size:.82rem;color:var(--azul)">▶ Detalle del modal (ventana emergente)</summary>';
      h += '<div style="margin-top:.5rem;padding:.5rem;background:rgba(200,164,90,.06);border-radius:6px;border-left:3px solid var(--dorado)">';
      h += richLineField('Título del congreso (en el modal)', 'cgmt-' + it.id, it.modalTitle || '');
      h += '<label style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">Descripción del modal</label>';
      h += '<textarea id="cgmd-' + it.id + '" rows="4" style="width:100%;box-sizing:border-box;padding:.4rem .5rem;border:1px solid #c5b99a;border-radius:4px;font-size:.83rem;resize:vertical">' + esc(it.modalDescription || '') + '</textarea>';
      h += '<label style="display:block;margin-top:.6rem;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">Botones de enlace en el modal</label>';
      h += '<p class="help">Etiqueta y URL de cada botón (ej.: "↓ Programa (PDF)" y la ruta al PDF).</p>';
      h += '<div id="cgml-' + it.id + '">';
      (it.modalLinks || []).forEach(function (l) {
        h += '<div class="link-row">';
        h += '<input type="text" value="' + escA(l.label) + '" placeholder="Etiqueta">';
        h += '<input type="text" value="' + escA(l.url) + '" placeholder="URL o ruta">';
        h += '<button class="del-link" onclick="delCongressModalLink(this)">×</button>';
        h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir archivo (PDF, imagen)">';
        h += '<input type="file" accept=".pdf,image/*" style="display:none" onchange="uploadCongressLinkFile(this)">Subir</label>';
        h += '</div>';
      });
      h += '</div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="addCongressModalLink(' + it.id + ')">+ Enlace</button>';
      h += '</div></details>';
      h += '</div>';
      h += '</details>';
      return h;
    }

    function renderGroupHeader(it) {
      return '<div style="border-left:3px solid var(--dorado);padding:.5rem .8rem;margin:.8rem 0 .4rem;background:rgba(200,164,90,.08);border-radius:0 6px 6px 0">'
        + '<strong style="font-family:Raleway,sans-serif;font-size:.88rem;color:var(--azul)">' + esc(it.title) + '</strong>'
        + '<span style="margin-left:.5rem;font-size:.75rem;color:#888">' + esc(it.count) + '</span>'
        + '</div>';
    }

    function renderCongressGroupHeader(it) {
      var h = '<div class="item-card" data-iid="' + it.id + '" draggable="true" style="border-left:3px solid var(--dorado);background:rgba(200,164,90,.08)">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<button class="btn-del-item" onclick="removeCongressGroup(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong style="color:var(--azul)">— Subcategoría —</strong></div>';
      h += richLineField('Título de la subcategoría', 'grpt-' + it.id, it.title, 'Ej.: Congreso Internacional Lope de Vega');
      h += richLineField('Texto del contador', 'grpc-' + it.id, it.count, 'Ej.: 11 ediciones');
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addCongressAfterGroup(' + it.id + ')">+ Añadir congreso aquí</button>';
      h += '</div>';
      return h;
    }

    function removeCongressGroup(iid) {
      if (!confirm('¿Eliminar esta subcategoría?')) return;
      readAllItems();
      S.items = S.items.filter(function (it) { return it.id !== iid; });
      rerenderItems();
    }

    function addCongress() {
      readAllItems();
      S.items.unshift({ id: blockId++, image: '', imageAlt: '', year: '', edition: '', name: '', dates: '', location: '', onclick: '', modalId: '', modalTitle: '', modalDescription: '', modalLinks: [] });
      rerenderItems();
    }

    function addCongressGroup() {
      readAllItems();
      S.items.unshift({ id: blockId++, _group: true, title: '', count: '' });
      rerenderItems();
    }

    function addCongressAfterGroup(gid) {
      readAllItems();
      var idx = S.items.findIndex(function (it) { return it.id === gid; });
      var newItem = { id: blockId++, image: '', imageAlt: '', year: '', edition: '', name: '', dates: '', location: '', onclick: '', modalId: '', modalTitle: '', modalDescription: '', modalLinks: [], _open: true };
      S.items.splice(idx + 1, 0, newItem);
      rerenderItems();
    }

    function addCongressModalLink(iid) {
      var container = document.getElementById('cgml-' + iid);
      if (!container) return;
      var row = document.createElement('div');
      row.className = 'link-row';
      row.innerHTML = '<input type="text" value="" placeholder="Etiqueta">'
        + '<input type="text" value="" placeholder="URL o ruta">'
        + '<button class="del-link" onclick="delCongressModalLink(this)">×</button>'
        + '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir archivo (PDF, imagen)">'
        + '<input type="file" accept=".pdf,image/*" style="display:none" onchange="uploadCongressLinkFile(this)">Subir</label>';
      container.appendChild(row);
    }

    function delCongressModalLink(btn) {
      var row = btn.closest('.link-row');
      if (row) row.remove();
    }

    async function uploadCongressLinkFile(fileInput) {
      if (!fileInput.files || !fileInput.files.length) return;
      var file = fileInput.files[0];
      var ext = file.name.split('.').pop().toLowerCase();
      var endpoint = ext === 'pdf' ? '/api/upload-image' : '/api/upload-image';
      toast('Subiendo archivo…', 'info');
      try {
        var r = await fetch(endpoint + '?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (data.ok) {
          var depth = S.currentPath.split('/').length - 1;
          var prefix = depth > 0 ? '../' : '';
          var urlInput = fileInput.closest('.link-row').querySelectorAll('input[type="text"]')[1];
          if (urlInput) urlInput.value = prefix + 'media/' + data.filename;
          toast('Archivo subido: ' + data.filename, 'ok');
        } else {
          toast('Error al subir: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al subir archivo', 'err');
      }
      fileInput.value = '';
    }

    async function uploadSeminarPdfFile(fileInput, targetId) {
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
          var depth = S.currentPath.split('/').length - 1;
          var prefix = depth > 0 ? '../' : '';
          var urlInput = document.getElementById(targetId);
          if (urlInput) urlInput.value = prefix + 'media/' + data.filename;
          toast('Archivo subido: ' + data.filename, 'ok');
        } else {
          toast('Error al subir: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al subir archivo', 'err');
      }
      fileInput.value = '';
    }

    // ── SEMINARIOS ───────────────────────────────────────────────────────────────
    function renderSeminarsEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Seminarios</h2>';
      h += '<div id="itemsContainer">';
      S.items.forEach(function (it) { h += renderSeminarCard(it); });
      h += '</div>';
      h += '<div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">';
      h += '<button class="btn btn-blue btn-sm" onclick="addSeminar()">+ Añadir seminario</button>';
      h += '<button class="btn btn-outline btn-sm" onclick="addSeminarGroup()">+ Añadir subcategoría</button>';
      h += '</div>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderSeminarCard(it) {
      if (it._group) return renderSeminarGroupHeader(it);
      var openAttr = it._open ? ' open' : '';
      var label = esc(it.name || 'Nuevo seminario') + (it.year ? ' (' + it.year + ')' : '');
      var h = '<details class="item-card" data-iid="' + it.id + '" draggable="true"' + openAttr + '>';
      h += '<summary style="cursor:pointer;display:flex;align-items:center;gap:.5rem;list-style:none;padding-right:2rem">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<strong id="smlabel-' + it.id + '">' + label + '</strong>';
      h += '<button class="btn-del-item" onclick="event.preventDefault();removeItem(' + it.id + ')" style="position:static;margin-left:auto">✕</button>';
      h += '</summary>';
      h += '<div style="padding-top:.75rem">';
      h += '<div class="row">';
      h += '<div>' + field('Año', 'smy-' + it.id, it.year) + '</div>';
      h += '<div>' + field('Fechas (cabecera)', 'smd-' + it.id, it.dates, '12-14 jun. 2024') + '</div>';
      h += '</div>';
      h += '<label style="display:block;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">Nombre</label>';
      h += '<input type="text" id="smn-' + it.id + '" value="' + escA(it.name || '') + '" oninput="updateSeminarLabel(' + it.id + ')">';
      h += richLineField('Tema (opcional)', 'smt-' + it.id, it.theme);
      h += '<label style="margin-top:.4rem">Campos del panel desplegable</label>';
      h += '<p class="help">Estos campos aparecen cuando se despliega el seminario.</p>';
      h += '<div id="smf-' + it.id + '">';
      (it.fields || []).forEach(function (f, fi) {
        h += '<div class="link-row">';
        h += '<input type="text" value="' + escA(f.label) + '" placeholder="Etiqueta" style="max-width:150px">';
        h += '<input type="text" value="' + escA(f.value) + '" placeholder="Valor">';
        h += '<button class="del-link" onclick="delSemField(' + it.id + ',' + fi + ')">×</button>';
        h += '</div>';
      });
      h += '</div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem" onclick="addSemField(' + it.id + ')">+ Campo</button>';
      h += '<div style="margin-top:.4rem">';
      h += '<label style="display:block;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">URL del programa PDF (opcional)</label>';
      h += '<div class="link-row">';
      h += '<input type="text" id="smp-' + it.id + '" value="' + escA(it.pdfUrl || '') + '" placeholder="https://... (dejar vacío si no hay programa)" style="flex:1">';
      h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir archivo (PDF, imagen)">';
      h += '<input type="file" accept=".pdf,image/*" style="display:none" onchange="uploadSeminarPdfFile(this,\'smp-' + it.id + '\')">Subir</label>';
      h += '</div>';
      h += '<label style="display:block;margin-top:.4rem;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">URL del cartel (imagen o PDF, opcional)</label>';
      h += '<div class="link-row">';
      h += '<input type="text" id="smpost-' + it.id + '" value="' + escA(it.posterUrl || '') + '" placeholder="https://... (dejar vacío si no hay cartel)" style="flex:1">';
      h += '<label class="btn btn-outline btn-sm img-upload-btn" title="Subir imagen o PDF del cartel">';
      h += '<input type="file" accept=".pdf,image/*" style="display:none" onchange="uploadSeminarPdfFile(this,\'smpost-' + it.id + '\')">Subir</label>';
      h += '</div>';
      h += '</div>';
      h += '</div>';
      h += '</details>';
      return h;
    }

    function renderSeminarGroupHeader(it) {
      var h = '<div class="item-card" data-iid="' + it.id + '" draggable="true" style="border-left:3px solid var(--dorado);background:rgba(200,164,90,.08)">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<button class="btn-del-item" onclick="removeSeminarGroup(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong style="color:var(--azul)">— Subcategoría —</strong></div>';
      h += richLineField('Título de la subcategoría', 'grpt-' + it.id, it.title, 'Ej.: Seminario Internacional Lope de Vega');
      h += richLineField('Texto del contador', 'grpc-' + it.id, it.count, 'Ej.: 8 ediciones');
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addSeminarAfterGroup(' + it.id + ')">+ Añadir seminario aquí</button>';
      h += '</div>';
      return h;
    }

    function removeSeminarGroup(iid) {
      if (!confirm('¿Eliminar esta subcategoría?')) return;
      readAllItems();
      S.items = S.items.filter(function (it) { return it.id !== iid; });
      rerenderItems();
    }

    function addSemField(iid) {
      readAllItems();
      var it = S.items.find(function (i) { return i.id === iid; });
      if (it) { if (!it.fields) it.fields = []; it.fields.push({ label: '', value: '' }); }
      rerenderItems();
    }

    function delSemField(iid, fi) {
      readAllItems();
      var it = S.items.find(function (i) { return i.id === iid; });
      if (it && it.fields) { it.fields.splice(fi, 1); }
      rerenderItems();
    }

    function addSeminar() {
      readAllItems();
      S.items.unshift({ id: blockId++, year: '', name: '', theme: '', dates: '', fields: [{ label: 'Fechas', value: '' }, { label: 'Organizado por', value: '' }], pdfUrl: '', pdfText: '', posterUrl: '', posterText: '' });
      rerenderItems();
    }

    function addSeminarGroup() {
      readAllItems();
      S.items.unshift({ id: blockId++, _group: true, title: '', count: '' });
      rerenderItems();
    }

    function updateSeminarLabel(iid) {
      var n = document.getElementById('smn-' + iid);
      var y = document.getElementById('smy-' + iid);
      var lbl = document.getElementById('smlabel-' + iid);
      if (!lbl) return;
      var name = n ? n.value.trim() : '';
      var year = y ? y.value.trim() : '';
      lbl.textContent = (name || 'Nuevo seminario') + (year ? ' (' + year + ')' : '');
    }

    function addSeminarAfterGroup(gid) {
      readAllItems();
      var idx = S.items.findIndex(function (it) { return it.id === gid; });
      var newItem = { id: blockId++, year: '', name: '', theme: '', dates: '', fields: [{ label: 'Fechas', value: '' }, { label: 'Organizado por', value: '' }], pdfUrl: '', pdfText: '', posterUrl: '', posterText: '', _open: true };
      S.items.splice(idx + 1, 0, newItem);
      rerenderItems();
    }

    // ── MULTIMEDIA ───────────────────────────────────────────────────────────────
    function renderMultimediaEditor() {
      var h = '<div class="ed-section"><h2>Vídeos</h2>';
      h += '<div id="itemsContainer">';
      S.items.forEach(function (it) { h += renderVideoCard(it); });
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addVideo()">+ Añadir vídeo</button>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderVideoCard(it) {
      var isLocal = !!it.isLocal;
      var h = '<div class="item-card" data-iid="' + it.id + '">';
      h += '<button class="btn-del-item" onclick="removeItem(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong>' + esc((it.title || '').replace(/<[^>]+>/g, '').substring(0, 50) || 'Nuevo vídeo') + '</strong></div>';
      h += '<div class="row">';
      h += '<div>' + field('Fecha', 'vid-' + it.id, it.date, '12 jul. 2024') + '</div>';
      var knownSources = getKnownVideoSources();
      var isCustomSrc = it.source && knownSources.indexOf(it.source) === -1;
      h += '<div><div class="field"><label>Canal / fuente</label>'
        + '<select id="vis-sel-' + it.id + '" onchange="updateVideoSource(' + it.id + ')">';
      knownSources.forEach(function (s) { h += '<option value="' + escA(s) + '"' + (!isCustomSrc && it.source === s ? ' selected' : '') + '>' + esc(s) + '</option>'; });
      h += '<option value="_custom"' + (isCustomSrc ? ' selected' : '') + '>Otra fuente…</option>';
      h += '</select>'
        + '<input type="text" id="vis-txt-' + it.id + '" value="' + escA(isCustomSrc ? it.source : '') + '" placeholder="Nombre del canal"' + (isCustomSrc ? '' : ' style="display:none"') + '>'
        + '</div></div>';
      h += '</div>';
      h += richLineField('Título', 'vit-' + it.id, it.title);
      h += richLineField('Descripción', 'vin-' + it.id, it.desc);
      h += '<div class="field"><label style="flex-direction:row;align-items:center;gap:.5rem;cursor:pointer">'
        + '<input type="checkbox" id="vilocal-' + it.id + '"' + (isLocal ? ' checked' : '') + ' onchange="updateVideoCardUI(' + it.id + ')" style="width:auto;margin:0"> '
        + 'Archivo local (el vídeo está guardado en el servidor, no en internet)</label></div>';
      h += '<div id="viu-row-' + it.id + '"' + (isLocal ? ' style="display:none"' : '') + '>' + field('URL del vídeo', 'viu-' + it.id, it.url, 'https://') + '</div>';
      h += '<div id="vil-row-' + it.id + '"' + (isLocal ? '' : ' style="display:none"') + '>';
      h += '<div class="field"><label>Ruta del archivo de vídeo</label>';
      h += '<div class="row" style="gap:.4rem;align-items:center">';
      h += '<input type="text" id="vilp-' + it.id + '" value="' + escA(it.localSrc || '') + '" placeholder="../media/nombre.mp4" style="flex:1">';
      h += '<input type="file" id="vif-' + it.id + '" accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogv,.mov" style="display:none" onchange="uploadLocalVideo(' + it.id + ',this)">';
      h += '<button class="btn btn-outline btn-sm" onclick="document.getElementById(\'vif-' + it.id + '\').click();return false" style="white-space:nowrap">⬆ Subir</button>';
      h += '</div>';
      h += '<p class="help">Ruta relativa a la página HTML (ej.: <code>../media/nombre.mp4</code>).</p>';
      h += '</div>';
      h += '</div>';
      h += imgField('Miniatura', it.image, 'vii-' + it.id);
      h += '</div>';
      return h;
    }

    function addVideo() {
      readAllItems();
      S.items.push({ id: blockId++, image: '', imageAlt: '', source: 'YouTube', date: '', title: '', desc: '', url: '', localSrc: '', videoId: '', isLocal: false });
      rerenderItems();
    }

    function updateVideoCardUI(iid) {
      var cb = document.getElementById('vilocal-' + iid);
      var urlRow = document.getElementById('viu-row-' + iid);
      var localRow = document.getElementById('vil-row-' + iid);
      if (!cb || !urlRow || !localRow) return;
      urlRow.style.display = cb.checked ? 'none' : '';
      localRow.style.display = cb.checked ? '' : 'none';
    }

    function getKnownVideoSources() {
      var base = ['RTVE', 'YouTube', 'BTV'];
      S.items.forEach(function (it) {
        if (it.source && base.indexOf(it.source) === -1) base.push(it.source);
      });
      return base;
    }

    function updateVideoSource(iid) {
      var sel = document.getElementById('vis-sel-' + iid);
      var txt = document.getElementById('vis-txt-' + iid);
      if (!sel || !txt) return;
      if (sel.value === '_custom') { txt.style.display = ''; txt.focus(); }
      else txt.style.display = 'none';
    }

    async function uploadLocalVideo(iid, input) {
      if (!input.files || !input.files.length) return;
      var file = input.files[0];
      var pathEl = document.getElementById('vilp-' + iid);
      toast('Subiendo vídeo…', 'info');
      try {
        var r = await fetch('/api/upload-media?name=' + encodeURIComponent(file.name), {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        var data = await r.json();
        if (data.ok) {
          if (pathEl) pathEl.value = '../media/' + data.filename;
          toast('Vídeo subido: ' + data.filename, 'ok');
        } else {
          toast('Error al subir: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al subir vídeo', 'err');
      }
    }

    // ── MIEMBROS ─────────────────────────────────────────────────────────────────
    function renderMembersEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Miembros del grupo</h2>';
      h += '<div id="itemsContainer">';
      S.items.filter(function (it) { return !it.past; }).forEach(function (it) { h += renderMemberCard(it); });
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addMember()">+ Añadir miembro</button>';
      h += '</div>';
      h += '<div class="ed-section"><h2>Histórico de investigadores</h2>';
      h += '<div id="pastItemsContainer">';
      S.items.filter(function (it) { return it.past; }).forEach(function (it) { h += renderMemberCard(it); });
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addPastMember()">+ Añadir investigador histórico</button>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderMemberCard(it) {
      var openAttr = it._open ? ' open' : '';
      var label = esc(it.name || 'Nuevo miembro') + (it.displayRole ? ' — ' + esc(it.displayRole) : '');
      var moveLabel = it.past ? '↑ Mover a activos' : '↓ Mover a histórico';
      var h = '<details class="item-card" data-iid="' + it.id + '" draggable="true"' + openAttr + '>';
      h += '<summary style="cursor:pointer;display:flex;align-items:center;gap:.5rem;list-style:none;padding-right:2rem">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<strong id="mblabel-' + it.id + '">' + label + '</strong>';
      h += '<button class="btn btn-outline btn-sm" style="margin-left:auto;flex-shrink:0" onclick="event.preventDefault();toggleMemberSection(' + it.id + ')">' + moveLabel + '</button>';
      h += '<button class="btn-del-item" onclick="event.preventDefault();removeItem(' + it.id + ')" style="position:static">✕</button>';
      h += '</summary>';
      h += '<div style="padding-top:.75rem">';
      h += '<div class="field"><label>Nombre completo</label>'
        + '<input type="text" id="mn-' + it.id + '" value="' + escA(it.name || '') + '" oninput="updateMemberLabel(' + it.id + ')"></div>';
      h += '<div class="row">';
      h += '<div><div class="field"><label>Rol</label><select id="mr-' + it.id + '"><option' + (it.role === 'Investigador principal' ? ' selected' : '') + '>Investigador principal</option><option' + (it.role === 'Comité científico' ? ' selected' : '') + '>Comité científico</option><option' + (it.role === 'Investigador' ? ' selected' : '') + '>Investigador</option><option' + (it.role === 'Investigadora' ? ' selected' : '') + '>Investigadora</option><option' + (it.role === 'Técnico' ? ' selected' : '') + '>Técnico</option></select></div></div>';
      h += '<div><label style="display:block;font-size:.78rem;font-weight:600;color:var(--azul-oscuro)">Rol corto (tarjeta)</label>'
        + '<input type="text" id="mdr-' + it.id + '" value="' + escA(it.displayRole || '') + '" oninput="updateMemberLabel(' + it.id + ')"></div>';
      h += '</div>';
      h += richLineField('Universidad / Institución', 'mu-' + it.id, it.uni);
      h += '<div class="row">';
      h += '<div>' + field('Email', 'me-' + it.id, it.email) + '</div>';
      h += '<div>' + field('ORCID (solo el ID, p.ej. 0000-0002-1825-0097)', 'mo-' + it.id, it.orcid || '') + '</div>';
      h += '</div>';
      h += imgField('Foto', it.photo ? '../' + it.photo : '', 'mp-' + it.id);
      h += richField('Biografía', it.bio, 'mb-' + it.id);
      h += '</div>';
      h += '</details>';
      return h;
    }

    function updateMemberLabel(iid) {
      var n = document.getElementById('mn-' + iid);
      var r = document.getElementById('mdr-' + iid);
      var lbl = document.getElementById('mblabel-' + iid);
      if (!lbl) return;
      var name = n ? n.value.trim() : '';
      var role = r ? r.value.trim() : '';
      lbl.textContent = (name || 'Nuevo miembro') + (role ? ' — ' + role : '');
    }

    function addMember() {
      readAllItems();
      S.items.push({ id: blockId++, past: false, name: '', role: 'Investigador', uni: '', email: '', orcid: '', photo: '', bio: '<p>Biografía del miembro.</p>', displayName: '', displayRole: 'Investigador', displayUni: '' });
      rerenderItems();
    }

    function addPastMember() {
      readAllItems();
      S.items.push({ id: blockId++, past: true, name: '', role: 'Investigador', uni: '', email: '', orcid: '', photo: '', bio: '<p>Biografía del miembro.</p>', displayName: '', displayRole: 'Investigador', displayUni: '' });
      rerenderItems();
    }

    function toggleMemberSection(iid) {
      readAllItems();
      var it = S.items.find(function (m) { return m.id === iid; });
      if (!it) return;
      it.past = !it.past;
      rerenderItems();
    }

    // ── PROYECTOS ────────────────────────────────────────────────────────────────
    function renderProjectsEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Proyectos de investigación</h2>';
      h += '<div id="itemsContainer">';
      S.items.forEach(function (it) { h += it._group ? renderProjectEraHeader(it) : renderProjectCard(it); });
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.5rem" onclick="addProject()">+ Añadir proyecto</button>';
      h += ' <button class="btn btn-sm" style="margin-top:.5rem" onclick="addProjectEra()">+ Añadir década</button>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderProjectEraHeader(it) {
      var h = '<div class="item-card" data-iid="' + it.id + '" draggable="true" style="border-left:3px solid var(--dorado);background:rgba(200,164,90,.08)">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<button class="btn-del-item" onclick="removeProjectEra(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong style="color:var(--azul)">— Década / Era —</strong></div>';
      h += field('Etiqueta (ej.: Década de 2020)', 'pera-label-' + it.id, it.eraLabel, 'Ej.: Década de 2020');
      h += field('ID HTML (ej.: era-2020)', 'pera-id-' + it.id, it.eraId, 'Ej.: era-2020');
      h += '</div>';
      return h;
    }

    function removeProjectEra(iid) {
      if (!confirm('¿Eliminar esta década/era?')) return;
      readAllItems();
      S.items = S.items.filter(function (it) { return it.id !== iid; });
      rerenderItems();
    }

    function addProjectEra() {
      readAllItems();
      S.items.unshift({ id: blockId++, _group: true, eraLabel: '', eraId: '' });
      rerenderItems();
    }

    function renderProjectCard(it) {
      var h = '<div class="item-card" data-iid="' + it.id + '" draggable="true">';
      h += '<span class="drag-handle" title="Arrastrar para reordenar">⠿</span>';
      h += '<button class="btn-del-item" onclick="removeItem(' + it.id + ')">✕</button>';
      h += '<div class="item-card-header"><strong>' + esc((it.title || 'Nuevo proyecto').replace(/<[^>]+>/g, '')) + '</strong></div>';
      h += '<div class="row">';
      h += '<div>' + field('Años', 'py-' + it.id, it.year, '2021-2024') + '</div>';
      h += '<div><div class="field"><label>Estado</label><select id="ps-' + it.id + '"><option value="1"' + (it.isCurrent ? ' selected' : '') + '>Vigente</option><option value="0"' + (!it.isCurrent ? ' selected' : '') + '>Completado</option></select></div></div>';
      h += '</div>';
      h += richLineField('Título del proyecto', 'pt-' + it.id, it.title);
      h += '<div class="field"><label>Investigador/a principal</label><div class="row" style="gap:.4rem">'
        + '<select id="pilab-' + it.id + '" style="width:7rem;flex:none"><option value="IP"' + ((!it.ipLabel || it.ipLabel === 'IP') ? ' selected' : '') + '>IP</option><option value="IPs"' + (it.ipLabel === 'IPs' ? ' selected' : '') + '>IPs</option><option value="IP RED"' + (it.ipLabel === 'IP RED' ? ' selected' : '') + '>IP RED</option></select>'
        + '<input type="text" id="pi-' + it.id + '" value="' + escA(it.ipValue || '') + '"></div></div>';
      h += field('Referencia', 'pr-' + it.id, it.metas['Ref.'] || it.metas['Ref.:'] || '');
      h += field('Financiación', 'pf-' + it.id, it.metas['Financiación'] || it.metas['Financiación:'] || '');
      h += field('Presupuesto', 'pb-' + it.id, it.metas['Presupuesto'] || it.metas['Presupuesto:'] || '');
      h += richField('Descripción (opcional)', it.desc || '', 'pd-' + it.id);
      h += '</div>';
      return h;
    }

    function addProject() {
      readAllItems();
      S.items.push({ id: blockId++, year: '', title: '', desc: '', isCurrent: true, ipLabel: 'IP', ipValue: '', metas: {} });
      rerenderItems();
    }

    // ── ITEM MANAGEMENT (generic) ────────────────────────────────────────────────
    function removeItem(iid) {
      var item = S.items.find(function (it) { return it.id === iid; });
      if (item && item._group) return;
      if (!confirm('¿Eliminar este elemento?')) return;
      readAllItems();
      S.items = S.items.filter(function (it) { return it.id !== iid; });
      rerenderItems();
    }

    function rerenderItems() {
      if (S.pageType === 'members') {
        var c = document.getElementById('itemsContainer');
        var p = document.getElementById('pastItemsContainer');
        if (c) { var h = ''; S.items.filter(function (it) { return !it.past; }).forEach(function (it) { h += renderMemberCard(it); }); c.innerHTML = h; }
        if (p) { var h = ''; S.items.filter(function (it) { return it.past; }).forEach(function (it) { h += renderMemberCard(it); }); p.innerHTML = h; }
        initRichEditors();
        initMembersDrag();
        return;
      }
      var c = document.getElementById('itemsContainer');
      if (!c) return;
      var h = '';
      S.items.forEach(function (it) {
        if (S.pageType === 'theses') h += renderThesisCard(it);
        else if (S.pageType === 'congresses') h += renderCongressCard(it);
        else if (S.pageType === 'seminars') h += renderSeminarCard(it);
        else if (S.pageType === 'multimedia') h += renderVideoCard(it);
        else if (S.pageType === 'projects') h += it._group ? renderProjectEraHeader(it) : renderProjectCard(it);
      });
      c.innerHTML = h;
      initRichEditors();
      if (S.pageType === 'theses' || S.pageType === 'congresses' || S.pageType === 'seminars' || S.pageType === 'projects') initThesisDrag();
    }

    // ── DRAG GENÉRICO ────────────────────────────────────────────────────────────
    // cardSelector: selector CSS de las tarjetas arrastrables
    // onDrop(srcCard, tgtCard): callback cuando se completa el drop
    var _uniDragSrc = null;

    function initDraggable(containerIds, cardSelector, onDrop) {
      if (!Array.isArray(containerIds)) containerIds = [containerIds];
      containerIds.forEach(function (cid) {
        var c = typeof cid === 'string' ? document.getElementById(cid) : cid;
        if (!c) return;
        c.querySelectorAll(cardSelector).forEach(function (card) {
          if (card._dragBound) return;
          card._dragBound = true;
          card.addEventListener('mousedown', function (e) {
            var cur = e.target;
            var fromHandle = false;
            while (cur && cur !== card) {
              if (cur.classList && (cur.classList.contains('drag-handle') || cur.classList.contains('sb-drag-handle') || cur.classList.contains('block-handle'))) { fromHandle = true; break; }
              cur = cur.parentElement;
            }
            card.draggable = fromHandle;
          });
          card.addEventListener('dragstart', function (e) {
            // No iniciar drag desde contenteditable (por si acaso)
            var t = e.target;
            while (t && t !== card) {
              if (t.contentEditable === 'true') { e.preventDefault(); return; }
              t = t.parentElement;
            }
            _uniDragSrc = card;
            e.dataTransfer.effectAllowed = 'move';
            card.classList.add('dragging');
          });
          card.addEventListener('dragover', function (e) {
            if (!_uniDragSrc || _uniDragSrc === card) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drag-over');
          });
          card.addEventListener('dragleave', function () {
            card.classList.remove('drag-over');
          });
          card.addEventListener('drop', function (e) {
            e.preventDefault();
            card.classList.remove('drag-over');
            if (!_uniDragSrc || _uniDragSrc === card) return;
            onDrop(_uniDragSrc, card);
            _uniDragSrc = null;
          });
          card.addEventListener('dragend', function () {
            card.classList.remove('drag-over', 'dragging');
            _uniDragSrc = null;
          });
        });
      });
    }

    function initMembersDrag() {
      ['itemsContainer', 'pastItemsContainer'].forEach(function (cid) {
        initDraggable(cid, '.item-card[draggable]', function (srcCard, tgtCard) {
          var srcId = parseInt(srcCard.getAttribute('data-iid'));
          var tgtId = parseInt(tgtCard.getAttribute('data-iid'));
          readAllItems();
          var srcIdx = S.items.findIndex(function (it) { return it.id === srcId; });
          var tgtIdx = S.items.findIndex(function (it) { return it.id === tgtId; });
          if (srcIdx < 0 || tgtIdx < 0) return;
          var removed = S.items.splice(srcIdx, 1)[0];
          S.items.splice(tgtIdx, 0, removed);
          rerenderItems();
        });
      });
    }

    var _dragSrcId = null; // mantenido por compatibilidad con menuDrag
    function initThesisDrag() {
      initDraggable('itemsContainer', '.item-card[draggable]', function (srcCard, tgtCard) {
        var srcId = parseInt(srcCard.getAttribute('data-iid'));
        var tgtId = parseInt(tgtCard.getAttribute('data-iid'));
        readAllItems();
        var srcIdx = S.items.findIndex(function (it) { return it.id === srcId; });
        var tgtIdx = S.items.findIndex(function (it) { return it.id === tgtId; });
        if (srcIdx < 0 || tgtIdx < 0) return;
        var removed = S.items.splice(srcIdx, 1)[0];
        S.items.splice(tgtIdx, 0, removed);
        rerenderItems();
      });
    }

    function initBlocksDrag() {
      initDraggable('blocksContainer', '.block-card[draggable]', function (srcCard, tgtCard) {
        readAllBlocks();
        var srcId = parseInt(srcCard.getAttribute('data-bid'));
        var tgtId = parseInt(tgtCard.getAttribute('data-bid'));
        var srcIdx = S.blocks.findIndex(function (b) { return b.id === srcId; });
        var tgtIdx = S.blocks.findIndex(function (b) { return b.id === tgtId; });
        if (srcIdx < 0 || tgtIdx < 0) return;
        var removed = S.blocks.splice(srcIdx, 1)[0];
        S.blocks.splice(tgtIdx, 0, removed);
        rerenderBlocks();
      });
    }

    // ── PARTES DE COMEDIAS ───────────────────────────────────────────────────────
    function renderPartesEditor() {
      var h = '<div class="ed-section"><h2>Texto introductorio</h2>';
      h += richField('Introducción', S.introHtml, 'intro');
      h += '</div>';
      h += '<div class="ed-section"><h2>Partes de comedias</h2>';
      h += '<p class="help" style="margin-bottom:.5rem">Cada Parte contiene uno o varios tomos, y cada tomo contiene sus obras.</p>';
      h += '<div id="partesContainer">';
      h += renderAllPartes();
      h += '</div>';
      h += '<button class="btn btn-blue btn-sm" style="margin-top:.75rem" onclick="addParte()">+ Añadir Parte</button>';
      h += '</div>';
      h += renderHtmlBlocksSection();
      return h;
    }

    function renderAllPartes() {
      var h = '';
      (S.partesData || []).forEach(function (p, idx) { h += renderParteCard(p, idx); });
      return h;
    }

    function renderParteCard(p, idx) {
      var openAttr = p._open ? ' open' : '';
      var label = 'Parte ' + (p.roman || String(p.num || idx + 1)) + (p.year ? ' (' + p.year + ')' : '') + (p.coord ? ' — ' + p.coord : '');
      var h = '<details class="item-card" data-parte-det="' + idx + '" style="margin-bottom:.5rem"' + openAttr + '>';
      h += '<summary style="cursor:pointer;display:flex;align-items:center;gap:.5rem;list-style:none;padding-right:2rem">'
        + '<strong>' + esc(label) + '</strong>'
        + '<button class="btn-del-item" onclick="event.preventDefault();removeParte(' + idx + ')" style="position:static;margin-left:auto">✕</button>'
        + '</summary>';
      h += '<div style="padding-top:.75rem">';
      h += '<div class="row">';
      h += '<div>' + field('Número', 'pnum-' + idx, String(p.num || idx + 1)) + '</div>';
      h += '<div>' + field('Romano', 'proman-' + idx, p.roman || '') + '</div>';
      h += '<div>' + field('Año', 'pyear-' + idx, String(p.year || '')) + '</div>';
      h += '</div>';
      h += field('Coordinador/es (vacío si no hay)', 'pcoord-' + idx, p.coord || '', 'Ej.: Luigi Giuliani y Ramón Valdés');
      h += field('Editorial', 'pedit-' + idx, p.editorial || '');
      h += field('Ciudad', 'pcity-' + idx, p.city || '');
      h += imgField('Portada', p.image || '', 'pimg-' + idx);
      h += '<div style="margin-top:.75rem;border-top:1px solid var(--border);padding-top:.5rem">';
      h += '<strong style="font-size:.85rem">Tomos / Volúmenes</strong>';
      h += '<div id="pvols-' + idx + '">';
      (p.volumes || []).forEach(function (v, vi) { h += renderVolCard(idx, vi, v); });
      h += '</div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.4rem" onclick="addVol(' + idx + ')">+ Añadir tomo</button>';
      h += '</div>';
      h += '</div>';
      h += '</details>';
      return h;
    }

    function renderVolCard(idx, vi, v) {
      var h = '<div class="item-card" data-vol-idx="' + vi + '" style="margin:.5rem 0;padding:.6rem .8rem;border-left:3px solid var(--dorado)">';
      h += '<button class="btn-del-item" onclick="removeVol(' + idx + ',' + vi + ')">✕</button>';
      h += '<div class="item-card-header"><strong style="font-size:.85rem">' + esc(v.label || 'Tomo ' + (vi + 1)) + '</strong></div>';
      h += '<div class="row">';
      h += '<div>' + field('Etiqueta (ej.: Tomo I)', 'pvlabel-' + idx + '-' + vi, v.label || '') + '</div>';
      h += '<div>' + field('ISBN', 'pvisbn-' + idx + '-' + vi, v.isbn || '') + '</div>';
      h += '</div>';
      h += '<div style="margin-top:.4rem"><strong style="font-size:.78rem;color:#888">Obras</strong>';
      h += '<div id="pplays-' + idx + '-' + vi + '">';
      (v.plays || []).forEach(function (play, pi) { h += renderPlayRow(idx, vi, pi, play); });
      h += '</div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.3rem;font-size:.75rem" onclick="addPlay(' + idx + ',' + vi + ')">+ Añadir obra</button>';
      h += '</div>';
      h += '</div>';
      return h;
    }

    function renderPlayRow(idx, vi, pi, play) {
      var h = '<div class="item-card" data-play-idx="' + pi + '" style="margin:.3rem 0;padding:.4rem .6rem;border:1px solid var(--border)">';
      h += '<button class="btn-del-item" onclick="removePlay(' + idx + ',' + vi + ',' + pi + ')" style="top:.3rem;right:.3rem">✕</button>';
      h += '<div class="row">';
      h += '<div style="flex:2">' + richLineField('Título', 'pptitle-' + idx + '-' + vi + '-' + pi, play.title || '') + '</div>';
      h += '<div style="flex:1">' + field('Páginas', 'pppages-' + idx + '-' + vi + '-' + pi, play.pages || '') + '</div>';
      h += '</div>';
      h += field('Editores', 'ppeditors-' + idx + '-' + vi + '-' + pi, play.editors || '', 'Ej.: ed. Luigi Giuliani');
      h += '<div class="field"><label><input type="checkbox" id="pphistory-' + idx + '-' + vi + '-' + pi + '"' + (play.history ? ' checked' : '') + ' style="margin-right:.3rem"> Historia editorial (no es una obra de teatro)</label></div>';
      h += '</div>';
      return h;
    }

    function addParte() {
      readPartesFormValues();
      var num = (S.partesData || []).length + 1;
      if (!S.partesData) S.partesData = [];
      S.partesData.push({ num: num, roman: '', year: '', coord: null, editorial: '', city: '', image: '', volumes: [], _open: true });
      rerenderPartes();
    }

    function removeParte(idx) {
      if (!confirm('¿Eliminar la Parte ' + (idx + 1) + '?')) return;
      readPartesFormValues();
      S.partesData.splice(idx, 1);
      rerenderPartes();
    }

    function addVol(idx) {
      readPartesFormValues();
      if (!S.partesData || !S.partesData[idx]) return;
      if (!S.partesData[idx].volumes) S.partesData[idx].volumes = [];
      var vi = S.partesData[idx].volumes.length + 1;
      S.partesData[idx].volumes.push({ label: 'Tomo ' + toRoman(vi), isbn: '', plays: [] });
      rerenderPartes();
    }

    function removeVol(idx, vi) {
      if (!confirm('¿Eliminar este tomo?')) return;
      readPartesFormValues();
      if (!S.partesData || !S.partesData[idx]) return;
      S.partesData[idx].volumes.splice(vi, 1);
      rerenderPartes();
    }

    function addPlay(idx, vi) {
      readPartesFormValues();
      if (!S.partesData || !S.partesData[idx] || !S.partesData[idx].volumes[vi]) return;
      S.partesData[idx].volumes[vi].plays.push({ title: '', editors: '', pages: '' });
      rerenderPartes();
    }

    function removePlay(idx, vi, pi) {
      readPartesFormValues();
      if (!S.partesData || !S.partesData[idx] || !S.partesData[idx].volumes[vi]) return;
      S.partesData[idx].volumes[vi].plays.splice(pi, 1);
      rerenderPartes();
    }

    function toRoman(n) {
      var v = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
      var r = ''; v.forEach(function (p) { while (n >= p[1]) { r += p[0]; n -= p[1]; } }); return r;
    }

    function rerenderPartes() {
      var c = document.getElementById('partesContainer');
      if (c) c.innerHTML = renderAllPartes();
    }

    function readPartesFormValues() {
      if (S.pageType !== 'partes' || !S.partesData) return;
      S.partesData.forEach(function (p, idx) {
        var el;
        var det = document.querySelector('[data-parte-det="' + idx + '"]');
        if (det) p._open = det.open;
        el = document.getElementById('pnum-' + idx); if (el) p.num = parseInt(el.value) || idx + 1;
        el = document.getElementById('proman-' + idx); if (el) p.roman = el.value;
        el = document.getElementById('pyear-' + idx); if (el) p.year = parseInt(el.value) || el.value || '';
        el = document.getElementById('pcoord-' + idx); if (el) p.coord = el.value.trim() || null;
        el = document.getElementById('pedit-' + idx); if (el) p.editorial = el.value;
        el = document.getElementById('pcity-' + idx); if (el) p.city = el.value;
        el = document.getElementById('pimg-' + idx); if (el) p.image = el.value;
        (p.volumes || []).forEach(function (v, vi) {
          el = document.getElementById('pvlabel-' + idx + '-' + vi); if (el) v.label = el.value;
          el = document.getElementById('pvisbn-' + idx + '-' + vi); if (el) v.isbn = el.value;
          (v.plays || []).forEach(function (play, pi) {
            play.title = gR('pptitle-' + idx + '-' + vi + '-' + pi);
            el = document.getElementById('ppeditors-' + idx + '-' + vi + '-' + pi); if (el) play.editors = el.value;
            el = document.getElementById('pppages-' + idx + '-' + vi + '-' + pi); if (el) play.pages = el.value;
            var hEl = document.getElementById('pphistory-' + idx + '-' + vi + '-' + pi);
            if (hEl && hEl.checked) { play.history = true; } else { delete play.history; }
          });
        });
      });
    }

    function genPartes() {
      var h = '\n';
      h += '    <p class="intro-text">\n      ' + S.introHtml + '\n    </p>\n';
      if (S.partesSearchHtml) h += '\n    <!-- SEARCH -->\n    ' + S.partesSearchHtml + '\n';
      h += '\n    <!-- GRID (JS-generated) -->\n    <div class="partes-grid" id="partesGrid"></div>\n';
      if (S.partesNoResultsHtml) h += '    ' + S.partesNoResultsHtml + '\n';
      return h;
    }

    function updatePartesScript() {
      if (!S.partesData) return;
      var clean = S.partesData.map(function (p) { var c = Object.assign({}, p); delete c._open; return c; });
      var partesJson = JSON.stringify(clean, null, 2);
      // Find and replace the full PARTES array using bracket counting
      var startTag = S.footerPart.indexOf('const PARTES =');
      if (startTag === -1) startTag = S.footerPart.search(/const\s+PARTES\s*=/);
      if (startTag === -1) return;
      var arrStart = S.footerPart.indexOf('[', startTag);
      if (arrStart === -1) return;
      var depth = 0, i = arrStart, arrEnd = -1;
      while (i < S.footerPart.length) {
        var ch = S.footerPart[i];
        if (ch === '[') depth++;
        else if (ch === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
        i++;
      }
      if (arrEnd === -1) return;
      // Include the trailing semicolon if present
      var after = arrEnd + 1;
      while (after < S.footerPart.length && S.footerPart[after] === ' ') after++;
      var hasSemi = S.footerPart[after] === ';';
      S.footerPart = S.footerPart.slice(0, arrStart) + partesJson + (hasSemi ? ';' : '') + S.footerPart.slice(hasSemi ? after + 1 : after);
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // LIBRO BLOCK (bloque genérico disponible en cualquier página)
    // ══════════════════════════════════════════════════════════════════════════════

    // Render the libro fields inside a block-card (called from renderBlockCard)
    function renderLibroBlockFields(b) {
      var isMod = (!b.displayMode || b.displayMode === 'modal');
      var h = '';
      h += '<div class="field"><label>Modo de visualización</label>';
      h += '<div style="display:flex;gap:1.5rem;margin-top:.2rem">';
      h += '<label style="font-weight:400;cursor:pointer"><input type="radio" name="lbmode-' + b.id + '" value="modal"' + (isMod ? ' checked' : '') + ' onchange="updLibroMode(' + b.id + ',this.value)"> Modal emergente (portada clicable abre ventana)</label>';
      h += '<label style="font-weight:400;cursor:pointer"><input type="radio" name="lbmode-' + b.id + '" value="dropdown"' + (!isMod ? ' checked' : '') + ' onchange="updLibroMode(' + b.id + ',this.value)"> Desplegable (se abre debajo de la portada)</label>';
      h += '</div></div>';
      h += richLineField('Título *', 'lbtitle-' + b.id, b.title || '');
      h += '<div class="row">';
      h += '<div>' + field('Autor/es', 'lbauthor-' + b.id, b.author || '') + '</div>';
      h += '<div>' + field('Editor/es', 'lbeditor-' + b.id, b.editor || '') + '</div>';
      h += '</div>';
      h += field('Año', 'lbyear-' + b.id, String(b.year || ''));
      h += '<div class="row">';
      h += '<div>' + field('Editorial', 'lbedit-' + b.id, b.editorial || '') + '</div>';
      h += '<div>' + field('Ciudad', 'lbcity-' + b.id, b.city || '') + '</div>';
      h += '</div>';
      h += '<div class="row">';
      h += '<div>' + field('Colección', 'lbcollection-' + b.id, b.collection || '') + '</div>';
      h += '<div>' + field('ISBN', 'lbisbn-' + b.id, b.isbn || '') + '</div>';
      h += '</div>';
      h += field('Más información', 'lbbuy-' + b.id, b.buyUrl || '', 'https://…');
      h += imgField('Portada', b.image || '', 'lbimg-' + b.id);
      h += '<div style="margin-top:.75rem;border-top:1px solid var(--borde);padding-top:.5rem">';
      h += '<strong style="font-size:.85rem">Campos personalizados</strong>';
      h += '<div id="lbextra-' + b.id + '">';
      (b.extraFields || []).forEach(function (ef, ei) {
        h += '<div class="item-card" data-ef-idx="' + ei + '" style="margin:.4rem 0;padding:.4rem .6rem">';
        h += '<button class="btn-del-item" onclick="delLibroExtra(' + b.id + ',' + ei + ')" style="top:.3rem;right:.3rem">✕</button>';
        h += '<div class="row">';
        h += '<div>' + field('Etiqueta', 'lbef-label-' + b.id + '-' + ei, ef.label || '', 'p. ej.: Páginas') + '</div>';
        h += '<div>' + field('Valor', 'lbef-value-' + b.id + '-' + ei, ef.value || '', 'p. ej.: 320') + '</div>';
        h += '</div></div>';
      });
      h += '</div>';
      h += '<button class="btn btn-outline btn-sm" style="margin-top:.4rem" onclick="addLibroExtra(' + b.id + ')">+ Añadir campo</button>';
      h += '</div>';
      return h;
    }

    function updLibroMode(bid, val) {
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) b.displayMode = val;
    }

    function addLibroExtra(bid) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b) { if (!b.extraFields) b.extraFields = []; b.extraFields.push({ label: '', value: '' }); }
      rerenderBlocks();
    }

    function delLibroExtra(bid, ei) {
      readAllBlocks();
      var b = S.blocks.find(function (b) { return b.id === bid; });
      if (b && b.extraFields) { b.extraFields.splice(ei, 1); }
      rerenderBlocks();
    }

    // ── END LIBRO BLOCK ──────────────────────────────────────────────────────────

    function readAllItems() {
      S.items.forEach(function (it) {
        if (it._group) {
          if (S.pageType === 'congresses' || S.pageType === 'seminars') {
            it.title = gR('grpt-' + it.id);
            it.count = gR('grpc-' + it.id);
          }
          if (S.pageType === 'projects') {
            var el = document.getElementById('pera-label-' + it.id); if (el) it.eraLabel = el.value;
            var ei = document.getElementById('pera-id-' + it.id); if (ei) it.eraId = ei.value;
          }
          return;
        }
        var type = S.pageType;
        if (type === 'theses') {
          var y = document.getElementById('thy-' + it.id); if (y) it.year = y.value;
          it.title = gR('tht-' + it.id);
          var m = document.querySelector('[data-rich-id="thm-' + it.id + '"]'); if (m) it.meta = m.innerHTML;
          var l = document.getElementById('thl-' + it.id); if (l) it.link = l.value;
          var p = document.getElementById('thp-' + it.id); if (p) it.pending = p.value === 'pending';
        }
        if (type === 'congresses') {
          var det = document.querySelector('details.item-card[data-iid="' + it.id + '"]'); if (det) it._open = det.open;
          var y = document.getElementById('cgy-' + it.id); if (y) it.year = y.value;
          it.edition = gR('cge-' + it.id);
          it.name = gR('cgn-' + it.id);
          var d = document.getElementById('cgd-' + it.id); if (d) it.dates = d.value;
          var l = document.getElementById('cgl-' + it.id); if (l) it.location = l.value;
          var i = document.getElementById('cgi-' + it.id); if (i) it.image = i.value;
          var a = document.getElementById('cga-' + it.id); if (a) it.imageAlt = a.value;
          var oid = document.getElementById('cgoid-' + it.id); if (oid) it.modalId = oid.value.trim();
          if (!it.modalId) it.modalId = 'cg' + it.id; // auto-generate stable ID
          it.modalTitle = gR('cgmt-' + it.id);
          var md = document.getElementById('cgmd-' + it.id); if (md) it.modalDescription = md.value;
          var mlc = document.getElementById('cgml-' + it.id);
          if (mlc) {
            it.modalLinks = [];
            mlc.querySelectorAll('.link-row').forEach(function (row) {
              var ins = row.querySelectorAll('input[type="text"]');
              if (ins.length >= 2) it.modalLinks.push({ label: ins[0].value, url: ins[1].value });
            });
          }
          // Sync onclick with modalId
          if (it.modalId) it.onclick = 'openModal(\'' + it.modalId + '\')';
        }
        if (type === 'seminars') {
          var det = document.querySelector('details.item-card[data-iid="' + it.id + '"]'); if (det) it._open = det.open;
          var y = document.getElementById('smy-' + it.id); if (y) it.year = y.value;
          var n = document.getElementById('smn-' + it.id); if (n) it.name = n.value;
          it.theme = gR('smt-' + it.id);
          var d = document.getElementById('smd-' + it.id); if (d) it.dates = d.value;
          var p = document.getElementById('smp-' + it.id); if (p) it.pdfUrl = p.value;
          var post = document.getElementById('smpost-' + it.id); if (post) it.posterUrl = post.value;
          var fc = document.getElementById('smf-' + it.id);
          if (fc) {
            it.fields = [];
            fc.querySelectorAll('.link-row').forEach(function (row) {
              var inputs = row.querySelectorAll('input');
              if (inputs.length >= 2) it.fields.push({ label: inputs[0].value, value: inputs[1].value });
            });
          }
        }
        if (type === 'multimedia') {
          var d = document.getElementById('vid-' + it.id); if (d) it.date = d.value;
          var vssel = document.getElementById('vis-sel-' + it.id), vstxt = document.getElementById('vis-txt-' + it.id);
          if (vssel) it.source = (vssel.value === '_custom' ? (vstxt ? vstxt.value.trim() : '') : vssel.value);
          it.title = gR('vit-' + it.id);
          it.desc = gR('vin-' + it.id);
          var lc = document.getElementById('vilocal-' + it.id); it.isLocal = lc ? lc.checked : false;
          if (it.isLocal) {
            var lp = document.getElementById('vilp-' + it.id); if (lp) it.localSrc = lp.value;
            it.url = '';
          } else {
            var u = document.getElementById('viu-' + it.id); if (u) it.url = u.value;
            it.localSrc = '';
          }
          var i = document.getElementById('vii-' + it.id); if (i) it.image = i.value;
        }
        if (type === 'members') {
          var det = document.querySelector('details.item-card[data-iid="' + it.id + '"]'); if (det) it._open = det.open;
          var n = document.getElementById('mn-' + it.id); if (n) it.name = n.value;
          var r = document.getElementById('mr-' + it.id); if (r) it.role = r.value;
          var dr = document.getElementById('mdr-' + it.id); if (dr) it.displayRole = dr.value;
          it.uni = gR('mu-' + it.id);
          var e = document.getElementById('me-' + it.id); if (e) it.email = e.value;
          var o = document.getElementById('mo-' + it.id); if (o) it.orcid = o.value;
          var p = document.getElementById('mp-' + it.id); if (p) it.photo = p.value.replace(/^\.\.\//, '');
          var b = document.querySelector('[data-rich-id="mb-' + it.id + '"]'); if (b) it.bio = b.innerHTML;
        }
        if (type === 'projects') {
          var y = document.getElementById('py-' + it.id); if (y) it.year = y.value;
          var s = document.getElementById('ps-' + it.id); if (s) it.isCurrent = s.value === '1';
          it.title = gR('pt-' + it.id);
          var pilab = document.getElementById('pilab-' + it.id); if (pilab) it.ipLabel = pilab.value || 'IP';
          var pi = document.getElementById('pi-' + it.id); if (pi) it.ipValue = pi.value;
          var r = document.getElementById('pr-' + it.id); if (r) it.metas['Ref.'] = r.value;
          var f = document.getElementById('pf-' + it.id); if (f) it.metas['Financiación'] = f.value;
          var b = document.getElementById('pb-' + it.id); if (b) it.metas['Presupuesto'] = b.value;
          var d = document.querySelector('[data-rich-id="pd-' + it.id + '"]'); if (d) it.desc = d.innerHTML;
        }
      });
      // Read intro
      var intro = document.querySelector('[data-rich-id="intro"]');
      if (intro) S.introHtml = intro.innerHTML;
      // Read partes data
      if (S.pageType === 'partes') readPartesFormValues();
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // HTML GENERATION
    // ══════════════════════════════════════════════════════════════════════════════
    function generateHtml() {
      readFormValues();

      var content = '\n';

      // If a sidebar was added to a page that only had page-wrap, switch to article-wrap
      if (S.hasSidebar && S.wrapperOpen && S.wrapperOpen.includes('page-wrap') && !S.wrapperOpen.includes('article-wrap')) {
        S.wrapperOpen = S.wrapperOpen.replace('page-wrap', 'article-wrap');
      }

      // Hero
      content += genHero();

      // Wrapper open
      if (S.wrapperOpen) content += '\n  ' + S.wrapperOpen + '\n';

      // Main open
      if (S.mainTag) content += '\n    <' + S.mainTag + S.mainAttrs + '>\n';

      // Specialized content
      if (S.pageType === 'theses') content += genTheses();
      else if (S.pageType === 'congresses') { content += genCongresses(); rebuildCongressesModalScript(); }
      else if (S.pageType === 'seminars') content += genSeminars();
      else if (S.pageType === 'multimedia') content += genMultimedia();
      else if (S.pageType === 'members') content += genMembers();
      else if (S.pageType === 'projects') content += genProjects();
      else if (S.pageType === 'partes') content += genPartes();
      else content += genBlocks();

      // Shared HTML blocks (specialized page types)
      if (S.htmlBlocks && S.htmlBlocks.length) {
        var _validHb = S.htmlBlocks.filter(function (b) { return b && b.trim(); });
        if (_validHb.length) {
          content += '\n      \x3C!--html-blocks:' + JSON.stringify(_validHb) + '--\x3E\n';
          _validHb.forEach(function (b) { content += '      ' + b.trim() + '\n'; });
        }
      }

      // Main close
      if (S.mainTag) content += '\n    </' + S.mainTag + '>\n';

      // Sidebar
      if (S.hasSidebar && S.sidebarCards.length > 0) {
        content += genSidebar();
      }

      // Wrapper close
      if (S.wrapperClose) content += '\n  ' + S.wrapperClose + '\n';

      // Content after main container (modal overlays, etc.) — preserved verbatim
      if (S.afterGridHtml) content += '\n' + S.afterGridHtml + '\n';

      content += '\n';

      // Update title in header
      var header = S.headerPart.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + S.pageTitle + '</title>');
      // Update PARTES script in footer for partes page type
      if (S.pageType === 'partes') updatePartesScript();
      var footer = S.footerPart;
      if (_pendingLocalVideos) footer = updateFooterVideosScript(footer, _pendingLocalVideos);

      // Ensure lightbox is present if the page has figures or image grids
      if (/article-figure-img-wrap|event-box-img-wrap/.test(content) && !/id="lightbox"/.test(footer) && !/id="lightbox"/.test(content)) {
        var lbHtml = '\n  <!-- LIGHTBOX -->\n  <div class="lightbox" id="lightbox" onclick="closeLightbox()">\n    <button class="lightbox-close" onclick="closeLightbox()" aria-label="Cerrar">✕</button>\n    <img id="lightbox-img" src="" alt="" />\n  </div>\n  <script>function openLightbox(src){document.getElementById(\'lightbox-img\').src=src;document.getElementById(\'lightbox\').classList.add(\'open\');document.body.style.overflow=\'hidden\';}function closeLightbox(){document.getElementById(\'lightbox\').classList.remove(\'open\');document.body.style.overflow=\'\';}document.addEventListener(\'keydown\',function(e){if(e.key===\'Escape\')closeLightbox();});document.addEventListener(\'click\',function(e){var w=e.target.closest(\'.article-figure-img-wrap,.event-box-img-wrap\');if(!w)return;var img=w.querySelector(\'img\');if(img)openLightbox(img.src);});<\/script>\n';
        // Insert just after </footer> or before </body>
        if (/<\/footer>/i.test(footer)) {
          footer = footer.replace(/<\/footer>/i, '</footer>' + lbHtml);
        } else {
          footer = lbHtml + footer;
        }
      } else if (/id="lightbox"/.test(footer) && !/e\.target\.closest\('\.article-figure-img-wrap/.test(footer)) {
        // Lightbox exists but missing the delegated click listener — add it
        footer = footer.replace(
          /(document\.addEventListener\('keydown',\s*function\(e\)\s*\{\s*if\s*\(e\.key\s*===\s*'Escape'\)\s*closeLightbox\(\);\s*\}\);)/,
          "$1document.addEventListener('click',function(e){var w=e.target.closest('.article-figure-img-wrap,.event-box-img-wrap');if(!w)return;var img=w.querySelector('img');if(img)openLightbox(img.src);});"
        );
      }

      return header + content + footer;
    }

    function readFormValues() {
      var t = document.getElementById('edTitle'); if (t) S.pageTitle = t.value;
      if (S.heroData) {
        var hEl = document.querySelector('[data-rich-id="edHeroTitle"]'); if (hEl) S.heroData.title = hEl.innerHTML; else { var h2 = document.getElementById('edHeroTitle'); if (h2) S.heroData.title = h2.value; }
        var b = document.getElementById('edBreadcrumb'); if (b) S.heroData.breadcrumbLast = b.value;
        var c = document.getElementById('edHeroCat'); if (c) S.heroData.catBadge = c.value;
        var d = document.getElementById('edHeroDate'); if (d) S.heroData.date = d.value;
        var sEl = document.querySelector('[data-rich-id="edHeroSub"]'); if (sEl) S.heroData.subtitle = sEl.innerHTML; else { var s2 = document.getElementById('edHeroSub'); if (s2) S.heroData.subtitle = s2.value; }
        var bgI = document.getElementById('edHeroBg'); if (bgI) S.heroData.bgImage = bgI.value.trim();
      }
      readSidebarCards();
      if (S.pageType === 'news') {
        if (!S.newsEntry) S.newsEntry = {};
        var ne = document.getElementById('edNewsExcerpt'); if (ne) S.newsEntry.excerpt = ne.value;
        var ni = document.getElementById('edNewsImg'); if (ni) S.newsEntry.img = ni.value;
      }
      readAllBlocks();
      readAllItems();
      readHtmlBlocks();
    }

    function genHero() {
      if (!S.heroData || !S.heroOriginalHtml) return '';
      var doc = new DOMParser().parseFromString('<div>' + S.heroOriginalHtml + '</div>', 'text/html');
      var hero = doc.querySelector('.page-hero, .article-hero, .idx-hero');
      if (!hero) return '\n  ' + S.heroOriginalHtml + '\n';
      var h1 = hero.querySelector('h1'); if (h1) h1.innerHTML = S.heroData.title;
      var bc = hero.querySelector('.breadcrumb, .article-breadcrumb, .page-hero-breadcrumb');
      if (bc && S.heroData.breadcrumbLast) {
        var nodes = bc.childNodes;
        for (var i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) { nodes[i].textContent = '\n        ' + S.heroData.breadcrumbLast + '\n      '; break; }
        }
      }
      if (S.heroData.type === 'article') {
        var cb = hero.querySelector('.article-cat-badge'); if (cb) cb.textContent = S.heroData.catBadge;
        var ds = hero.querySelector('.article-date'); if (ds) ds.textContent = S.heroData.date;
      }
      if (S.heroData.type === 'index') {
        var sub = hero.querySelector('.idx-hero-sub'); if (sub) sub.innerHTML = S.heroData.subtitle;
      }
      if (S.heroData.bgImage) {
        var bgDiv = hero.querySelector('.page-hero-bg, .article-hero-bg');
        if (bgDiv) bgDiv.style.backgroundImage = "url('" + S.heroData.bgImage + "')";
      }
      var html = hero.outerHTML.replace(/<(img|br|hr|meta|link|input|source)(\s[^>]*?)(?<!\/)>/gi, '<$1$2 />');
      return '\n  ' + html + '\n';
    }

    // ── BLOCK HTML GENERATION ────────────────────────────────────────────────────
    function genBlocks() {
      var h = '';
      // One-time modal init script for libro blocks (appended at end if needed)
      var needsLibroModal = S.blocks.some(function (b) { return b.type === 'libro'; });
      var libroModalScript = needsLibroModal ? genLibroModalScript() : '';
      var innerOpen = S.innerWrapperClass ? '\n<div class="' + escA(S.innerWrapperClass) + '">' : '';
      var innerClose = S.innerWrapperClass ? '\n</div>\n' : '';
      if (innerOpen) h += innerOpen;
      S.blocks.forEach(function (b) {
        if (b.type === '_skip' || b.type === '_preserve') { h += '\n' + b.html + '\n'; return; }
        if (b.type === 'heading') {
          var cls = b.cls ? ' class="' + escA(b.cls) + '"' : '';
          var hid = b.tocId ? ' id="' + escA(b.tocId) + '"' : '';
          h += '\n      <' + b.tag + cls + hid + '>' + b.html + '</' + b.tag + '>\n';
        } else if (b.type === 'lead') {
          h += '\n      <div class="article-lead">\n        ' + b.html + '\n      </div>\n';
        } else if (b.type === 'paragraph') {
          var cls = b.cls ? ' class="' + escA(b.cls) + '"' : '';
          h += '\n      <p' + cls + '>\n        ' + b.html + '\n      </p>\n';
        } else if (b.type === 'imagegrid') {
          var gcols = b.cols || 2;
          var gtc = Array(gcols).fill('1fr').join(' ');
          var gridSizeStyles = { small: 'max-width:400px;margin-left:auto;margin-right:auto', medium: '', large: 'max-width:700px;margin-left:auto;margin-right:auto', full: '' };
          var gridSS = gridSizeStyles[b.size || 'medium'] || '';
          var gridStyle = 'display: grid; grid-template-columns: ' + gtc + '; gap: 1rem;' + (gridSS ? ' ' + gridSS : '');
          h += '\n      <div class="article-imagegrid" style="' + gridStyle + '">\n';
          (b.imgs || []).forEach(function (img) {
            h += '        <figure class="inline-figure" style="float: none; width: 100%; margin: 0;">\n';
            h += '          <div class="article-figure-img-wrap" onclick="openLightbox(\'' + escA(img.src).replace(/'/g, '\\\'') + '\')">\n';
            h += '            <img src="' + escA(img.src) + '" alt="' + escA(img.alt) + '" />\n';
            h += '            <span class="zoom-hint" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
            h += '          </div>\n        </figure>\n';
          });
          h += '      </div>\n';
        } else if (b.type === 'figure') {
          var figPos2 = b.position || 'right', figSz2 = b.size || 'medium';
          var fc = (figPos2 === 'left') ? 'inline-figure-left' : 'inline-figure';
          if (b.cls && b.cls !== 'inline-figure' && b.cls !== 'inline-figure-left') fc = b.cls;
          var figSizeBase = { small: 'width:150px', medium: '', large: 'width:380px', full: 'float:none;clear:both;width:100%;margin:1.5rem 0' };
          var figSS = figSizeBase[figSz2] || '';
          if (figPos2 === 'center' && figSz2 !== 'full') figSS = (figSS ? figSS + ';' : '') + 'float:none;clear:both;margin-left:auto;margin-right:auto;display:block';
          var figWrapStyle = (figSz2 === 'full') ? ' style="display:block;max-width:100%"' : '';
          h += '\n      <figure class="' + fc + '"' + (figSS ? ' style="' + figSS + '"' : '') + '>' + '\n';
          h += '        <div class="article-figure-img-wrap"' + figWrapStyle + ' onclick="openLightbox(\'' + escA(b.src).replace(/'/g, '\\\'') + '\')">\n';
          h += '          <img src="' + escA(b.src) + '" alt="' + escA(b.alt) + '" />\n';
          h += '          <span class="zoom-hint" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>\n';
          h += '        </div>\n';
          if (b.caption) h += '        <figcaption>' + b.caption + '</figcaption>\n';
          h += '      </figure>\n';
        } else if (b.type === 'pullquote') {
          h += '\n      <div class="pull-quote">\n        ' + b.html + '\n      </div>\n';
        } else if (b.type === 'links') {
          if (!b.links || !b.links.length) return;
          h += '\n      <div class="article-links">\n';
          b.links.forEach(function (l) {
            if (!l.label || !l.url) return;
            h += '        <a class="article-ext-link" href="' + escA(l.url) + '" target="_blank" rel="noopener noreferrer">\n';
            h += '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>\n';
            h += '          ' + esc(l.label) + '\n        </a>\n';
          });
          h += '      </div>\n';
        } else if (b.type === 'highlight') {
          h += '\n      <div class="book-highlight">\n';
          h += '        <p>\n          ' + b.html + '\n        </p>\n';
          if (b.btnUrl) {
            h += '        <a class="btn-consultar" href="' + escA(b.btnUrl) + '" target="_blank" rel="noopener noreferrer">\n';
            h += '          ' + esc(b.btnLabel || '↓ Consultar aquí') + '\n        </a>\n';
          }
          h += '      </div>\n';
        } else if (b.type === 'list') {
          var lcls = b.cls ? ' class="' + escA(b.cls) + '"' : '';
          h += '\n      <ul' + lcls + '>\n';
          (b.items || []).forEach(function (item) {
            var noteClean = (item.note || '').replace(/<br\s*\/?>/gi, '').trim();
            h += '\n        <li>\n          ' + item.main;
            if (noteClean && noteClean !== '<br>') { h += '\n          <span class="biblio-note">' + item.note + '</span>'; }
            h += '\n        </li>\n';
          });
          h += '      </ul>\n';
        } else if (b.type === 'libro') {
          var lbJson = JSON.stringify({ title: b.title, author: b.author, editor: b.editor, year: b.year, editorial: b.editorial, city: b.city, collection: b.collection, isbn: b.isbn, buyUrl: b.buyUrl, image: b.image, displayMode: b.displayMode, extraFields: b.extraFields || [] }).replace(/'/g, '&#39;');
          var lbImg = b.image ? '<img src="' + escA(b.image) + '" alt="' + escA(b.title ? (b.title.replace(/<[^>]+>/g, '')) : '') + '" class="libro-block-cover">' : '<div class="libro-block-cover libro-block-cover--ph"></div>';
          var lbDl = '';
          var lbFields = [['Autor/es', b.author], ['Editor/es', b.editor], ['Año', b.year], ['Editorial', b.editorial], ['Ciudad', b.city], ['Colección', b.collection], ['ISBN', b.isbn]];
          (b.extraFields || []).forEach(function (ef) { if (ef.label && ef.value) lbFields.push([ef.label, ef.value]); });
          lbFields.forEach(function (f) { if (f[0] && f[1]) lbDl += '\n          <dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; });
          var lbBuy = b.buyUrl ? '\n          <a href="' + escA(b.buyUrl) + '" class="libro-block-buy" target="_blank" rel="noopener noreferrer">Más información</a>' : '';
          var lbId = slugifyStr(b.title ? b.title.replace(/<[^>]+>/g, '') : '');
          if (!b.displayMode || b.displayMode === 'modal') {
            h += '\n      <div class="libro-block libro-block--modal" id="' + lbId + '" data-lb=\'' + lbJson + '\' onclick="openLb(this)">';
            h += '\n        ' + lbImg;
            h += '\n        <div class="libro-block-title">' + b.title + '</div>';
            if (b.author) h += '\n        <div class="libro-block-author">' + esc(b.author) + '</div>';
            h += '\n      </div>\n';
          } else {
            h += '\n      <details class="libro-block libro-block--dropdown" id="' + lbId + '" data-lb=\'' + lbJson + '\'>';
            h += '\n        <summary class="libro-block-summary">';
            h += '\n          ' + lbImg;
            h += '\n          <div class="libro-block-caption">';
            h += '\n            <strong class="libro-block-title">' + b.title + '</strong>';
            if (b.author || b.year) h += '\n            <span class="libro-block-author">' + esc([b.author, b.year].filter(Boolean).join(' · ')) + '</span>';
            h += '\n          </div>';
            h += '\n        </summary>';
            h += '\n        <div class="libro-block-panel"><dl>' + lbDl + '\n        </dl>' + lbBuy + '\n        </div>';
            h += '\n      </details>\n';
          }
        }
      });
      if (libroModalScript) h += libroModalScript;
      if (innerClose) h += innerClose;
      return h;
    }

    function genLibroModalScript() {
      return '\n      <script id="libroModalScript">\n'
        + '(function(){\n'
        + '  if(window.__lbI)return;window.__lbI=1;\n'
        + '  var s=document.createElement(\'style\');\n'
        /* ── Modal-mode thumbnail (inline portada clicable) ── */
        + '  s.textContent=\'.libro-block{display:flex;flex-direction:column;align-items:center;text-align:center;cursor:pointer;width:160px}\'\n'
        + '  +\'.libros-modal-grid{display:flex;flex-wrap:wrap;gap:1.5rem 1.2rem;margin:0 0 1.5rem;align-items:flex-start}\'\n'
        + '  +\'.libro-block-cover{width:160px;height:240px;object-fit:cover;object-position:center;border-radius:5px;box-shadow:0 4px 16px rgba(0,0,0,.2);transition:transform .18s,box-shadow .18s}\'\n'
        + '  +\'.libro-block--modal .libro-block-cover:hover{transform:translateY(-5px);box-shadow:0 10px 28px rgba(0,0,0,.28)}\'\n'
        + '  +\'.libro-block-cover--ph{width:100%;max-width:160px;height:240px;background:var(--crema,#faf8f4);border:1px solid var(--borde,#d5cfc5);border-radius:5px;display:block}\'\n'
        + '  +\'.libro-block-title{margin-top:.5rem;font-family:Raleway,sans-serif;font-weight:600;font-size:.82rem;color:var(--azul,#1a3a5c);line-height:1.3}\'\n'
        + '  +\'.libro-block-author{font-size:.72rem;color:var(--gris-texto,#888)}\'\n'
        /* ── Overlay ── */
        + '  +\'#lbMdlOv{display:none;position:fixed;inset:0;background:rgba(10,20,36,.78);z-index:800;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(2px)}\'\n'
        + '  +\'#lbMdlOv.open{display:flex}\'\n'
        /* ── Modal box: flex column igual que congresos ── */
        + '  +\'.lbMdlBox{background:var(--blanco,#fff);border-radius:4px;width:100%;max-width:780px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.35)}\'\n'
        + '  +\'.lbMdlClose{position:absolute;top:.7rem;right:.9rem;background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gris-texto,#aaa);line-height:1;padding:.2rem .4rem;border-radius:4px;transition:color .12s;z-index:1}\'\n'
        + '  +\'.lbMdlClose:hover{color:var(--azul,#1a3a5c)}\'\n'
        /* layout = grid 2 cols, imagen llena todo el alto */
        + '  +\'.lbMdlLayout{display:grid;grid-template-columns:200px 1fr;min-height:0;overflow:hidden}\'\n'
        + '  +\'.lbMdlSide{overflow:hidden;min-height:0;background:var(--azul,#1a3a5c);min-height:300px}\'\n'
        + '  +\'.lbMdlImg{width:100%;height:100%;object-fit:cover;object-position:center;display:block;cursor:zoom-in}\'\n'
        + '  +\'.lbMdlMain{overflow-y:auto;padding:1.5rem 1.5rem;display:flex;flex-direction:column;min-height:0}\'\n'
        + '  +\'.lbMdlH{font-family:Raleway,sans-serif;font-size:1.25rem;font-weight:700;color:var(--azul,#1a3a5c);margin:0 0 .8rem;line-height:1.3;padding-right:1.5rem}\'\n'
        + '  +\'.lbMdlDl{display:grid;grid-template-columns:auto 1fr;gap:.28rem .8rem;margin:.1rem 0 0}\'\n'
        + '  +\'.lbMdlDl dt{font-weight:600;font-size:.88rem;color:var(--azul,#1a3a5c);white-space:nowrap;padding:.06rem 0}\'\n'
        + '  +\'.lbMdlDl dd{margin:0;font-size:.88rem;color:var(--gris-texto,#555);padding:.06rem 0}\'\n'
        /* botón igual que btn-consultar / modal-link-btn */
        + '  +\'.lbMdlBuy{display:inline-flex;align-items:center;align-self:flex-start;margin-top:1.2rem;padding:11px 18px;background:var(--azul,#1a3a5c);color:#fff!important;border-radius:3px;font-family:Raleway,sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none!important;transition:background .2s}\'\n'
        + '  +\'.lbMdlBuy:hover{background:var(--dorado,#c8a45a);color:#fff!important}\'\n'
        /* responsive: simplificar en tablet, ocultar imagen en móvil */
        + '  +\'@media(max-width:700px){.lbMdlLayout{grid-template-columns:160px 1fr}}\'\n'
        + '  +\'@media(max-width:500px){.lbMdlLayout{grid-template-columns:1fr}.lbMdlSide{display:none}.lbMdlMain{padding:1.2rem 1rem}}\'\n'
        + '  +\'.libros-dd-grid{display:flex;flex-wrap:wrap;gap:1.2rem;align-items:flex-start}\'\n'
        /* ── Dropdown CSS ── */
        + '  +\'.libro-block--dropdown{display:flex;flex-direction:column;width:360px;max-width:100%;align-items:stretch;text-align:left;vertical-align:top;margin:0;border:1px solid var(--borde,#d5cfc5);border-radius:10px;overflow:hidden;cursor:default;transition:box-shadow .2s}\'\n'
        + '  +\'.libro-block--dropdown summary{display:flex;align-items:flex-start;gap:1rem;cursor:pointer;list-style:none;padding:.9rem 1rem;background:var(--crema,#faf8f4);transition:background .12s}\'\n'
        + '  +\'.libro-block--dropdown summary:hover{background:var(--gris-claro,#f0eeea)}\'\n'
        + '  +\'.libro-block--dropdown summary::-webkit-details-marker{display:none}\'\n'
        + '  +\'.libro-block--dropdown .libro-block-cover{width:160px;height:auto;flex-shrink:0;border-radius:5px;box-shadow:0 3px 12px rgba(0,0,0,.18)}\'\n'
        + '  +\'.libro-block--dropdown .libro-block-cover--ph{width:160px;height:240px;flex-shrink:0;background:var(--crema,#faf8f4);border:1px solid var(--borde,#d5cfc5);border-radius:5px}\'\n'
        + '  +\'.libro-block-caption{display:flex;flex-direction:column;gap:.2rem;padding-top:.2rem;flex:1;min-width:0}\'\n'
        + '  +\'.libro-block--dropdown .libro-block-title{font-family:Raleway,sans-serif;font-weight:700;color:var(--azul,#1a3a5c);font-size:.92rem;line-height:1.35}\'\n'
        + '  +\'.libro-block--dropdown .libro-block-author{font-size:.8rem;color:var(--gris-texto,#888);margin-top:.1rem}\'\n'
        + '  +\'.libro-block-panel{padding:.85rem 1rem;border-top:1px solid var(--borde,#d5cfc5);background:var(--blanco,#fff)}\'\n'
        + '  +\'.libro-block-panel dl{display:grid;grid-template-columns:auto 1fr;gap:.2rem .7rem;margin:0}\'\n'
        + '  +\'.libro-block-panel dt{font-weight:600;font-size:.82rem;color:var(--azul,#1a3a5c);white-space:nowrap}\'\n'
        + '  +\'.libro-block-panel dd{margin:0;font-size:.82rem;color:var(--gris-texto,#555)}\'\n'
        + '  +\'.libro-block-buy{display:inline-flex;align-items:center;align-self:flex-start;margin-top:.75rem;padding:10px 16px;background:var(--azul,#1a3a5c);color:#fff!important;border-radius:3px;font-family:Raleway,sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none!important;transition:background .2s}\'\n'
        + '  +\'.libro-block-buy:hover{background:var(--dorado,#c8a45a);color:#fff!important}\'\n'
        /* ── Lightbox propio para portadas ── */
        + '  +\'#lbImgOv{display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:900;align-items:center;justify-content:center;cursor:zoom-out}\'\n'
        + '  +\'#lbImgOv.open{display:flex}\'\n'
        + '  +\'#lbImgFull{max-width:90%;max-height:90vh;border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,.5)}\';\n'
        + '  document.head.appendChild(s);\n'
        /* ── Lightbox DOM + openLibroImg ── */
        + '  var lbImg=document.createElement(\'div\');lbImg.id=\'lbImgOv\';\n'
        + '  lbImg.innerHTML=\'<img id="lbImgFull" src="" alt="" \\/>\'\n'
        + '  lbImg.addEventListener(\'click\',function(){lbImg.classList.remove(\'open\');document.body.style.overflow=\'\'});\n'
        + '  document.body.appendChild(lbImg);\n'
        + '  window.openLibroImg=function(src){document.getElementById(\'lbImgFull\').src=src;lbImg.classList.add(\'open\');document.body.style.overflow=\'hidden\';};\n'
        /* ── Modal libro ── */
        + '  var ov=document.createElement(\'div\');ov.id=\'lbMdlOv\';\n'
        + '  ov.innerHTML=\'<div class="lbMdlBox"><button class="lbMdlClose" onclick="closeLb()">✕<\\/button><div id="lbMdlBody"><\\/div><\\/div>\';\n'
        + '  document.body.appendChild(ov);\n'
        + '  ov.addEventListener(\'click\',function(e){if(e.target===ov)closeLb();});\n'
        + '  window.closeLb=function(){ov.classList.remove(\'open\');document.body.style.overflow=\'\';};\n'
        + '  window.openLb=function(el){\n'
        + '    var d=JSON.parse(el.dataset.lb||\'{}\')||{};\n'
        + '    var imgH=d.image?\'<div class="lbMdlSide"><img src="\'+d.image+\'" alt="\'+d.title+\'" class="lbMdlImg" onclick="openLibroImg(this.src)" title="Ver imagen ampliada" style="cursor:zoom-in"><\\/div>\':\'\'\n'
        + '    var dl=\'\';\n'
        + '    var fs=[[\'Autor/es\',d.author],[\'Editor/es\',d.editor],[\'Año\',d.year],[\'Editorial\',d.editorial],[\'Ciudad\',d.city],[\'Colección\',d.collection],[\'ISBN\',d.isbn]];\n'
        + '    (d.extraFields||[]).forEach(function(f){if(f.label&&f.value)fs.push([f.label,f.value]);});\n'
        + '    fs.forEach(function(f){if(f[0]&&f[1])dl+=\'<dt>\'+f[0]+\'<\\/dt><dd>\'+f[1]+\'<\\/dd>\';});\n'
        + '    var buy=d.buyUrl?\'<a href="\'+d.buyUrl+\'" class="lbMdlBuy" target="_blank" rel="noopener noreferrer">Más información<\\/a>\':\'\'\n'
        + '    document.getElementById(\'lbMdlBody\').innerHTML=\'<div class="lbMdlLayout">\'+imgH+\'<div class="lbMdlMain"><h3 class="lbMdlH">\'+d.title+\'<\\/h3><dl class="lbMdlDl">\'+dl+\'<\\/dl>\'+buy+\'<\\/div><\\/div>\';\n'
        + '    ov.classList.add(\'open\');document.body.style.overflow=\'hidden\';\n'
        + '  };\n'
        /* ── Grid JS: agrupa libros consecutivos en grid wrapper ── */
        + '  function wrapLibroGrids(){\n'
        + '    document.querySelectorAll(\'.libro-block--dropdown\').forEach(function(el){\n'
        + '      if(el.parentNode.classList.contains(\'libros-dd-grid\'))return;\n'
        + '      var wrap=document.createElement(\'div\');wrap.className=\'libros-dd-grid\';\n'
        + '      el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);\n'
        + '      var nx;\n'
        + '      while((nx=wrap.nextElementSibling)&&nx.classList.contains(\'libro-block--dropdown\'))wrap.appendChild(nx);\n'
        + '    });\n'
        + '    document.querySelectorAll(\'.libro-block--modal\').forEach(function(el){\n'
        + '      if(el.parentNode.classList.contains(\'libros-modal-grid\'))return;\n'
        + '      var wrap=document.createElement(\'div\');wrap.className=\'libros-modal-grid\';\n'
        + '      el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);\n'
        + '      var nx;\n'
        + '      while((nx=wrap.nextElementSibling)&&nx.classList.contains(\'libro-block--modal\'))wrap.appendChild(nx);\n'
        + '    });\n'
        + '  }\n'
        + '  if(document.readyState===\'loading\')document.addEventListener(\'DOMContentLoaded\',wrapLibroGrids);else wrapLibroGrids();\n'
        + '})();\n'
        + '      <\/script>\n';
    }
