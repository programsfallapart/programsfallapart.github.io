// Generates public/giscus-dark.css and public/giscus-light.css from the active palette.
// Run: node generate-giscus.cjs

const fs = require('node:fs')
const { ACTIVE_PALETTE, active: p } = require('./palettes.config.cjs')

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hoverVariant(hex) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 16)
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 16)
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 16)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function generate(mode) {
  const g = p.giscus[mode]
  const isDark = mode === 'dark'
  const primary = p.primary
  const accent = p.accent
  const muted = p.muted
  const border = isDark ? p.border.dark : p.border.light
  const primaryHover = hoverVariant(primary)

  // Prettylights syntax colors
  const syntaxEntity = isDark ? primary : hoverVariant(primary)
  const syntaxConstant = isDark ? accent : hoverVariant(accent)
  const syntaxComment = isDark ? muted : hoverVariant(muted)

  return `/*! Custom ${mode} Giscus theme for programsfallapart.com — palette: ${ACTIVE_PALETTE} */
main {
  --color-prettylights-syntax-comment: ${syntaxComment};
  --color-prettylights-syntax-constant: ${syntaxConstant};
  --color-prettylights-syntax-entity: ${syntaxEntity};
  --color-prettylights-syntax-storage-modifier-import: ${g['fg-default']};
  --color-prettylights-syntax-entity-tag: ${syntaxEntity};
  --color-prettylights-syntax-keyword: ${syntaxConstant};
  --color-prettylights-syntax-string: ${syntaxComment};
  --color-prettylights-syntax-variable: ${g['fg-default']};
  --color-prettylights-syntax-brackethighlighter-unmatched: ${syntaxComment};
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: ${syntaxEntity};
  --color-prettylights-syntax-markup-list: ${syntaxConstant};
  --color-prettylights-syntax-markup-heading: ${syntaxEntity};
  --color-prettylights-syntax-markup-italic: ${g['fg-default']};
  --color-prettylights-syntax-markup-bold: ${g['fg-default']};
  --color-prettylights-syntax-markup-deleted-text: ${isDark ? '#ffd8d3' : '#82071e'};
  --color-prettylights-syntax-markup-deleted-bg: ${isDark ? '#78191b' : '#ffebe9'};
  --color-prettylights-syntax-markup-inserted-text: ${isDark ? '#aff5b4' : '#116329'};
  --color-prettylights-syntax-markup-inserted-bg: ${isDark ? '#033a16' : '#dafbe1'};
  --color-prettylights-syntax-markup-changed-text: ${isDark ? '#ffdfb6' : '#953800'};
  --color-prettylights-syntax-markup-changed-bg: ${isDark ? '#5a1e02' : '#ffd8b5'};
  --color-prettylights-syntax-markup-ignored-text: ${isDark ? g['fg-default'] : '#eaeef2'};
  --color-prettylights-syntax-markup-ignored-bg: ${syntaxEntity};
  --color-prettylights-syntax-meta-diff-range: ${syntaxEntity};
  --color-prettylights-syntax-sublimelinter-gutter-mark: ${isDark ? p['primary-gray'] : muted};
  --color-btn-text: ${g['btn-text']};
  --color-btn-bg: ${g['btn-bg']};
  --color-btn-border: ${border};
  --color-btn-shadow: 0 ${isDark ? '0' : '1px 0'} ${isDark ? 'transparent' : 'rgba(27, 31, 36, 0.04)'};
  --color-btn-inset-shadow: ${isDark ? '0 0 transparent' : 'inset 0 1px 0 rgba(255, 255, 255, 0.25)'};
  --color-btn-hover-bg: ${isDark ? '#333' : '#eaeef2'};
  --color-btn-hover-border: ${isDark ? p['primary-gray'] : '#d0d7de'};
  --color-btn-active-bg: ${isDark ? '#363636' : '#dde2e7'};
  --color-btn-active-border: ${isDark ? p['primary-gray'] : '#d0d7de'};
  --color-btn-selected-bg: ${isDark ? '#333' : '#dde2e7'};
  --color-btn-primary-text: ${isDark ? p['primary-dark'] : '#fff'};
  --color-btn-primary-bg: ${primary};
  --color-btn-primary-border: ${primary};
  --color-btn-primary-shadow: 0 0 transparent;
  --color-btn-primary-inset-shadow: 0 0 transparent;
  --color-btn-primary-hover-bg: ${primaryHover};
  --color-btn-primary-hover-border: ${primaryHover};
  --color-btn-primary-selected-bg: ${primaryHover};
  --color-btn-primary-disabled-text: rgba(255, 255, 255, 0.5);
  --color-btn-primary-disabled-bg: ${hexToRgba(primary, 0.6)};
  --color-btn-primary-disabled-border: ${hexToRgba(primary, 0.4)};
  --color-fg-default: ${g['fg-default']};
  --color-fg-muted: ${g['fg-muted']};
  --color-fg-subtle: ${g['fg-subtle']};
  --color-canvas-default: ${g['canvas-default']};
  --color-canvas-overlay: ${g['canvas-overlay']};
  --color-canvas-inset: ${g['canvas-inset']};
  --color-canvas-subtle: ${g['canvas-subtle']};
  --color-border-default: ${border};
  --color-border-muted: ${border};
  --color-neutral-muted: ${isDark ? 'rgba(110, 118, 129, 0.4)' : 'rgba(175, 184, 193, 0.2)'};
  --color-accent-fg: ${primary};
  --color-accent-emphasis: ${primary};
  --color-accent-muted: ${hexToRgba(primary, 0.4)};
  --color-accent-subtle: ${hexToRgba(primary, isDark ? 0.15 : 0.1)};
  --color-danger-fg: ${g['danger-fg']};
  --color-danger-emphasis: ${g['danger-fg']};
  --color-open-fg: ${primary};
  --color-open-emphasis: ${primary};
  --color-closed-fg: ${g['danger-fg']};
  --color-done-fg: ${primary};
}

main .gsc-comment-box {
  border-color: ${border};
}

main .gsc-comment {
  border-color: ${border};
}

main .gsc-timeline {
  border-color: ${border};
}
`
}

fs.writeFileSync('public/giscus-dark.css', generate('dark'))
fs.writeFileSync('public/giscus-light.css', generate('light'))

console.log(`Generated Giscus themes for palette: ${ACTIVE_PALETTE}`)
