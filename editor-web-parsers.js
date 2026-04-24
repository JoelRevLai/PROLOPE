    // ── PARSE FILE ───────────────────────────────────────────────────────────────
    function parseFile(html, path) {
      blockId = 0;
      S.blocks = []; S.items = []; S.introHtml = ''; S.htmlBlocks = []; S.afterGridHtml = '';
      S.hasSidebar = false; S.sidebarCards = [];
      S.wrapperOpen = ''; S.wrapperClose = '';
      S.innerWrapperClass = '';
      S.mainTag = ''; S.mainAttrs = '';
      S.heroData = null; S.heroOriginalHtml = '';

      S.pageType = detectType(path);

      // Split header / content / footer
      splitHtml(html);

      // Page title
      var m = S.headerPart.match(/<title>([\s\S]*?)<\/title>/i);
      S.pageTitle = m ? m[1].trim() : '';

      // Parse content zone into DOM
      var doc = new DOMParser().parseFromString('<div id="__cz__">' + S.contentZone + '</div>', 'text/html');
      var cz = doc.getElementById('__cz__');

      // Hero
      var heroEl = cz.querySelector('.page-hero, .article-hero, .idx-hero');
      if (heroEl) {
        S.heroOriginalHtml = heroEl.outerHTML;
        S.heroData = extractHero(heroEl);
      }

      // Find main content + sidebar + wrapper
      var mainEl = cz.querySelector('.article-main') || cz.querySelector('.article-body') || cz.querySelector('.page-content') || cz.querySelector('.page-content-full');
      var sidebarEl = cz.querySelector('.article-sidebar') || cz.querySelector('aside');
      if (sidebarEl) { S.hasSidebar = true; parseSidebarCards(sidebarEl); }

      var _mainContainer = null;
      if (mainEl) {
        var wr = mainEl.parentElement;
        if (wr && wr.id !== '__cz__') { S.wrapperOpen = openTag(wr); S.wrapperClose = '</' + wr.tagName.toLowerCase() + '>'; _mainContainer = wr; }
        else { _mainContainer = mainEl; }
        S.mainTag = mainEl.tagName.toLowerCase(); S.mainAttrs = getAttrs(mainEl);
        parseMain(mainEl);
      } else {
        var gm = cz.querySelector('main');
        if (gm) {
          S.mainTag = 'main'; S.mainAttrs = getAttrs(gm);
          var wr = gm.parentElement;
          if (wr && wr.id !== '__cz__') { S.wrapperOpen = openTag(wr); S.wrapperClose = '</' + wr.tagName.toLowerCase() + '>'; _mainContainer = wr; }
          else { _mainContainer = gm; }
          parseMain(gm);
        }
      }
      // Capture any content after the main container (e.g. modal overlays)
      if (_mainContainer) {
        var _afterHtml = '';
        var _sib = _mainContainer.nextSibling;
        while (_sib) {
          if (_sib.outerHTML !== undefined) _afterHtml += _sib.outerHTML;
          else if (_sib.nodeType === 3 && _sib.textContent.trim()) _afterHtml += _sib.textContent;
          _sib = _sib.nextSibling;
        }
        S.afterGridHtml = _afterHtml.trim();
      }
      // Parse shared HTML blocks (for specialized page types)
      S.htmlBlocks = [];
      var _hbMarker = '\x3C!--html-blocks:';
      var _hbEnd = '--\x3E';
      var _hbStart = html.indexOf(_hbMarker);
      if (_hbStart !== -1) {
        var _hbClose = html.indexOf(_hbEnd, _hbStart);
        if (_hbClose !== -1) {
          try { S.htmlBlocks = JSON.parse(html.slice(_hbStart + _hbMarker.length, _hbClose)); } catch (e) { }
        }
      }
      // After afterGridHtml is set, enrich congress items with modal data
      if (S.pageType === 'congresses') enrichCongressItems();
    }

    function splitHtml(html) {
      var hi = html.indexOf('</header>');
      if (hi === -1) { S.headerPart = ''; S.contentZone = html; S.footerPart = ''; return; }
      hi += 9;
      var fi = -1;
      ['<!-- FUNDERS -->' ,'<section class="funders">' ,'<!-- FOOTER -->' ,'<footer>'].forEach(function(mk){
        var idx = html.indexOf(mk, hi);
        if (idx !== -1 && (fi === -1 || idx < fi)) fi = idx;
      });
      S.headerPart = html.substring(0, hi);
      S.contentZone = fi !== -1 ? html.substring(hi, fi) : html.substring(hi);
      S.footerPart = fi !== -1 ? html.substring(fi) : '';
    }

    function extractHero(el) {
      var h1 = el.querySelector('h1');
      var bc = el.querySelector('.breadcrumb, .article-breadcrumb, .page-hero-breadcrumb');
      var bgEl = el.querySelector('.page-hero-bg, .article-hero-bg');
      var bgImage = '';
      if (bgEl) {
        var bgStyle = bgEl.style.backgroundImage || bgEl.getAttribute('style') || '';
        var mBg = bgStyle.match(/url\(['"]?(.*?)['"]?\)/);
        if (mBg) bgImage = mBg[1];
      }
      var d = {
        title: h1 ? h1.innerHTML.trim() : '',
        breadcrumbLast: '',
        catBadge: (el.querySelector('.article-cat-badge') || {}).textContent || '',
        date: (el.querySelector('.article-date') || {}).textContent || '',
        subtitle: (el.querySelector('.idx-hero-sub') || {}).textContent || '',
        type: el.classList.contains('article-hero') ? 'article' : el.classList.contains('idx-hero') ? 'index' : 'page',
        bgImage: bgImage,
      };
      if (bc) {
        var nodes = bc.childNodes;
        for (var i = nodes.length - 1; i >= 0; i--) {
          if (nodes[i].nodeType === 3 && nodes[i].textContent.trim()) { d.breadcrumbLast = nodes[i].textContent.trim(); break; }
        }
      }
      return d;
    }

    function parseMain(mainEl) {
      var type = S.pageType;

      // Specialized parsing
      if (type === 'theses') return parseTheses(mainEl);
      if (type === 'congresses') return parseCongresses(mainEl);
      if (type === 'seminars') return parseSeminars(mainEl);
      if (type === 'multimedia') return parseMultimedia(mainEl);
      if (type === 'members') return parseMembers(mainEl);
      if (type === 'projects') return parseProjects(mainEl);
      if (type === 'news') return parseNews(mainEl);
      if (type === 'partes') return parsePartes(mainEl);

      // Generic: parse into blocks
      // Expand clearfix wrapper divs (inline figure + surrounding text) into individual blocks
      Array.from(mainEl.children).forEach(function (el) {
        var tag = el.tagName ? el.tagName.toLowerCase() : '';
        var cls = el.className || '';
        if (tag === 'div' && /\bclearfix\b/.test(cls) && !cls.includes('article-imagegrid') && el.querySelector('.inline-figure, .inline-figure-left')) {
          Array.from(el.children).forEach(function (child) { S.blocks.push(makeBlock(child)); });
        } else if (tag === 'div' && cls.includes('libros-dd-grid')) {
          Array.from(el.children).forEach(function (child) { S.blocks.push(makeBlock(child)); });
        } else if (tag === 'div' && cls.includes('content-section')) {
          S.innerWrapperClass = el.className;
          Array.from(el.children).forEach(function (child) { S.blocks.push(makeBlock(child)); });
        } else {
          S.blocks.push(makeBlock(el));
        }
      });
    }

    function parsePartes(mainEl) {
      var introEl = mainEl.querySelector('.intro-text');
      S.introHtml = introEl ? introEl.innerHTML : '';
      var searchWrap = mainEl.querySelector('.search-bar-wrap');
      S.partesSearchHtml = searchWrap ? searchWrap.outerHTML : '';
      var noResultsEl = mainEl.querySelector('.no-results');
      S.partesNoResultsHtml = noResultsEl ? noResultsEl.outerHTML : '';
      S.partesData = [];
      // Find the full PARTES array using bracket counting
      var startTag = S.footerPart.indexOf('const PARTES =');
      if (startTag === -1) startTag = S.footerPart.search(/const\s+PARTES\s*=/);
      if (startTag !== -1) {
        var arrStart = S.footerPart.indexOf('[', startTag);
        if (arrStart !== -1) {
          var depth = 0, i = arrStart, partesStr = '';
          while (i < S.footerPart.length) {
            var ch = S.footerPart[i];
            if (ch === '[') depth++;
            else if (ch === ']') { depth--; if (depth === 0) { partesStr = S.footerPart.slice(arrStart, i + 1); break; } }
            i++;
          }
          if (partesStr) {
            try { S.partesData = (new Function('return ' + partesStr))(); } catch (e) { console.error('Error parsing PARTES', e); }
          }
        }
      }
    }

    function parseNews(mainEl) {
      var f = {};
      // Slug from filename
      f.slug = S.currentPath.split('/').pop().replace(/^noticia-/, '').replace(/\.html$/, '');
      // Hero data already parsed into S.heroData
      f.titulo = S.heroData ? S.heroData.title : '';
      f.tituloPlain = f.titulo.replace(/<[^>]+>/g, '');
      f.cat = S.heroData ? S.heroData.catBadge : '';
      f.fechaLarga = S.heroData ? S.heroData.date : '';
      f.breadcrumb = S.heroData ? S.heroData.breadcrumbLast : '';
      f.tituloSeo = S.pageTitle.replace(/\s*\|\s*PROLOPE\s*$/, '').trim();
      // Tipo: check for event-box
      f.tipo = mainEl.querySelector('.event-box') ? 'evento' : 'suceso';
      // Image
      var figImg = mainEl.querySelector('.article-figure img, .article-figure-img-wrap img');
      var evImg = mainEl.querySelector('.event-box-img-wrap img');
      var imgEl = figImg || evImg;
      f.imgPath = imgEl ? imgEl.getAttribute('src') : '';
      f.imagenAlt = imgEl ? (imgEl.getAttribute('alt') || '') : '';
      // Evento fields
      f.evTitulo = '';
      f.evSubtitulo = '';
      f.evFechas = '';
      f.evLugar = '';
      f.evLinks = [];
      if (f.tipo === 'evento') {
        var evTitleEl = mainEl.querySelector('.event-box-title');
        if (evTitleEl) {
          var em = evTitleEl.querySelector('em');
          if (em) { f.evSubtitulo = em.textContent.trim(); em.remove(); }
          f.evTitulo = evTitleEl.textContent.trim();
        }
        var metaLis = mainEl.querySelectorAll('.event-box-meta li');
        if (metaLis[0]) f.evFechas = metaLis[0].textContent.trim();
        if (metaLis[1]) f.evLugar = metaLis[1].textContent.trim();
        mainEl.querySelectorAll('.event-box-links a').forEach(function (a) {
          f.evLinks.push({ label: a.textContent.trim(), url: a.getAttribute('href') || '' });
        });
      }
      // Content blocks
      f.contentBlocks = [];
      Array.from(mainEl.children).forEach(function (el) {
        var tag = el.tagName ? el.tagName.toLowerCase() : '';
        var cls = el.className || '';
        if (tag === 'p' && cls.indexOf('article-lead-subtitle') !== -1) {
          f.contentBlocks.push({ type: 'subtitulo', text: el.innerHTML });
        } else if (tag === 'h2' && cls.indexOf('article-lead-title') !== -1) {
          f.contentBlocks.push({ type: 'titulo', text: el.innerHTML });
        } else if (tag === 'p' && !cls.includes('back-link')) {
          f.contentBlocks.push({ type: 'parrafo', text: el.innerHTML });
        } else if (tag === 'figure' && (cls.includes('inline-figure') || cls.includes('inline-figure-left'))) {
          var img = el.querySelector('img');
          var figcap = el.querySelector('figcaption');
          var figElStyle = el.getAttribute('style') || '';
          var figElSize = 'medium';
          if (figElStyle.indexOf('float:none') !== -1 || figElStyle.indexOf('float: none') !== -1) figElSize = 'full';
          else if (figElStyle.indexOf('width:380') !== -1 || figElStyle.indexOf('width: 380') !== -1) figElSize = 'large';
          else if (figElStyle.indexOf('width:150') !== -1 || figElStyle.indexOf('width: 150') !== -1) figElSize = 'small';
          f.contentBlocks.push({
            type: 'figura',
            src: img ? (img.getAttribute('src') || '') : '',
            alt: img ? (img.getAttribute('alt') || '') : '',
            caption: figcap ? figcap.innerHTML : '',
            position: (figElStyle.indexOf('margin-left:auto') !== -1 || figElStyle.indexOf('margin-left: auto') !== -1) ? 'center' : cls.includes('inline-figure-left') ? 'left' : 'right',
            size: figElSize
          });
        } else if (tag === 'div' && cls.includes('pull-quote')) {
          f.contentBlocks.push({ type: 'cita', text: el.innerHTML });
        } else if (tag === 'div' && cls.includes('article-links') && el.dataset.block === 'enlaces') {
          var links = [];
          el.querySelectorAll('a').forEach(function (a) { links.push({ label: a.textContent.trim(), url: a.getAttribute('href') || '' }); });
          if (links.length) f.contentBlocks.push({ type: 'enlaces', links: links });
        } else if (tag === 'div' && cls.includes('book-highlight')) {
          var p = el.querySelector('p');
          var a = el.querySelector('a.btn-consultar');
          f.contentBlocks.push({
            type: 'recuadro',
            text: p ? p.innerHTML : '',
            btnLabel: a ? a.textContent.trim() : '',
            btnUrl: a ? (a.getAttribute('href') || '') : ''
          });
        } else if (tag === 'ul' && cls.includes('biblio-list')) {
          var items = [];
          el.querySelectorAll('li').forEach(function (li) {
            var note = li.querySelector('.biblio-note');
            var noteHtml = note ? note.innerHTML : '';
            if (note) note.remove();
            items.push({ main: li.innerHTML.trim(), note: noteHtml });
            if (note) li.appendChild(note);
          });
          if (items.length) f.contentBlocks.push({ type: 'lista', items: items });
        } else if (tag === 'div' && cls.includes('article-imagegrid')) {
          var cols = 2;
          var gridStyle = el.style.gridTemplateColumns || '';
          var colMatch = gridStyle.match(/1fr/g);
          if (colMatch) cols = colMatch.length;
          var imgs = [];
          el.querySelectorAll('img').forEach(function (img) {
            imgs.push({ src: img.getAttribute('src') || '', alt: img.getAttribute('alt') || '' });
          });
          var igStyle = el.getAttribute('style') || '';
          var igSize = 'medium';
          if (igStyle.indexOf('max-width:400') !== -1 || igStyle.indexOf('max-width: 400') !== -1) igSize = 'small';
          else if (igStyle.indexOf('max-width:700') !== -1 || igStyle.indexOf('max-width: 700') !== -1) igSize = 'large';
          f.contentBlocks.push({ type: 'imagegrid', cols: cols, size: igSize, imgs: imgs });
        } else if (tag && !cls.includes('back-link')) {
          f.contentBlocks.push({ type: 'html-directo', html: el.outerHTML });
        }
      });
      // External links (only divs without data-block="enlaces" which are inline content blocks)
      f.links = [];
      mainEl.querySelectorAll('.article-links:not([data-block=enlaces]) a').forEach(function (a) {
        f.links.push({ label: a.textContent.trim(), url: a.getAttribute('href') || '' });
      });
      // Excerpt from newsEntry (loaded later)
      f.excerpt = '';
      f.searchDesc = '';
      S.newsFormData = f;
    }

    function makeBlock(el) {
      var id = blockId++, tag = el.tagName ? el.tagName.toLowerCase() : '', cls = el.className || '';
      if (tag === 'h2' || tag === 'h3') return { id: id, type: 'heading', tag: tag, html: el.innerHTML, cls: cls };
      if (tag === 'p' && cls.indexOf('article-lead') !== -1 && cls.indexOf('article-lead-subtitle') === -1) return { id: id, type: 'lead', html: el.innerHTML };
      if (tag === 'p') return { id: id, type: 'paragraph', html: el.innerHTML, cls: cls };
      if (tag === 'figure' || cls.indexOf('inline-figure') !== -1) {
        var img = el.querySelector('img'), cap = el.querySelector('figcaption');
        var figStyle = el.getAttribute('style') || '';
        var figSize = 'medium';
        if (figStyle.indexOf('float:none') !== -1 || figStyle.indexOf('float: none') !== -1) figSize = 'full';
        else if (figStyle.indexOf('width:380') !== -1 || figStyle.indexOf('width: 380') !== -1) figSize = 'large';
        else if (figStyle.indexOf('width:150') !== -1 || figStyle.indexOf('width: 150') !== -1) figSize = 'small';
        var figPos = (figStyle.indexOf('margin-left:auto') !== -1 || figStyle.indexOf('margin-left: auto') !== -1) ? 'center' : (cls.indexOf('-left') !== -1 ? 'left' : 'right');
        return { id: id, type: 'figure', src: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '', caption: cap ? cap.innerHTML : '', cls: cls, position: figPos, size: figSize };
      }
      if (cls.indexOf('pull-quote') !== -1) return { id: id, type: 'pullquote', html: el.innerHTML };
      if (cls.indexOf('article-links') !== -1) {
        var links = []; el.querySelectorAll('a').forEach(function (a) { links.push({ label: a.textContent.trim(), url: a.getAttribute('href') || '' }); });
        return { id: id, type: 'links', links: links };
      }
      if (tag === 'div' && (cls.includes('article-imagegrid') || (el.style && el.style.gridTemplateColumns)) && el.querySelector('.inline-figure')) {
        var imgs = [];
        el.querySelectorAll('.inline-figure').forEach(function (fig) {
          var img = fig.querySelector('img');
          imgs.push({ src: img ? img.getAttribute('src') : '', alt: img ? (img.getAttribute('alt') || '') : '' });
        });
        var gtcStyle = el.style.gridTemplateColumns || '';
        var colsCount = gtcStyle ? gtcStyle.trim().split(/\s+/).length : 2;
        var igElStyle = el.getAttribute('style') || '';
        var igElSize = 'medium';
        if (igElStyle.indexOf('max-width:400') !== -1 || igElStyle.indexOf('max-width: 400') !== -1) igElSize = 'small';
        else if (igElStyle.indexOf('max-width:700') !== -1 || igElStyle.indexOf('max-width: 700') !== -1) igElSize = 'large';
        return { id: id, type: 'imagegrid', cols: colsCount, size: igElSize, imgs: imgs };
      }
      if (cls.indexOf('book-highlight') !== -1) {
        var bpEl = el.querySelector('p'), baEl = el.querySelector('a.btn-consultar,a[href]');
        return { id: id, type: 'highlight', html: bpEl ? bpEl.innerHTML : '', btnLabel: baEl ? baEl.textContent.trim() : '', btnUrl: baEl ? baEl.getAttribute('href') || '' : '' };
      }
      if (cls.indexOf('libro-block') !== -1) {
        var lbData = {};
        if (el.dataset && el.dataset.lb) { try { lbData = JSON.parse(el.dataset.lb); } catch (e) { } }
        return { id: id, type: 'libro', title: lbData.title || '', author: lbData.author || '', editor: lbData.editor || '', year: lbData.year || '', editorial: lbData.editorial || '', city: lbData.city || '', collection: lbData.collection || '', isbn: lbData.isbn || '', buyUrl: lbData.buyUrl || '', image: lbData.image || '', displayMode: lbData.displayMode || 'modal', extraFields: lbData.extraFields || [] };
      }
      if (tag === 'ul') {
        var items = [];
        el.querySelectorAll('li').forEach(function (li) {
          var liClone = li.cloneNode(true);
          var noteEl = liClone.querySelector('span.biblio-note');
          var noteHtml = '';
          if (noteEl) { noteHtml = noteEl.innerHTML; noteEl.parentNode.removeChild(noteEl); }
          items.push({ main: liClone.innerHTML.trim(), note: noteHtml });
        });
        return { id: id, type: 'list', cls: cls, items: items };
      }
      if (tag === 'script') {
        if (el.id === 'libroModalScript') return { id: id, type: '_skip', html: '' };
        return { id: id, type: '_skip', html: el.outerHTML };
      }
      return { id: id, type: '_preserve', html: el.outerHTML };
    }

    // ── SPECIALIZED PARSERS ──────────────────────────────────────────────────────
    function parseTheses(main) {
      var lead = main.querySelector('.article-lead');
      S.introHtml = lead ? lead.innerHTML : '';
      main.querySelectorAll('.thesis-item').forEach(function (el) {
        S.items.push({
          id: blockId++,
          year: txt(el, '.thesis-year'),
          title: (el.querySelector('.thesis-title') || {}).innerHTML || '',
          meta: (el.querySelector('.thesis-meta') || {}).innerHTML || '',
          link: el.querySelector('.thesis-link') ? el.querySelector('.thesis-link').getAttribute('href') : '',
          linkText: txt(el, '.thesis-link'),
          pending: !!el.querySelector('.thesis-pending'),
        });
      });
    }

    function parseCongresses(main) {
      var intro = main.querySelector('.intro-text');
      S.introHtml = intro ? intro.innerHTML : '';
      Array.from(main.children).forEach(function (child) {
        if (!child.classList) return;
        if (child.classList.contains('intro-text')) return;
        if (child.classList.contains('series-header')) {
          S.items.push({
            _group: true,
            id: blockId++,
            title: txt(child, '.series-title'),
            count: txt(child, '.series-count'),
          });
        } else if (child.classList.contains('congress-grid')) {
          child.querySelectorAll('.congress-card').forEach(function (el) {
            var img = el.querySelector('img');
            var metaEl = el.querySelector('.congress-meta-small');
            var metaHtml = metaEl ? metaEl.innerHTML : '';
            var dates = '', location = '';
            if (metaHtml) {
              var parts = metaHtml.split(/<br\s*\/?>/i);
              dates = parts[0] ? parts[0].replace(/<[^>]+>/g, '').trim() : '';
              location = parts[1] ? parts[1].replace(/<[^>]+>/g, '').trim() : '';
            }
            S.items.push({
              id: blockId++,
              image: img ? img.getAttribute('src') : '',
              imageAlt: img ? img.getAttribute('alt') : '',
              year: txt(el, '.congress-year-badge'),
              edition: txt(el, '.congress-edition'),
              name: (el.querySelector('.congress-name') || {}).innerHTML || '',
              dates: dates,
              location: location,
              onclick: el.getAttribute('onclick') || '',
            });
          });
        }
      });
    }

    function findCongressesObjectBounds(src) {
      // Matches "const congresses = {" or "var congresses = {"
      var m = src.match(/(?:const|var|let)\s+congresses\s*=/);
      if (!m) return null;
      var start = m.index;
      var braceStart = src.indexOf('{', start + m[0].length);
      if (braceStart === -1) return null;
      var depth = 0, i = braceStart, len = src.length;
      for (; i < len; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') { depth--; if (depth === 0) break; }
      }
      return { start: start, end: i + 1, objStr: src.substring(braceStart, i + 1) };
    }

    function extractCongressesData() {
      var src = S.footerPart || '';
      var bounds = findCongressesObjectBounds(src);
      if (!bounds) return {};
      try { return new Function('return ' + bounds.objStr)(); } catch (e) { return {}; }
    }

    function enrichCongressItems() {
      // Extract modal ID from onclick attribute
      S.items.forEach(function (it) {
        if (it._group) return;
        var m = (it.onclick || '').match(/openModal\(['"]([^'"]+)['"]\)/);
        it.modalId = m ? m[1] : '';
      });
      // Load modal detail data from the congresses JS object in S.footerPart
      var cData = extractCongressesData();
      S.items.forEach(function (it) {
        if (it._group) return;
        var d = it.modalId ? (cData[it.modalId] || {}) : {};
        it.modalTitle = d.title !== undefined ? d.title : '';
        it.modalDescription = d.description !== undefined ? d.description : '';
        it.modalLinks = (d.links || []).map(function (l) { return { label: l.label || '', url: l.url || '' }; });
      });
    }

    function parseSeminars(main) {
      var intro = main.querySelector('.intro-text');
      S.introHtml = intro ? intro.innerHTML : '';
      S.items = [];
      Array.from(main.children).forEach(function (child) {
        if (!child.classList) return;
        if (child.classList.contains('intro-text')) return;
        if (child.classList.contains('series-header')) {
          S.items.push({
            _group: true,
            id: blockId++,
            title: txt(child, '.series-title'),
            count: txt(child, '.series-count'),
          });
        } else if (child.classList.contains('seminar-list')) {
          child.querySelectorAll('.seminar-item').forEach(function (el) {
            var panel = el.querySelector('.seminar-panel');
            var fields = [];
            if (panel) {
              panel.querySelectorAll('.seminar-field').forEach(function (f) {
                var label = txt(f, '.seminar-field-label');
                var value = txt(f, '.seminar-field-value');
                fields.push({ label: label, value: value });
              });
            }
            var pdfBtn = el.querySelector('.seminar-pdf-btn');
            var posterBtn = el.querySelector('.seminar-poster-btn');
            S.items.push({
              id: blockId++,
              year: txt(el, '.seminar-year'),
              name: txt(el, '.seminar-name'),
              theme: txt(el, '.seminar-theme'),
              dates: txt(el, '.seminar-dates-inline'),
              fields: fields,
              pdfUrl: pdfBtn ? pdfBtn.getAttribute('href') : '',
              pdfText: pdfBtn ? pdfBtn.textContent.trim() : '',
              posterUrl: posterBtn ? posterBtn.getAttribute('href') : '',
              posterText: posterBtn ? posterBtn.textContent.trim() : '',
            });
          });
        }
      });
    }

    function parseMultimedia(main) {
      var intro = main.querySelector('.intro-text');
      S.introHtml = intro ? intro.innerHTML : '';

      // Parse local videos src from the footer script block (const videos = {...})
      // Match each entry individually: id: { ... src: "..." ... }
      var localVideosMap = {};
      var entryRe = /['"]?([\w-]+)['"]?\s*:\s*\{[^{}]*src\s*:\s*['"]([^'"]+)['"][^{}]*\}/g, em;
      while ((em = entryRe.exec(S.footerPart)) !== null) {
        localVideosMap[em[1]] = { src: em[2] };
      }

      main.querySelectorAll('.video-card').forEach(function (el) {
        var img = el.querySelector('img');
        var url = '', localSrc = '', videoId = '';
        var source = txt(el, '.video-source-badge');
        var oc = el.getAttribute('onclick') || '';
        var isLocal = false;
        var openM = oc.match(/openVideo\(['"]([^'"]+)['"]\)/);
        if (openM) {
          videoId = openM[1];
          isLocal = true;
          localSrc = (localVideosMap[videoId] || {}).src || '';
        } else {
          var winM = oc.match(/window\.open\(['"]([^'"]+)['"]/);
          if (winM) url = winM[1];
        }
        S.items.push({
          id: blockId++,
          image: img ? img.getAttribute('src') : '',
          imageAlt: img ? img.getAttribute('alt') : '',
          source: source,
          date: txt(el, '.video-date'),
          title: (el.querySelector('.video-title') || {}).innerHTML || '',
          desc: txt(el, '.video-desc'),
          url: url,
          localSrc: localSrc,
          videoId: videoId,
          isLocal: isLocal,
        });
      });
    }

    function parseMembers(main) {
      var intro = main.querySelector('.intro');
      S.introHtml = intro ? intro.innerHTML : '';
      var pastGrid = main.querySelector('.past-grid');
      main.querySelectorAll('.card[data-name]').forEach(function (c) {
        var isPast = pastGrid ? pastGrid.contains(c) : false;
        S.items.push({
          id: blockId++,
          past: isPast,
          name: c.getAttribute('data-name') || '',
          role: c.getAttribute('data-role') || '',
          uni: c.getAttribute('data-uni') || '',
          email: c.getAttribute('data-email') || '',
          orcid: c.getAttribute('data-orcid') || '',
          photo: (c.getAttribute('data-photo') || '').replace(/^\.\.\//, ''),
          bio: c.getAttribute('data-bio') || '',
          displayName: txt(c, '.cname'),
          displayRole: txt(c, '.crole'),
          displayUni: txt(c, '.cuni'),
        });
      });
    }

    function parseProjects(main) {
      var intro = main.querySelector('.intro-block');
      S.introHtml = intro ? intro.innerHTML : '';
      Array.from(main.children).forEach(function (child) {
        if (child.classList.contains('intro-block')) return;
        if (child.classList.contains('timeline-era')) {
          var eraLabel = txt(child, '.era-label');
          var eraId = child.getAttribute('id') || '';
          var projectItems = child.querySelectorAll('.project-item');
          // Omitir eras vacías (sin label, sin id y sin proyectos)
          if (eraLabel || eraId || projectItems.length > 0) {
            S.items.push({ _group: true, id: blockId++, eraId: eraId, eraLabel: eraLabel });
          }
          projectItems.forEach(function (el) {
            S.items.push(parseProjectItem(el));
          });
        } else if (child.classList.contains('project-item')) {
          // project-item fuera de timeline-era (compatibilidad)
          S.items.push(parseProjectItem(child));
        }
        // Ignorar cualquier otro elemento
      });
    }

    function parseProjectItem(el) {
      var card = el.querySelector('.project-card');
      var metas = {};
      el.querySelectorAll('.project-meta-item').forEach(function (m) {
        metas[txt(m, '.label')] = txt(m, '.value');
      });
      // Extraer el campo IP (puede ser IP, IPs, IP RED, etc.)
      var ipKey = Object.keys(metas).find(function (k) { return /^IP/i.test(k); }) || 'IP';
      var ipValue = metas[ipKey] || '';
      delete metas[ipKey];
      return {
        id: blockId++,
        year: txt(el, '.year-text') || txt(el, '.project-year'),
        title: txt(el, '.project-title'),
        desc: (el.querySelector('.project-desc') || {}).innerHTML || '',
        isCurrent: card ? card.classList.contains('current') : false,
        ipLabel: ipKey,
        ipValue: ipValue,
        metas: metas,
      };
    }

    // ── HELPERS ──────────────────────────────────────────────────────────────────
    function txt(el, sel) { var c = el.querySelector(sel); return c ? c.textContent.trim() : ''; }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function escA(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
    function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function openTag(el) { var h = el.outerHTML; return h.substring(0, h.indexOf('>') + 1); }
    function getAttrs(el) { var a = []; for (var i = 0; i < el.attributes.length; i++) { var at = el.attributes[i]; a.push(at.name + '="' + escA(at.value) + '"'); } return a.length ? ' ' + a.join(' ') : ''; }
