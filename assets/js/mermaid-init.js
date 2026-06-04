/* Mermaid diagram init - loaded only on pages that use {{< mermaid >}} */
import mermaid from './mermaid.esm.min.mjs';

function getMermaidConfig() {
  var dark = document.documentElement.classList.contains('dark');
  return {
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'strict',
    fontFamily: 'InterVariable, Inter, system-ui, sans-serif',
    themeVariables: dark
      ? {
          background: '#111827',
          mainBkg: '#134e4a',
          nodeBorder: '#2dd4bf',
          nodeTextColor: '#f8fafc',
          textColor: '#f8fafc',
          titleColor: '#f8fafc',
          primaryColor: '#134e4a',
          primaryTextColor: '#f1f5f9',
          primaryBorderColor: '#2dd4bf',
          secondaryColor: '#1f2937',
          secondaryTextColor: '#f1f5f9',
          secondaryBorderColor: '#14b8a6',
          tertiaryColor: '#0f172a',
          tertiaryTextColor: '#e5e7eb',
          tertiaryBorderColor: '#334155',
          lineColor: '#5eead4',
          edgeLabelBackground: '#111827',
          clusterBkg: '#0f172a',
          clusterBorder: '#334155',
          fontSize: '16px'
        }
      : {
          background: '#ffffff',
          mainBkg: '#ccfbf1',
          nodeBorder: '#0d9488',
          nodeTextColor: '#111827',
          textColor: '#111827',
          titleColor: '#111827',
          primaryColor: '#ccfbf1',
          primaryTextColor: '#111827',
          primaryBorderColor: '#0d9488',
          secondaryColor: '#f0fdfa',
          secondaryTextColor: '#111827',
          secondaryBorderColor: '#14b8a6',
          tertiaryColor: '#f9fafb',
          tertiaryTextColor: '#374151',
          tertiaryBorderColor: '#cbd5e1',
          lineColor: '#0f766e',
          edgeLabelBackground: '#ffffff',
          clusterBkg: '#f8fafc',
          clusterBorder: '#cbd5e1',
          fontSize: '16px'
        }
  };
}

function prepareDiagrams() {
  document.querySelectorAll('.mermaid').forEach(function (el) {
    if (!el.getAttribute('data-original')) {
      el.setAttribute('data-original', el.innerHTML);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  prepareDiagrams();
  mermaid.initialize(getMermaidConfig());
  mermaid.run({ querySelector: '.mermaid' });
  // Re-render on theme toggle
  var origToggle = window.toggleTheme;
  if (typeof origToggle === 'function') {
    window.toggleTheme = function () {
      origToggle();
      mermaid.initialize(getMermaidConfig());
      document.querySelectorAll('.mermaid[data-processed]').forEach(function (el) {
        el.removeAttribute('data-processed');
        el.innerHTML = el.getAttribute('data-original');
      });
      mermaid.run({ querySelector: '.mermaid' });
    };
  }
});
