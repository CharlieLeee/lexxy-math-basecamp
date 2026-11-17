<p align="center">
  <img src="icons/icon-128.png" width="96" height="96" alt="">
</p>

<h1 align="center">Math for Basecamp</h1>

<p align="center">
  Type LaTeX in Basecamp messages and comments. It renders as you type.
</p>

<p align="center">
  <a href="https://github.com/CharlieLeee/lexxy-math-basecamp/releases/latest"><img src="https://img.shields.io/github/v/release/CharlieLeee/lexxy-math-basecamp?label=release" alt="Latest release"></a>
  <a href="https://github.com/CharlieLeee/lexxy-math-basecamp/actions/workflows/ci.yml"><img src="https://github.com/CharlieLeee/lexxy-math-basecamp/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/lexxy-math"><img src="https://img.shields.io/npm/v/lexxy-math?label=lexxy-math" alt="lexxy-math on npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
</p>

<p align="center">
  <img src="media/demo-inline-and-block.gif" width="820" alt="Inline and block formulas in a Basecamp comment">
</p>

An unofficial browser extension that adds math to [Basecamp](https://basecamp.com)'s editor, rendered with KaTeX. Built on [lexxy-math](https://github.com/CharlieLeee/lexxy-math), the math extension for [Lexxy](https://github.com/basecamp/lexxy), the editor Basecamp uses.

## Features

<p align="center">
  <img src="media/demo-comment.gif" width="820" alt="Writing math in a Basecamp comment">
</p>

- **Inline math:** type `$E=mc^2$`
- **Block math:** type `$$` on an empty line and press Enter
- **Edit:** click any formula; Escape or Cmd/Ctrl+Enter to confirm
- **Formatting:** bold, italic, underline, strikethrough, colors and links apply to math
- **Posted messages and comments:** `$...$` and `$$...$$` render for anyone with the extension. Without it, colleagues see the LaTeX source
- Prices like `$5 and $10`, code, and escaped `\$` stay text

Not affiliated with or endorsed by 37signals or Basecamp.

## Install

Works in Chrome (and Chromium browsers such as Edge, Brave and Arc) and Firefox 140+. Store listings are under review; until then, install from the [latest release](https://github.com/CharlieLeee/lexxy-math-basecamp/releases/latest):

**Chrome:** download `lexxy-math-basecamp-chrome.zip` and unzip it. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and pick the unzipped folder.

**Firefox:** download `lexxy-math-basecamp-firefox.zip`. Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and pick the zip. Firefox removes temporary add-ons on restart; the signed add-on from addons.mozilla.org stays.

Then refresh any open Basecamp tabs.

## How it works

Basecamp bundles Lexxy and exposes it as `window.Lexxy`. The extension runs in the page at `document_start` (`src/loader.js`):

1. When Basecamp assigns `window.Lexxy`, lexxy-math is built against that exact instance, so math nodes share Basecamp's Lexical
2. When `<lexxy-editor>` is defined (Lexxy does this a task later), math is appended to the element's base extensions, so every editor starts with math. Basecamp's own Lexxy configuration is left untouched
3. KaTeX's CSS is inlined with `data:` fonts, which Basecamp's Content Security Policy allows (its CDN is blocked)
4. Posted content (`.formatted_content`) is rendered with lexxy-math's `renderContentMath` and `renderTextMath`, including comments added later

If Basecamp changes how it loads Lexxy, the extension logs a warning and leaves the editor alone.

## Privacy

No data is collected or sent anywhere, and the extension makes no network requests. It runs only on `3.basecamp.com` and `app.basecamp.com`. See [PRIVACY.md](PRIVACY.md).

## Development

```bash
npm install
npx playwright install chromium firefox
npm test          # builds dist/chrome and dist/firefox, runs the browser tests in both, lints the Firefox build
npm run package   # lexxy-math-basecamp-{chrome,firefox,source}.zip
npm run assets    # icons and store images
```

Both targets ship the same scripts; `rollup/targets.mjs` holds the only per-browser difference, the Firefox manifest keys. `test/fixtures/basecamp.html` reproduces how Basecamp loads Lexxy: an async bundle that assigns `window.Lexxy`, deferred element definition, and the relevant CSP.

Releases: bump `version` in `package.json` (the manifest takes it from there) and push a `v*` tag. CI attaches the Chrome, Firefox and source zips to the GitHub release.

## License

MIT. Bundles [lexxy-math](https://github.com/CharlieLeee/lexxy-math) and [KaTeX](https://katex.org) (both MIT); their licenses ship in `licenses/`.
