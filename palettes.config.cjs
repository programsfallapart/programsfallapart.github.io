// ─── Color Palette Registry ───
// Switch palettes by changing ACTIVE_PALETTE below.
// Run `node generate-giscus.cjs` after switching to regenerate Giscus themes.

const ACTIVE_PALETTE = 'oxide'

const palettes = {
  // Current palette — soft teal + warm amber
  teal: {
    primary: '#7aa2f7',
    accent: '#c8935f',
    muted: '#9ca3af',
    'primary-dark': '#1f1f1f',
    'primary-gray': '#525252',
    'primary-white': '#fcfcfc',
    border: { light: '#e5e7eb', dark: '#2a2a2a' },
    code: { bg: '#374151', 'bg-dark': '#282c34', text: '#e4e4e7' },
    logo: {
      text: '#e6edf3',
      accent: '#9fbbe0',
      bars: ['#f0f2f6', '#e5e9f2', '#c7d4ea', '#9fbbe0'],
      particles: ['#9fbbe0', '#e0a458', '#c7d4ea', '#9fbbe0'],
    },
    giscus: {
      dark: {
        'btn-text': '#e6edf3',
        'btn-bg': '#2a2a2a',
        'fg-default': '#e6edf3',
        'fg-muted': '#9ca3af',
        'fg-subtle': '#6b7280',
        'canvas-default': '#1f1f1f',
        'canvas-overlay': '#2a2a2a',
        'canvas-inset': '#161616',
        'canvas-subtle': '#2a2a2a',
        'danger-fg': '#da3633',
      },
      light: {
        'btn-text': '#24292f',
        'btn-bg': '#f6f8fa',
        'fg-default': '#1f2328',
        'fg-muted': '#636c76',
        'fg-subtle': '#6e7781',
        'canvas-default': '#fcfcfc',
        'canvas-overlay': '#fff',
        'canvas-inset': '#f6f8fa',
        'canvas-subtle': '#f6f8fa',
        'danger-fg': '#cf222e',
      },
    },
  },

  // Oxide-inspired — green accent, navy darks
  oxide: {
    primary: '#48d597',
    accent: '#e0a458',
    muted: '#8b949e',
    'primary-dark': '#181c21',
    'primary-gray': '#4a5568',
    'primary-white': '#f8f9fa',
    border: { light: '#d1d5db', dark: '#2d333b' },
    code: { bg: '#2d333b', 'bg-dark': '#22272e', text: '#e6edf3' },
    logo: {
      text: '#e6edf3',
      accent: '#9fbbe0',
      bars: ['#f0f2f6', '#e5e9f2', '#c7d4ea', '#9fbbe0'],
      particles: ['#9fbbe0', '#e0a458', '#c7d4ea', '#9fbbe0'],
    },
    giscus: {
      dark: {
        'btn-text': '#e6edf3',
        'btn-bg': '#2d333b',
        'fg-default': '#e6edf3',
        'fg-muted': '#8b949e',
        'fg-subtle': '#636e7b',
        'canvas-default': '#181c21',
        'canvas-overlay': '#2d333b',
        'canvas-inset': '#13161a',
        'canvas-subtle': '#2d333b',
        'danger-fg': '#f85149',
      },
      light: {
        'btn-text': '#1f2328',
        'btn-bg': '#f6f8fa',
        'fg-default': '#1f2328',
        'fg-muted': '#636c76',
        'fg-subtle': '#6e7781',
        'canvas-default': '#f8f9fa',
        'canvas-overlay': '#fff',
        'canvas-inset': '#f0f2f5',
        'canvas-subtle': '#f0f2f5',
        'danger-fg': '#cf222e',
      },
    },
  },
}

const active = palettes[ACTIVE_PALETTE]
if (!active) {
  throw new Error(`Unknown palette "${ACTIVE_PALETTE}". Available: ${Object.keys(palettes).join(', ')}`)
}

module.exports = { ACTIVE_PALETTE, palettes, active }
