/**
 * site-search.js — Buscador inline del sitio PROLOPE
 */
(function () {
  'use strict';

  var headerInner = document.querySelector('.header-inner');
  var input       = document.getElementById('siteSearchInput');
  var results     = document.getElementById('siteSearchResults');
  var count       = document.getElementById('siteSearchCount');
  var dropdown    = document.getElementById('siteSearchDropdown');
  var btnOpen     = document.getElementById('siteSearchBtn');
  var btnClose    = document.getElementById('siteSearchClose');

  /* ---------- abrir / cerrar ---------- */

  function openSearch() {
    headerInner.classList.add('search-active');
    input.value = '';
    results.innerHTML = '';
    count.textContent = '';
    dropdown.classList.remove('has-content');
    setTimeout(function () { input.focus(); }, 80);
  }

  function closeSearch() {
    headerInner.classList.remove('search-active');
    dropdown.classList.remove('has-content');
    input.value = '';
    results.innerHTML = '';
    count.textContent = '';
  }

  btnOpen.addEventListener('click', openSearch);
  btnClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && headerInner.classList.contains('search-active')) closeSearch();
  });

  /* Cerrar al hacer clic fuera del header y dropdown */
  document.addEventListener('click', function (e) {
    if (!headerInner.classList.contains('search-active')) return;
    if (e.target.closest('header') || e.target.closest('.site-search-dropdown')) return;
    closeSearch();
  });

  /* ---------- normalizar texto ---------- */

  function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  /* ---------- parsear la consulta en términos simples y frases exactas ---------- */

  function parseQuery(raw) {
    var phrases = [];
    var words   = [];
    // Extraer frases entre comillas (simples o dobles, rectas o tipográficas)
    var remaining = raw.replace(/["""«»]([^"""«»]+)["""«»]/g, function (_, phrase) {
      var p = phrase.trim();
      if (p) phrases.push(p);
      return ' ';
    });
    remaining.split(/\s+/).forEach(function (w) {
      if (w.length > 0) words.push(w);
    });
    return { phrases: phrases, words: words };
  }

  /* ---------- buscar ---------- */

  function doSearch() {
    var raw = input.value.trim();
    var q   = normalize(raw);
    if (q.length < 2) {
      results.innerHTML = '';
      count.textContent = '';
      dropdown.classList.remove('has-content');
      return;
    }

    var parsed  = parseQuery(q);
    var phrases = parsed.phrases;
    var terms   = parsed.words;
    var scored  = [];

    SEARCH_INDEX.forEach(function (page) {
      var haystack   = normalize(page.title + ' ' + page.description + ' ' + page.content);
      var titleN     = normalize(page.title);
      var descN      = normalize(page.description);
      var matched    = 0;
      var total      = phrases.length + terms.length;
      var score      = 0;

      phrases.forEach(function (p) {
        if (haystack.indexOf(p) !== -1) {
          matched++;
          if (titleN.indexOf(p) !== -1) score += 4;
          else if (descN.indexOf(p) !== -1) score += 2;
          else score += 1;
        }
      });

      terms.forEach(function (t) {
        if (haystack.indexOf(t) !== -1) {
          matched++;
          if (titleN.indexOf(t) !== -1) score += 3;
          else if (descN.indexOf(t) !== -1) score += 2;
          else score += 1;
        }
      });

      if (total === 0) return;
      if (matched === total) {
        scored.push({ page: page, score: score });
      }
    });

    scored.sort(function (a, b) { return b.score - a.score; });

    count.textContent = scored.length + ' resultado' + (scored.length !== 1 ? 's' : '');
    dropdown.classList.add('has-content');

    if (scored.length === 0) {
      results.innerHTML = '<p class="site-search-empty">No se han encontrado resultados.</p>';
      return;
    }

    var SECTION_LABELS = {
      'el-grupo/miembros.html': 'Miembros',
      'eventos/seminarios.html': 'Seminarios',
      'eventos/congresos.html': 'Congresos',
      'publicaciones/partes-comedias.html': 'Partes de comedias',
      'publicaciones/otras-publicaciones.html': 'Otras publicaciones',
      'el-grupo/historial-proyectos.html': 'Proyectos',
      'formacion/tesis.html': 'Tesis',
      'multimedia/multimedia.html': 'Multimedia',
    };

    function getSectionLabel(pageUrl) {
      var hash = pageUrl.indexOf('#');
      if (hash !== -1) {
        var base = pageUrl.substring(0, hash);
        return SECTION_LABELS[base] || null;
      }
      if (pageUrl.startsWith('noticias/') && pageUrl !== 'noticias/noticias.html') {
        return 'Noticias';
      }
      return null;
    }

    var html = '';
    scored.forEach(function (item) {
      var label = getSectionLabel(item.page.url);
      var labelHtml = label
        ? ' <span style="display:inline-block;font-size:.68rem;font-weight:600;letter-spacing:.04em;padding:1px 6px;border-radius:3px;vertical-align:middle;background:var(--dorado,#8b6914);color:#fff;margin-left:5px;opacity:.85">' + escapeHtml(label) + '</span>'
        : '';
      html += '<a class="site-search-item" href="' + (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '') + item.page.url + '">' +
        '<span class="site-search-item-title">' + escapeHtml(item.page.title) + labelHtml + '</span>' +
        '<span class="site-search-item-desc">' + escapeHtml(item.page.description) + '</span>' +
        '</a>';
    });
    results.innerHTML = html;
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  if (input) {
    input.addEventListener('input', doSearch);
  }
  if (typeof SEARCH_INDEX === 'undefined') {
    console.error('site-search.js: SEARCH_INDEX no está definido. Asegúrate de que search-data.js se carga antes.');
  }
})();
