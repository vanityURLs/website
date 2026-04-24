/* Dark-mode pre-paint — MUST load synchronously in <head> before <body> renders
 * to avoid a light-mode flash on page load for users who prefer dark.
 * Tiny by design. Do not add unrelated code here. */
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) { /* private-mode or storage blocked; let CSS handle it */ }
})();
