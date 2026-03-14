// Populates the sidebar with the 5 most recent news, excluding the current page
(function () {
  var currentPage = location.pathname.split('/').pop();
  var sidebar = document.querySelector('.sidebar-news-list');
  if (!sidebar || typeof news === 'undefined') return;

  var recent = news.filter(function (n) { return n.url !== currentPage; }).slice(0, 5);

  sidebar.innerHTML = recent.map(function (n) {
    return '<li class="sidebar-news-item">' +
      '<a class="sidebar-news-link" href="' + n.url + '">' +
        '<img class="sidebar-news-thumb" src="' + n.img + '" alt="" />' +
        '<div class="sidebar-news-text">' +
          '<div class="sidebar-news-date">' + n.date + '</div>' +
          '<div class="sidebar-news-title">' + n.title + '</div>' +
        '</div>' +
      '</a>' +
    '</li>';
  }).join('');
})();
