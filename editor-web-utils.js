
    // ══════════════════════════════════════════════════════════════════════════════
    // NUEVAS FUNCIONALIDADES v1.1
    // ══════════════════════════════════════════════════════════════════════════════

    // ── #1 SISTEMA DE AYUDA CONTEXTUAL ───────────────────────────────────────────
    var HELP_TEXTS = {
      'Metadatos': {
        desc: 'Información básica de la página que los buscadores como Google utilizan para indexarla.',
        fields: [
          '<b>Título de la página:</b> Texto que aparece en la pestaña del navegador y en los resultados de búsqueda. Debe ser descriptivo y conciso (50-60 caracteres ideales).'
        ],
        tip: 'El título SEO no es el mismo que el título visible en la página. Aquí controlas lo que aparece en la pestaña del navegador.'
      },
      'Cabecera': {
        desc: 'La "cabecera héroe" es la gran banda visual en la parte superior de la página con título y navegación de migas de pan.',
        fields: [
          '<b>Título principal:</b> El H1 de la página, visible en grande en la cabecera.',
          '<b>Breadcrumb:</b> El último segmento de la ruta de navegación (ej.: "El grupo"). Ayuda al usuario a saber dónde está.',
          '<b>Categoría:</b> Etiqueta de color que clasifica el artículo (ej.: "Evento", "Investigación").',
          '<b>Fecha:</b> Fecha visible en la cabecera del artículo.'
        ],
        tip: 'El título puede contener HTML básico como <em>cursiva</em> si es necesario. El breadcrumb debe coincidir con el nombre de la sección en el menú.'
      },
      'Contenido': {
        desc: 'El cuerpo principal de la página, compuesto por bloques de texto, imágenes, citas, etc. Se construye bloque a bloque.',
        fields: [
          '<b>Párrafo:</b> Texto normal. Usar el editor de texto enriquecido para negrita, cursiva y enlaces.',
          '<b>Encabezado:</b> Título interno (H2 o H3) para organizar las secciones del artículo.',
          '<b>Figura:</b> Imagen con pie de foto opcional. Se puede posicionar a la izquierda, derecha o centrada.',
          '<b>Cita destacada:</b> Bloque visual resaltado para frases importantes.',
          '<b>Lista de enlaces:</b> Conjunto de enlaces externos relacionados.',
          '<b>Rejilla de imágenes:</b> Varias imágenes en formato cuadrícula.'
        ],
        tip: 'Arrastra los bloques por el icono "⠿" de la izquierda para reordenarlos. Usa "Añadir bloque" para agregar nuevo contenido al final.'
      },
      'Sidebar': {
        desc: 'Panel lateral derecho con tarjetas de navegación o contenido adicional. Aparece junto al artículo principal en pantallas anchas.',
        fields: [
          '<b>Tabla de contenidos:</b> Lista automática de los encabezados del artículo.',
          '<b>Navegación:</b> Lista de enlaces personalizados (ej.: otras páginas de la sección).',
          '<b>Texto libre:</b> Bloque de texto con editor enriquecido para notas o información complementaria.'
        ],
        tip: 'No todas las páginas tienen sidebar. Si la página actual no lo tiene, este apartado estará vacío. Los cambios en el sidebar se guardan junto con el resto de la página.'
      },
      'Tesis': {
        desc: 'Listado de tesis doctorales dirigidas por miembros del grupo.',
        fields: [
          '<b>Texto introductorio:</b> Párrafo inicial visible antes del listado de tesis.',
          '<b>Año:</b> Año de lectura o defensa de la tesis.',
          '<b>Título:</b> Título completo de la tesis (admite cursiva con etiqueta <em>).',
          '<b>Meta:</b> Autor, directores, universidad, etc.',
          '<b>Enlace:</b> URL al repositorio o texto descriptivo del estado (ej.: "En curso").',
          '<b>En curso:</b> Marcar si la tesis todavía no se ha leído.'
        ],
        tip: 'Arrastra las tarjetas para reordenar las tesis. Las tesis "en curso" se muestran sin enlace. Para eliminar una tesis, usa el botón rojo "×" de la esquina.'
      },
      'Congresos': {
        desc: 'Catálogo de congresos organizados por PROLOPE, con ficha detallada para cada edición.',
        fields: [
          '<b>Imagen:</b> Fotografía o cartel del congreso.',
          '<b>Año y edición:</b> Identificadores principales del congreso.',
          '<b>Nombre:</b> Título completo del congreso.',
          '<b>Fechas y lugar:</b> Cuándo y dónde se celebró.',
          '<b>Descripción modal:</b> Texto que aparece al hacer clic en la tarjeta.',
          '<b>Enlace modal:</b> Botones de acción dentro del modal (actas, programa, etc.).'
        ],
        tip: 'Los congresos se agrupan por series (encabezados de grupo). Usa "Añadir grupo" para crear una nueva serie y "Añadir congreso" para agregar ediciones dentro de ella.'
      },
      'Seminarios': {
        desc: 'Listado de seminarios organizados o coorganizados por PROLOPE.',
        fields: [
          '<b>Título:</b> Nombre del seminario.',
          '<b>Imagen:</b> Fotografía o cartel del seminario.',
          '<b>Campos adicionales:</b> Información libre que aparece en el panel desplegable (fechas, lugar, organizadores, etc.).'
        ],
        tip: 'Los campos adicionales son flexibles: puedes añadir o eliminar los que necesites con el botón "+ Campo". Arrastra para reordenar los seminarios dentro de cada grupo.'
      },
      'Miembros': {
        desc: 'Directorio de miembros del grupo de investigación, dividido en miembros actuales y antiguos.',
        fields: [
          '<b>Nombre:</b> Nombre completo del miembro.',
          '<b>Cargo/Rol:</b> Puesto o función dentro del grupo.',
          '<b>Universidad:</b> Institución de afiliación.',
          '<b>Email:</b> Correo electrónico de contacto.',
          '<b>ORCID:</b> Identificador ORCID del investigador.',
          '<b>Foto:</b> Ruta a la fotografía del miembro.',
          '<b>Biografía:</b> Texto breve sobre el investigador.',
          '<b>Miembro anterior:</b> Marcar si ya no forma parte activa del grupo.'
        ],
        tip: 'Las fotos deben estar en la carpeta media/. Usa el botón "Elegir" para seleccionar una imagen ya subida, o "Subir" para cargar una nueva.'
      },
      'Proyectos': {
        desc: 'Historial de proyectos de investigación financiados, agrupados por etapa o era temporal.',
        fields: [
          '<b>Era:</b> Período o etapa temporal que agrupa varios proyectos.',
          '<b>Año:</b> Año o rango de años del proyecto.',
          '<b>Título:</b> Nombre del proyecto.',
          '<b>Descripción:</b> Texto explicativo del proyecto.',
          '<b>IP / Investigador Principal:</b> Nombre de la persona responsable.',
          '<b>En curso:</b> Marcar si el proyecto está activo actualmente.',
          '<b>Campos adicionales:</b> Financiación, entidad convocante, referencia, etc.'
        ],
        tip: 'Los proyectos "en curso" se destacan visualmente. Puedes añadir campos adicionales de metadatos con el botón "+ Metadato".'
      },
      'Multimedia': {
        desc: 'Catálogo de vídeos y contenido audiovisual de PROLOPE.',
        fields: [
          '<b>Tipo:</b> YouTube/Vimeo (externo) o vídeo local (archivo del servidor).',
          '<b>URL del vídeo:</b> Enlace de YouTube o Vimeo.',
          '<b>Vídeo local:</b> Ruta al archivo de vídeo en el servidor.',
          '<b>Fuente:</b> Canal o plataforma de origen.',
          '<b>Fecha:</b> Fecha de publicación o grabación.',
          '<b>Título y descripción:</b> Metadatos visibles en la tarjeta del vídeo.',
          '<b>Miniatura:</b> Imagen de previsualización del vídeo.'
        ],
        tip: 'Para vídeos de YouTube, solo necesitas la URL completa; el editor extraerá automáticamente el ID del vídeo.'
      },
      'Partes de comedias': {
        desc: 'Catálogo de las Partes de comedias publicadas por PROLOPE con su información bibliográfica.',
        fields: [
          '<b>Texto introductorio:</b> Párrafo inicial visible antes del catálogo.',
          '<b>Cada parte:</b> Número, título, año, editorial, ISBN, imagen de portada, y enlace de compra.'
        ],
        tip: 'Las partes se muestran en una cuadrícula visual. El orden de las tarjetas determina el orden de aparición en la página.'
      },
      'Noticias': {
        desc: 'Editor de la ficha completa de una noticia: cabecera, cuerpo, tipo (suceso o evento) e imagen.',
        fields: [
          '<b>Tipo:</b> "Suceso" (noticia informativa) o "Evento" (convocatoria con fecha, lugar y enlaces).',
          '<b>Categoría:</b> Etiqueta visible en la cabecera (ej.: "Publicación", "Jornada").',
          '<b>Fecha:</b> Fecha larga visible (ej.: "15 de enero de 2025").',
          '<b>Imagen principal:</b> Fotografía que acompaña la noticia.',
          '<b>Bloques de contenido:</b> Cuerpo de la noticia (párrafos, imágenes, citas, etc.).',
          '<b>Datos del evento:</b> Solo para tipo "Evento": título, subtítulo, fechas, lugar y enlaces.'
        ],
        tip: 'El "Extracto" y la "Descripción para búsqueda" son textos cortos que aparecen en el listado de noticias y en los resultados del buscador interno.'
      }
    };

    function helpKey(sectionTitle) {
      // Match section title to HELP_TEXTS key (partial, case-insensitive)
      var title = sectionTitle.trim();
      var keys = Object.keys(HELP_TEXTS);
      // Exact match
      if (HELP_TEXTS[title]) return title;
      // Partial match
      for (var i = 0; i < keys.length; i++) {
        if (title.toLowerCase().indexOf(keys[i].toLowerCase()) !== -1 || keys[i].toLowerCase().indexOf(title.toLowerCase()) !== -1) return keys[i];
      }
      return null;
    }

    function sectionHelpBtn(sectionTitle) {
      var key = helpKey(sectionTitle);
      if (!key) return '';
      var safeKey = escA(key);
      return '<button class="help-btn" onclick="toggleHelpPanel(event,\'' + safeKey + '\')" title="Ayuda sobre esta sección">?</button>';
    }

    var _activeHelpKey = null;
    function toggleHelpPanel(e, key) {
      e.stopPropagation();
      // Find the panel
      var panel = document.getElementById('helpPanel_' + key.replace(/\s/g, '_'));
      if (!panel) return;
      var isOpen = panel.classList.contains('open');
      // Close all panels
      document.querySelectorAll('.help-panel.open').forEach(function (p) { p.classList.remove('open'); });
      document.getElementById('helpOverlay').style.display = 'none';
      if (!isOpen) {
        panel.classList.add('open');
        document.getElementById('helpOverlay').style.display = 'block';
        _activeHelpKey = key;
      } else {
        _activeHelpKey = null;
      }
    }

    function closeHelpPanel() {
      document.querySelectorAll('.help-panel.open').forEach(function (p) { p.classList.remove('open'); });
      document.getElementById('helpOverlay').style.display = 'none';
      _activeHelpKey = null;
    }

    function renderHelpPanel(key) {
      var data = HELP_TEXTS[key];
      if (!data) return '';
      var id = 'helpPanel_' + key.replace(/\s/g, '_');
      var html = '<div class="help-panel" id="' + id + '">';
      html += '<strong>' + esc(key) + '</strong>';
      if (data.desc) html += '<p>' + data.desc + '</p>';
      if (data.fields && data.fields.length) {
        html += '<ul>';
        data.fields.forEach(function (f) { html += '<li>' + f + '</li>'; });
        html += '</ul>';
      }
      if (data.tip) html += '<div class="help-tip">💡 ' + data.tip + '</div>';
      html += '</div>';
      return html;
    }

    // Patch: inject help button into section h2 titles
    // Called after renderEditor sets innerHTML
    function injectHelpButtons() {
      document.querySelectorAll('.ed-section h2').forEach(function (h2) {
        // Get text content, excluding badges
        var textNodes = Array.from(h2.childNodes).filter(function (n) { return n.nodeType === 3; });
        var titleText = textNodes.map(function (n) { return n.textContent; }).join('').trim();
        if (!titleText) {
          // Try first text content
          titleText = h2.textContent.replace(/REQUERIDO|OPCIONAL|NEW/gi, '').trim();
        }
        var key = helpKey(titleText);
        if (!key) return;
        // Avoid double injection
        if (h2.querySelector('.help-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'help-btn';
        btn.textContent = '?';
        btn.title = 'Ayuda sobre esta sección';
        btn.onclick = function (e) { toggleHelpPanel(e, key); };
        h2.appendChild(btn);
        // Insert panel after h2's parent section's h2
        var section = h2.closest('.ed-section');
        if (section) {
          var panelId = 'helpPanel_' + key.replace(/\s/g, '_');
          if (!document.getElementById(panelId)) {
            var panelDiv = document.createElement('div');
            panelDiv.innerHTML = renderHelpPanel(key);
            h2.insertAdjacentElement('afterend', panelDiv.firstChild);
          }
        }
      });
    }

    // ── #2 HISTORIAL / DESHACER ───────────────────────────────────────────────────
    var H = {
      snapshot: null,       // saved snapshot of S state at last save
      snapshotTime: null,   // Date of last save
      _dirty: false,        // whether there are unsaved changes
      _saveTimeInterval: null,
    };

    function markDirty() {
      if (H._dirty) return;
      H._dirty = true;
      var dot = document.getElementById('unsavedDot');
      var lbl = document.getElementById('unsavedLabel');
      if (dot) dot.classList.add('active');
      if (lbl) lbl.classList.add('active');
    }

    function markClean(saveTime) {
      H._dirty = false;
      H.snapshotTime = saveTime || new Date();
      var dot = document.getElementById('unsavedDot');
      var lbl = document.getElementById('unsavedLabel');
      if (dot) dot.classList.remove('active');
      if (lbl) lbl.classList.remove('active');
      updateSaveTimeLabel();
      // Show undo button
      var undoBtn = document.getElementById('btnUndo');
      if (undoBtn) undoBtn.style.display = '';
    }

    function updateSaveTimeLabel() {
      var el = document.getElementById('saveTimeLabel');
      if (!el) return;
      if (!H.snapshotTime) { el.classList.remove('active'); return; }
      var diff = Math.round((Date.now() - H.snapshotTime.getTime()) / 60000);
      var text = diff < 1 ? 'Guardado hace un momento' : diff === 1 ? 'Guardado hace 1 min' : 'Guardado hace ' + diff + ' min';
      el.textContent = text;
      el.classList.add('active');
    }

    function takeSnapshot() {
      // Store a JSON snapshot of key S fields before saving
      H.snapshot = JSON.stringify({
        blocks: S.blocks,
        items: S.items,
        introHtml: S.introHtml,
        heroData: S.heroData,
        pageTitle: S.pageTitle,
        sidebarCards: S.sidebarCards,
        newsFormData: S.newsFormData,
        partesData: S.partesData,
        afterGridHtml: S.afterGridHtml,
      });
    }

    function undoLastSave() {
      if (!H.snapshot) { toast('No hay snapshot guardado', 'info'); return; }
      if (!confirm('¿Restaurar el estado de la última vez que se guardó? Se perderán los cambios actuales.')) return;
      var snap;
      try { snap = JSON.parse(H.snapshot); } catch (e) { toast('Error al restaurar', 'err'); return; }
      Object.assign(S, snap);
      renderEditor();
      H._dirty = false;
      var dot = document.getElementById('unsavedDot');
      var lbl = document.getElementById('unsavedLabel');
      if (dot) dot.classList.remove('active');
      if (lbl) lbl.classList.remove('active');
      toast('Cambios revertidos al último guardado', 'info');
    }

    // Intercept input events on edBody to detect unsaved changes
    (function setupDirtyDetection() {
      // We hook into document-level input/change events inside edBody
      document.addEventListener('input', function (e) {
        var edBody = document.getElementById('edBody');
        if (edBody && edBody.contains(e.target)) markDirty();
      }, true);
      document.addEventListener('change', function (e) {
        var edBody = document.getElementById('edBody');
        if (edBody && edBody.contains(e.target)) markDirty();
      }, true);
      // Update save-time label every minute
      H._saveTimeInterval = setInterval(updateSaveTimeLabel, 60000);
    })();

    // ── #3 PREVENCIÓN PÉRDIDA DE CAMBIOS + Ctrl+S ────────────────────────────────
    window.addEventListener('beforeunload', function (e) {
      if (H._dirty) {
        e.preventDefault();
        e.returnValue = 'Hay cambios sin guardar. ¿Seguro que quieres salir?';
        return e.returnValue;
      }
    });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        var topbar = document.getElementById('topbar');
        if (topbar && topbar.style.display !== 'none') {
          savePage();
        }
      }
    });

    // ── #4 BÚSQUEDA EN NAV ────────────────────────────────────────────────────────
    function filterNav(query) {
      var q = query.trim().toLowerCase();
      var groups = document.querySelectorAll('#navList .nav-group');
      groups.forEach(function (group) {
        var items = group.querySelectorAll('.nav-item');
        var anyVisible = false;
        items.forEach(function (item) {
          var isNewsHidden = item.classList.contains('nav-news-hidden');
          // Individual news: only show when there's a query AND it matches
          if (isNewsHidden) {
            var text = item.textContent.toLowerCase();
            var match = q && text.indexOf(q) !== -1;
            item.style.display = match ? 'block' : '';
            if (match) anyVisible = true;
            return;
          }
          var text = item.textContent.toLowerCase();
          var match = !q || text.indexOf(q) !== -1;
          item.classList.toggle('nav-hidden', !match);
          if (match) anyVisible = true;
        });
        group.classList.toggle('nav-group-hidden', !anyVisible);
      });
    }

    // ── #5 MODO COMPACTO / EXPANDIDO ─────────────────────────────────────────────
    var _compactMode = true; // default: everything collapsed

    function injectCollapseToggles() {
      // Sections: inject chevron into h2 and bind click
      document.querySelectorAll('.ed-section').forEach(function (sec) {
        var h2 = sec.querySelector(':scope > h2');
        if (!h2 || h2.querySelector('.toggle-chevron')) return;
        var chev = document.createElement('span');
        chev.className = 'toggle-chevron';
        chev.setAttribute('aria-hidden', 'true');
        chev.textContent = '▾';
        h2.insertBefore(chev, h2.firstChild);
        h2.addEventListener('click', function (e) {
          if (e.target.closest('.help-btn')) return;
          sec.classList.toggle('is-collapsed');
        });
        sec.classList.add('is-collapsed');
      });

      // Block cards: inject toggle into block-header and bind click
      document.querySelectorAll('.block-card').forEach(function (card) {
        var header = card.querySelector('.block-header');
        if (!header || header.querySelector('.block-toggle')) return;
        var tog = document.createElement('span');
        tog.className = 'block-toggle';
        tog.setAttribute('aria-hidden', 'true');
        tog.textContent = '▾';
        header.insertBefore(tog, header.firstChild);
        header.addEventListener('click', function (e) {
          if (e.target.closest('.block-actions')) return;
          card.classList.toggle('is-collapsed');
        });
        card.classList.add('is-collapsed');
      });

      // News content blocks: inject toggle into item-card-header inside #nc-blocks
      var ncBlocks = document.getElementById('nc-blocks');
      if (ncBlocks) {
        ncBlocks.querySelectorAll('.item-card').forEach(function (card) {
          var header = card.querySelector('.item-card-header');
          if (!header || header.querySelector('.block-toggle')) return;
          var tog = document.createElement('span');
          tog.className = 'block-toggle';
          tog.setAttribute('aria-hidden', 'true');
          tog.textContent = '▾';
          header.insertBefore(tog, header.firstChild);
          header.addEventListener('click', function (e) {
            card.classList.toggle('is-collapsed');
          });
          card.classList.add('is-collapsed');
        });
      }
    }

    function toggleCompact() {
      _compactMode = !_compactMode;
      document.querySelectorAll('.ed-section').forEach(function (sec) {
        sec.classList.toggle('is-collapsed', _compactMode);
      });
      document.querySelectorAll('.block-card').forEach(function (card) {
        card.classList.toggle('is-collapsed', _compactMode);
      });
      var btn = document.getElementById('btnCompact');
      if (btn) {
        btn.textContent = _compactMode ? '⊞ Expandir todo' : '⊟ Compactar todo';
        btn.title = _compactMode ? 'Expandir todas las secciones' : 'Contraer todas las secciones';
      }
    }

    // ── HELPERS PARA RESETEAR UI EN CARGA DE PÁGINA ──────────────────────────────
    function resetEditorState() {
      H._dirty = false;
      H.snapshot = null;
      var dot = document.getElementById('unsavedDot');
      var lbl = document.getElementById('unsavedLabel');
      var undoBtn = document.getElementById('btnUndo');
      if (dot) dot.classList.remove('active');
      if (lbl) lbl.classList.remove('active');
      if (undoBtn) undoBtn.style.display = 'none';
      _compactMode = true;
      var btn = document.getElementById('btnCompact');
      if (btn) { btn.textContent = '⊞ Expandir todo'; btn.title = 'Expandir todas las secciones'; }
    }

    // ── TOAST ────────────────────────────────────────────────────────────────────
    function toast(msg, type) {
      var el = document.getElementById('toast');
      var icon = type === 'ok' ? '✅' : type === 'err' ? '❌' : 'ℹ️';
      el.innerHTML = '<span>' + icon + '</span><span>' + esc(msg) + '</span>';
      el.className = 'toast ' + (type || 'info') + ' show';
      clearTimeout(el._t);
      el._t = setTimeout(function () { el.classList.remove('show'); }, 4500);
    }

    // ── HISTORIAL DE VERSIONES ────────────────────────────────────────────────────

    var _histCurrentTs = null;

    function openHistory() {
      if (!S.currentPath) return;
      _histCurrentTs = null;
      document.getElementById('histFile').textContent = S.currentPath;
      document.getElementById('histPreviewEmpty').style.display = '';
      document.getElementById('histPreviewBar').style.display = 'none';
      document.getElementById('histIframe').style.display = 'none';
      document.getElementById('histPruneBar').style.display = 'none';
      document.getElementById('histList').innerHTML = '<div class="hist-loading">Cargando versiones…</div>';
      document.getElementById('histOverlay').classList.add('open');
      loadVersionList();
    }

    function closeHistory() {
      document.getElementById('histOverlay').classList.remove('open');
      var iframe = document.getElementById('histIframe');
      iframe.src = 'about:blank';
      iframe.style.display = 'none';
    }

    async function loadVersionList() {
      try {
        var r = await fetch('/api/versions?file=' + encodeURIComponent(S.currentPath));
        var versions = await r.json();
        var list = document.getElementById('histList');
        var pruneBar = document.getElementById('histPruneBar');
        var btnTogglePrune = document.getElementById('btnTogglePrune');
        if (!versions.length) {
          list.innerHTML = '<div class="hist-list-empty">No hay versiones guardadas todavía.<br><br>Las versiones se crean automáticamente cada vez que guardas la página.</div>';
          pruneBar.style.display = 'none';
          if (btnTogglePrune) btnTogglePrune.style.display = 'none';
          return;
        }
        if (btnTogglePrune) btnTogglePrune.style.display = '';

        // Synthetic "versión actual" entry always at top
        var currentEntry = '<div class="hist-item" data-ts="__current__" data-label="Versión actual" data-prerestore="0" onclick="selectVersion(this)">'
          + '<div class="hist-item-inner">'
          + '<span class="hist-item-date">Lo que está publicado</span>'
          + '<span class="hist-item-tag tag-current" style="margin-bottom:.15rem">📌 Versión actual</span>'
          + '</div>'
          + '</div>';

        var historyEntries = versions.map(function (v) {
          // Date formatting for natural language
          var dateObj = new Date(v.ts);
          var now = new Date();
          var dateStr = '';
          if (!isNaN(dateObj.getTime())) {
            var isToday = dateObj.getDate() === now.getDate() && dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
            var h = dateObj.getHours().toString().padStart(2, '0');
            var m = dateObj.getMinutes().toString().padStart(2, '0');
            if (isToday) {
              dateStr = 'Hoy a las ' + h + ':' + m;
            } else {
              var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
              dateStr = dateObj.getDate() + ' de ' + months[dateObj.getMonth()] + ', ' + h + ':' + m;
            }
          } else {
            dateStr = v.label; // Fallback to raw label if parsing fails
          }

          var tagClass = v.isPreRestore ? 'tag-prerestore' : 'tag-save';
          var tagText = v.isPreRestore ? '🔄 Revertida' : '💾 Autoguardado';
          // Timeline layout with action buttons wrapper
          return '<div class="hist-item" data-ts="' + esc(v.ts) + '" data-label="' + esc(v.label) + '" data-prerestore="' + (v.isPreRestore ? '1' : '0') + '" onclick="selectVersion(this)">'
            + '<div class="hist-item-inner">'
            + '<span class="hist-item-date">' + esc(dateStr) + '</span>'
            + '<span class="hist-item-tag ' + tagClass + '" style="margin-bottom:.15rem">' + tagText + '</span>'
            + '</div>'
            + '<div class="hist-item-actions">'
            + '<button class="hist-btn-del" onclick="deleteVersion(event,\'' + esc(v.ts) + '\')" title="Eliminar"><span class="hist-btn-icon">🗑️</span><span class="hist-btn-text">Eliminar</span></button>'
            + '</div>'
            + '</div>';
        });
        list.innerHTML = currentEntry + historyEntries.join('');
      } catch (e) {
        document.getElementById('histList').innerHTML = '<div class="hist-list-empty">Error al cargar versiones.</div>';
      }
    }

    function selectVersion(el) {
      document.querySelectorAll('.hist-item').forEach(function (i) { i.classList.remove('active'); });
      el.classList.add('active');
      _histCurrentTs = el.dataset.ts;
      var isCurrent = (_histCurrentTs === '__current__');
      var isPreRestore = el.dataset.prerestore === '1';
      var label = el.dataset.label;
      var typeLabel = isCurrent ? '' : (isPreRestore ? 'Versión revertida — ' : 'Versión anterior — ');
      document.getElementById('histPreviewLabel').textContent = typeLabel + label;
      document.getElementById('histPreviewBar').style.display = '';
      document.getElementById('histPreviewEmpty').style.display = 'none';
      // Hide restore button for the current version (it's already on the site)
      document.getElementById('btnRestoreVersion').style.display = isCurrent ? 'none' : '';
      var iframe = document.getElementById('histIframe');
      iframe.style.display = 'block';
      if (isCurrent) {
        iframe.src = '/' + S.currentPath;
      } else {
        iframe.src = '/_vp/' + S.currentPath + '?ts=' + encodeURIComponent(_histCurrentTs);
      }
    }

    function openVersionInTab() {
      if (!_histCurrentTs) return;
      var url = (_histCurrentTs === '__current__')
        ? '/' + S.currentPath
        : '/_vp/' + S.currentPath + '?ts=' + encodeURIComponent(_histCurrentTs);
      window.open(url, '_blank');
    }

    function togglePruneBar() {
      var bar = document.getElementById('histPruneBar');
      if (bar.style.display === 'none') {
        bar.style.display = '';
      } else {
        bar.style.display = 'none';
      }
    }

    async function deleteVersion(event, ts) {
      event.stopPropagation();
      if (!confirm('¿Eliminar definitivamente esta versión del historial?')) return;
      try {
        var r = await fetch('/api/version?file=' + encodeURIComponent(S.currentPath) + '&ts=' + encodeURIComponent(ts), { method: 'DELETE' });
        var data = await r.json();
        if (data.ok) {
          if (_histCurrentTs === ts) {
            _histCurrentTs = null;
            document.getElementById('histPreviewBar').style.display = 'none';
            document.getElementById('histPreviewEmpty').style.display = '';
            document.getElementById('histIframe').style.display = 'none';
            document.getElementById('histIframe').src = 'about:blank';
          }
          loadVersionList();
        } else {
          toast('Error al eliminar: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión', 'err');
      }
    }

    async function pruneVersions() {
      var keepN = parseInt(document.getElementById('histKeepN').value, 10);
      if (isNaN(keepN) || keepN < 1) { toast('Introduce un número válido de versiones a conservar.', 'err'); return; }
      var totalItems = document.querySelectorAll('.hist-item').length;
      var toDelete = Math.max(0, totalItems - keepN);
      if (toDelete === 0) { toast('No hay versiones antiguas que eliminar con ese criterio.', 'info'); return; }
      if (!confirm('Se eliminarán las ' + toDelete + ' versiones más antiguas, conservando las ' + keepN + ' más recientes. ¿Continuar?')) return;
      try {
        var r = await fetch('/api/versions-prune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: S.currentPath, keepLast: keepN })
        });
        var data = await r.json();
        if (data.ok) {
          toast(data.deleted + ' versiones eliminadas.', 'ok');
          _histCurrentTs = null;
          document.getElementById('histPreviewBar').style.display = 'none';
          document.getElementById('histPreviewEmpty').style.display = '';
          document.getElementById('histIframe').style.display = 'none';
          document.getElementById('histIframe').src = 'about:blank';
          loadVersionList();
        } else {
          toast('Error: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión', 'err');
      }
    }

    async function restoreVersion() {
      if (!_histCurrentTs) return;
      var labelEl = document.querySelector('.hist-item.active .hist-item-date');
      var labelText = labelEl ? labelEl.textContent : _histCurrentTs;
      if (!confirm('¿Seguro que quieres restaurar la versión del ' + labelText + '?\n\nEl estado actual de la página se guardará automáticamente en el historial antes de restaurar.')) return;
      var btn = document.getElementById('btnRestoreVersion');
      btn.textContent = 'Restaurando…';
      btn.disabled = true;
      try {
        var r = await fetch('/api/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: S.currentPath, ts: _histCurrentTs })
        });
        var data = await r.json();
        if (data.ok) {
          closeHistory();
          toast('Versión restaurada. Recargando página…', 'ok');
          setTimeout(function () { loadPage(S.currentPath); }, 800);
        } else {
          toast('Error al restaurar: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al restaurar', 'err');
      }
      btn.textContent = '↩ Restaurar esta versión';
      btn.disabled = false;
    }
