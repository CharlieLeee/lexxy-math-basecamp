import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { katexInlineCss } from "./rollup/katex_inline_css.mjs"
import { writeExtensionFiles } from "./rollup/extension_files.mjs"
import { TARGETS } from "./rollup/targets.mjs"

// Builds the unpacked extension for each browser into dist/<target>/
const outputs = (file, options) => Object.keys(TARGETS).map((target) => ({ file: `dist/${target}/${file}`, ...options }))

export default [
  {
    // lexxy-math, wrapped in a function so it only runs once Basecamp has set window.Lexxy
    input: "src/basecamp_math.js",
    external: ["@37signals/lexxy"],
    output: outputs("lexxy-math.js", {
      format: "iife",
      name: "lexxyMath",
      globals: { "@37signals/lexxy": "Lexxy" },
      banner: "globalThis.__lexxyMathForBasecamp = function () {",
      footer: "return lexxyMath\n}"
    }),
    plugins: [resolve(), commonjs(), katexInlineCss(), writeExtensionFiles()]
  },
  {
    input: "src/loader.js",
    output: outputs("loader.js", { format: "iife" })
  }
]
