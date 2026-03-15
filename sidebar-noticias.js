// Populates the sidebar with the 5 most recent news, excluding the current page
(function () {
  var currentPage = location.pathname.split('/').pop();
  var sidebar = document.querySelector('.sidebar-news-list');
  if (!sidebar || typeof news === 'undefined') return;

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  var recent = news.filter(function (n) { return n.url !== currentPage; }).slice(0, 5);

  sidebar.innerHTML = recent.map(function (n) {
    return '<li class="sidebar-news-item">' +
      '<a class="sidebar-news-link" href="' + esc(n.url) + '">' +
        '<img class="sidebar-news-thumb" src="' + esc(n.img) + '" alt="" />' +
        '<div class="sidebar-news-text">' +
          '<div class="sidebar-news-date">' + esc(n.date) + '</div>' +
          '<div class="sidebar-news-title">' + esc(n.title) + '</div>' +
        '</div>' +
      '</a>' +
    '</li>';
  }).join('');
})();
