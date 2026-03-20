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

  /* ---------- buscar ---------- */

  function doSearch() {
    var q = normalize(input.value.trim());
    if (q.length < 2) {
      results.innerHTML = '';
      count.textContent = '';
      dropdown.classList.remove('has-content');
      return;
    }

    var terms = q.split(/\s+/);
    var scored = [];

    SEARCH_INDEX.forEach(function (page) {
      var haystack = normalize(page.title + ' ' + page.description + ' ' + page.content);
      var matched = 0;
      var score = 0;

      terms.forEach(function (t) {
        if (haystack.indexOf(t) !== -1) {
          matched++;
          if (normalize(page.title).indexOf(t) !== -1) score += 3;
          else if (normalize(page.description).indexOf(t) !== -1) score += 2;
          else score += 1;
        }
      });

      if (matched === terms.length) {
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

    var html = '';
    scored.forEach(function (item) {
      html += '<a class="site-search-item" href="' + (typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '') + item.page.url + '">' +
        '<span class="site-search-item-title">' + escapeHtml(item.page.title) + '</span>' +
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
