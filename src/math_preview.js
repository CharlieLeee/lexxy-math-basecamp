import { renderTextMath } from "lexxy-math"

// In collaborative editors math stays $...$ text in the shared document, so the line being
// edited is previewed, rendered, in a popup just below it. The document itself is untouched.

const EDITABLE = "lexxy-editor[collaboration] [contenteditable]"
const BLOCK = "p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th"

export const PREVIEW_CSS = `
.lexxy-math-preview {
  background: var(--lexxy-color-canvas, #fff);
  border: 1px solid var(--lexxy-color-ink-lighter, #ccc);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.15);
  color: var(--lexxy-color-ink, inherit);
  max-width: min(640px, calc(100vw - 32px));
  overflow-x: auto;
  padding: 0.5em 0.75em;
  pointer-events: none;
  position: fixed;
  z-index: 1000;
}

.lexxy-math-preview[hidden] {
  display: none;
}

.lexxy-math-preview > * {
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
  const block = currentBlock()
  const rendered = block && renderedCopy(block)

  if (!rendered) {
    preview.hidden = true
    return
  }

  if (!preview.isConnected) document.body.append(preview)
  preview.replaceChildren(rendered)
  preview.hidden = false
  position(preview, block)
}

// The block holding the caret, when it is inside a collaborative editor
function currentBlock() {
  const node = getSelection()?.anchorNode
  const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node
  if (!element?.closest(EDITABLE)) return null

  return element.closest(BLOCK)
}

// A rendered copy of the block, or null when it holds no math
function renderedCopy(block) {
  if (!block.textContent.includes("$")) return null

  const copy = block.cloneNode(true)
  copy.removeAttribute("id")
  renderTextMath(copy)

  return copy.querySelector(".katex") ? copy : null
}

function position(preview, block) {
  const rect = block.getBoundingClientRect()
  const top = rect.bottom + 6
  const fitsBelow = top + preview.offsetHeight < window.innerHeight

  preview.style.left = `${Math.max(8, rect.left)}px`
  preview.style.top = `${fitsBelow ? top : rect.top - preview.offsetHeight - 6}px`
}
