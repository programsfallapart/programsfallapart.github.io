import { visit } from 'unist-util-visit'
import type { Root, Element, Text } from 'hast'

export default function rehypeHeadingNumbers() {
  return (tree: Root) => {
    let h2Count = 0
    let h3Count = 0

    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'h2') {
        // Skip the footnotes heading
        if (node.properties?.id === 'footnote-label') return

        h2Count++
        h3Count = 0

        const prefix: Text = { type: 'text', value: `${h2Count}. ` }
        node.children.unshift(prefix)
      } else if (node.tagName === 'h3') {
        h3Count++

        const prefix: Text = { type: 'text', value: `${h2Count}.${h3Count}. ` }
        node.children.unshift(prefix)
      }
    })
  }
}
