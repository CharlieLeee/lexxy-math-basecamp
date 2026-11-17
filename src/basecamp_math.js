// lexxy-math bound to Basecamp's own Lexxy. The build wraps this bundle in a function
// that loader.js calls once Basecamp assigns window.Lexxy, so "@37signals/lexxy"
// resolves to that instance (see rollup.config.mjs).

import { MathExtension, renderContentMath, renderTextMath } from "lexxy-math"
import katexCss from "katex-inline-css"

// Where Basecamp shows posted rich text
const POSTED_CONTENT = ".formatted_content, .trix-content, .lexxy-content"

// Basecamp's editor presets know nothing about math, so enable it for every rich text editor
export class BasecampMathExtension extends MathExtension {
  get enabled() {
    return this.editorElement.supportsRichText
  }
}

// Basecamp's CSP blocks the KaTeX CDN but allows inline styles and data: fonts
export function addKatexStyles() {
  if (document.querySelector("[data-lexxy-math-katex]")) return

  const style = document.createElement("style")
  style.dataset.lexxyMathKatex = ""
  style.textContent = katexCss
  document.head.append(style)
}

// Renders math in posted messages and comments, including ones Turbo adds later
export function renderPostedMath() {
  let scheduled = false

  const render = () => {
    scheduled = false
    document.querySelectorAll(POSTED_CONTENT).forEach((content) => {
      if (content.closest("lexxy-editor")) return

      renderContentMath(content)
      renderTextMath(content)
    })
  }

  const schedule = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(render)
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true })
  schedule()
}
