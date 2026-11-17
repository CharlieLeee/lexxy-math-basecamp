# Chrome Web Store listing

Upload: `lexxy-math-basecamp.zip` (`npm run package`)

## Store listing

**Name:** Math for Basecamp

**Summary** (max 132 characters):
Unofficial: type LaTeX math in Basecamp messages and comments. $...$ inline, $$ for blocks, rendered with KaTeX.

**Category:** Productivity

**Language:** English

**Description:**

Write math in Basecamp the way you write it everywhere else.

• Type $E=mc^2$ and it becomes a rendered formula as you type
• Type $$ on an empty line and press Enter for a centered block formula with a live preview
• Click any formula to edit it
• Bold, italic, underline, strikethrough, colors and links work on math like on text
• Math in posted messages and comments is rendered too, including comments that arrive while the page is open
• Prices like "$5 and $10", code, and escaped \$ stay plain text

Colleagues without the extension see the LaTeX source, so nothing is lost.

Built on lexxy-math, the open-source math extension for Lexxy (the editor Basecamp uses), and KaTeX. Everything runs in your browser: no data is collected and no network requests are made.

Open source: https://github.com/CharlieLeee/lexxy-math-basecamp

Not affiliated with or endorsed by 37signals or Basecamp.

**Images:**
- Icon: `icons/icon-128.png`
- Screenshot: `store/screenshot-1280x800.png`
- Small promo tile: `store/promo-440x280.png`

**Homepage / support URL:** https://github.com/CharlieLeee/lexxy-math-basecamp

## Privacy practices

**Single purpose:** Adds LaTeX math editing and rendering to Basecamp's rich text editor and posted content.

**Permissions:** none requested.

**Host permissions justification** (content script matches `https://3.basecamp.com/*`, `https://app.basecamp.com/*`):
The content script must run inside Basecamp pages to add math to Basecamp's editor and render math in posted messages and comments. It runs nowhere else.

**Remote code:** No. All JavaScript, CSS and fonts are bundled in the package.

**Data usage:** Collects no user data. (Leave every data category unchecked and certify the three disclosures.)

**Privacy policy URL:** https://github.com/CharlieLeee/lexxy-math-basecamp/blob/main/PRIVACY.md
