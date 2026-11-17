// Loads the built extension into test/fixtures/basecamp.html, which reproduces how Basecamp
// loads Lexxy (async bundle, window.Lexxy, deferred element definition, strict CSP).
// Runs in Chromium and Firefox; both targets ship the same scripts.

import assert from "node:assert/strict"
import { after, before, describe, test } from "node:test"
import { chromium, firefox } from "playwright"
import { serve } from "./serve.js"

for (const browserType of [chromium, firefox]) {
  describe(browserType.name(), () => {
    let server, browser, page
    const errors = []
    const cspViolations = []

    before(async () => {
      server = await serve()
      browser = await browserType.launch()
      page = await browser.newPage()
      page.on("pageerror", (error) => errors.push(error.message))
      await page.exposeFunction("reportViolation", (directive) => cspViolations.push(directive))
      await page.addInitScript(() => {
        document.addEventListener("securitypolicyviolation", (event) => window.reportViolation(event.effectiveDirective))
      })
      await page.goto(`${server.url}test/fixtures/basecamp.html`)
      await page.waitForSelector("lexxy-editor[connected]")
      await page.waitForSelector(".formatted_content .katex")
    })

    after(async () => {
      await browser?.close()
      server?.close()
    })

    const editorValue = () => page.$eval("lexxy-editor", (editor) => editor.value)

    test("adds math to the editor without replacing Lexxy's own extensions", async () => {
      const extensions = await page.$eval("lexxy-editor", (editor) => editor.baseExtensions.map((extension) => extension.name))
      assert.equal(extensions.at(-1), "BasecampMathExtension")
      assert.ok(extensions.length > 1)

      const nodes = await page.$eval("lexxy-editor", (editor) => [...editor.editor._nodes.keys()])
      assert.ok(nodes.includes("inline_math") && nodes.includes("block_math"))
    })

    test("typing $...$ creates inline math", async () => {
      await page.click("lexxy-editor [contenteditable]")
      await page.keyboard.type("Energy $E=mc^2$ ok")
      await page.waitForSelector("lexxy-editor .lexxy-math-inline .katex")
      assert.match(await editorValue(), /<span class="math-inline" data-math="E=mc\^2">/)
    })

    test("$$ + Enter opens the block editor", async () => {
      await page.keyboard.press("Enter")
      await page.keyboard.type("$$")
      await page.keyboard.press("Enter")
      await page.waitForFunction(() => document.activeElement?.matches("lexxy-math-editor textarea"))
      await page.keyboard.type("\\frac{1}{2}")
      await page.keyboard.press("Escape")
      await page.waitForSelector("lexxy-editor .lexxy-math-block .katex")
      assert.match(await editorValue(), /<div class="math-block" data-math="\\frac\{1\}\{2\}">/)
    })

    test("posted content renders, including content added later", async () => {
      const posted = await page.$$eval(".formatted_content .math-inline, .formatted_content .math-block", (elements) => elements.map((el) => el.dataset.math))
      assert.deepEqual(posted, ["x^2", "\\int_0^1 x\\,dx"])
      assert.match(await page.textContent(".formatted_content"), /costs \$5 and \$10 stay text/)

      await page.evaluate(() => {
        document.body.insertAdjacentHTML("beforeend", `<div class="formatted_content" id="later"><p>New comment $y$</p></div>`)
      })
      await page.waitForSelector("#later .katex")
    })

    test("KaTeX fonts load under the CSP, with no blocked requests or errors", async () => {
      const fontsLoaded = await page.evaluate(async () => {
        await document.fonts.ready
        return document.fonts.check("12px KaTeX_Main") && document.fonts.check("italic 12px KaTeX_Math")
      })
      assert.ok(fontsLoaded)
      assert.deepEqual(cspViolations, [])
      assert.deepEqual(errors, [])
    })
  })
}
