/* vanityURLs — consolidated client JS
 *
 * Extracted from inline scripts in baseof.html, showcase/list.html, and
 * blog/single.html so CSP can drop 'unsafe-inline' from script-src.
 *
 * i18n strings and flags are passed via a <script type="application/json"
 * id="app-config"> element rendered by Hugo. That element is inert data
 * (not executable), so CSP doesn't care.
 */
(function () {
  'use strict';

  // ── Read i18n strings from the inert config block ─────────
  var cfg = {};
  try {
    var el = document.getElementById('app-config');
    if (el) cfg = JSON.parse(el.textContent || '{}');
  } catch (e) { /* fall through with empty cfg */ }
  var t = cfg.i18n || {};

  // ── Dark mode toggle ─────────────────────────────────────
  function setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    document.querySelectorAll('.dark-icon-moon, .dark-icon-sun').forEach(function (el) {
      el.classList.toggle(
        'hidden',
        theme === 'dark'
          ? el.classList.contains('dark-icon-moon')
          : el.classList.contains('dark-icon-sun')
      );
    });
  }
  function toggleTheme() {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }
  // Expose so the mermaid block can re-wrap it
  window.toggleTheme = toggleTheme;

  // Initial icon state
  (function () {
    var dark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.dark-icon-moon').forEach(function (el) {
      el.classList.toggle('hidden', dark);
    });
    document.querySelectorAll('.dark-icon-sun').forEach(function (el) {
      el.classList.toggle('hidden', !dark);
    });
  })();

  // Bind dark-toggle buttons (replaces onclick="toggleTheme()")
  document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
    btn.addEventListener('click', function () { toggleTheme(); });
  });

  // ── Mobile menu ──────────────────────────────────────────
  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // ── Sidebar active link (JS fallback) ───────────────────
  document.querySelectorAll('.sidebar-link, .sidebar-parent, .sidebar-child-link').forEach(function (el) {
    var href = el.getAttribute('href');
    if (href && href.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) {
      el.classList.add('active');
    }
  });

  // ── Navigate-on-change for docs mobile dropdown ─────────
  // Replaces onchange="window.location=this.value"
  document.querySelectorAll('[data-action="navigate-on-change"]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      if (sel.value) window.location = sel.value;
    });
  });

  // ── Anchor links on article headings ────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('article h2, article h3, article h4').forEach(function (h) {
      if (!h.id) return;
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'anchor-link';
      a.setAttribute('aria-label', t.anchor_link || 'Link to this section');
      a.textContent = '#';
      h.appendChild(a);
    });
  });

  // ── Copy-to-clipboard on code blocks ────────────────────
  var COPY_ICON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var CHECK_ICON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (!navigator.clipboard) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', t.copy_code || 'Copy code');
      btn.innerHTML = COPY_ICON_SVG;
      pre.style.position = 'relative';
      pre.appendChild(btn);
      btn.addEventListener('click', function () {
        var code = (pre.querySelector('code') || pre).innerText;
        navigator.clipboard.writeText(code).then(function () {
          btn.classList.add('copied');
          btn.innerHTML = CHECK_ICON_SVG;
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = COPY_ICON_SVG;
          }, 2000);
        }, function () { /* swallow errors */ });
      });
    });
  });

  // ── Search modal ─────────────────────────────────────────
  var searchModal       = document.getElementById('search-modal');
  var searchBackdrop    = document.getElementById('search-backdrop');
  var searchInput       = document.getElementById('search-input');
  var searchResults     = document.getElementById('search-results');
  var searchPlaceholder = document.getElementById('search-placeholder-msg');
  var searchTrigger     = document.getElementById('search-trigger');
  var mobileSearch      = document.getElementById('mobile-search-trigger');
  var searchDebounce    = null;
  var pagefindModule    = null;
  var pagefindLoading   = false;

  async function loadPagefind() {
    if (pagefindModule) return pagefindModule;
    if (pagefindLoading) return null;
    pagefindLoading = true;
    try {
      var pf = await import('/pagefind/pagefind.js');
      await pf.init();
      pagefindModule = pf;
      return pf;
    } catch (e) {
      pagefindLoading = false;
      return null;
    }
  }

  function clearResults() {
    if (!searchResults) return;
    Array.from(searchResults.children).forEach(function (c) {
      if (c.id !== 'search-placeholder-msg') c.remove();
    });
  }

  function showMsg(text) {
    clearResults();
    if (searchPlaceholder) {
      searchPlaceholder.classList.remove('hidden');
      searchPlaceholder.textContent = text;
    }
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        showMsg((t.search_placeholder || 'Search') + '…');
      }
    });
    loadPagefind();
  }

  function closeSearch() {
    if (searchModal) searchModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (mobileSearch)  mobileSearch.addEventListener('click', openSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });
  if (searchModal) {
    var modalInner = searchModal.querySelector('.relative');
    if (modalInner) modalInner.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim();
      clearTimeout(searchDebounce);
      if (!q) { showMsg((t.search_placeholder || 'Search') + '…'); return; }
      searchDebounce = setTimeout(function () { runSearch(q); }, 200);
    });
  }

  async function runSearch(q) {
    var pf = await loadPagefind();
    if (!pf) { showMsg(t.search_unavailable || 'Search unavailable'); return; }
    try {
      var result = await pf.search(q);
      renderResults(result.results, q);
    } catch (e) {
      showMsg(t.search_error || 'Search error');
    }
  }

  function renderResults(results, q) {
    clearResults();
    if (!results || !results.length) {
      showMsg((t.search_no_results || 'No results for "%s"').replace('%s', q));
      return;
    }

    if (searchPlaceholder) searchPlaceholder.classList.add('hidden');

    // Pagefind's raw results include noisy fuzzy matches — on a search for
    // "commencer" against an English index, it returns pages that contain
    // "com" (from any URL), "en" (suffix of many words), etc. The raw result
    // object only exposes { id, data() } — there's no score on it — so we
    // have to load the data (which contains the excerpt with <mark> tags
    // wrapping matched words) and inspect what actually matched.
    //
    // Rule: a prefix of the query's first term must appear inside at least
    // one <mark>-wrapped word in the excerpt. Using a prefix (not the full
    // term) lets legitimate inflections match — e.g. searching "commencer"
    // still matches pages with "commencé" via the shared "commenc" prefix.
    var firstTerm = q.toLowerCase().split(/\s+/)[0] || '';
    // Don't filter short queries — 1–3 char searches are legitimately broad.
    var shouldFilter = firstTerm.length >= 4;
    // Trim trailing chars so inflections still match. A 4-char prefix is
    // enough to reject fuzzy noise ("com" hits for "commencer") while keeping
    // genuine inflected matches.
    var PREFIX_LEN = 4;
    var prefix = firstTerm.slice(0, Math.max(PREFIX_LEN, Math.floor(firstTerm.length * 0.6)));

    function excerptMatchesQuery(excerpt) {
      if (!shouldFilter) return true;
      if (!excerpt) return false;
      // Extract text inside <mark>...</mark> (Pagefind's match highlighting)
      var marks = excerpt.match(/<mark>([^<]*)<\/mark>/gi);
      if (!marks) return false;
      for (var i = 0; i < marks.length; i++) {
        var word = marks[i].replace(/<\/?mark>/gi, '').toLowerCase();
        if (word.indexOf(prefix) !== -1) return true;
      }
      return false;
    }

    Promise.all(results.slice(0, 20).map(function (r) { return r.data(); }))
      .then(function (items) {
        var relevant = items.filter(function (item) {
          return excerptMatchesQuery(item.excerpt);
        });

        if (!relevant.length) {
          showMsg((t.search_no_results || 'No results for "%s"').replace('%s', q));
          return;
        }

        relevant.slice(0, 8).forEach(function (item) {
          var a = document.createElement('a');
          a.href = item.url;
          a.className = [
            'flex', 'flex-col', 'px-4', 'py-3', 'no-underline',
            'hover:bg-gray-50', 'dark:hover:bg-gray-700/50',
            'transition-colors', 'cursor-pointer'
          ].join(' ');
          a.addEventListener('click', closeSearch);

          var title = document.createElement('span');
          title.className = 'text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5';
          title.textContent = (item.meta && item.meta.title) ? item.meta.title : item.url;

          var excerpt = document.createElement('span');
          excerpt.className = 'text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed';
          // Pagefind sanitizes this; it wraps matched terms in <mark>.
          excerpt.innerHTML = item.excerpt || '';

          a.appendChild(title);
          a.appendChild(excerpt);
          searchResults.appendChild(a);
        });
      });
  }

  // ── TOC active link on scroll ─────────────────────────
  (function () {
    var tocLinks = document.querySelectorAll('.toc a');
    if (!tocLinks.length) return;
    var headings = Array.from(document.querySelectorAll('article h2, article h3'));
    var current = '';
    function onScroll() {
      var sy = window.scrollY + 110;
      headings.forEach(function (h) { if (h.offsetTop <= sy) current = '#' + h.id; });
      tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === current); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // ── Header dropdown keyboard navigation ──────────────────
  document.querySelectorAll('[aria-haspopup="true"]').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    function openMenu() {
      btn.setAttribute('aria-expanded', 'true');
      panel.querySelectorAll('[role="menuitem"]').forEach(function (item) {
        item.setAttribute('tabindex', '0');
      });
      var first = panel.querySelector('[role="menuitem"]');
      if (first) setTimeout(function () { first.focus(); }, 10);
    }

    function closeMenu() {
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeMenu(); else openMenu();
      }
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(); }
    });

    panel.addEventListener('keydown', function (e) {
      var items = Array.from(panel.querySelectorAll('[role="menuitem"]'));
      var idx   = items.indexOf(document.activeElement);

      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx < items.length - 1) items[idx + 1].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) items[idx - 1].focus();
        else closeMenu();
      }
      if (e.key === 'Tab' && !e.shiftKey && idx === items.length - 1) {
        closeMenu();
      }
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ── Sidebar keyboard navigation ──────────────────────────
  (function () {
    var sidebar = document.querySelector('aside nav, aside > div');
    if (!sidebar) return;

    document.querySelectorAll('.sidebar-parent').forEach(function (parent) {
      parent.setAttribute('role', 'button');
      parent.setAttribute('tabindex', '0');

      var chevron = parent.querySelector('.chevron');
      function isOpen() { return chevron && chevron.classList.contains('rotate-90'); }
      function toggle() { if (chevron) chevron.classList.toggle('rotate-90', !isOpen()); }

      parent.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (parent.tagName === 'A') { window.location = parent.href; }
          else { toggle(); }
        }
      });
    });

    var allLinks = function () {
      return Array.from(sidebar.querySelectorAll(
        'a.sidebar-link, a.sidebar-parent, a.sidebar-child-link'
      )).filter(function (el) { return el.offsetParent !== null; });
    };

    sidebar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var links   = allLinks();
      var focused = document.activeElement;
      var idx     = links.indexOf(focused);
      if (idx === -1) return;
      e.preventDefault();
      var next = links[idx + (e.key === 'ArrowDown' ? 1 : -1)];
      if (next) next.focus();
    });
  })();

  // ── Showcase filter (was onclick="filterShowcase(this, ...)") ───
  (function () {
    var grid = document.getElementById('showcase-grid');
    if (!grid) return;

    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.filter-btn').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        var cards = grid.querySelectorAll('.showcase-card');
        var visible = 0;
        cards.forEach(function (card) {
          var tags = card.getAttribute('data-tags') || '';
          var show = filter === 'all' || tags.split(' ').indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });
        var empty = document.getElementById('showcase-empty');
        if (empty) empty.classList.toggle('hidden', visible > 0);
      });
    });
  })();

  // ── Blog: reading progress bar + copy-link ──────────────
  (function () {
    var bar = document.getElementById('reading-progress');
    if (bar) {
      var update = function () {
        var doc   = document.documentElement;
        var total = doc.scrollHeight - doc.clientHeight;
        var pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = Math.min(pct, 100) + '%';
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
    }

    var btn = document.getElementById('copy-link-btn');
    if (btn && navigator.clipboard) {
      var ORIG = btn.innerHTML;
      var CHECK =
        '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
          btn.innerHTML = CHECK;
          setTimeout(function () { btn.innerHTML = ORIG; }, 2000);
        });
      });
    }
  })();

  // ── Code shortcode: inline copy button in header bar ────
  // Matches the .copy-btn-inline element rendered by layouts/shortcodes/code.html
  (function () {
    var CHECK_SMALL =
      '<svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    document.querySelectorAll('.copy-btn-inline').forEach(function (btn) {
      if (!navigator.clipboard) return;
      var ORIG = btn.innerHTML;
      btn.addEventListener('click', function () {
        var block = btn.closest('.not-prose');
        if (!block) return;
        var src = block.querySelector('code') || block.querySelector('pre');
        if (!src) return;
        navigator.clipboard.writeText(src.innerText).then(function () {
          btn.innerHTML = CHECK_SMALL;
          setTimeout(function () { btn.innerHTML = ORIG; }, 2000);
        });
      });
    });
  })();

  // ── Tabs shortcode ───────────────────────────────────────
  // Matches [data-tabs] containers rendered by layouts/shortcodes/tabs.html
  (function () {
    document.querySelectorAll('[data-tabs]').forEach(function (container) {
      var panels = container.querySelectorAll('[data-tab-label]');
      var btnBar = container.querySelector('[data-tab-bar]');
      if (!panels.length || !btnBar) return;

      panels.forEach(function (panel, i) {
        var tabBtn = document.createElement('button');
        tabBtn.type = 'button';
        tabBtn.textContent = panel.getAttribute('data-tab-label');
        tabBtn.className = 'tab-btn px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors';
        btnBar.appendChild(tabBtn);
        panel.style.display = i === 0 ? '' : 'none';
        if (i === 0) {
          tabBtn.classList.add('border-brand-600', 'text-brand-700', 'dark:text-brand-400');
        } else {
          tabBtn.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400',
                               'hover:text-gray-700', 'dark:hover:text-gray-200');
        }
        tabBtn.addEventListener('click', function () {
          panels.forEach(function (p, j) { p.style.display = j === i ? '' : 'none'; });
          container.querySelectorAll('.tab-btn').forEach(function (b, j) {
            b.classList.toggle('border-brand-600',  j === i);
            b.classList.toggle('text-brand-700',    j === i);
            b.classList.toggle('dark:text-brand-400', j === i);
            b.classList.toggle('border-transparent', j !== i);
            b.classList.toggle('text-gray-500',     j !== i);
          });
        });
      });
    });
  })();
})();
