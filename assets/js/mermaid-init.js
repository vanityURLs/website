/* Mermaid diagram init — loaded only on pages that use {{< mermaid >}} */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof mermaid === 'undefined') return;
  var dark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: true,
    theme: dark ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif'
  });
  // Re-render on theme toggle
  var origToggle = window.toggleTheme;
  if (typeof origToggle === 'function') {
    window.toggleTheme = function () {
      origToggle();
      var isDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default' });
      document.querySelectorAll('.mermaid[data-processed]').forEach(function (el) {
        el.removeAttribute('data-processed');
        el.innerHTML = el.getAttribute('data-original') || el.innerHTML;
      });
      mermaid.run();
    };
  }
});
