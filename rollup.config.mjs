import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { copyStatic } from "./rollup/copy_static.mjs"
import { katexInlineCss } from "./rollup/katex_inline_css.mjs"

// Builds the unpacked extension into dist/
export default [
  {
    // lexxy-math, wrapped in a function so it only runs once Basecamp has set window.Lexxy
    input: "src/basecamp_math.js",
    external: ["@37signals/lexxy"],
    output: {
      file: "dist/lexxy-math.js",
      format: "iife",
      name: "lexxyMath",
      globals: { "@37signals/lexxy": "Lexxy" },
      banner: "globalThis.__lexxyMathForBasecamp = function () {",
      footer: "return lexxyMath\n}"
    },
    plugins: [resolve(), commonjs(), katexInlineCss(), copyStatic("dist")]
  },
  {
    input: "src/loader.js",
    output: { file: "dist/loader.js", format: "iife" }
  }
]
