// Syntax highlighting built from the site's own three-job palette instead of
// an imported theme's dozen colors:
//   gray   → comments & punctuation (structure you skim past)
//   green  → keywords & control flow (the machine's own words)
//   amber  → strings, numbers & literal values (the data)
// Everything else stays foreground ink. Code blocks now read as *ours*.

const darkTokens = [
  { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8b949e', fontStyle: 'italic' } },
  { scope: ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.operator.expression', 'variable.language'], settings: { foreground: '#48d597' } },
  { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'constant.other.symbol'], settings: { foreground: '#e0a458' } },
  { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: '#e0a458' } },
  { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic'], settings: { foreground: '#e6edf3' } },
  { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.name.namespace'], settings: { foreground: '#c9d1d9' } },
  { scope: ['variable', 'variable.other', 'meta.definition.variable', 'variable.parameter'], settings: { foreground: '#e6edf3' } },
  { scope: ['punctuation', 'meta.brace', 'keyword.operator', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: '#8b949e' } },
  { scope: ['entity.name.tag'], settings: { foreground: '#48d597' } },
  { scope: ['entity.other.attribute-name'], settings: { foreground: '#e0a458' } },
]

const lightTokens = [
  { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8a94a0', fontStyle: 'italic' } },
  { scope: ['keyword', 'keyword.control', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.operator.expression', 'variable.language'], settings: { foreground: '#1f8a5b' } },
  { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'constant.other.symbol'], settings: { foreground: '#9a6a2e' } },
  { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: '#9a6a2e' } },
  { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic'], settings: { foreground: '#26313b' } },
  { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.name.namespace'], settings: { foreground: '#3d4f5f' } },
  { scope: ['variable', 'variable.other', 'meta.definition.variable', 'variable.parameter'], settings: { foreground: '#26313b' } },
  { scope: ['punctuation', 'meta.brace', 'keyword.operator', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: '#8a94a0' } },
  { scope: ['entity.name.tag'], settings: { foreground: '#1f8a5b' } },
  { scope: ['entity.other.attribute-name'], settings: { foreground: '#9a6a2e' } },
]

export const oxideDark = {
  name: 'oxide-dark',
  type: 'dark',
  colors: {
    'editor.background': '#22272e',
    'editor.foreground': '#e6edf3',
  },
  tokenColors: darkTokens,
}

export const oxideLight = {
  name: 'oxide-light',
  type: 'light',
  colors: {
    'editor.background': '#eef1f4',
    'editor.foreground': '#26313b',
  },
  tokenColors: lightTokens,
}
