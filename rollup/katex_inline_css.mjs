import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"

const MODULE_ID = "katex-inline-css"
const require = createRequire(import.meta.url)

// Provides `import css from "katex-inline-css"`: KaTeX's stylesheet with its woff2 fonts
// inlined as data: URIs, for pages whose CSP blocks the KaTeX CDN but allows data: fonts.
export function katexInlineCss() {
  return {
    name: MODULE_ID,
    resolveId(id) {
      return id === MODULE_ID ? `\0${MODULE_ID}` : null
    },
    async load(id) {
      if (id !== `\0${MODULE_ID}`) return null

      const cssPath = require.resolve("katex/dist/katex.min.css")
      const css = await readFile(cssPath, "utf8")
      const fonts = new Map()

      for (const [, file] of css.matchAll(/url\(fonts\/([\w-]+\.woff2)\)/g)) {
        fonts.set(file, (await readFile(join(dirname(cssPath), "fonts", file))).toString("base64"))
      }

      const inlined = css.replace(/src:url\(fonts\/([\w-]+\.woff2)\)[^;}]*/g, (_, file) => (
        `src:url(data:font/woff2;base64,${fonts.get(file)}) format("woff2")`
      ))

      return `export default ${JSON.stringify(inlined)}`
    }
  }
}
