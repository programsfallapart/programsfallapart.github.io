// ─── Color Palette Registry ───
// Switch palettes by changing ACTIVE_PALETTE below.

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
  },

  // Oxide-inspired — green accent, navy darks
  oxide: {
    primary: '#48d597',
    'primary-on-light': '#2d9d6a',
    accent: '#e0a458',
    muted: '#8b949e',
    'primary-dark': '#181c21',
    'primary-gray': '#4a5568',
    'primary-white': '#f8f9fa',
    border: { light: '#d1d5db', dark: '#2d333b' },
    code: { bg: '#2d333b', 'bg-dark': '#22272e', text: '#e6edf3' },
    logo: {
      dark: {
        text: '#e6edf3',
        accent: '#48d597',        // was #9fbbe0 — now matches your primary green
        bars: ['#e6edf3', '#8b949e', '#4a5568', '#2d333b'],  // your existing grays
        particles: ['#48d597', '#e0a458', '#4a5568', '#48d597'],  // green + amber + one neutral
      },
      light: {
        text: '#3d4f5f',
        accent: '#2d9d6a',        // your primary-on-light green
        bars: ['#d1d5db', '#b0b8c4', '#8b949e', '#6b7280'],  // your light mode grays
        particles: ['#2d9d6a', '#c8935f', '#8b949e', '#2d9d6a'],  // green + amber + one neutral
      },
    },
  },
}

const active = palettes[ACTIVE_PALETTE]
if (!active) {
  throw new Error(`Unknown palette "${ACTIVE_PALETTE}". Available: ${Object.keys(palettes).join(', ')}`)
}

module.exports = { ACTIVE_PALETTE, palettes, active }
