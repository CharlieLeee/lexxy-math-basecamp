import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import inject from "@rollup/plugin-inject"

// Test fixture: Lexxy bundled like Basecamp's rich_text.js, assigning window.Lexxy
export default {
  input: "test/fixtures/lexxy_entry.js",
  output: { file: "test/fixtures/lexxy.js", format: "iife", inlineDynamicImports: true },
  plugins: [
    nodeResolve(),
    commonjs(),
    inject({ Prism: ["prismjs", "default"], include: "**/prismjs/components/**" })
  ]
}
