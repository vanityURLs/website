/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./content/**/*.html",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.brand.600'),
              textDecoration: 'none',
              '&:hover': { color: theme('colors.brand.800'), textDecoration: 'underline' },
            },
            'h1,h2,h3,h4,h5': { color: theme('colors.gray.900'), fontWeight: '700' },
            code: {
              color: theme('colors.brand.700'),
              backgroundColor: theme('colors.brand.50'),
              borderRadius: theme('borderRadius.sm'),
              paddingLeft:   '0.3em',
              paddingRight:  '0.3em',
              paddingTop:    '0.15em',
              paddingBottom: '0.15em',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
            pre: {
              /* background/color handled by Chroma + CSS overrides in main.css */
              borderRadius: theme('borderRadius.lg'),
              padding: '1rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontSize: '0.875em',
            },
            table: { fontSize: '0.875em' },
            'thead th': { color: theme('colors.gray.900') },
          },
        },
        invert: {
          css: {
            '--tw-prose-body':         theme('colors.gray.100'),
            '--tw-prose-headings':     theme('colors.gray.100'),
            '--tw-prose-links':        theme('colors.brand.400'),
            '--tw-prose-bold':         theme('colors.gray.100'),
            '--tw-prose-counters':     theme('colors.gray.400'),
            '--tw-prose-bullets':      theme('colors.gray.500'),
            '--tw-prose-hr':           theme('colors.gray.700'),
            '--tw-prose-quotes':       theme('colors.gray.300'),
            '--tw-prose-quote-borders':theme('colors.gray.600'),
            '--tw-prose-captions':     theme('colors.gray.400'),
            '--tw-prose-code':         theme('colors.brand.300'),
            '--tw-prose-pre-code':     theme('colors.gray.200'),
            '--tw-prose-pre-bg':       theme('colors.gray.900'),
            '--tw-prose-th-borders':   theme('colors.gray.600'),
            '--tw-prose-td-borders':   theme('colors.gray.700'),
            code: {
              backgroundColor: 'rgb(15 23 42)',
              color: theme('colors.brand.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
