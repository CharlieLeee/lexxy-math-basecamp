import { findMath, renderMath } from "lexxy-math"

// In collaborative editors math stays $...$ text in the shared document. While the caret is
// in (or right next to) a formula, that formula is shown rendered in a popup under it.
// The document itself is untouched.

const EDITABLE = "lexxy-editor[collaboration] [contenteditable]"

export const PREVIEW_CSS = `
.lexxy-math-preview {
  background: var(--lexxy-color-canvas, #fff);
  border: 1px solid var(--lexxy-color-ink-lighter, #ccc);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
  color: var(--lexxy-color-ink, inherit);
  max-width: min(640px, calc(100vw - 32px));
  overflow-x: auto;
  padding: 0.35em 0.6em;
  pointer-events: none;
  position: fixed;
  z-index: 1000;
}

.lexxy-math-preview[hidden] {
  display: none;
}

.lexxy-math-preview .katex-display {
  margin: 0;
}
`

export function previewCollaborativeMath() {
  const preview = document.createElement("div")
  preview.className = "lexxy-math-preview"
  preview.hidden = true

  let scheduled = false
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      update(preview)
    })
  }

  document.addEventListener("selectionchange", schedule)
  document.addEventListener("input", schedule, true)
  window.addEventListener("scroll", schedule, true)
  window.addEventListener("resize", schedule)
}

function update(preview) {
  const formula = formulaAtCaret()
  if (!formula) {
    preview.hidden = true
    return
  }

  if (!preview.isConnected) document.body.append(preview)
  preview.innerHTML = renderMath(formula.latex, { displayMode: formula.displayMode })
  preview.hidden = false
  position(preview, formula.range.getBoundingClientRect())
}

// The formula around a collapsed caret in a collaborative editor, with a Range over its text
function formulaAtCaret() {
  const selection = getSelection()
  if (!selection?.isCollapsed) return null

  const { anchorNode: node, anchorOffset: caret } = selection
  if (node?.nodeType !== Node.TEXT_NODE || !node.parentElement.closest(EDITABLE)) return null

  const formula = mathAround(node.nodeValue, caret)
  if (!formula) return null

  const range = document.createRange()
  range.setStart(node, formula.start)
  range.setEnd(node, formula.end)
  return { ...formula, range }
}

function mathAround(text, caret) {
  for (let offset = 0, match; (match = findMath(text.slice(offset))); offset += match.end) {
    const start = offset + match.start
    const end = offset + match.end
    if (caret < start) return null
    if (caret <= end) return { ...match, start, end }
  }
  return null
}

function position(preview, rect) {
  const below = rect.bottom + 6
  const fitsBelow = below + preview.offsetHeight < window.innerHeight

  preview.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - preview.offsetWidth - 8))}px`
  preview.style.top = `${fitsBelow ? below : rect.top - preview.offsetHeight - 6}px`
}
