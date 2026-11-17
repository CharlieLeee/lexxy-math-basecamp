// Renders the extension icons and Chrome Web Store images with Playwright: `npm run assets`
// (run `npm test` first so dist/ and the Lexxy fixture are built)
import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { serve } from "../test/serve.js"

const ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect x="4" y="4" width="120" height="120" rx="28" fill="#3b3f99"/>
  <text x="58" y="88" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="72" fill="#fff">x</text>
  <text x="92" y="58" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="40" fill="#ffd166">2</text>
</svg>`

const PROMO = `
<body style="margin:0;width:440px;height:280px;display:flex;align-items:center;justify-content:center;gap:20px;
             background:#3b3f99;color:#fff;font-family:-apple-system,system-ui,sans-serif">
  <div style="width:110px;height:110px">${ICON}</div>
  <div>
    <div style="font-size:26px;font-weight:800">Math for Basecamp</div>
    <div style="font-size:16px;opacity:.85;margin-top:6px">$x^2$ → <i style="font-family:Georgia,serif">x</i><sup>2</sup> as you type</div>
  </div>
</body>`

const SCREENSHOT_CONTENT = `
<h2>Journal club notes</h2>
<p>The loss is <span class="math-inline" data-math="\\mathcal{L}(\\theta) = \\mathbb{E}\\left[\\lVert x - \\hat x_\\theta \\rVert^2\\right]">$x$</span>, minimized with step size <span class="math-inline" data-math="\\eta = 10^{-3}">$x$</span>.</p>
<div class="math-block" data-math="\\theta_{t+1} = \\theta_t - \\eta \\, \\nabla_\\theta \\mathcal{L}(\\theta_t)">$$x$$</div>
<p>Type <code>$...$</code> for inline math, or <code>$$</code> and Enter for a block. Click any formula to edit it.</p>`

const browser = await chromium.launch()
const page = await browser.newPage()
await mkdir("icons", { recursive: true })
await mkdir("store", { recursive: true })

for (const size of [16, 48, 128]) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<body style="margin:0;background:transparent">${ICON.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body>`)
  await page.screenshot({ path: `icons/icon-${size}.png`, omitBackground: true })
}

await page.setViewportSize({ width: 440, height: 280 })
await page.setContent(PROMO)
await page.screenshot({ path: "store/promo-440x280.png" })

// Screenshot of the editor running the built extension (test fixture, not Basecamp itself)
const server = await serve()
await page.setViewportSize({ width: 1280, height: 800 })
await page.goto(`${server.url}test/fixtures/basecamp.html`)
await page.waitForSelector("lexxy-editor[connected]")
await page.addStyleTag({ content: "body{margin:0;padding:48px 160px;font:18px system-ui,sans-serif;background:#f6f7f9} .formatted_content{display:none} lexxy-editor{background:#fff;min-height:560px}" })
await page.$eval("lexxy-editor", (editor, html) => { editor.value = html }, SCREENSHOT_CONTENT)
await page.waitForTimeout(800)
await page.screenshot({ path: "store/screenshot-1280x800.png" })

server.close()
await browser.close()
