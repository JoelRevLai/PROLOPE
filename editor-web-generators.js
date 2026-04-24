    function genTheses() {
      var h = '\n      <p class="article-lead">' + S.introHtml + '</p>\n';
      h += '\n      <div class="thesis-list">\n';
      S.items.forEach(function (it) {
        var thId = slugifyStr(((it.year || '') + '-' + (it.title ? it.title.replace(/<[^>]+>/g, '') : '')).substring(0, 50));
        h += '        <div class="thesis-item" id="' + escA(thId) + '">\n';
        h += '          <span class="thesis-year">' + esc(it.year) + '</span>\n';
        h += '          <p class="thesis-title">' + it.title + '</p>\n';
        h += '          <div class="thesis-meta">' + it.meta + '</div>\n';
        if (it.pending) {
          h += '          <span class="thesis-pending">Consulta de la tesis pendiente</span>\n';
        } else if (it.link) {
          h += '          <a class="thesis-link" href="' + escA(it.link) + '" target="_blank" rel="noopener noreferrer">→ Consultar tesis</a>\n';
        }
        h += '        </div>\n';
      });
      h += '      </div>\n';
      return h;
    }

    function genCongresses() {
      var h = '\n    <p class="intro-text">' + S.introHtml + '</p>\n';
      var inGrid = false;
      S.items.forEach(function (it) {
        if (it._group) {
          if (inGrid) { h += '    </div>\n\n'; inGrid = false; }
          h += '\n    <div class="series-header">\n';
          h += '      <span class="series-title">' + it.title + '</span>\n';
          h += '      <span class="series-rule"></span>\n';
          h += '      <span class="series-count">' + it.count + '</span>\n';
          h += '    </div>\n\n';
          h += '    <div class="congress-grid">\n';
          inGrid = true;
          return;
        }
        if (!it.year && !it.edition && !it.name && !it.dates && !it.location && !it.image) return;
        if (!inGrid) { h += '\n    <div class="congress-grid">\n'; inGrid = true; }
        var conId = slugifyStr(((it.edition ? it.edition.replace(/<[^>]+>/g, '') : '') + '-' + (it.name ? it.name.replace(/<[^>]+>/g, '') : '')).substring(0, 60));
        h += '\n      <div class="congress-card" id="' + escA(conId) + '"' + (it.onclick ? ' onclick="' + escA(it.onclick) + '"' : '') + '>\n';
        h += '        <div class="congress-poster">\n';
        if (it.image) h += '          <img src="' + escA(it.image) + '" alt="' + escA(it.imageAlt) + '" />\n';
        h += '          <div class="congress-poster-overlay"></div>\n';
        h += '          <span class="congress-year-badge">' + esc(it.year) + '</span>\n';
        h += '        </div>\n';
        h += '        <div class="congress-info">\n';
        h += '          <div class="congress-edition">' + it.edition + '</div>\n';
        h += '          <div class="congress-name">' + it.name + '</div>\n';
        var meta = esc(it.dates);
        if (it.location) meta += '<br /><strong>' + esc(it.location) + '</strong>';
        h += '          <div class="congress-meta-small">' + meta + '</div>\n';
        h += '        </div>\n';
        h += '        <span class="congress-hint">Ver más →</span>\n';
        h += '      </div>\n';
      });
      if (inGrid) h += '    </div>\n';
      return h;
    }

    function rebuildCongressesModalScript() {
      var src = S.footerPart || '';
      var bounds = findCongressesObjectBounds(src);
      // Build new object literal
      var lines = '{\n';
      S.items.forEach(function (it) {
        if (it._group || !it.modalId) return;
        lines += '      ' + it.modalId + ': {\n';
        lines += '        edition: ' + JSON.stringify((it.edition || '').replace(/<[^>]+>/g, '')) + ',\n';
        lines += '        title: ' + JSON.stringify((it.modalTitle || '').replace(/<[^>]+>/g, '')) + ',\n';
        lines += '        dates: ' + JSON.stringify(it.dates || '') + ',\n';
        lines += '        location: ' + JSON.stringify(it.location || '') + ',\n';
        lines += '        img: ' + JSON.stringify(it.image || '') + ',\n';
        lines += '        description: ' + JSON.stringify(it.modalDescription || '') + ',\n';
        lines += '        links: [\n';
        (it.modalLinks || []).forEach(function (l) {
          lines += '          { label: ' + JSON.stringify(l.label) + ', url: ' + JSON.stringify(l.url) + ' },\n';
        });
        lines += '        ]\n';
        lines += '      },\n';
      });
      lines += '    }';
      if (bounds) {
        // Replace existing congresses object
        S.footerPart = src.substring(0, bounds.start) +
          'const congresses = ' + lines + src.substring(bounds.end);
      } else {
        // No existing object: inject before the first <script> closing tag in footer
        S.footerPart = src.replace('<' + '/script>', 'const congresses = ' + lines + ';\n  <' + '/script>');
      }
    }

    function genSeminars() {
      var h = '\n    <p class="intro-text">' + S.introHtml + '</p>\n';
      var inList = false;
      var semIdx = 0;
      S.items.forEach(function (it) {
        if (it._group) {
          if (inList) { h += '    </ul>\n\n'; inList = false; }
          h += '\n    <div class="series-header">\n';
          h += '      <span class="series-title">' + it.title + '</span>\n';
          h += '      <span class="series-rule"></span>\n';
          h += '      <span class="series-count">' + it.count + '</span>\n';
          h += '    </div>\n\n';
          h += '    <ul class="seminar-list">\n';
          inList = true;
          return;
        }
        if (!it.year && !it.name && !it.dates) return;
        if (!inList) { h += '\n    <ul class="seminar-list">\n'; inList = true; }
        var semId = slugifyStr((it.year || '') + '-' + (it.name || '').substring(0, 40));
        h += '\n      <li class="seminar-item" id="' + escA(semId) + '">\n';
        h += '        <button class="seminar-trigger" onclick="toggleSeminar(this)">\n';
        h += '          <span class="seminar-year">' + esc(it.year) + '</span>\n';
        h += '          <span class="seminar-title-wrap">\n';
        h += '            <span class="seminar-name">' + esc(it.name) + '</span>\n';
        if (it.theme) h += '            <span class="seminar-theme">' + it.theme + '</span>\n';
        h += '          </span>\n';
        h += '          <span class="seminar-dates-inline">' + esc(it.dates) + '</span>\n';
        h += '          <span class="seminar-chevron">▼</span>\n';
        h += '        </button>\n';
        h += '        <div class="seminar-panel" id="sem-panel-' + semIdx + '">\n';
        h += '          <div class="seminar-panel-grid">\n';
        (it.fields || []).forEach(function (f) {
          if (!f.label && !f.value) return;
          h += '            <div class="seminar-field"><div class="seminar-field-label">' + esc(f.label) + '</div><div class="seminar-field-value">' + esc(f.value) + '</div></div>\n';
        });
        h += '          </div>\n';
        if (it.pdfUrl) h += '          <a class="seminar-pdf-btn" href="' + escA(it.pdfUrl) + '" target="_blank" rel="noopener noreferrer">' + (it.pdfText || 'Programa (PDF)') + '</a>\n';
        if (it.posterUrl) h += '          <a class="seminar-poster-btn" href="' + escA(it.posterUrl) + '" target="_blank" rel="noopener noreferrer">' + (it.posterText || 'Cartel') + '</a>\n';
        h += '        </div>\n';
        h += '      </li>\n';
        semIdx++;
      });
      if (inList) h += '    </ul>\n';
      return h;
    }

    var _pendingLocalVideos = null;

    function genMultimedia() {
      var h = '\n    <div class="video-grid">\n';
      var localVideos = {};
      S.items.forEach(function (it) {
        var isLocal = it.isLocal && it.localSrc;
        var onclick;
        if (isLocal) {
          var vid = it.videoId;
          if (!vid) {
            vid = it.localSrc.split('/').pop().replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '').toLowerCase() || ('video' + Object.keys(localVideos).length);
            if (/^\d/.test(vid)) vid = 'v' + vid; // identifiers can't start with a digit
          }
          it.videoId = vid; // persist derived id so subsequent saves reuse it
          onclick = "openVideo('" + vid + "')";
          localVideos[vid] = {
            date: it.date || '',
            title: (it.title || '').replace(/<[^>]+>/g, ''),
            desc: it.desc || '',
            src: it.localSrc,
          };
        } else {
          onclick = it.url ? "window.open('" + it.url.replace(/'/g, "\\'") + "','_blank')" : '';
        }
        var vidId = slugifyStr((it.title ? it.title.replace(/<[^>]+>/g, '') : '').substring(0, 50));
        h += '\n      <article class="video-card" id="' + escA(vidId) + '"' + (onclick ? ' onclick="' + escA(onclick) + '"' : '') + '>\n';
        h += '        <div class="video-thumb-wrap">\n';
        if (it.image) h += '          <img src="' + escA(it.image) + '" alt="' + escA(it.imageAlt || '') + '" loading="lazy" />\n';
        h += '          <div class="play-btn">\n';
        h += '            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">\n';
        h += '              <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>\n';
        h += '              <polygon points="32,24 60,40 32,56" fill="white"/>\n';
        h += '            </svg>\n';
        h += '          </div>\n';
        h += '          <span class="video-source-badge">' + esc(it.source) + '</span>\n';
        h += '        </div>\n';
        h += '        <div class="video-info">\n';
        h += '          <div class="video-date">' + esc(it.date) + '</div>\n';
        h += '          <h2 class="video-title">' + it.title + '</h2>\n';
        h += '          <p class="video-desc">' + it.desc + '</p>\n';
        h += '        </div>\n';
        h += '        <span class="video-hint">Ver vídeo →</span>\n';
        h += '      </article>\n';
      });
      h += '    </div>\n';
      _pendingLocalVideos = Object.keys(localVideos).length ? localVideos : null;
      return h;
    }

    function updateFooterVideosScript(footerPart, localVideos) {
      var ids = Object.keys(localVideos);
      var lines = ['    const videos = {'];
      ids.forEach(function (id, i) {
        var v = localVideos[id];
        lines.push('      ' + JSON.stringify(id) + ': {');
        lines.push('        date: ' + JSON.stringify(v.date) + ',');
        lines.push('        title: ' + JSON.stringify(v.title ? v.title.replace(/<[^>]+>/g, '') : '') + ',');
        lines.push('        desc: ' + JSON.stringify(v.desc ? v.desc.replace(/<[^>]+>/g, '') : '') + ',');
        lines.push('        type: \'inline\',');
        lines.push('        src: ' + JSON.stringify(v.src));
        lines.push('      }' + (i < ids.length - 1 ? ',' : ''));
      });
      lines.push('    };');
      var newDecl = lines.join('\n');
      // Replace existing const videos = {...}; block
      // Use [ \t]* (no newlines) so the backreference matches the indented closing };
      var replaced = footerPart.replace(/[ \t]*const\s+videos\s*=\s*\{[\s\S]*?\n[ \t]*\};/, newDecl);
      if (replaced !== footerPart) return replaced;
      // Fallback: insert before the openVideo function
      replaced = footerPart.replace(/([ \t]*)function\s+openVideo\s*\(/, function (m, indent) {
        return newDecl + '\n\n' + indent + 'function openVideo(';
      });
      if (replaced !== footerPart) return replaced;
      // Last resort: prepend a new script block
      return '\n  <script>\n' + newDecl + '\n  <\/script>\n' + footerPart;
    }

    function genMembers() {
      function memberCardHtml(m) {
        var photo = m.photo || '';
        var imgSrc = photo ? '../' + photo : '';
        var s = '\n<div class="card" id="' + slugifyStr(m.name) + '" tabindex="0" role="button"\n';
        s += '  data-name="' + escA(m.name) + '" data-role="' + escA(m.role) + '" data-uni="' + escA((m.uni || '').replace(/<[^>]+>/g, '')) + '" data-email="' + escA(m.email) + '" data-orcid="' + escA(m.orcid || '') + '"\n';
        s += '  data-photo="' + escA(imgSrc) + '"\n';
        s += '  data-bio="' + escAttr(m.bio) + '">\n';
        s += '<img class="cphoto" src="' + escA(imgSrc) + '" alt="' + escA(m.name) + '" onerror="this.onerror=null;this.src=\'../media/logo_positiu.png\';this.style.objectFit=\'contain\';this.style.padding=\'28px\'"/>\n';
        s += '<div class="cbody"><p class="cname">' + esc(m.name) + '</p><p class="crole">' + esc(m.displayRole || m.role) + '</p><p class="cuni">' + (m.uni || '') + '</p></div>\n';
        s += '<span class="chint">Ver ficha →</span>\n</div>\n';
        return s;
      }
      var current = S.items.filter(function (m) { return !m.past; });
      var past = S.items.filter(function (m) { return m.past; });
      var h = '\n<p class="intro">' + S.introHtml + '</p>\n';
      h += '\n<div class="grid">\n';
      current.forEach(function (m) { h += memberCardHtml(m); });
      h += '\n</div>\n';
      h += '\n<div class="members-section">\n<h2>Histórico de investigadores</h2>\n</div>\n';
      h += '\n<div class="grid past-grid">\n';
      past.forEach(function (m) { h += memberCardHtml(m); });
      h += '\n</div>\n';
      return h;
    }

    function genProjects() {
      var h = '\n      <div class="intro-block">' + S.introHtml + '</div>\n';
      var inEra = false;
      S.items.forEach(function (it) {
        if (it._group) {
          if (inEra) { h += '      </div>\n\n'; inEra = false; }
          var idAttr = it.eraId ? ' id="' + escA(it.eraId) + '"' : '';
          h += '\n      <div class="timeline-era"' + idAttr + '>\n';
          h += '        <p class="era-label">' + esc(it.eraLabel) + '</p>\n\n';
          inEra = true;
          return;
        }
        var indent = inEra ? '        ' : '      ';
        var indent2 = inEra ? '          ' : '        ';
        var indent3 = inEra ? '            ' : '          ';
        var prjId = slugifyStr(((it.year || '') + '-' + (it.title ? it.title.replace(/<[^>]+>/g, '') : '')).substring(0, 50));
        h += indent + '<div class="project-item" id="' + escA(prjId) + '">\n';
        h += indent2 + '<div class="project-year"><span class="year-text">' + esc(it.year) + '</span></div>\n';
        h += indent2 + '<div class="project-card' + (it.isCurrent ? ' current' : '') + '">\n';
        if (it.isCurrent) h += indent3 + '<span class="project-badge">Vigente</span>\n';
        h += indent3 + '<span class="year-text-mobile">' + esc(it.year) + '</span>\n';
        h += indent3 + '<p class="project-title">' + it.title + '</p>\n';
        h += indent3 + '<div class="project-meta">\n';
        if (it.ipValue) h += indent3 + '  <span class="project-meta-item"><span class="label">' + esc(it.ipLabel || 'IP') + '</span><span class="value">' + esc(it.ipValue) + '</span></span>\n';
        var metaLabels = ['Ref.', 'Financiación', 'Presupuesto'];
        metaLabels.forEach(function (label) {
          var val = it.metas[label] || '';
          if (val) h += indent3 + '  <span class="project-meta-item"><span class="label">' + label + '</span><span class="value">' + esc(val) + '</span></span>\n';
        });
        h += indent3 + '</div>\n';
        if (it.desc) h += indent3 + '<div class="project-desc">' + it.desc + '</div>\n';
        h += indent2 + '</div>\n';
        h += indent + '</div>\n';
      });
      if (inEra) h += '      </div>\n';
      return h;
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // SAVE / PREVIEW
    // ══════════════════════════════════════════════════════════════════════════════
    function slugifyStr(str) {
      return (str || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    async function postSearchSection(prefix, entries) {
      try {
        await fetch('/api/search-data-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefix: prefix, entries: entries }),
        });
      } catch (e) { /* silent */ }
    }

    async function updateCongressesSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        if (it._group || (!it.edition && !it.name)) return;
        var namePlain = it.name ? it.name.replace(/<[^>]+>/g, '') : '';
        var editionPlain = it.edition ? it.edition.replace(/<[^>]+>/g, '') : '';
        var conParts = [editionPlain, namePlain, it.year, it.dates, it.location, it.modalTitle,
          it.modalDescription ? it.modalDescription.replace(/<[^>]+>/g, '') : ''];
        var s = slugifyStr((editionPlain + '-' + (namePlain || '')).substring(0, 60));
        entries.push({
          url: 'eventos/congresos.html#' + s,
          title: (editionPlain ? editionPlain + ': ' : '') + namePlain,
          description: [it.dates, it.location].filter(Boolean).join(', '),
          content: conParts.filter(Boolean).join(' ')
        });
      });
      await postSearchSection('eventos/congresos.html', entries);
    }

    async function updateSeminarsSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        if (it._group || !it.name) return;
        var themePlain = it.theme ? it.theme.replace(/<[^>]+>/g, '') : '';
        var semParts = [it.year, it.name, it.dates, themePlain];
        (it.fields || []).forEach(function (f) { if (f.value) semParts.push(f.value); });
        var s = slugifyStr(((it.year || '') + '-' + (it.name || '').substring(0, 40)));
        entries.push({
          url: 'eventos/seminarios.html#' + s,
          title: it.name + (it.year ? ' (' + it.year + ')' : ''),
          description: it.dates || it.year || '',
          content: semParts.filter(Boolean).join(' ')
        });
      });
      await postSearchSection('eventos/seminarios.html', entries);
    }

    async function updateThesesSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        if (!it.year && !it.title) return;
        var titlePlain = it.title ? it.title.replace(/<[^>]+>/g, '') : '';
        var metaPlain = it.meta ? it.meta.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
        var author = metaPlain.split('Director')[0].trim().replace(/[,\s]+$/, '');
        var s = slugifyStr(((it.year || '') + '-' + (titlePlain || '')).substring(0, 50));
        entries.push({
          url: 'formacion/tesis.html#' + s,
          title: titlePlain ? titlePlain + ' (' + it.year + ')' : 'Tesis ' + it.year,
          description: (it.year || '') + (author ? '. ' + author : ''),
          content: [it.year, titlePlain, metaPlain].filter(Boolean).join(' ')
        });
      });
      await postSearchSection('formacion/tesis.html', entries);
    }

    async function postSearchData(url, content, opts) {
      try {
        await fetch('/api/search-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ url: url, content: content }, opts || {})),
        });
      } catch (e) { /* silent */ }
    }

    async function updateMultimediaSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        var titlePlain = it.title ? it.title.replace(/<[^>]+>/g, '') : '';
        if (!titlePlain) return;
        var s = slugifyStr(titlePlain.substring(0, 50));
        entries.push({
          url: 'multimedia/multimedia.html#' + s,
          title: titlePlain,
          description: (it.source || '') + (it.date ? ', ' + it.date : ''),
          content: [titlePlain, it.date, it.source, it.desc ? it.desc.replace(/<[^>]+>/g, '') : ''].filter(Boolean).join(' ')
        });
      });
      await postSearchSection('multimedia/multimedia.html', entries);
    }

    async function updateMembersSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        if (!it.name) return;
        var bio = it.bio ? it.bio.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
        var s = slugifyStr(it.name);
        var uniPlain = it.uni ? it.uni.replace(/<[^>]+>/g, '') : '';
        entries.push({
          url: 'el-grupo/miembros.html#' + s,
          title: it.name,
          description: (it.role || '') + (uniPlain ? ' — ' + uniPlain : ''),
          content: [it.name, it.role, uniPlain, bio].filter(Boolean).join(' ')
        });
      });
      await postSearchSection('el-grupo/miembros.html', entries);
    }

    async function updateProjectsSearchData() {
      var entries = [];
      S.items.forEach(function (it) {
        if (it._group || !it.title) return;
        var titlePlain = it.title ? it.title.replace(/<[^>]+>/g, '') : '';
        var prjParts = [it.year, titlePlain];
        var m = it.metas || {};
        Object.keys(m).forEach(function (k) { if (m[k]) prjParts.push(m[k]); });
        if (it.desc) prjParts.push(it.desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        var s = slugifyStr(((it.year || '') + '-' + titlePlain.substring(0, 50)));
        var ipVal = m['IP'] || m['IPs'] || '';
        entries.push({
          url: 'el-grupo/historial-proyectos.html#' + s,
          title: titlePlain + (it.year ? ' (' + it.year + ')' : ''),
          description: (it.year || '') + (ipVal ? '. IP: ' + ipVal : ''),
          content: prjParts.filter(Boolean).join(' ')
        });
      });
      await postSearchSection('el-grupo/historial-proyectos.html', entries);
    }

    async function updatePartesSearchData() {
      var entries = [];
      (S.partesData || []).forEach(function (p) {
        if (!p.roman) return;
        var stripHtml = function (s) { return (s || '').replace(/<[^>]+>/g, ''); };
        var allPlays = (p.volumes || []).reduce(function (acc, v) {
          return acc.concat((v.plays || []).filter(function (pl) { return !pl.history; }).map(function (pl) { return stripHtml(pl.title); }));
        }, []);
        var allEditors = (p.volumes || []).reduce(function (acc, v) {
          return acc.concat((v.plays || []).map(function (pl) { return stripHtml(pl.editors); }).filter(Boolean));
        }, []).join(', ');
        var isbns = (p.volumes || []).map(function (v) { return v.isbn || ''; }).filter(Boolean).join(' ');
        var s = 'parte-' + p.num;
        var pContent = ['Parte ' + p.roman, p.year, p.coord || '', p.editorial, p.city]
          .concat(allPlays).concat([allEditors, isbns]).filter(Boolean).join(' ');
        var desc = (p.editorial || '') + ', ' + (p.city || '') + ', ' + (p.year || '') + (p.coord ? '. Coord. ' + p.coord : '');
        entries.push({
          url: 'publicaciones/partes-comedias.html#' + s,
          title: 'Comedias de Lope de Vega. Parte ' + p.roman + ' (' + p.year + ')',
          description: desc,
          content: pContent
        });
      });
      await postSearchSection('publicaciones/partes-comedias.html', entries);
    }

    async function updateGenericSearchData() {
      // For article pages: one entry per page
      if (S.pageType === 'article' || S.pageType === 'news' || S.pageType === 'contact') {
        var html = generateHtml();
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.querySelector('.article-main, .article-body, .page-content, .page-content-full, main');
        if (main) { main.querySelectorAll('script, style').forEach(function (el) { el.remove(); }); }
        var content = main ? main.textContent.replace(/\s+/g, ' ').trim() : '';
        var titleEl = doc.querySelector('title');
        var titleText = titleEl ? titleEl.textContent.trim() : (S.pageTitle || '');
        var descEl = doc.querySelector('meta[name="description"]');
        var descText = descEl ? descEl.getAttribute('content') || '' : '';
        await postSearchData(S.currentPath, content, { title: titleText, description: descText, upsert: true });
        return;
      }
      // For otras-publicaciones and similar: replace all entries for this page using section approach
      var html = generateHtml();
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var libroEls = doc.querySelectorAll('[data-lb]');
      var entries = [];
      libroEls.forEach(function (el) {
        try {
          var d = JSON.parse(el.getAttribute('data-lb'));
          if (!d.title) return;
          var titleClean = d.title.replace(/<[^>]+>/g, '');
          var parts = [d.author, d.editor, d.year, d.editorial, d.city, d.collection, d.isbn];
          (d.extraFields || []).forEach(function (f) { if (f.value) parts.push(f.value); });
          entries.push({
            url: S.currentPath + '#' + slugifyStr(titleClean),
            title: titleClean,
            description: [d.author, d.year].filter(Boolean).join(', '),
            content: parts.filter(Boolean).join(' ')
          });
        } catch (e) { }
      });
      await postSearchSection(S.currentPath, entries);
    }

    async function savePage() {
      if (S.pageType === 'news') { await saveNewsPage(); return; }
      await flushPendingUploads();
      takeSnapshot();
      var html = generateHtml();
      var btn = document.getElementById('btnSave');
      btn.innerHTML = '<span class="saving-spinner"></span>Guardando…';
      btn.disabled = true;

      var savedOk = false;
      try {
        var r = await fetch('/api/page?path=' + encodeURIComponent(S.currentPath), {
          method: 'POST',
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
          body: html,
        });
        var data = await r.json();
        if (data.ok) {
          savedOk = true;
          toast('Cambios guardados correctamente', 'ok');
          S.originalHtml = html;
          if (S.pageType === 'theses') await updateThesesSearchData();
          if (S.pageType === 'congresses') await updateCongressesSearchData();
          if (S.pageType === 'seminars') await updateSeminarsSearchData();
          if (S.pageType === 'multimedia') await updateMultimediaSearchData();
          if (S.pageType === 'members') await updateMembersSearchData();
          if (S.pageType === 'projects') await updateProjectsSearchData();
          if (S.pageType === 'partes') await updatePartesSearchData();
          if (S.pageType === 'news' || S.pageType === 'article' || S.pageType === 'libros' || S.pageType === 'contact') await updateGenericSearchData();
        } else {
          toast('Error al guardar: ' + (data.error || 'desconocido'), 'err');
        }
      } catch (e) {
        toast('Error de conexión al guardar', 'err');
      }
      btn.innerHTML = savedOk ? '✓ Guardado' : '💾 Guardar cambios';
      btn.disabled = false;
      if (savedOk) {
        markClean();
        setTimeout(function () { btn.innerHTML = '💾 Guardar cambios'; }, 2000);
      }
    }

    function previewPage() {
      var html;
      if (S.pageType === 'news') {
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
        var imgPath = imgRaw ? '../media/' + imgRaw.replace(/^(\.\.\/)?media\//, '') : '';
        var imagenAlt = document.getElementById('nc-img-alt').value.trim();
        var excerpt = document.getElementById('nc-excerpt').value.trim();
        var contentBlocks = ncGetBlocks();
        var links = ncGetLinks('nc-links');
        var evTitulo = (document.getElementById('nc-ev-titulo') || {}).value || '';
        var evSubtitulo = (document.getElementById('nc-ev-subtitulo') || {}).value || '';
        var evFechas = (document.getElementById('nc-ev-fechas') || {}).value || '';
        var evLugar = (document.getElementById('nc-ev-lugar') || {}).value || '';
        var evLinks = ncGetLinks('nc-ev-links');
        html = ncGenerateHtml({ tipo, cat, titulo, tituloPlain, slug, fechaLarga, fechaCorta, breadcrumb, tituloSeo, imgPath, imagenAlt, excerpt, contentBlocks, links, evTitulo: evTitulo.trim(), evSubtitulo: evSubtitulo.trim(), evFechas: evFechas.trim(), evLugar: evLugar.trim(), evLinks, filename: S.currentPath.split('/').pop() });
      } else {
        html = generateHtml();
      }
      // Inject <base> so relative paths (CSS, JS, images) resolve correctly from the blob URL
      var base = '<base href="' + location.origin + '/">';
      html = html.replace(/(<head[^>]*>)/i, '$1\n  ' + base);
      var blob = new Blob([html], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
    }

